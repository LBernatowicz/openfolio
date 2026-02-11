# 🚀 Plan Deploymentu na Raspberry Pi z GitHub Actions

Ten dokument opisuje plan automatycznego deploymentu aplikacji OpenFolio na Raspberry Pi przy użyciu GitHub Actions.

## 📋 Wymagania

### Na Raspberry Pi:
- ✅ System operacyjny: Raspberry Pi OS (64-bit)
- ✅ Node.js >= 18.17.0 (lub Docker jeśli używasz wersji Docker)
- ✅ PM2 (dla wersji bez Docker) lub Docker & Docker Compose (dla wersji Docker)
- ✅ Git
- ✅ SSH dostęp do Raspberry Pi
- ✅ Port 22 (SSH) otwarty w firewall
- ✅ **Kompatybilne z OpenMediaVault (OMV)** - workflow nie wpływa na kontenery OMV

### Na GitHub:
- ✅ Repozytorium z kodem
- ✅ Secrets skonfigurowane w GitHub (patrz sekcja poniżej)

## 🔐 Konfiguracja GitHub Secrets

Aby GitHub Actions mógł połączyć się z Raspberry Pi, musisz skonfigurować następujące secrets w repozytorium:

1. **Przejdź do Settings → Secrets and variables → Actions**
2. **Dodaj następujące secrets:**

| Secret Name | Opis | Przykład |
|------------|------|----------|
| `RASPBERRY_PI_HOST` | Adres IP lub hostname Raspberry Pi | `192.168.1.100` lub `raspberrypi.local` |
| `RASPBERRY_PI_USER` | Nazwa użytkownika na Raspberry Pi | `pi` |
| `RASPBERRY_PI_SSH_KEY` | Prywatny klucz SSH (cały klucz) | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `RASPBERRY_PI_PORT` | Port SSH (opcjonalnie, domyślnie 22) | `22` |

### Jak wygenerować klucz SSH:

```bash
# Na swoim komputerze lokalnym
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_raspberry_pi

# Skopiuj zawartość pliku prywatnego (będzie potrzebny w GitHub Secrets)
cat ~/.ssh/github_actions_raspberry_pi

# Skopiuj klucz publiczny na Raspberry Pi
ssh-copy-id -i ~/.ssh/github_actions_raspberry_pi.pub pi@192.168.1.100

# Lub ręcznie:
cat ~/.ssh/github_actions_raspberry_pi.pub | ssh pi@192.168.1.100 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

## 📁 Struktura Workflow

Dostępne są dwa workflow:

### 1. Deploy bez Docker (PM2) - `deploy-raspberry-pi.yml`
- ✅ Szybszy deployment
- ✅ Mniejsze zużycie zasobów
- ✅ Łatwiejsze debugowanie
- ⚠️ Wymaga Node.js na Raspberry Pi

### 2. Deploy z Docker - `deploy-raspberry-pi-docker.yml`
- ✅ Izolacja środowiska
- ✅ Łatwiejsze zarządzanie zależnościami
- ✅ Kompatybilność z różnymi systemami
- ⚠️ Większe zużycie zasobów

## 🎯 Kiedy workflow się uruchamia?

Workflow uruchamia się automatycznie gdy:
- ✅ Push do brancha `main` lub `master`
- ✅ Pull Request jest zamknięty (merged) do `main`/`master`
- ✅ Ręczne uruchomienie przez `workflow_dispatch`

## 📝 Krok po kroku - Pierwsza konfiguracja

### Krok 1: Przygotowanie Raspberry Pi

```bash
# Zaloguj się na Raspberry Pi
ssh pi@192.168.1.100

# Zainstaluj Node.js (jeśli używasz wersji bez Docker)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Zainstaluj PM2 (jeśli używasz wersji bez Docker)
sudo npm install -g pm2
pm2 startup

# LUB zainstaluj Docker (jeśli używasz wersji Docker)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
sudo apt-get install docker-compose-plugin -y

# Zainstaluj Git
sudo apt-get install git -y

# Utwórz katalog na aplikację
mkdir -p ~/openfolio
cd ~/openfolio
```

### Krok 2: Konfiguracja SSH na Raspberry Pi

```bash
# Na Raspberry Pi
# Upewnij się, że SSH jest włączony
sudo systemctl enable ssh
sudo systemctl start ssh

# Sprawdź czy działa
sudo systemctl status ssh
```

### Krok 3: Konfiguracja GitHub Secrets

1. Przejdź do: `https://github.com/TWOJE_REPO/settings/secrets/actions`
2. Dodaj wszystkie wymagane secrets (patrz sekcja wyżej)

### Krok 4: Wybór workflow

Wybierz jeden z workflow:
- **Bez Docker**: Użyj `deploy-raspberry-pi.yml`
- **Z Docker**: Użyj `deploy-raspberry-pi-docker.yml`

### Krok 5: Pierwszy deploy

```bash
# W repozytorium GitHub
# Przejdź do Actions → Deploy to Raspberry Pi → Run workflow
# LUB po prostu zrób push do main/master
git push origin main
```

## 🔄 Co się dzieje podczas deploymentu?

### Wersja bez Docker (PM2):

1. ✅ Połączenie SSH z Raspberry Pi
2. ✅ Zatrzymanie aplikacji PM2
3. ✅ Pobranie najnowszego kodu z GitHub
4. ✅ Instalacja zależności (`npm install`)
5. ✅ Budowanie aplikacji (`npm run build`)
6. ✅ Uruchomienie aplikacji z PM2
7. ✅ Zapisanie konfiguracji PM2

### Wersja z Docker:

1. ✅ Połączenie SSH z Raspberry Pi
2. ✅ Backup istniejącego pliku `.env` (jeśli istnieje)
3. ✅ Pobranie najnowszego kodu z GitHub
4. ✅ Przywrócenie pliku `.env` z backupu lub utworzenie z `env.example`
5. ✅ Zapisanie tagu poprzedniego obrazu dla rollback
6. ✅ Zatrzymanie **TYLKO** kontenerów OpenFolio (bezpieczne dla innych kontenerów)
7. ✅ Budowanie nowego obrazu Docker (ARM64)
8. ✅ Uruchomienie kontenerów OpenFolio
9. ✅ Weryfikacja deploymentu (status kontenera, healthcheck, HTTP check)
10. ✅ Automatyczny rollback w przypadku błędu
11. ✅ Czyszczenie **TYLKO** nieużywanych obrazów OpenFolio

**🔒 Bezpieczeństwo:** Workflow działa **TYLKO** na kontenerach OpenFolio:
- Kontener: `openfolio-app`
- Sieć: `openfolio-network`
- Obrazy: `openfolio*`
- **Inne kontenery na Raspberry Pi pozostają nietknięte**

## 🔧 Konfiguracja zmiennych środowiskowych (.env)

### Automatyczna obsługa pliku .env

Workflow Docker automatycznie obsługuje plik `.env`:

- **Jeśli plik `.env` już istnieje** - workflow zachowa go i nie będzie nadpisywać (twoja konfiguracja jest bezpieczna)
- **Jeśli plik `.env` nie istnieje** - workflow automatycznie utworzy go z szablonu `env.example`

### Pierwsza konfiguracja .env na Raspberry Pi

#### Opcja 1: Automatyczne utworzenie (zalecane)

1. Upewnij się, że plik `env.example` istnieje w repozytorium
2. Przy pierwszym deploymentzie workflow automatycznie utworzy `.env` z szablonu
3. Zaloguj się na Raspberry Pi i edytuj plik:

```bash
ssh pi@192.168.1.100
cd ~/openfolio
nano .env
```

4. Wypełnij wszystkie wymagane wartości (patrz `env.example`)

#### Opcja 2: Ręczne utworzenie przed pierwszym deploymentem

```bash
# Na Raspberry Pi
ssh pi@192.168.1.100
cd ~/openfolio
cp env.example .env
nano .env
# Wypełnij wszystkie wartości
```

### Wymagane zmienne środowiskowe

Upewnij się, że plik `.env` zawiera wszystkie wymagane zmienne:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://192.168.1.100:80
NEXTAUTH_SECRET=twoj-super-tajny-klucz-minimum-32-znaki

# GitHub OAuth Configuration
GITHUB_CLIENT_ID=twoj_github_client_id
GITHUB_CLIENT_SECRET=twoj_github_client_secret

# GitHub API Configuration
GITHUB_TOKEN=twoj_github_token
NEXT_PUBLIC_GITHUB_USERNAME=LBernatowicz
NEXT_PUBLIC_GITHUB_REPO=openfolio-cms

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://192.168.1.100:80
NEXT_PUBLIC_SITE_NAME="OpenFolio & Blog"
```

### Aktualizacja zmiennych środowiskowych

Aby zaktualizować zmienne środowiskowe:

1. Zaloguj się na Raspberry Pi
2. Edytuj plik `.env`:

```bash
ssh pi@192.168.1.100
cd ~/openfolio
nano .env
```

3. Zrestartuj kontenery:

```bash
docker-compose down
docker-compose up -d
```

**Uwaga:** Workflow **nie nadpisuje** istniejącego pliku `.env` podczas deploymentu, więc twoje zmiany są bezpieczne.

## 🛠️ Rozwiązywanie problemów

### Problem: "Permission denied (publickey)"

**Rozwiązanie:**
```bash
# Sprawdź czy klucz SSH jest poprawnie skonfigurowany
ssh -i ~/.ssh/github_actions_raspberry_pi pi@192.168.1.100

# Sprawdź uprawnienia na Raspberry Pi
ssh pi@192.168.1.100 "ls -la ~/.ssh/authorized_keys"
```

### Problem: "npm: command not found"

**Rozwiązanie:**
```bash
# Na Raspberry Pi
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Problem: "pm2: command not found"

**Rozwiązanie:**
```bash
# Na Raspberry Pi
sudo npm install -g pm2
```

### Problem: "Port 3000 already in use" (PM2)

**Rozwiązanie:**
```bash
# Na Raspberry Pi
# Sprawdź co używa portu
sudo lsof -i :3000

# Zatrzymaj proces
pm2 stop openfolio
# lub
sudo kill -9 <PID>
```

### Problem: "Port 80 already in use" (Docker - konflikt z OMV)

**Problem:** OpenMediaVault (OMV) używa portu 80 dla swojego interfejsu webowego, co może kolidować z OpenFolio.

**Rozwiązanie - Zmień port w docker-compose.yml:**

1. Edytuj `docker-compose.yml` na Raspberry Pi:

```bash
ssh pi@192.168.1.100
cd ~/openfolio
nano docker-compose.yml
```

2. Zmień mapowanie portów z `80:3000` na `8080:3000` (lub inny wolny port):

```yaml
ports:
  - "8080:3000"  # Zamiast 80:3000
```

3. Zaktualizuj plik `.env`:

```bash
nano .env
```

Zmień:
```env
NEXTAUTH_URL=http://192.168.1.100:8080
NEXT_PUBLIC_SITE_URL=http://192.168.1.100:8080
```

4. Zrestartuj kontenery:

```bash
docker-compose down
docker-compose up -d
```

**Alternatywnie - użyj reverse proxy w OMV:**

Możesz skonfigurować reverse proxy w OMV, aby OpenFolio było dostępne pod domeną (np. `openfolio.local`) bez konfliktu portów.

### Problem: "Build failed"

**Rozwiązanie:**
```bash
# Na Raspberry Pi
cd ~/openfolio
npm cache clean --force
rm -rf node_modules .next
npm install --legacy-peer-deps --force
npm run build
```

### Problem: "Container is not running" (Docker)

**Rozwiązanie:**
```bash
# Na Raspberry Pi
cd ~/openfolio

# Sprawdź logi kontenera
docker-compose logs openfolio

# Sprawdź status
docker-compose ps

# Sprawdź czy plik .env istnieje i jest poprawnie skonfigurowany
cat .env

# Zrestartuj kontenery
docker-compose down
docker-compose up -d
```

### Problem: "Deployment failed - rollback executed"

**Co się stało:**
- Workflow wykrył błąd podczas deploymentu i automatycznie przywrócił poprzednią wersję
- Aplikacja powinna działać na poprzedniej wersji

**Rozwiązanie:**
1. Sprawdź logi deploymentu w GitHub Actions
2. Zidentyfikuj przyczynę błędu (build, start, healthcheck)
3. Napraw problem w kodzie
4. Zrób commit i push - workflow spróbuje ponownie

```bash
# Na Raspberry Pi - sprawdź aktualną wersję
cd ~/openfolio
docker images | grep openfolio
git log -1
```

### Problem: "Healthcheck reports unhealthy"

**Rozwiązanie:**
```bash
# Na Raspberry Pi
cd ~/openfolio

# Sprawdź szczegółowe informacje o healthcheck
docker inspect openfolio-app | grep -A 10 Health

# Sprawdź logi aplikacji
docker-compose logs -f openfolio

# Jeśli aplikacja działa, ale healthcheck nie, możesz tymczasowo wyłączyć healthcheck
# Edytuj docker-compose.yml i usuń sekcję healthcheck
```

### Problem: "Application not responding after deployment"

**Rozwiązanie:**
```bash
# Na Raspberry Pi
cd ~/openfolio

# Sprawdź czy kontener działa
docker ps | grep openfolio

# Sprawdź logi
docker-compose logs --tail=50 openfolio

# Sprawdź czy port jest otwarty
sudo netstat -tlnp | grep 80

# Sprawdź zmienne środowiskowe
docker exec openfolio-app env | grep -E "NEXTAUTH|GITHUB|NEXT_PUBLIC"

# Zrestartuj kontener
docker-compose restart openfolio
```

### Problem: ".env file not found" lub "Environment variables missing"

**Rozwiązanie:**
```bash
# Na Raspberry Pi
cd ~/openfolio

# Sprawdź czy plik .env istnieje
ls -la .env

# Jeśli nie istnieje, utwórz z szablonu
if [ ! -f .env ] && [ -f env.example ]; then
  cp env.example .env
  echo "⚠️  Utworzono .env z szablonu - wypełnij wartości!"
  nano .env
fi

# Sprawdź czy docker-compose używa env_file
grep -A 2 "env_file" docker-compose.yml

# Zrestartuj kontenery
docker-compose down
docker-compose up -d
```

## 📊 Monitorowanie deploymentu

### W GitHub:
- Przejdź do: `Actions` → Wybierz workflow → Zobacz logi

### Na Raspberry Pi:

```bash
# Sprawdź status PM2
pm2 status
pm2 logs openfolio

# Sprawdź status Docker
docker-compose ps
docker-compose logs -f
```

## 🔒 Bezpieczeństwo

### Izolacja kontenerów:

Workflow Docker jest zaprojektowany tak, aby **nie wpływać na inne kontenery** na Raspberry Pi:

- ✅ **Działa tylko w katalogu `~/openfolio`** - docker-compose używa tylko pliku `docker-compose.yml` z tego katalogu
- ✅ **Używa unikalnej nazwy kontenera** - `openfolio-app` (nie koliduje z innymi)
- ✅ **Używa dedykowanej sieci** - `openfolio-network` (izolowana od innych projektów)
- ✅ **Czyści tylko obrazy OpenFolio** - `openfolio*` (nie usuwa obrazów innych projektów)
- ✅ **Nie używa `--remove-orphans`** - nie usuwa kontenerów z innych projektów
- ✅ **Wszystkie operacje są precyzyjne** - używają nazw kontenerów/obrazów zamiast ogólnych komend

**Możesz bezpiecznie używać tego workflow nawet jeśli masz inne kontenery Docker na Raspberry Pi!**

### Kompatybilność z OpenMediaVault (OMV):

Workflow jest w pełni kompatybilny z **OpenMediaVault (OMV)**:

- ✅ **Nie wpływa na kontenery OMV** - wszystkie operacje są ograniczone do kontenerów OpenFolio
- ✅ **Nie wpływa na sieci OMV** - używa dedykowanej sieci `openfolio-network`
- ✅ **Nie wpływa na obrazy OMV** - czyści tylko obrazy `openfolio*`
- ✅ **Nie wpływa na Portainer** - jeśli używasz Portainer do zarządzania OMV, kontenery OMV pozostaną nietknięte

**⚠️ Uwaga dotycząca portów:**
- Domyślnie OpenFolio używa portu **80** (mapowanie `80:3000` w docker-compose.yml)
- OMV również używa portu **80** dla swojego interfejsu webowego
- **Jeśli masz konflikt portów**, zmień port w `docker-compose.yml`:

```yaml
ports:
  - "8080:3000"  # Zamiast 80:3000, użyj 8080:3000
```

Następnie zaktualizuj `NEXTAUTH_URL` i `NEXT_PUBLIC_SITE_URL` w pliku `.env`:
```env
NEXTAUTH_URL=http://192.168.1.100:8080
NEXT_PUBLIC_SITE_URL=http://192.168.1.100:8080
```

### Rekomendacje:

1. ✅ **Używaj kluczy SSH zamiast hasła**
2. ✅ **Ogranicz dostęp SSH do określonych IP** (opcjonalnie)
3. ✅ **Używaj non-root user** na Raspberry Pi
4. ✅ **Regularnie aktualizuj system**
5. ✅ **Używaj firewall** (ufw)

```bash
# Na Raspberry Pi - konfiguracja firewall
sudo ufw allow 22/tcp  # SSH
sudo ufw allow 3000/tcp # Aplikacja (opcjonalnie)
sudo ufw enable
```

## 🎨 Dostosowanie workflow

Możesz dostosować workflow do swoich potrzeb:

### Dodaj testy przed deploymentem:

```yaml
- name: Run tests
  run: npm test

- name: Run linter
  run: npm run lint
```

### Dodaj powiadomienia:

```yaml
- name: Notify on success
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Deployment completed!'
```

### Funkcje już zaimplementowane w workflow Docker:

Workflow `deploy-raspberry-pi-docker.yml` już zawiera:

- ✅ **Automatyczny rollback** - przywraca poprzednią wersję w przypadku błędu
- ✅ **Healthcheck** - weryfikuje czy kontener działa poprawnie
- ✅ **Weryfikacja HTTP** - sprawdza czy aplikacja odpowiada
- ✅ **Obsługa .env** - automatycznie zachowuje lub tworzy plik .env
- ✅ **Szczegółowe logowanie** - każdy krok jest logowany

### Dodaj rollback dla PM2 (jeśli używasz wersji bez Docker):

```yaml
- name: Rollback on failure
  if: failure()
  uses: appleboy/ssh-action@v1.0.3
  with:
    script: |
      cd ~/openfolio
      git reset --hard HEAD~1
      pm2 restart openfolio
```

## ✅ Checklist przed pierwszym deploymentem

### Ogólne wymagania:
- [ ] Node.js zainstalowany na Raspberry Pi (lub Docker)
- [ ] PM2 zainstalowany i skonfigurowany (lub Docker Compose)
- [ ] SSH działa na Raspberry Pi
- [ ] Klucz SSH wygenerowany i dodany do GitHub Secrets
- [ ] Klucz publiczny dodany do `~/.ssh/authorized_keys` na Raspberry Pi
- [ ] Test połączenia SSH działa
- [ ] Katalog `~/openfolio` istnieje (lub zostanie utworzony automatycznie)
- [ ] Port 80 (lub 3000) jest wolny (lub zmień w konfiguracji)

### Dla deploymentu Docker:
- [ ] Docker i Docker Compose zainstalowane na Raspberry Pi
- [ ] Użytkownik ma uprawnienia do Docker (`sudo usermod -aG docker $USER`)
- [ ] Plik `env.example` istnieje w repozytorium
- [ ] Plik `.env` skonfigurowany na Raspberry Pi (lub zostanie utworzony automatycznie z szablonu)
- [ ] Wszystkie wymagane zmienne środowiskowe wypełnione w `.env`

### Dla deploymentu PM2:
- [ ] Node.js >= 18.17.0 zainstalowany
- [ ] PM2 zainstalowany globalnie
- [ ] PM2 startup skonfigurowany
- [ ] Zmienne środowiskowe skonfigurowane (`.env.local` lub `.env`)

## 🚀 Gotowe!

Po skonfigurowaniu, każdy push do `main`/`master` automatycznie wdroży aplikację na Raspberry Pi!

## 📚 Dodatkowe zasoby

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [SSH Action Documentation](https://github.com/appleboy/ssh-action)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Docker Documentation](https://docs.docker.com/)

