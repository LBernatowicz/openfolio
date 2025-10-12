# Przewodnik wdrożenia OpenFolio z Docker Compose

## Wymagania systemowe

- Docker (wersja 20.10+)
- Docker Compose (wersja 2.0+)
- Git
- Dostęp do internetu

**Uwaga**: 
- Lokalnie możesz używać Bun (`bun install`, `bun run dev`)
- W kontenerze Docker używamy npm dla kompatybilności
- Na serwerze docelowym nie musisz instalować Bun ani npm - wszystko działa w kontenerze

## Kroki wdrożenia

### 1. Pobranie kodu

```bash
git clone https://github.com/LBernatowicz/openfolio.git
cd openfolio
```

### 2. Konfiguracja zmiennych środowiskowych

Skopiuj plik przykładowy i wypełnij wartości:

```bash
cp env.example .env
```

Edytuj plik `.env` i wypełnij wszystkie wymagane wartości:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:80
NEXTAUTH_SECRET=twoj-super-tajny-klucz-minimum-32-znaki

# GitHub OAuth Configuration
GITHUB_CLIENT_ID=twoj_github_client_id
GITHUB_CLIENT_SECRET=twoj_github_client_secret

# GitHub API Configuration
GITHUB_TOKEN=twoj_github_token
NEXT_PUBLIC_GITHUB_USERNAME=LBernatowicz
NEXT_PUBLIC_GITHUB_REPO=openfolio-cms

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:80
NEXT_PUBLIC_SITE_NAME="OpenFolio & Blog"
```

### 3. Konfiguracja GitHub OAuth App

1. Przejdź do GitHub Settings → Developer settings → OAuth Apps
2. Kliknij "New OAuth App"
3. Wypełnij:
   - **Application name**: OpenFolio
   - **Homepage URL**: `http://localhost:80` (lub twoja domena)
   - **Authorization callback URL**: `http://localhost:80/api/auth/callback/github`
4. Skopiuj Client ID i Client Secret do pliku `.env`

### 4. Generowanie GitHub Token

1. Przejdź do GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Kliknij "Generate new token (classic)"
3. Wybierz zakresy:
   - `repo` (pełny dostęp do repozytoriów)
   - `read:user` (odczyt danych użytkownika)
4. Skopiuj token do pliku `.env`

### 5. Uruchomienie aplikacji

```bash
# Budowanie i uruchomienie
docker-compose up --build -d

# Sprawdzenie statusu
docker-compose ps

# Wyświetlenie logów
docker-compose logs -f
```

### 6. Dostęp do aplikacji

Aplikacja będzie dostępna pod adresem: `http://localhost:80`

## Zarządzanie aplikacją

### Przydatne komendy Docker Compose

```bash
# Zatrzymanie aplikacji
docker-compose down

# Restart aplikacji
docker-compose restart

# Aktualizacja aplikacji (po pobraniu nowego kodu)
git pull
docker-compose up --build -d

# Wyświetlenie logów
docker-compose logs -f openfolio

# Wejście do kontenera
docker-compose exec openfolio sh
```

### Monitoring

```bash
# Sprawdzenie zużycia zasobów
docker stats

# Sprawdzenie statusu kontenerów
docker-compose ps

# Sprawdzenie logów błędów
docker-compose logs --tail=100 openfolio
```

## Wdrożenie produkcyjne

### 1. Konfiguracja domeny

Zmień w pliku `.env`:
```env
NEXTAUTH_URL=https://twoja-domena.com
NEXT_PUBLIC_SITE_URL=https://twoja-domena.com
```

### 2. Konfiguracja GitHub OAuth dla produkcji

Zaktualizuj GitHub OAuth App:
- **Homepage URL**: `https://twoja-domena.com`
- **Authorization callback URL**: `https://twoja-domena.com/api/auth/callback/github`

### 3. Bezpieczeństwo

```bash
# Generowanie bezpiecznego NEXTAUTH_SECRET
openssl rand -base64 32
```

### 4. Reverse Proxy (opcjonalnie)

Jeśli używasz Nginx jako reverse proxy:

```nginx
server {
    listen 80;
    server_name twoja-domena.com;
    
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Rozwiązywanie problemów

### Problem: Aplikacja nie uruchamia się

```bash
# Sprawdź logi
docker-compose logs openfolio

# Sprawdź czy wszystkie zmienne środowiskowe są ustawione
docker-compose config
```

### Problem: Błąd konfliktu zależności npm

Jeśli widzisz błąd `ERESOLVE could not resolve` lub konflikty peer dependencies:

```bash
# Wyczyść cache Docker
docker system prune -a

# Przebuduj bez cache
docker-compose build --no-cache

# Uruchom ponownie
docker-compose up -d
```

**Uwaga**: Dockerfile używa `--legacy-peer-deps` żeby rozwiązać konflikty zależności między next-auth a @auth/core.

### Problem: Błąd "bun install --frozen-lockfile"

Jeśli widzisz błąd związany z Bun w Dockerfile:

```bash
# Wyczyść cache Docker
docker system prune -a

# Przebuduj bez cache
docker-compose build --no-cache

# Uruchom ponownie
docker-compose up -d
```

**Uwaga**: Dockerfile został zaktualizowany, żeby używać npm zamiast Bun dla lepszej kompatybilności.

### Problem: Błąd autoryzacji GitHub

1. Sprawdź czy Client ID i Client Secret są poprawne
2. Sprawdź czy callback URL jest zgodny z konfiguracją GitHub OAuth App
3. Sprawdź czy GitHub Token ma odpowiednie uprawnienia

### Problem: Brak dostępu do GitHub API

1. Sprawdź czy GITHUB_TOKEN jest poprawny
2. Sprawdź czy NEXT_PUBLIC_GITHUB_USERNAME i NEXT_PUBLIC_GITHUB_REPO są poprawne
3. Sprawdź czy repozytorium istnieje i jest publiczne

### Problem: Komentarze nie działają

1. Sprawdź czy GitHub OAuth jest skonfigurowany
2. Sprawdź czy użytkownik ma uprawnienia do dodawania komentarzy w repozytorium
3. Sprawdź logi aplikacji pod kątem błędów API

## Backup i przywracanie

### Backup danych

```bash
# Backup zmiennych środowiskowych
cp .env .env.backup

# Backup logów
docker-compose logs > logs-backup.txt
```

### Przywracanie

```bash
# Przywróć zmienne środowiskowe
cp .env.backup .env

# Restart aplikacji
docker-compose restart
```

## Aktualizacje

### Aktualizacja aplikacji

```bash
# Pobierz najnowsze zmiany
git pull origin main

# Przebuduj i uruchom ponownie
docker-compose up --build -d

# Sprawdź czy wszystko działa
docker-compose ps
```

### Aktualizacja Docker

```bash
# Zatrzymaj aplikację
docker-compose down

# Usuń stare obrazy
docker system prune -a

# Uruchom ponownie
docker-compose up --build -d
```

## Wsparcie

W przypadku problemów:
1. Sprawdź logi: `docker-compose logs -f`
2. Sprawdź status kontenerów: `docker-compose ps`
3. Sprawdź konfigurację: `docker-compose config`
4. Sprawdź czy wszystkie zmienne środowiskowe są ustawione

## Porty

- **80**: Główna aplikacja (HTTP)
- **3000**: Aplikacja wewnętrznie (w kontenerze)

## Wolumeny

- `./logs:/app/logs` - Logi aplikacji
