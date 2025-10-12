#!/bin/bash

# 🐳 Skrypt instalacji Portainer na Raspberry Pi
# Uruchom: bash install-portainer-pi.sh

set -e

echo "🐳 Instalacja Portainer na Raspberry Pi"
echo "======================================"

# Kolory dla output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funkcja do logowania
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Sprawdź czy jesteś na Raspberry Pi
if ! grep -q "Raspberry Pi" /proc/cpuinfo 2>/dev/null; then
    warning "To nie wygląda na Raspberry Pi. Kontynuujesz mimo to?"
    read -p "Kontynuować? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Sprawdź czy jesteś root
if [[ $EUID -eq 0 ]]; then
    error "Nie uruchamiaj tego skryptu jako root. Użyj zwykłego użytkownika."
fi

log "Rozpoczynam instalację Portainer..."

# 1. Aktualizacja systemu
log "Aktualizuję system..."
sudo apt update && sudo apt upgrade -y

# 2. Instalacja Docker
log "Instaluję Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    rm get-docker.sh
else
    info "Docker już zainstalowany: $(docker --version)"
fi

# 3. Dodanie użytkownika do grupy docker
log "Dodaję użytkownika do grupy docker..."
sudo usermod -aG docker $USER

# 4. Instalacja Docker Compose
log "Instaluję Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo apt install -y docker-compose
else
    info "Docker Compose już zainstalowany: $(docker-compose --version)"
fi

# 5. Instalacja dodatkowych narzędzi
log "Instaluję dodatkowe narzędzia..."
sudo apt install -y git curl wget htop ufw

# 6. Konfiguracja firewall
log "Konfiguruję firewall..."
sudo ufw allow ssh
sudo ufw allow 8000
sudo ufw allow 9443
sudo ufw allow 3000
sudo ufw --force enable

# 7. Instalacja Portainer
log "Instaluję Portainer..."

# Sprawdź czy Portainer już działa
if docker ps | grep -q portainer; then
    warning "Portainer już działa. Zatrzymuję istniejący kontener..."
    docker stop portainer
    docker rm portainer
fi

# Utwórz wolumen dla Portainer
docker volume create portainer_data

# Uruchom Portainer
docker run -d \
    --name portainer \
    --restart=always \
    -p 8000:8000 \
    -p 9443:9443 \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v portainer_data:/data \
    portainer/portainer-ce:latest

# 8. Sprawdzenie instalacji
log "Sprawdzam instalację..."
sleep 5

if docker ps | grep -q portainer; then
    log "Portainer zainstalowany pomyślnie!"
else
    error "Instalacja Portainer nie powiodła się."
fi

# 9. Pobierz IP Raspberry Pi
PI_IP=$(hostname -I | awk '{print $1}')

# 10. Utworzenie katalogu na projekty
log "Tworzę katalog na projekty..."
mkdir -p ~/docker-projects
cd ~/docker-projects

# 11. Klonowanie repozytorium OpenFolio
log "Klonuję repozytorium OpenFolio..."
if [ -d "openfolio" ]; then
    warning "Katalog 'openfolio' już istnieje. Usuwam go..."
    rm -rf openfolio
fi

git clone https://github.com/LBernatowicz/openfolio.git
cd openfolio

# 12. Utworzenie docker-compose.yml dla Portainer
log "Tworzę docker-compose.yml dla Portainer..."
cat > docker-compose.yml << EOF
version: '3.8'

services:
  openfolio:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - HOSTNAME=0.0.0.0
      - NEXT_TELEMETRY_DISABLED=1
      - NEXTAUTH_URL=http://$PI_IP:3000
      - NEXTAUTH_SECRET=your_secret_here
      - GITHUB_TOKEN=your_github_token_here
      - GITHUB_OWNER=LBernatowicz
      - GITHUB_REPO=openfolio-cms
      - GITHUB_CLIENT_ID=your_client_id
      - GITHUB_CLIENT_SECRET=your_client_secret
    restart: unless-stopped
    volumes:
      - ./logs:/app/logs
    networks:
      - openfolio-network

networks:
  openfolio-network:
    driver: bridge
EOF

# 13. Utworzenie pliku .env.local
log "Tworzę plik .env.local..."
cat > .env.local << EOF
# GitHub API
GITHUB_TOKEN=your_github_token_here
GITHUB_OWNER=LBernatowicz
GITHUB_REPO=openfolio-cms

# NextAuth
NEXTAUTH_URL=http://$PI_IP:3000
NEXTAUTH_SECRET=your_secret_here

# GitHub OAuth
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
EOF

# 14. Utworzenie skryptu aktualizacji
log "Tworzę skrypt aktualizacji..."
cat > ~/update-openfolio-portainer.sh << 'EOF'
#!/bin/bash

echo "🔄 Aktualizacja OpenFolio w Portainer..."

# Przejdź do katalogu projektu
cd ~/docker-projects/openfolio

# Pobierz najnowsze zmiany
git pull origin main

# Zatrzymaj stos w Portainer (jeśli działa)
docker-compose down

# Zbuduj nowy obraz
docker-compose build --no-cache

# Uruchom ponownie
docker-compose up -d

echo "✅ Aktualizacja zakończona!"
echo "Sprawdź status w Portainer: https://IP_RASPBERRY_PI:9443"
EOF

chmod +x ~/update-openfolio-portainer.sh

# 15. Podsumowanie
echo
echo "🎉 Instalacja Portainer zakończona pomyślnie!"
echo "============================================="
echo
echo "🌐 Dostęp do Portainer:"
echo "   https://$PI_IP:9443"
echo
echo "📁 Projekt OpenFolio:"
echo "   ~/docker-projects/openfolio"
echo
echo "🔧 Następne kroki:"
echo "   1. Otwórz Portainer: https://$PI_IP:9443"
echo "   2. Utwórz konto administratora"
echo "   3. Wybierz 'Local' jako środowisko"
echo "   4. Przejdź do 'Stacks' → 'Add stack'"
echo "   5. Wklej zawartość docker-compose.yml"
echo "   6. Skonfiguruj zmienne środowiskowe"
echo "   7. Kliknij 'Deploy the stack'"
echo
echo "📝 Konfiguracja zmiennych środowiskowych:"
echo "   NEXTAUTH_URL=http://$PI_IP:3000"
echo "   NEXTAUTH_SECRET=your_secret_here"
echo "   GITHUB_TOKEN=your_github_token_here"
echo "   GITHUB_OWNER=LBernatowicz"
echo "   GITHUB_REPO=openfolio-cms"
echo "   GITHUB_CLIENT_ID=your_client_id"
echo "   GITHUB_CLIENT_SECRET=your_client_secret"
echo
echo "🔄 Aktualizacja:"
echo "   ~/update-openfolio-portainer.sh"
echo
echo "📊 Przydatne komendy:"
echo "   docker ps                    - status kontenerów"
echo "   docker logs portainer       - logi Portainer"
echo "   docker-compose logs         - logi aplikacji"
echo "   docker-compose down         - zatrzymaj aplikację"
echo "   docker-compose up -d        - uruchom aplikację"
echo
echo "⚠️  Pamiętaj o:"
echo "   - Skonfigurowaniu zmiennych środowiskowych"
echo "   - Wylogowaniu się i ponownym zalogowaniu (grupa docker)"
echo "   - Skonfigurowaniu GitHub OAuth App"
echo
echo "🚀 Portainer jest gotowy do użycia!"
