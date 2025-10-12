# 🐳 Wdrożenie OpenFolio przez Portainer na Raspberry Pi

Przewodnik krok po kroku dla wdrożenia aplikacji OpenFolio używając Portainer na Raspberry Pi.

## 📋 Wymagania

- Raspberry Pi 4 (zalecane) lub nowszy
- System operacyjny: Raspberry Pi OS (64-bit)
- Połączenie internetowe
- Dostęp SSH do Pi

## 🚀 Instalacja Portainer

### 1. Przygotowanie systemu

```bash
# Aktualizuj system
sudo apt update && sudo apt upgrade -y

# Zainstaluj Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Dodaj użytkownika do grupy docker
sudo usermod -aG docker $USER

# Wyloguj się i zaloguj ponownie, aby zastosować zmiany grupy
```

### 2. Instalacja Portainer

```bash
# Utwórz wolumen dla Portainer
docker volume create portainer_data

# Uruchom Portainer
docker run -d -p 8000:8000 -p 9443:9443 --name portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce:latest

# Sprawdź czy Portainer działa
docker ps
```

### 3. Konfiguracja Portainer

1. **Otwórz przeglądarkę** i przejdź do: `https://IP_RASPBERRY_PI:9443`
2. **Utwórz konto administratora** Portainer
3. **Wybierz "Local"** jako środowisko Docker

## 📦 Przygotowanie aplikacji OpenFolio

### 1. Utworzenie stosu w Portainer

W Portainer:
1. Przejdź do **"Stacks"**
2. Kliknij **"Add stack"**
3. Nazwij stos: `openfolio`

### 2. Konfiguracja docker-compose.yml

Wklej następującą konfigurację:

```yaml
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
      - NEXTAUTH_URL=http://IP_RASPBERRY_PI:3000
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
```

### 3. Konfiguracja zmiennych środowiskowych

W sekcji **"Environment variables"** dodaj:

```env
NEXTAUTH_URL=http://IP_RASPBERRY_PI:3000
NEXTAUTH_SECRET=your_secret_here
GITHUB_TOKEN=your_github_token_here
GITHUB_OWNER=LBernatowicz
GITHUB_REPO=openfolio-cms
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
```

## 🔧 Alternatywne podejście: Git Repository

### 1. Konfiguracja przez Git

W Portainer:
1. **"Stacks"** → **"Add stack"**
2. Wybierz **"Repository"**
3. **Repository URL**: `https://github.com/LBernatowicz/openfolio.git`
4. **Reference**: `main`
5. **Compose path**: `docker-compose.yml`

### 2. Utworzenie docker-compose.yml w repozytorium

```yaml
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
    env_file:
      - .env.local
    restart: unless-stopped
    volumes:
      - ./logs:/app/logs
    networks:
      - openfolio-network

networks:
  openfolio-network:
    driver: bridge
```

## 🚀 Wdrożenie

### 1. Uruchomienie stosu

1. **Kliknij "Deploy the stack"**
2. **Poczekaj** na zbudowanie obrazu
3. **Sprawdź logi** w sekcji "Logs"

### 2. Monitorowanie

W Portainer możesz:
- **Zobaczyć logi** aplikacji w czasie rzeczywistym
- **Restartować** kontener
- **Zatrzymywać/uruchamiać** stos
- **Monitorować** użycie zasobów

## 🔄 Aktualizacje

### 1. Automatyczne aktualizacje

W Portainer:
1. **"Stacks"** → **"openfolio"**
2. **"Editor"**
3. **"Pull and redeploy"**

### 2. Ręczne aktualizacje

```bash
# SSH do Raspberry Pi
ssh pi@IP_RASPBERRY_PI

# Przejdź do katalogu projektu
cd /path/to/openfolio

# Pobierz najnowsze zmiany
git pull origin main

# W Portainer: "Pull and redeploy"
```

## 🌐 Konfiguracja sieciowa

### 1. Sprawdź IP Raspberry Pi

```bash
hostname -I
```

### 2. Konfiguracja firewall

```bash
# Zezwól na porty Portainer i aplikacji
sudo ufw allow 8000
sudo ufw allow 9443
sudo ufw allow 3000
sudo ufw enable
```

### 3. Port forwarding (opcjonalnie)

W routerze skonfiguruj:
- **Port 3000** → IP Raspberry Pi (aplikacja)
- **Port 9443** → IP Raspberry Pi (Portainer)

## 📊 Zarządzanie przez Portainer

### 1. Dashboard

- **Containers**: Zarządzanie kontenerami
- **Images**: Zarządzanie obrazami Docker
- **Volumes**: Zarządzanie wolumenami
- **Networks**: Zarządzanie sieciami

### 2. Monitorowanie

- **Resource usage**: CPU, RAM, dysk
- **Logs**: Logi aplikacji w czasie rzeczywistym
- **Events**: Zdarzenia Docker

### 3. Backup i restore

```bash
# Backup wolumenu Portainer
docker run --rm -v portainer_data:/data -v $(pwd):/backup alpine tar czf /backup/portainer-backup.tar.gz -C /data .

# Restore wolumenu Portainer
docker run --rm -v portainer_data:/data -v $(pwd):/backup alpine tar xzf /backup/portainer-backup.tar.gz -C /data
```

## 🔧 Rozwiązywanie problemów

### 1. Aplikacja nie startuje

**W Portainer:**
1. **"Containers"** → **"openfolio"**
2. **"Logs"** - sprawdź błędy
3. **"Inspect"** - sprawdź konfigurację

### 2. Problemy z budowaniem

**Sprawdź Dockerfile:**
```dockerfile
# Upewnij się, że używasz x86_64
FROM --platform=linux/amd64 node:18
```

### 3. Problemy z pamięcią

**W Portainer:**
1. **"Containers"** → **"openfolio"**
2. **"Duplicate/Edit"**
3. **"Resource limits"** - ustaw limity pamięci

### 4. Problemy z siecią

**Sprawdź:**
- Czy porty są otwarte
- Czy firewall nie blokuje połączeń
- Czy aplikacja nasłuchuje na `0.0.0.0:3000`

## 🎯 Zalety Portainer

### ✅ Plusy:
- **Graficzny interfejs** - łatwe zarządzanie
- **Monitorowanie** w czasie rzeczywistym
- **Logi** w jednym miejscu
- **Zarządzanie stosami** docker-compose
- **Backup i restore**
- **Zarządzanie obrazami**

### ⚠️ Minusy:
- **Dodatkowe zasoby** - Portainer zużywa pamięć
- **Złożoność** - więcej warstw abstrakcji
- **Zależność** - jeśli Portainer nie działa, trudniej zarządzać

## 🚀 Dostęp do aplikacji

Po wdrożeniu aplikacja będzie dostępna pod adresem:

- **Aplikacja**: `http://IP_RASPBERRY_PI:3000`
- **Portainer**: `https://IP_RASPBERRY_PI:9443`

## 📱 Dodatkowe opcje

### 1. HTTPS z Let's Encrypt

```yaml
# Dodaj do docker-compose.yml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - openfolio
```

### 2. Monitoring z Prometheus

```yaml
# Dodaj do docker-compose.yml
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
```

## ✅ Podsumowanie

Portainer na Raspberry Pi oferuje:

- ✅ **Graficzne zarządzanie** Dockerem
- ✅ **Łatwe wdrożenie** aplikacji
- ✅ **Monitorowanie** w czasie rzeczywistym
- ✅ **Zarządzanie stosami** docker-compose
- ✅ **Backup i restore**
- ✅ **Zarządzanie obrazami**

To doskonałe rozwiązanie dla osób, które preferują graficzny interfejs nad linijką komend! 🎉
