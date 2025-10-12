#!/bin/bash

# 🍓 Skrypt instalacji OpenFolio na Raspberry Pi
# Uruchom: bash install-openfolio-pi.sh

set -e

echo "🍓 Instalacja OpenFolio na Raspberry Pi"
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

log "Rozpoczynam instalację OpenFolio..."

# 1. Aktualizacja systemu
log "Aktualizuję system..."
sudo apt update && sudo apt upgrade -y

# 2. Instalacja Node.js
log "Instaluję Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    info "Node.js już zainstalowany: $(node --version)"
fi

# Sprawdź wersje
log "Wersje zainstalowanych narzędzi:"
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"

# 3. Instalacja PM2
log "Instaluję PM2..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
else
    info "PM2 już zainstalowany: $(pm2 --version)"
fi

# 4. Instalacja dodatkowych narzędzi
log "Instaluję dodatkowe narzędzia..."
sudo apt install -y git curl wget htop ufw

# 5. Klonowanie repozytorium
log "Klonuję repozytorium OpenFolio..."
if [ -d "openfolio" ]; then
    warning "Katalog 'openfolio' już istnieje. Usuwam go..."
    rm -rf openfolio
fi

git clone https://github.com/LBernatowicz/openfolio.git
cd openfolio

# 6. Instalacja zależności
log "Instaluję zależności npm..."
npm install --legacy-peer-deps --force --no-audit --no-fund

# 7. Konfiguracja zmiennych środowiskowych
log "Konfiguruję zmienne środowiskowe..."
if [ ! -f ".env.local" ]; then
    cp .env.example .env.local 2>/dev/null || touch .env.local
fi

# Pobierz IP Raspberry Pi
PI_IP=$(hostname -I | awk '{print $1}')

info "Twój adres IP Raspberry Pi: $PI_IP"

echo
echo "🔧 Konfiguracja zmiennych środowiskowych"
echo "========================================"
echo "Musisz skonfigurować następujące zmienne w pliku .env.local:"
echo
echo "NEXTAUTH_URL=http://$PI_IP:3000"
echo "NEXTAUTH_SECRET=your_secret_here"
echo "GITHUB_TOKEN=your_github_token_here"
echo "GITHUB_OWNER=LBernatowicz"
echo "GITHUB_REPO=openfolio-cms"
echo "GITHUB_CLIENT_ID=your_client_id"
echo "GITHUB_CLIENT_SECRET=your_client_secret"
echo

read -p "Czy chcesz edytować plik .env.local teraz? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    nano .env.local
fi

# 8. Budowanie aplikacji
log "Buduję aplikację..."
npm run build

if [ $? -eq 0 ]; then
    log "Build zakończony pomyślnie!"
else
    error "Build nie powiódł się. Sprawdź logi powyżej."
fi

# 9. Konfiguracja PM2
log "Konfiguruję PM2..."

# Utwórz katalog na logi
mkdir -p ~/logs

# Utwórz plik konfiguracyjny PM2
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'openfolio',
    script: 'npm',
    args: 'start',
    cwd: '$(pwd)',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/home/$USER/logs/openfolio-error.log',
    out_file: '/home/$USER/logs/openfolio-out.log',
    log_file: '/home/$USER/logs/openfolio-combined.log',
    time: true
  }]
};
EOF

# 10. Uruchomienie aplikacji
log "Uruchamiam aplikację z PM2..."
pm2 start ecosystem.config.js

# Zapisz konfigurację PM2
pm2 save

# 11. Konfiguracja automatycznego startu PM2
log "Konfiguruję automatyczny start PM2..."
pm2 startup
echo
warning "Wykonaj polecenie które pokazało PM2 powyżej, aby skonfigurować automatyczny start."

# 12. Konfiguracja firewall (opcjonalnie)
echo
read -p "Czy chcesz skonfigurować firewall (ufw)? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log "Konfiguruję firewall..."
    sudo ufw allow ssh
    sudo ufw allow 3000
    sudo ufw --force enable
    sudo ufw status
fi

# 13. Utworzenie skryptu aktualizacji
log "Tworzę skrypt aktualizacji..."
cat > ~/update-openfolio.sh << 'EOF'
#!/bin/bash

echo "🔄 Aktualizacja OpenFolio..."

# Przejdź do katalogu projektu
cd ~/openfolio

# Zatrzymaj aplikację
pm2 stop openfolio

# Pobierz najnowsze zmiany
git pull origin main

# Zainstaluj nowe zależności
npm install --legacy-peer-deps --force --no-audit --no-fund

# Zbuduj aplikację
npm run build

# Uruchom ponownie
pm2 start openfolio

echo "✅ Aktualizacja zakończona!"
EOF

chmod +x ~/update-openfolio.sh

# 14. Podsumowanie
echo
echo "🎉 Instalacja zakończona pomyślnie!"
echo "=================================="
echo
echo "📊 Status aplikacji:"
pm2 status
echo
echo "🌐 Aplikacja jest dostępna pod adresem:"
echo "   http://localhost:3000"
echo "   http://$PI_IP:3000"
echo
echo "📝 Przydatne komendy:"
echo "   pm2 status          - status aplikacji"
echo "   pm2 logs openfolio  - logi aplikacji"
echo "   pm2 restart openfolio - restart aplikacji"
echo "   pm2 stop openfolio  - zatrzymaj aplikację"
echo "   pm2 monit          - monitorowanie w czasie rzeczywistym"
echo
echo "🔄 Aktualizacja:"
echo "   ~/update-openfolio.sh - ręczna aktualizacja"
echo
echo "📁 Logi:"
echo "   ~/logs/openfolio-*.log"
echo
echo "🔧 Konfiguracja:"
echo "   nano ~/openfolio/.env.local - zmienne środowiskowe"
echo "   nano ~/openfolio/ecosystem.config.js - konfiguracja PM2"
echo
echo "⚠️  Pamiętaj o skonfigurowaniu zmiennych środowiskowych w .env.local!"
echo
echo "🚀 Aplikacja jest gotowa do użycia!"
