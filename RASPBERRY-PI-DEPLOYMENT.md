# 🍓 Wdrożenie OpenFolio na Raspberry Pi

Przewodnik krok po kroku dla wdrożenia aplikacji OpenFolio bezpośrednio na Raspberry Pi bez Docker.

## 📋 Wymagania

- Raspberry Pi 4 (zalecane) lub nowszy
- System operacyjny: Raspberry Pi OS (64-bit)
- Połączenie internetowe
- Dostęp SSH do Pi

## 🚀 Instalacja

### 1. Przygotowanie systemu

```bash
# Aktualizuj system
sudo apt update && sudo apt upgrade -y

# Zainstaluj Node.js (najnowsza wersja LTS)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Sprawdź wersje
node --version
npm --version
```

### 2. Instalacja PM2 (Process Manager)

```bash
# Zainstaluj PM2 globalnie
sudo npm install -g pm2

# Skonfiguruj PM2 do automatycznego startu
pm2 startup
# Wykonaj polecenie które pokaże PM2

# Sprawdź status
pm2 status
```

### 3. Klonowanie i konfiguracja projektu

```bash
# Przejdź do katalogu domowego
cd ~

# Sklonuj repozytorium
git clone https://github.com/LBernatowicz/openfolio.git
cd openfolio

# Zainstaluj zależności
npm install --legacy-peer-deps --force --no-audit --no-fund

# Skopiuj plik środowiskowy
cp .env.example .env.local
```

### 4. Konfiguracja zmiennych środowiskowych

```bash
# Edytuj plik .env.local
nano .env.local
```

Dodaj wszystkie wymagane zmienne:

```env
# GitHub API
GITHUB_TOKEN=your_github_token_here
GITHUB_OWNER=LBernatowicz
GITHUB_REPO=openfolio-cms

# NextAuth
NEXTAUTH_URL=http://your-pi-ip:3000
NEXTAUTH_SECRET=your_secret_here

# GitHub OAuth
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
```

### 5. Budowanie aplikacji

```bash
# Zbuduj aplikację
npm run build

# Sprawdź czy build się powiódł
ls -la .next
```

## 🔧 Konfiguracja PM2

### 1. Utwórz plik konfiguracyjny PM2

```bash
# Utwórz plik ecosystem.config.js
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'openfolio',
    script: 'npm',
    args: 'start',
    cwd: '/home/pi/openfolio',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/home/pi/logs/openfolio-error.log',
    out_file: '/home/pi/logs/openfolio-out.log',
    log_file: '/home/pi/logs/openfolio-combined.log',
    time: true
  }]
};
```

### 2. Utwórz katalog na logi

```bash
mkdir -p ~/logs
```

### 3. Uruchom aplikację

```bash
# Uruchom z PM2
pm2 start ecosystem.config.js

# Sprawdź status
pm2 status

# Zobacz logi
pm2 logs openfolio

# Zapisz konfigurację PM2
pm2 save
```

## 🌐 Konfiguracja sieciowa

### 1. Sprawdź IP Raspberry Pi

```bash
# Sprawdź adres IP
hostname -I
# lub
ip addr show
```

### 2. Konfiguracja firewall (opcjonalnie)

```bash
# Zainstaluj ufw jeśli nie jest zainstalowany
sudo apt install ufw -y

# Zezwól na SSH
sudo ufw allow ssh

# Zezwól na port 3000
sudo ufw allow 3000

# Włącz firewall
sudo ufw enable

# Sprawdź status
sudo ufw status
```

### 3. Konfiguracja routera (port forwarding)

Jeśli chcesz dostęp z internetu:

1. **Zaloguj się do routera** (zwykle 192.168.1.1 lub 192.168.0.1)
2. **Znajdź sekcję "Port Forwarding"** lub "Virtual Server"
3. **Dodaj regułę**:
   - External Port: 3000 (lub inny)
   - Internal IP: IP twojego Raspberry Pi
   - Internal Port: 3000
   - Protocol: TCP

## 🔄 Automatyczne aktualizacje

### 1. Skrypt aktualizacji

```bash
# Utwórz skrypt aktualizacji
nano ~/update-openfolio.sh
```

```bash
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
```

```bash
# Nadaj uprawnienia wykonywania
chmod +x ~/update-openfolio.sh
```

### 2. Automatyczna aktualizacja (cron)

```bash
# Edytuj crontab
crontab -e

# Dodaj linię dla codziennej aktualizacji o 2:00
0 2 * * * /home/pi/update-openfolio.sh >> /home/pi/logs/update.log 2>&1
```

## 📊 Monitorowanie

### 1. Podstawowe komendy PM2

```bash
# Status aplikacji
pm2 status

# Logi w czasie rzeczywistym
pm2 logs openfolio

# Restart aplikacji
pm2 restart openfolio

# Zatrzymaj aplikację
pm2 stop openfolio

# Usuń aplikację z PM2
pm2 delete openfolio

# Monitorowanie w czasie rzeczywistym
pm2 monit
```

### 2. Sprawdzanie zasobów

```bash
# Użycie CPU i pamięci
htop

# Użycie dysku
df -h

# Użycie sieci
iftop
```

## 🔧 Rozwiązywanie problemów

### 1. Aplikacja nie startuje

```bash
# Sprawdź logi
pm2 logs openfolio

# Sprawdź czy port jest wolny
sudo netstat -tlnp | grep :3000

# Sprawdź zmienne środowiskowe
pm2 env 0
```

### 2. Problemy z pamięcią

```bash
# Sprawdź użycie pamięci
free -h

# Jeśli potrzeba, zwiększ limit w PM2
pm2 restart openfolio --max-memory-restart 2G
```

### 3. Problemy z siecią

```bash
# Sprawdź połączenie
ping google.com

# Sprawdź DNS
nslookup google.com

# Sprawdź porty
sudo netstat -tlnp
```

## 🚀 Dostęp do aplikacji

Po skonfigurowaniu aplikacja będzie dostępna pod adresem:

- **Lokalnie**: `http://localhost:3000`
- **W sieci lokalnej**: `http://IP_RASPBERRY_PI:3000`
- **Z internetu**: `http://PUBLIC_IP:3000` (jeśli skonfigurowano port forwarding)

## 📱 Dodatkowe opcje

### 1. HTTPS z Let's Encrypt (opcjonalnie)

```bash
# Zainstaluj certbot
sudo apt install certbot -y

# Wygeneruj certyfikat
sudo certbot certonly --standalone -d your-domain.com
```

### 2. Reverse Proxy z Nginx (opcjonalnie)

```bash
# Zainstaluj Nginx
sudo apt install nginx -y

# Skonfiguruj reverse proxy
sudo nano /etc/nginx/sites-available/openfolio
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Włącz konfigurację
sudo ln -s /etc/nginx/sites-available/openfolio /etc/nginx/sites-enabled/

# Restart Nginx
sudo systemctl restart nginx
```

## ✅ Podsumowanie

Ten przewodnik pozwala na:

- ✅ **Natywne uruchomienie** bez Docker
- ✅ **Automatyczne restartowanie** z PM2
- ✅ **Monitorowanie** aplikacji
- ✅ **Automatyczne aktualizacje**
- ✅ **Dostęp z sieci** lokalnej i internetu
- ✅ **HTTPS** (opcjonalnie)
- ✅ **Reverse proxy** (opcjonalnie)

Aplikacja będzie działać stabilnie na Raspberry Pi i będzie dostępna z każdego urządzenia w sieci! 🎉
