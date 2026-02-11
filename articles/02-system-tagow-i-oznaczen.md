# System tagów i oznaczeń — Instrukcja obsługi GitHub Issues jako CMS

> Jak prawidłowo tworzyć projekty, artykuły i komentarze w GitHub Issues, aby OpenFolio poprawnie je rozpoznawał i wyświetlał? Kompletna instrukcja obsługi.

---

## 🏷️ Wymagane etykiety (Labels)

OpenFolio rozpoznaje Issues na podstawie **etykiet**. Dwie etykiety są kluczowe:

### 🔵 `project` — Główny projekt

Issue z etykietą `project` staje się **kartą projektu** w portfolio.

```
┌────────────────────────────────────────┐
│  Issue #1                              │
│  Tytuł: "OpenFolio"                   │
│  Labels: project, nextjs, typescript   │
│                    ↑                   │
│           TA ETYKIETA JEST WYMAGANA   │
└────────────────────────────────────────┘
          ↓
    Wyświetlane jako karta projektu
```

### 🟡 `changelog` — Artykuł/wpis

Issue z etykietą `changelog` to **artykuł** (changelog entry) powiązany z projektem.

```
┌────────────────────────────────────────┐
│  Issue #2                              │
│  Tytuł: "[#1] Inicjalizacja projektu"  │
│  Labels: changelog, setup              │
│                   ↑                    │
│          TA ETYKIETA JEST WYMAGANA    │
└────────────────────────────────────────┘
          ↓
    Wyświetlane jako wpis w historii projektu
```

---

## 📋 Tworzenie projektu krok po kroku

### Krok 1: Utwórz nowe Issue

1. Wejdź do repozytorium → zakładka **Issues**
2. Kliknij **New Issue**

### Krok 2: Wypełnij dane projektu

**Tytuł:**
```
OpenFolio - Nowoczesne Portfolio
```

**Opis (Body)** z frontmatter:

```markdown
---
title: "OpenFolio - Nowoczesne Portfolio"
thumbnailImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97"
mainImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085"
technologies: ["Next.js", "TypeScript", "Tailwind CSS", "React"]
status: "in-progress"
liveUrl: "https://openfolio.vercel.app"
---

# OpenFolio

Nowoczesne portfolio programistyczne zbudowane w **Next.js 14**.

## 🚀 Funkcjonalności

- ✅ Responsywny design
- ✅ Dark mode
- ✅ GitHub Issues jako CMS
- 🔄 System komentarzy (w trakcie)

## 🛠 Stack

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS
- **CMS:** GitHub Issues API

## 📸 Screenshoty

![Desktop view](https://example.com/screenshot.png)
```

### Krok 3: Dodaj etykiety

Kliknij **Labels** i dodaj:
- ✅ `project` (WYMAGANE!)
- `nextjs`
- `typescript`
- `in-progress`

### Krok 4: Submit

Kliknij **Submit new issue** — projekt jest gotowy!

---

## 📝 Frontmatter — dostępne pola

### Dla projektów (`project`)

```yaml
---
# Tytuł (nadpisuje tytuł Issue)
title: "Nazwa projektu"

# Miniaturka (lista projektów)
thumbnailImage: "https://example.com/thumb.jpg"

# Obrazek główny (szczegóły projektu)
mainImage: "https://example.com/main.jpg"

# Technologie (array JSON)
technologies: ["React", "TypeScript", "Node.js"]

# Status: "completed", "in-progress", "planned"
status: "in-progress"

# Link do live demo
liveUrl: "https://example.com"
---
```

### Dla artykułów (`changelog`)

```yaml
---
# Tytuł artykułu
title: "Inicjalizacja projektu"

# Data publikacji (ISO 8601)
date: "2024-01-15T10:30:00Z"

# Obrazek artykułu
image: "https://example.com/article.jpg"

# Wersja (opcjonalnie - do sortowania)
version: "1.0.0"
---
```

---

## 🔗 Powiązywanie artykułów z projektami

OpenFolio obsługuje dwa sposoby powiązywania artykułów z projektami:

### Sposób 1: GitHub Sub-issues (zalecane)

GitHub natively wspiera sub-issues. W OpenFolio:

1. Utwórz Issue-projekt z etykietą `project`
2. W GitHub UI utwórz sub-issue (Task) pod tym projektem
3. Sub-issue automatycznie staje się artykułem projektu

```
Issue #1 (project: "OpenFolio")
├── Sub-issue #2 (artykuł: "Inicjalizacja")
├── Sub-issue #3 (artykuł: "Implementacja UI")
└── Sub-issue #4 (artykuł: "Deployment")
```

### Sposób 2: Prefiks w tytule

Alternatywnie, w tytule artykułu dodaj numer projektu:

```
Tytuł: [#1] Inicjalizacja projektu
        ↑
   Numer Issue projektu
```

---

## 🎨 Opcjonalne etykiety

### Status projektu

| Etykieta | Kolor | Ikona w UI |
|----------|-------|------------|
| `completed` | 🟢 `#00FF00` | ✓ Ukończony |
| `in-progress` | 🟡 `#FFA500` | ⚡ W trakcie |
| `planned` | 🔵 `#0000FF` | 📋 Planowany |

### Technologie

Dodaj etykiety technologii — będą wyświetlane jako tagi:

| Etykieta | Kolor |
|----------|-------|
| `nextjs` | `#000000` |
| `typescript` | `#3178C6` |
| `react` | `#61DAFB` |
| `tailwind` | `#06B6D4` |
| `nodejs` | `#339933` |
| `python` | `#3776AB` |

### Kategorie

| Etykieta | Opis |
|----------|------|
| `bug` | Zgłoszenie błędu |
| `enhancement` | Ulepszenie |
| `documentation` | Dokumentacja |
| `setup` | Konfiguracja |
| `feature` | Nowa funkcjonalność |

---

## 🖼️ Jak OpenFolio wyświetla dane?

### Karta projektu

```
┌─────────────────────────────────────────────────────────┐
│  📷 thumbnailImage                                       │
├─────────────────────────────────────────────────────────┤
│  📌 title                        [status badge]         │
│                                                          │
│  📝 description (pierwsze 200 znaków body)              │
│                                                          │
│  🏷️ [technology] [technology] [technology] +2           │
│                                                          │
│  🔗 [GitHub] [Live Demo]                                │
└─────────────────────────────────────────────────────────┘
```

### Szczegóły projektu

```
┌─────────────────────────────────────────────────────────┐
│  📷 mainImage                                            │
├─────────────────────────────────────────────────────────┤
│  📌 title                                                │
│  📝 Pełna treść body (Markdown rendered)                │
│                                                          │
│  ═══════════════════════════════════════════════════════ │
│                                                          │
│  📚 Historia projektu (entries)                          │
│  ├── 📄 Artykuł 1 (sub-issue #2)                        │
│  ├── 📄 Artykuł 2 (sub-issue #3)                        │
│  └── 📄 Artykuł 3 (sub-issue #4)                        │
│                                                          │
│  ═══════════════════════════════════════════════════════ │
│                                                          │
│  💬 Komentarze (comments z Issue)                       │
└─────────────────────────────────────────────────────────┘
```

---

## 💬 System komentarzy

### Jak działają komentarze?

1. **Komentarze w GitHub Issues** automatycznie pojawiają się w UI
2. **Użytkownicy mogą dodawać komentarze** przez aplikację
3. Komentarze są zapisywane jako **GitHub Issue Comments**

### Dodawanie komentarza przez UI

```
┌─────────────────────────────────────────────────────────┐
│  💬 Komentarze (3)                              [▼]     │
├─────────────────────────────────────────────────────────┤
│  [avatar] Zalogowany jako: @username  [Wyloguj]        │
│  ┌───────────────────────────────────────────────┐     │
│  │ Napisz komentarz...                           │ [📤]│
│  └───────────────────────────────────────────────┘     │
├─────────────────────────────────────────────────────────┤
│  [avatar] @jan_kowalski • 2 dni temu                   │
│  Świetny projekt! 👏                                    │
│  [❤️ 5] [💬 Odpowiedz]                                 │
│                                                          │
│  [avatar] @anna_nowak • 1 dzień temu                   │
│  Czy planujesz dodać dark mode?                         │
│  [❤️ 2] [💬 Odpowiedz]                                 │
└─────────────────────────────────────────────────────────┘
```

### Markdown w komentarzach

Komentarze wspierają **GitHub Flavored Markdown**:

```markdown
Świetny projekt! 👏

**Propozycje:**
- [ ] Dodać więcej animacji
- [ ] Poprawić responsywność na mobile

```typescript
// Może coś takiego?
const animation = useSpring({ opacity: 1 });
```
```

---

## 📊 Przykład kompletnego projektu

### Issue #10 — Projekt główny

**Tytuł:** `E-commerce Platform`

**Labels:** `project`, `nextjs`, `stripe`, `completed`

**Body:**
```markdown
---
title: "E-commerce Platform"
thumbnailImage: "https://images.unsplash.com/photo-1557821552-17105176677c"
mainImage: "https://images.unsplash.com/photo-1563013544-824ae1b704d3"
technologies: ["Next.js", "Stripe", "PostgreSQL", "Prisma"]
status: "completed"
liveUrl: "https://myshop.vercel.app"
---

# E-commerce Platform

Pełnofunkcjonalna platforma e-commerce z obsługą płatności.

## 🚀 Funkcjonalności

- ✅ Koszyk zakupowy
- ✅ Płatności Stripe
- ✅ Panel administratora
- ✅ Historia zamówień

## 📊 Metryki

- **Performance Score:** 95/100
- **Accessibility:** 100/100
```

### Sub-issue #11 — Artykuł

**Tytuł:** `Implementacja płatności Stripe`

**Labels:** `changelog`, `stripe`, `backend`

**Body:**
```markdown
---
title: "Implementacja płatności Stripe"
date: "2024-01-20T14:30:00Z"
version: "1.2.0"
---

# Implementacja płatności Stripe

W tej iteracji zintegrowałem Stripe jako główny system płatności.

## Co zostało zrobione

### 1. Konfiguracja Stripe

\`\`\`typescript
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});
\`\`\`

### 2. Checkout flow

Zaimplementowałem pełny flow płatności z obsługą błędów...

## Rezultaty

- ✅ Płatności działają poprawnie
- ✅ Testowane z Stripe CLI
```

---

## ⚠️ Najczęstsze błędy

### ❌ Brak etykiety `project`

```
Issue bez etykiety "project"
→ Nie pojawi się jako projekt w portfolio
```

**Rozwiązanie:** Dodaj etykietę `project` do Issue

### ❌ Niepoprawny frontmatter

```yaml
# ŹLE - brak cudzysłowów przy URL
liveUrl: https://example.com

# DOBRZE
liveUrl: "https://example.com"
```

### ❌ Technologies jako string

```yaml
# ŹLE
technologies: "React, TypeScript"

# DOBRZE
technologies: ["React", "TypeScript"]
```

### ❌ Niepoprawny format daty

```yaml
# ŹLE
date: "15-01-2024"

# DOBRZE (ISO 8601)
date: "2024-01-15T10:30:00Z"
```

---

## 🛠️ Tworzenie etykiet

### W GitHub UI

1. **Settings** → **Labels** w repozytorium
2. Kliknij **New label**
3. Wypełnij:
   - Name: `project`
   - Description: "Oznacza główny projekt"
   - Color: wybierz kolor

### Przez GitHub CLI

```bash
gh label create "project" --description "Główny projekt" --color "0E8A16"
gh label create "changelog" --description "Wpis changelog" --color "FFA500"
gh label create "nextjs" --description "Next.js" --color "000000"
gh label create "typescript" --description "TypeScript" --color "3178C6"
```

---

## 📝 Checklist przed publikacją

### Dla nowego projektu

- [ ] Issue ma etykietę `project`
- [ ] Tytuł jest opisowy
- [ ] Frontmatter zawiera `title`, `technologies`, `status`
- [ ] Body zawiera opis w Markdown
- [ ] Dodane dodatkowe etykiety technologii

### Dla nowego artykułu

- [ ] Issue ma etykietę `changelog`
- [ ] Jest sub-issue projektu LUB ma prefiks `[#X]` w tytule
- [ ] Frontmatter zawiera `title`, `date`
- [ ] Content jest sformatowany w Markdown

---

## 🎯 Następny artykuł

Czas na podsumowanie — co się udało, co można poprawić i jakie są plany na przyszłość.

➡️ [Podsumowanie projektu](./03-podsumowanie-projektu.md)
