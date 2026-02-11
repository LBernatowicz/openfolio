#!/bin/bash

# Skrypt pomocniczy do deploymentu na Raspberry Pi
# Może być użyty ręcznie lub przez GitHub Actions

set -e

echo "🚀 OpenFolio - Raspberry Pi Deployment Script"
echo "=============================================="

# Sprawdź czy jesteśmy w odpowiednim katalogu
if [ ! -f "package.json" ]; then
    echo "❌ Błąd: package.json nie znaleziony!"
    echo "📋 Uruchom skrypt z katalogu głównego projektu"
    exit 1
fi

# Sprawdź czy Node.js jest zainstalowany
if ! command -v node &> /dev/null; then
    echo "❌ Node.js nie jest zainstalowany!"
    echo "📋 Zainstaluj Node.js: curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && sudo apt-get install -y nodejs"
    exit 1
fi

# Sprawdź czy PM2 jest zainstalowany
if ! command -v pm2 &> /dev/null; then
    echo "⚠️  PM2 nie jest zainstalowany. Instalowanie..."
    sudo npm install -g pm2
fi

echo "📥 Pobieranie najnowszych zmian..."
if [ -d .git ]; then
    git fetch origin
    git reset --hard origin/main || git reset --hard origin/master
else
    echo "❌ To nie jest repozytorium Git!"
    exit 1
fi

echo "📦 Instalowanie zależności..."
npm install --legacy-peer-deps --force --no-audit --no-fund

echo "🔨 Budowanie aplikacji..."
npm run build

echo "▶️  Uruchamianie aplikacji..."
if pm2 list | grep -q "openfolio"; then
    echo "🔄 Restartowanie istniejącej aplikacji..."
    pm2 restart openfolio
else
    echo "🆕 Tworzenie nowej instancji PM2..."
    pm2 start npm --name "openfolio" -- start
fi

echo "💾 Zapisywanie konfiguracji PM2..."
pm2 save

echo "📊 Status aplikacji:"
pm2 status openfolio

echo ""
echo "✅ Deployment zakończony pomyślnie!"
echo "🌐 Aplikacja powinna być dostępna na: http://localhost:3000"
echo "📋 Logi: pm2 logs openfolio"
echo "🔄 Restart: pm2 restart openfolio"
echo "🛑 Stop: pm2 stop openfolio"

