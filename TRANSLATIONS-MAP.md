adó# 🗺️ Mapa tłumaczeń OpenFolio

## 📁 Pliki tłumaczeń

Tłumaczenia znajdują się w:
- `src/messages/pl.json` - Polski
- `src/messages/en.json` - English

## 📋 Mapowanie kluczy do komponentów

### 🔧 common - Ogólne elementy
| Klucz | Użycie | Pliki |
|-------|--------|-------|
| `common.loading` | Stan ładowania | Wszystkie strony z async data |
| `common.error` | Komunikaty błędów | Error states |
| `common.tryAgain` | Przycisk ponowienia | Error handlers |
| `common.cancel` | Anulowanie akcji | Formularze, dialogi |
| `common.send` | Wysyłanie | CommentSection |
| `common.back` | Powrót | Nawigacja |
| `common.viewMore` | Zobacz więcej | Linki rozwijające |
| `common.articles` | Liczba artykułów | Licznik artykułów |

---

### 🧭 nav - Nawigacja
| Klucz | Użycie | Komponent |
|-------|--------|-----------|
| `nav.backToHome` | Powrót do strony głównej | `/projects/page.tsx` |
| `nav.backToProjects` | Powrót do listy projektów | `/projects/[id]/page.tsx` |
| `nav.backToProject` | Powrót do projektu | `/projects/[id]/articles/[articleId]/page.tsx` |
| `nav.palette` | Przełącznik palety | `Navbar.tsx` |
| `nav.theme.dark` | Motyw ciemny | `Navbar.tsx` |
| `nav.theme.light` | Motyw jasny | `Navbar.tsx` |
| `nav.theme.system` | Motyw systemowy | `Navbar.tsx` |
| `nav.language.polish` | Język polski | `Navbar.tsx` |
| `nav.language.english` | Język angielski | `Navbar.tsx` |

---

### 🏠 home - Strona główna
| Klucz | Użycie | Komponent |
|-------|--------|-----------|
| `home.welcome` | Tytuł powitalny | `WelcomeSection.tsx` |
| `home.intro` | Opis wprowadzający | `WelcomeSection.tsx` |

---

### 👤 about - Sekcja About Me
| Klucz | Użycie | Komponent |
|-------|--------|-----------|
| `about.title` | Tytuł sekcji | `AboutSection.tsx` |
| `about.greeting` | Powitanie | `AboutSection.tsx` |
| `about.developer` | Przycisk programista | `AboutSection.tsx` |
| `about.engineer` | Przycisk inżynier | `AboutSection.tsx` |
| `about.developerTools` | Tytuł narzędzi programisty | `AboutSection.tsx` |
| `about.engineerTools` | Tytuł narzędzi inżyniera | `AboutSection.tsx` |
| `about.developerDescription` | Opis programisty | `AboutSection.tsx` |
| `about.engineerDescription` | Opis inżyniera | `AboutSection.tsx` |

---

### 💼 portfolio - Sekcja Portfolio
| Klucz | Użycie | Komponent |
|-------|--------|-----------|
| `portfolio.title` | Tytuł sekcji | `PortfolioSection.tsx` |
| `portfolio.loadingProjects` | Stan ładowania | `PortfolioSection.tsx` |
| `portfolio.loadingError` | Błąd ładowania | `PortfolioSection.tsx` |
| `portfolio.checkConnection` | Sprawdź połączenie | `PortfolioSection.tsx` |
| `portfolio.clickToViewAll` | Link do wszystkich | `PortfolioSection.tsx` |

---

### ⏰ now - Sekcja Now
| Klucz | Użycie | Komponent |
|-------|--------|-----------|
| `now.title` | Tytuł sekcji | `NowSection.tsx` |
| `now.whatIsThis` | Pytanie wyjaśniające | `NowSection.tsx` |
| `now.currentStatus` | Aktualny status | `NowSection.tsx` |

---

### 📄 cv - Sekcja CV
| Klucz | Użycie | Komponent |
|-------|--------|-----------|
| `cv.title` | Tytuł sekcji | `CVSection.tsx` |
| `cv.description` | Opis | `CVSection.tsx` |
| `cv.download` | Przycisk pobierania | `CVSection.tsx` |

---

### 🎓 education - Edukacja
| Klucz | Użycie | Komponent |
|-------|--------|-----------|
| `education.title` | Tytuł sekcji | `StudySection.tsx` |
| `education.degree` | Kierunek studiów | `StudySection.tsx` |
| `education.university` | Nazwa uczelni | `StudySection.tsx` |
| `education.period` | Okres studiów | `StudySection.tsx` |
| `education.specialization` | Specjalizacja | `StudySection.tsx` |
| `education.courses` | Kursy | `StudySection.tsx` |
| `education.platforms` | Platformy | `StudySection.tsx` |
| `education.current` | Obecnie | `StudySection.tsx` |
| `education.technologies` | Lista technologii | `StudySection.tsx` |
| `education.viewMore` | Zobacz więcej | `StudySection.tsx` |
| `education.clickToViewDetails` | Link do szczegółów | `StudySection.tsx` |

---

### 💼 experience - Doświadczenie
| Klucz | Użycie | Komponent |
|-------|--------|-----------|
| `experience.title` | Tytuł sekcji | `ExperienceSection.tsx` |
| `experience.softwareEngineer` | Stanowisko | `ExperienceSection.tsx` |
| `experience.frontendDeveloper` | Stanowisko | `ExperienceSection.tsx` |
| `experience.current` | Obecnie | `ExperienceSection.tsx` |
| `experience.clickToViewDetails` | Link do szczegółów | `ExperienceSection.tsx` |

---

### 📧 contact - Kontakt
| Klucz | Użycie | Komponent |
|-------|--------|-----------|
| `contact.title` | Tytuł sekcji | `ContactSection.tsx` |
| `contact.location` | Lokalizacja | `ContactSection.tsx` |

---

### 🚀 projects - Projekty
| Klucz | Użycie | Pliki |
|-------|--------|-------|
| `projects.title` | Tytuł | `/projects/page.tsx`, Navbar |
| `projects.myProjects` | Tytuł strony | `/projects/page.tsx` |
| `projects.subtitle` | Podtytuł | `/projects/page.tsx` |
| `projects.loading` | Ładowanie z GitHub | `/projects/page.tsx` |
| `projects.loadingProject` | Ładowanie projektu | `/projects/[id]/page.tsx` |
| `projects.loadingArticle` | Ładowanie artykułu | `/projects/[id]/articles/[articleId]/page.tsx` |
| `projects.loadingError` | Błąd | `/projects/page.tsx` |
| `projects.checkGitHub` | Sprawdź GitHub | `/projects/page.tsx` |
| `projects.notFound` | Nie znaleziono | `/projects/[id]/page.tsx` |
| `projects.searchedProject` | Szukany projekt | `/projects/[id]/page.tsx` |
| `projects.availableProjects` | Dostępne projekty | `/projects/[id]/page.tsx` |
| `projects.errorLoadingArticle` | Błąd artykułu | `/projects/[id]/articles/[articleId]/page.tsx` |

#### Statusy projektów
| Klucz | Wartość PL | Wartość EN |
|-------|-----------|------------|
| `projects.status.completed` | Ukończony | Completed |
| `projects.status.inProgress` | W trakcie | In Progress |
| `projects.status.planned` | Planowany | Planned |
| `projects.status.unknown` | Nieznany | Unknown |

#### Przyciski
| Klucz | Użycie |
|-------|--------|
| `projects.buttons.github` | Link do GitHub |
| `projects.buttons.liveDemo` | Link do Live Demo |

#### Changelog
| Klucz | Użycie | Plik |
|-------|--------|------|
| `projects.changelog.title` | Tytuł sekcji | `/projects/[id]/page.tsx` |
| `projects.changelog.subtitle` | Podtytuł | `/projects/[id]/page.tsx` |
| `projects.changelog.readArticle` | Link do artykułu | `/projects/[id]/page.tsx` |

#### Artykuł
| Klucz | Użycie | Plik |
|-------|--------|------|
| `projects.article.changelogFile` | Nazwa pliku | `/projects/[id]/articles/[articleId]/page.tsx` |
| `projects.article.articleNumber` | Numer artykułu | `/projects/[id]/articles/[articleId]/page.tsx` |
| `projects.article.tableOfContents` | Spis treści | `/projects/[id]/articles/[articleId]/page.tsx` |
| `projects.article.technologiesUsed` | Technologie | `/projects/[id]/articles/[articleId]/page.tsx` |
| `projects.article.publicationDate` | Data publikacji | `/projects/[id]/articles/[articleId]/page.tsx` |
| `projects.article.version` | Wersja | `/projects/[id]/articles/[articleId]/page.tsx` |
| `projects.article.backToProject` | Powrót | `/projects/[id]/articles/[articleId]/page.tsx` |

---

### 💬 comments - Komentarze
| Klucz | Użycie | Komponent |
|-------|--------|-----------|
| `comments.title` | Tytuł sekcji | `CommentSection.tsx` |
| `comments.addComment` | Placeholder dodawania | `CommentSection.tsx` |
| `comments.writeReply` | Placeholder odpowiedzi | `CommentSection.tsx` |
| `comments.send` | Przycisk wyślij | `CommentSection.tsx` |
| `comments.cancel` | Przycisk anuluj | `CommentSection.tsx` |
| `comments.reply` | Przycisk odpowiedz | `CommentSection.tsx` |
| `comments.noComments` | Brak komentarzy | `CommentSection.tsx` |
| `comments.user` | Domyślny użytkownik | Article pages |

---

### 📅 date - Formatowanie dat
| Klucz | Użycie | Opis |
|-------|--------|------|
| `date.format.long` | Locale dla dat | `pl-PL` lub `en-US` |
| `date.format.options` | Opcje formatowania | Używane w `toLocaleDateString()` |

---

## 🎨 Struktura plików tłumaczeń

```json
{
  "common": {           // Ogólne elementy UI
    "loading": "...",
    "error": "..."
  },
  "nav": {             // Nawigacja i navbar
    "backToHome": "...",
    "theme": { ... }
  },
  "home": { ... },     // Strona główna
  "about": { ... },    // Sekcja About Me
  "portfolio": { ... },// Sekcja Portfolio
  "now": { ... },      // Sekcja Now
  "cv": { ... },       // Sekcja CV
  "education": { ... },// Edukacja
  "experience": { ... },// Doświadczenie
  "contact": { ... },  // Kontakt
  "projects": {        // Strona projektów
    "status": { ... }, // Statusy
    "buttons": { ... },// Przyciski
    "changelog": { ... },// Changelog
    "article": { ... } // Artykuł
  },
  "comments": { ... }, // Sekcja komentarzy
  "date": { ... }      // Formatowanie dat
}
```

---

## 📝 Zasady używania

### 1. **Tylko elementy UI**
✅ Tłumaczymy:
- Przyciski, linki, nagłówki
- Statusy, etykiety
- Komunikaty błędów
- Placeholdery
- Nawigacja

❌ NIE tłumaczymy:
- Tytuły projektów (z GitHub Issues)
- Opisy projektów (z GitHub Issues)
- Treść artykułów (z GitHub Issues)
- Nazwy firm, stanowisk (z ExperienceSection)
- Nazwy uczelni (chyba że dynamiczne)

### 2. **Formatowanie dat**
Używaj locale z `date.format.long`:
```typescript
new Date().toLocaleDateString(t('date.format.long'), {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
```

### 3. **Pluralizacja**
Dla liczby artykułów:
```typescript
// PL: "5 artykułów"
// EN: "5 articles"
`${count} ${t('common.articles')}`
```

### 4. **Interpolacja**
Dla dynamicznych wartości:
```typescript
t('projects.searchedProject') + ': ' + id
```

---

## 🔄 Proces aktualizacji tłumaczeń

1. **Dodaj nowy klucz** do obu plików (`pl.json` i `en.json`)
2. **Zaktualizuj ten plik** (TRANSLATIONS-MAP.md) z mapowaniem
3. **Użyj klucza** w komponencie: `t('namespace.key')`
4. **Przetestuj** oba języki

---

## 🎯 Przykłady użycia

### W Server Component:
```typescript
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('projects');
  
  return <h1>{t('title')}</h1>;
}
```

### W Client Component:
```typescript
'use client';
import { useTranslations } from 'next-intl';

export default function Component() {
  const t = useTranslations('about');
  
  return <p>{t('greeting')}</p>;
}
```

### Nested keys:
```typescript
const t = useTranslations('projects');

// Dostęp do zagnieżdżonych kluczy
t('status.completed')        // "Ukończony"
t('buttons.github')          // "GitHub"
t('changelog.title')         // "Changelog"
t('article.tableOfContents') // "Spis treści"
```

---

## ✅ Checklist implementacji

- [x] Utworzone pliki `pl.json` i `en.json`
- [x] Dodane wszystkie klucze tłumaczeń
- [ ] Zainstalować `next-intl`
- [ ] Skonfigurować routing i middleware
- [ ] Zaktualizować wszystkie komponenty
- [ ] Przetestować obie wersje językowe
- [ ] Dodać selektor języka do Navbar

---

**Ostatnia aktualizacja:** 2024-01-21  
**Liczba kluczy tłumaczeń:** ~90  
**Wspierane języki:** Polski (PL), English (EN)

