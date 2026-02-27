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

### Problem: Błąd lightningcss na ARM64

Jeśli widzisz błąd `Cannot find module '../lightningcss.linux-arm64-gnu.node'`:

```bash
# Wyczyść cache Docker
docker system prune -a

# Przebuduj bez cache
docker-compose build --no-cache

# Uruchom ponownie
docker-compose up -d
```

**Uwaga**: Dockerfile używa `--platform=linux/amd64` żeby wymusić architekturę x86_64, która ma lepszą kompatybilność z natywnymi modułami Node.js.

### Problem: Błąd Turbopack na ARM64

Jeśli widzisz błąd `TurbopackInternalError` lub `Failed to write page endpoint /_error`:

```bash
# Wyczyść cache Docker
docker system prune -a

# Przebuduj bez cache
docker-compose build --no-cache

# Uruchom ponownie
docker-compose up -d
```

**Uwaga**: Dockerfile używa `npx next build` zamiast `npm run build` żeby wyłączyć Turbopack, który ma problemy z architekturą ARM64.

### Problem: Błąd konfliktu zależności npm

Jeśli widzisz błąd `ERESOLVE could not resolve` lub konflikty peer dependencies, spróbuj różnych opcji:

#### Opcja 1: Standardowy Dockerfile (npm)
```bash
# Wyczyść cache Docker
docker system prune -a

# Przebuduj bez cache
docker-compose build --no-cache

# Uruchom ponownie
docker-compose up -d
```

#### Opcja 2: Dockerfile z Yarn
```bash
# Użyj yarn zamiast npm
docker-compose -f docker-compose.yarn.yml build --no-cache
docker-compose -f docker-compose.yarn.yml up -d
```

#### Opcja 3: Dockerfile z Node.js 20
```bash
# Użyj najnowszego Node.js
docker-compose -f docker-compose.node20.yml build --no-cache
docker-compose -f docker-compose.node20.yml up -d
```

#### Opcja 4: Dockerfile z Ubuntu (bez Alpine)
```bash
# Zmień Dockerfile na wersję z Ubuntu
# Edytuj Dockerfile i zmień FROM node:18-alpine na FROM node:18
docker-compose build --no-cache
docker-compose up -d
```

**Uwaga**: Różne Dockerfile używają różnych podejść:
- **Dockerfile**: npm z Alpine Linux
- **Dockerfile.yarn**: yarn z Alpine Linux  
- **Dockerfile.node20**: npm z Node.js 20
- **Dockerfile z Ubuntu**: npm z Ubuntu (lepsza kompatybilność)

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

---

## GitHub Actions + Tailscale (deploy na Raspberry Pi)

### SSH: „Connection timed out” (port 22)

- **Workflow został zaktualizowany**: używana jest akcja `tailscale/github-action@v4` z parametrem **`ping`**. Akcja czeka do ~3 minut na łączność z Pi przed próbą SSH, co zwykle usuwa timeout.
- **`RASPBERRY_PI_HOST`** w GitHub Secrets **musi** być adresem w sieci Tailscale:
  - hostname w tailnecie (np. `raspberrypi`, `mypi`) **albo**
  - adres IP Tailscale (100.x.x.x).
  Nie używaj lokalnego IP z LAN (np. 192.168.x.x) – runner GitHub nie ma do niego dostępu.
- Na Raspberry Pi: upewnij się, że Tailscale działa (`tailscale status`) i że firewall zezwala na SSH z sieci Tailscale (np. `sudo ufw allow from 100.64.0.0/10 to any port 22` albo zezwól na interfejs `tailscale0`).

### Konfiguracja OAuth (zamiast authkey)

Workflow używa **OAuth client** (bez ostrzeżenia o deprecacji). Potrzebne sekrety w GitHubie:

| Secret | Opis |
|--------|------|
| `TS_OAUTH_CLIENT_ID` | Client ID z Tailscale OAuth client |
| `TS_OAUTH_SECRET` | Client secret z Tailscale OAuth client |
| `RASPBERRY_PI_HOST` | Hostname lub IP Tailscale Pi (np. `raspberrypi` lub `100.x.x.x`) |
| `RASPBERRY_PI_USER` | Użytkownik SSH na Pi |
| `RASPBERRY_PI_SSH_KEY` | Prywatny klucz SSH do deployu |

**Kroki w Tailscale:**

1. Wejdź na [Tailscale OAuth clients](https://tailscale.com/s/oauth-clients) i utwórz nowy OAuth client.
2. Nadaj mu zakres (scope) **`auth_keys`** (read & write) – potrzebny do tworzenia ephemeral nodes.
3. W **Tags** ustaw tag używany w workflow, np. `tag:ci` (tag musi być wcześniej utworzony w Admin → Access controls → Tags).
4. Skopiuj **Client ID** i **Client secret**.
5. W repozytorium GitHub: **Settings → Secrets and variables → Actions** → dodaj sekrety `TS_OAUTH_CLIENT_ID` i `TS_OAUTH_SECRET`.
6. W **Access controls** (ACL) w Tailscale upewnij się, że urządzenia z tagiem `tag:ci` mają prawo łączyć się z Twoim Raspberry Pi (np. w `"acls"` dodaj regułę dla tego tagu).
