#!/bin/bash

# Skrypt konfiguracji wdrożenia OpenFolio
# Uruchom: chmod +x deploy-setup.sh && ./deploy-setup.sh

set -e

echo "🚀 Konfiguracja wdrożenia OpenFolio..."

# Sprawdzenie wymagań
echo "📋 Sprawdzanie wymagań..."

if ! command -v docker &> /dev/null; then
    echo "❌ Docker nie jest zainstalowany. Zainstaluj Docker i spróbuj ponownie."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose nie jest zainstalowany. Zainstaluj Docker Compose i spróbuj ponownie."
    exit 1
fi

echo "✅ Docker i Docker Compose są zainstalowane"

# Sprawdzenie czy plik .env istnieje
if [ ! -f ".env" ]; then
    echo "📝 Tworzenie pliku .env..."
    cp env.example .env
    echo "✅ Plik .env został utworzony"
    echo "⚠️  Pamiętaj o wypełnieniu wszystkich wartości w pliku .env!"
else
    echo "✅ Plik .env już istnieje"
fi

# Sprawdzenie czy Dockerfile istnieje
if [ ! -f "Dockerfile" ]; then
    echo "❌ Brak pliku Dockerfile. Upewnij się, że jesteś w katalogu projektu."
    exit 1
fi

# Sprawdzenie czy docker-compose.yml istnieje
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Brak pliku docker-compose.yml. Upewnij się, że jesteś w katalogu projektu."
    exit 1
fi

echo "✅ Wszystkie wymagane pliki są obecne"

# Tworzenie katalogu na logi
echo "📁 Tworzenie katalogu na logi..."
mkdir -p logs
echo "✅ Katalog logs został utworzony"

# Sprawdzenie konfiguracji Docker Compose
echo "🔍 Sprawdzanie konfiguracji Docker Compose..."
if docker-compose config > /dev/null 2>&1; then
    echo "✅ Konfiguracja Docker Compose jest poprawna"
else
    echo "❌ Błąd w konfiguracji Docker Compose. Sprawdź plik docker-compose.yml"
    exit 1
fi

echo ""
echo "🎉 Konfiguracja zakończona pomyślnie!"
echo ""
echo "📋 Następne kroki:"
echo "1. Edytuj plik .env i wypełnij wszystkie wymagane wartości"
echo "2. Skonfiguruj GitHub OAuth App (patrz DEPLOYMENT-GUIDE.md)"
echo "3. Wygeneruj GitHub Token z odpowiednimi uprawnieniami"
echo "4. Uruchom aplikację: docker-compose up --build -d"
echo ""
echo "📖 Szczegółowa instrukcja: DEPLOYMENT-GUIDE.md"
echo "🌐 Aplikacja będzie dostępna pod: http://localhost:80"
echo ""
echo "💡 Przydatne komendy:"
echo "   docker-compose up --build -d    # Uruchomienie"
echo "   docker-compose down              # Zatrzymanie"
echo "   docker-compose logs -f           # Wyświetlenie logów"
echo "   docker-compose ps                # Status kontenerów"
