# OpenFolio - Portfolio & Blog

Nowoczesne portfolio zintegrowane z GitHub Issues jako CMS.

## 🚀 Szybkie uruchomienie z Docker Compose

### Wymagania
- Docker 20.10+
- Docker Compose 2.0+
- Git

### Kroki wdrożenia

1. **Pobierz kod**
```bash
git clone https://github.com/LBernatowicz/openfolio.git
cd openfolio
```

2. **Skonfiguruj środowisko**
```bash
chmod +x deploy-setup.sh
./deploy-setup.sh
```

3. **Wypełnij zmienne środowiskowe**
```bash
# Edytuj plik .env i wypełnij wszystkie wartości
nano .env
```

4. **Uruchom aplikację**
```bash
docker-compose up --build -d
```

5. **Sprawdź status**
```bash
docker-compose ps
docker-compose logs -f
```

Aplikacja będzie dostępna pod: **http://localhost:80**

## 📋 Konfiguracja GitHub

### GitHub OAuth App
1. GitHub Settings → Developer settings → OAuth Apps
2. New OAuth App:
   - **Name**: OpenFolio
   - **Homepage URL**: `http://localhost:80`
   - **Callback URL**: `http://localhost:80/api/auth/callback/github`

### GitHub Token
1. GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Scopes: `repo`, `read:user`

## 🔧 Zarządzanie

```bash
# Uruchomienie
docker-compose up --build -d

# Zatrzymanie
docker-compose down

# Restart
docker-compose restart

# Logi
docker-compose logs -f

# Status
docker-compose ps

# Aktualizacja
git pull && docker-compose up --build -d
```

## 📖 Dokumentacja

- [Przewodnik wdrożenia](DEPLOYMENT-GUIDE.md) - Szczegółowa instrukcja
- [Przewodnik Markdown](MARKDOWN-GUIDE.md) - Formatowanie treści
- [Przewodnik tłumaczeń](README-Translations-Guide.md) - Internacjonalizacja

## 🛠️ Rozwiązywanie problemów

### Aplikacja nie uruchamia się
```bash
docker-compose logs openfolio
docker-compose config
```

### Błąd autoryzacji GitHub
- Sprawdź Client ID/Secret w `.env`
- Sprawdź callback URL w GitHub OAuth App
- Sprawdź uprawnienia GitHub Token

### Brak dostępu do GitHub API
- Sprawdź GITHUB_TOKEN
- Sprawdź NEXT_PUBLIC_GITHUB_USERNAME/REPO
- Sprawdź czy repozytorium jest publiczne

## 🌐 Wdrożenie produkcyjne

1. Zmień domenę w `.env`:
```env
NEXTAUTH_URL=https://twoja-domena.com
NEXT_PUBLIC_SITE_URL=https://twoja-domena.com
```

2. Zaktualizuj GitHub OAuth App dla nowej domeny

3. Uruchom z HTTPS (użyj reverse proxy)

## 📊 Monitoring

```bash
# Zużycie zasobów
docker stats

# Logi błędów
docker-compose logs --tail=100 openfolio

# Status kontenerów
docker-compose ps
```

## 🔄 Backup

```bash
# Backup konfiguracji
cp .env .env.backup

# Backup logów
docker-compose logs > logs-backup.txt
```

## 📞 Wsparcie

W przypadku problemów:
1. Sprawdź logi: `docker-compose logs -f`
2. Sprawdź status: `docker-compose ps`
3. Sprawdź konfigurację: `docker-compose config`
4. Sprawdź zmienne środowiskowe w `.env`

---

**Porty**: 80 (HTTP)  
**Środowisko**: Production  
**Baza danych**: GitHub Issues (CMS)  
**Autoryzacja**: GitHub OAuth
