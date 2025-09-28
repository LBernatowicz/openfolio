# Integracja z GitHub Issues

## Konfiguracja

Aby używać GitHub Issues jako źródła danych dla projektów i komentarzy, wykonaj następujące kroki:

### 1. Utwórz Personal Access Token

1. Idź do GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
2. Kliknij "Generate new token (classic)"
3. Wybierz zakresy:
   - `repo` - pełny dostęp do repozytoriów
   - `public_repo` - dostęp do publicznych repozytoriów
4. Skopiuj wygenerowany token

### 2. Skonfiguruj zmienne środowiskowe

Utwórz plik `.env.local` w głównym katalogu projektu:

```bash
GITHUB_TOKEN=your_github_personal_access_token_here
GITHUB_OWNER=lukaszbernatowicz
GITHUB_REPO=openfolio
```

### 3. Struktura Issues w GitHub

#### Projekty
- Utwórz issues z etykietami: `project`, `feature`, `enhancement`
- Tytuł issue = nazwa projektu
- Opis issue = opis projektu
- Etykiety = technologie używane w projekcie

#### Artykuły/Changelog
- Utwórz issues z etykietą: `changelog`
- W tytule dodaj prefiks z numerem projektu: `[#1] Nazwa artykułu`
- Opis issue = treść artykułu

#### Komentarze
- Komentarze do issues automatycznie stają się komentarzami w aplikacji
- Można dodawać komentarze bezpośrednio w aplikacji

### 4. Przykładowe Issues

#### Issue #1 - Projekt
```
Tytuł: OpenFolio
Etykiety: project, nextjs, typescript, tailwind
Opis: Nowoczesne portfolio programistyczne zbudowane w Next.js 14...
```

#### Issue #2 - Changelog
```
Tytuł: [#1] Inicjalizacja projektu
Etykiety: changelog
Opis: Konfiguracja Next.js 14, TypeScript, Tailwind CSS
```

### 5. Funkcjonalności

- ✅ Ładowanie projektów z GitHub Issues
- ✅ Wyświetlanie komentarzy z GitHub
- ✅ Dodawanie nowych komentarzy
- ✅ Polubienia komentarzy (lokalne)
- ✅ Responsywny design
- ✅ Obsługa błędów i stanów ładowania

### 6. Fallback

Jeśli GitHub API nie jest dostępne, aplikacja automatycznie przełączy się na dane mockowe z `src/data/projects.ts`.

## Uruchomienie

```bash
bun install
bun run dev
```

Aplikacja będzie dostępna pod adresem `http://localhost:3000`
