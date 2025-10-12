# 🌍 Przewodnik: Implementacja wielojęzyczności (i18n)

## 📋 Spis treści
1. [Porównanie rozwiązań](#porównanie-rozwiązań)
2. [Rozwiązanie 1: next-intl (Zalecane)](#rozwiązanie-1-next-intl-zalecane)
3. [Rozwiązanie 2: React Context (Proste)](#rozwiązanie-2-react-context-proste)
4. [Rozwiązanie 3: next-i18next](#rozwiązanie-3-next-i18next)
5. [Implementacja krok po kroku](#implementacja-krok-po-kroku)
6. [Struktura tłumaczeń](#struktura-tłumaczeń)
7. [Best Practices](#best-practices)

---

## 🔍 Porównanie rozwiązań

| Cecha | next-intl | React Context | next-i18next |
|-------|-----------|---------------|--------------|
| **Łatwość** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Funkcje** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Next.js 15** | ✅ | ✅ | ⚠️ (problemy) |
| **SSR/SSG** | ✅ | ⚠️ | ✅ |
| **Bundle size** | 📦 Mały | 📦 Minimalny | 📦 Duży |
| **TypeScript** | ✅ Pełne | ✅ Własne | ✅ |
| **Routing** | ✅ /en, /pl | ❌ Parametry | ✅ /en, /pl |

**Rekomendacja:** `next-intl` - najlepsze dla Next.js 15 App Router

---

## 🎯 Rozwiązanie 1: next-intl (Zalecane)

### Dlaczego next-intl?
- ✅ Oficjalnie wspierany przez Next.js 15
- ✅ Routing z prefiksami (`/en`, `/pl`)
- ✅ SSR i SSG out-of-the-box
- ✅ TypeScript z autocomplete
- ✅ Formatowanie dat, liczb, walut
- ✅ Lazy loading tłumaczeń

### Instalacja

```bash
bun add next-intl
```

### Struktura katalogów

```
src/
├── app/
│   └── [locale]/
│       ├── layout.tsx
│       ├── page.tsx
│       ├── projects/
│       │   └── page.tsx
│       └── ...
├── i18n/
│   ├── request.ts
│   └── routing.ts
└── messages/
    ├── en.json
    ├── pl.json
    └── de.json (opcjonalnie)
```

### Krok 1: Konfiguracja routing

```typescript
// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // Dostępne języki
  locales: ['en', 'pl'],
  
  // Domyślny język
  defaultLocale: 'pl',
  
  // Strategia wykrywania języka
  localeDetection: true
});

// Wyeksportuj komponenty nawigacji z i18n
export const { Link, redirect, usePathname, useRouter } = 
  createNavigation(routing);
```

### Krok 2: Konfiguracja Next.js

```typescript
// next.config.ts
import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* inne opcje konfiguracji */
};

export default withNextIntl(nextConfig);
```

### Krok 3: Middleware

```typescript
// src/middleware.ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Ścieżki które będą obsługiwane przez middleware
  matcher: [
    // Dopasuj wszystkie ścieżki oprócz _next i statycznych plików
    '/((?!_next|api|.*\\..*).*)',
    // Jednak zawsze dopasuj api/trpc
    '/(api|trpc)(.*)'
  ]
};
```

### Krok 4: Layout z i18n

```typescript
// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Walidacja locale
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Pobierz tłumaczenia
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### Krok 5: Pliki z tłumaczeniami

```json
// messages/pl.json
{
  "common": {
    "welcome": "Witaj",
    "about": "O mnie",
    "projects": "Projekty",
    "contact": "Kontakt",
    "loading": "Ładowanie..."
  },
  "home": {
    "title": "Cześć, jestem Łukasz Bernatowicz",
    "subtitle": "Programista i inżynier systemów",
    "description": "Pasjonat technologii z naciskiem na UX, animacje i mikrointerakcje."
  },
  "about": {
    "greeting": "Cześć, jestem Łukasz, fullstack developer z Polski 🇵🇱",
    "developer": "Programista",
    "engineer": "Inżynier",
    "developerTools": "Główne narzędzia dla programisty",
    "engineerTools": "Główne narzędzia dla inżyniera",
    "developerDescription": "Poza programowaniem, pasjonuję się muzyką, podróżowaniem i fotografią. Niezwykłym hobby jest dla mnie gra na gitarze i tworzenie muzyki elektronicznej.",
    "engineerDescription": "Jako inżynier systemów, skupiam się na budowaniu skalowalnej infrastruktury i automatyzacji procesów. Pasjonuje mnie DevOps i architektura chmurowa."
  },
  "projects": {
    "title": "Portfolio",
    "viewAll": "Zobacz wszystkie projekty",
    "status": {
      "completed": "Ukończony",
      "inProgress": "W trakcie",
      "planned": "Planowany"
    }
  }
}
```

```json
// messages/en.json
{
  "common": {
    "welcome": "Welcome",
    "about": "About",
    "projects": "Projects",
    "contact": "Contact",
    "loading": "Loading..."
  },
  "home": {
    "title": "Hi, I'm Łukasz Bernatowicz",
    "subtitle": "Developer and Systems Engineer",
    "description": "Technology enthusiast focused on UX, animations and microinteractions."
  },
  "about": {
    "greeting": "Hi, I'm Łukasz, fullstack developer from Poland 🇵🇱",
    "developer": "Developer",
    "engineer": "Engineer",
    "developerTools": "Main tools for developer",
    "engineerTools": "Main tools for engineer",
    "developerDescription": "Besides programming, I'm passionate about music, traveling and photography. My unique hobby is playing guitar and creating electronic music.",
    "engineerDescription": "As a systems engineer, I focus on building scalable infrastructure and process automation. I'm passionate about DevOps and cloud architecture."
  },
  "projects": {
    "title": "Portfolio",
    "viewAll": "View all projects",
    "status": {
      "completed": "Completed",
      "inProgress": "In Progress",
      "planned": "Planned"
    }
  }
}
```

### Krok 6: Użycie w komponentach

#### Server Component

```typescript
// src/app/[locale]/page.tsx
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

// Dla metadata (SEO)
export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'home' });
  
  return {
    title: t('title'),
    description: t('description')
  };
}

export default function HomePage() {
  const t = useTranslations('home');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

#### Client Component

```typescript
// src/components/sections/AboutSection.tsx
'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function AboutSection() {
  const t = useTranslations('about');
  const [activeCategory, setActiveCategory] = useState<'developer' | 'engineer'>('developer');
  
  return (
    <div>
      <p>{t('greeting')}</p>
      
      <button onClick={() => setActiveCategory('developer')}>
        {t('developer')}
      </button>
      <button onClick={() => setActiveCategory('engineer')}>
        {t('engineer')}
      </button>
      
      <h3>
        {activeCategory === 'developer' 
          ? t('developerTools') 
          : t('engineerTools')}
      </h3>
      
      <p>
        {activeCategory === 'developer'
          ? t('developerDescription')
          : t('engineerDescription')}
      </p>
    </div>
  );
}
```

### Krok 7: Selektor języka

```typescript
// src/components/ui/LanguageSwitcher.tsx
'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { Languages } from 'lucide-react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-2">
      <Languages className="w-5 h-5 text-gray-400" />
      <button
        onClick={() => switchLanguage('pl')}
        className={`px-3 py-1 rounded ${
          locale === 'pl' 
            ? 'bg-blue-600 text-white' 
            : 'text-gray-400 hover:text-white'
        }`}
      >
        PL
      </button>
      <button
        onClick={() => switchLanguage('en')}
        className={`px-3 py-1 rounded ${
          locale === 'en' 
            ? 'bg-blue-600 text-white' 
            : 'text-gray-400 hover:text-white'
        }`}
      >
        EN
      </button>
    </div>
  );
}
```

### Zaawansowane funkcje

#### Interpolacja zmiennych

```typescript
const t = useTranslations('projects');

// JSON: "projectCount": "Masz {count} projektów"
<p>{t('projectCount', { count: 5 })}</p>
// Wynik: "Masz 5 projektów"
```

#### Pluralizacja

```json
{
  "projects": {
    "count": "{count, plural, =0 {brak projektów} one {# projekt} few {# projekty} other {# projektów}}"
  }
}
```

```typescript
<p>{t('projects.count', { count: 1 })}</p>  // "1 projekt"
<p>{t('projects.count', { count: 3 })}</p>  // "3 projekty"
<p>{t('projects.count', { count: 10 })}</p> // "10 projektów"
```

#### Formatowanie dat

```typescript
import { useFormatter } from 'next-intl';

const format = useFormatter();

// Data
format.dateTime(new Date(), {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
// PL: "15 stycznia 2024"
// EN: "January 15, 2024"

// Liczby
format.number(1234.56, {
  style: 'currency',
  currency: 'PLN'
});
// PL: "1 234,56 zł"
// EN: "PLN 1,234.56"
```

#### Rich text / HTML

```json
{
  "welcome": "Witaj <strong>{name}</strong>!"
}
```

```typescript
import { useTranslations } from 'next-intl';

const t = useTranslations();

<p>{t.rich('welcome', {
  name: 'Łukasz',
  strong: (chunks) => <strong className="text-blue-500">{chunks}</strong>
})}</p>
```

---

## 🔧 Rozwiązanie 2: React Context (Proste)

Jeśli potrzebujesz prostego rozwiązania bez zmian w routing:

### Struktura

```
src/
├── contexts/
│   └── LanguageContext.tsx
├── locales/
│   ├── pl.ts
│   └── en.ts
└── hooks/
    └── useTranslation.ts
```

### Implementacja

```typescript
// src/locales/pl.ts
export const pl = {
  common: {
    welcome: 'Witaj',
    about: 'O mnie',
    projects: 'Projekty',
    contact: 'Kontakt',
  },
  home: {
    title: 'Cześć, jestem Łukasz Bernatowicz',
    subtitle: 'Programista i inżynier systemów',
  },
  // ... więcej
};

export type TranslationKeys = typeof pl;
```

```typescript
// src/locales/en.ts
import { TranslationKeys } from './pl';

export const en: TranslationKeys = {
  common: {
    welcome: 'Welcome',
    about: 'About',
    projects: 'Projects',
    contact: 'Contact',
  },
  home: {
    title: "Hi, I'm Łukasz Bernatowicz",
    subtitle: 'Developer and Systems Engineer',
  },
  // ... więcej
};
```

```typescript
// src/contexts/LanguageContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { pl, TranslationKeys } from '@/locales/pl';
import { en } from '@/locales/en';

type Locale = 'pl' | 'en';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = { pl, en };

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('pl');

  const value = {
    locale,
    setLocale,
    t: translations[locale],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
```

```typescript
// src/hooks/useTranslation.ts
import { useLanguage } from '@/contexts/LanguageContext';

export function useTranslation() {
  const { t, locale, setLocale } = useLanguage();
  return { t, locale, setLocale };
}
```

### Użycie

```typescript
// src/app/layout.tsx
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
```

```typescript
// src/components/sections/AboutSection.tsx
'use client';

import { useTranslation } from '@/hooks/useTranslation';

export default function AboutSection() {
  const { t } = useTranslation();
  
  return (
    <div>
      <p>{t.about.greeting}</p>
      <h3>{t.about.developerTools}</h3>
    </div>
  );
}
```

```typescript
// src/components/ui/LanguageSwitcher.tsx
'use client';

import { useTranslation } from '@/hooks/useTranslation';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <div>
      <button onClick={() => setLocale('pl')}>PL</button>
      <button onClick={() => setLocale('en')}>EN</button>
    </div>
  );
}
```

**Zalety:**
- ✅ Bardzo proste
- ✅ TypeScript autocomplete
- ✅ Brak zależności
- ✅ Pełna kontrola

**Wady:**
- ❌ Brak SEO dla różnych języków
- ❌ Brak URL routing (/en, /pl)
- ❌ Język zapisywany w localStorage (nie w URL)

---

## 📁 Struktura tłumaczeń - Best Practices

### Organizacja plików

```json
{
  "common": {
    // Elementy używane wszędzie
    "loading": "Ładowanie...",
    "error": "Wystąpił błąd",
    "save": "Zapisz",
    "cancel": "Anuluj"
  },
  "navigation": {
    // Menu, navbar
    "home": "Strona główna",
    "about": "O mnie",
    "projects": "Projekty"
  },
  "home": {
    // Strona główna
    "title": "Tytuł",
    "subtitle": "Podtytuł"
  },
  "about": {
    // Sekcja About
  },
  "projects": {
    // Strona projektów
    "list": {
      // Lista projektów
    },
    "detail": {
      // Szczegóły projektu
    }
  },
  "validation": {
    // Komunikaty walidacji
    "required": "Pole wymagane",
    "email": "Niepoprawny email"
  }
}
```

### Konwencje nazewnictwa

✅ **Dobrze:**
```json
{
  "user": {
    "profile": {
      "editButton": "Edytuj profil",
      "saveButton": "Zapisz zmiany"
    }
  }
}
```

❌ **Źle:**
```json
{
  "edit_profile_btn": "Edytuj profil",
  "save_profile_button": "Zapisz zmiany"
}
```

### Pluralizacja

```json
{
  "projects": {
    "count": "{count, plural, =0 {no projects} one {# project} other {# projects}}"
  }
}
```

---

## 🎨 Dodanie selektora języka do Navbar

```typescript
// src/components/ui/Navbar.tsx
'use client';

import { Languages } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { useState } from 'react';

export default function Navbar() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const languages = [
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
  ];

  const switchLanguage = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setShowLangMenu(false);
  };

  const currentLanguage = languages.find(lang => lang.code === locale);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="text-xl font-bold text-white">
            OpenFolio
          </div>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <Languages className="w-5 h-5 text-gray-300" />
              <span className="text-sm font-medium text-white">
                {currentLanguage?.flag} {currentLanguage?.code.toUpperCase()}
              </span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-lg overflow-hidden">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => switchLanguage(lang.code)}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors ${
                      locale === lang.code ? 'bg-gray-800' : ''
                    }`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="text-white font-medium">{lang.name}</span>
                    {locale === lang.code && (
                      <span className="ml-auto text-blue-500">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
```

---

## ✅ Checklist implementacji

### Krok 1: Instalacja i konfiguracja
- [ ] Zainstaluj `next-intl`
- [ ] Utwórz strukturę katalogów (`[locale]`, `messages/`)
- [ ] Skonfiguruj `next.config.ts`
- [ ] Dodaj middleware
- [ ] Skonfiguruj routing

### Krok 2: Przygotowanie tłumaczeń
- [ ] Utwórz `messages/pl.json`
- [ ] Utwórz `messages/en.json`
- [ ] Zdefiniuj wszystkie klucze tłumaczeń
- [ ] Przetłumacz wszystkie teksty

### Krok 3: Migracja komponentów
- [ ] Zmień layout na `[locale]/layout.tsx`
- [ ] Zmień stronę główną na `[locale]/page.tsx`
- [ ] Przenieś wszystkie podstrony do `[locale]/`
- [ ] Zamień hardcoded teksty na `t()`

### Krok 4: Nawigacja
- [ ] Dodaj selektor języka do Navbar
- [ ] Zamień `Link` z Next.js na `Link` z `next-intl`
- [ ] Dodaj przełączanie języka w stopce (opcjonalnie)

### Krok 5: SEO
- [ ] Dodaj `hreflang` tags
- [ ] Zaktualizuj metadata dla każdego języka
- [ ] Dodaj sitemap z różnymi językami

### Krok 6: Testowanie
- [ ] Przetestuj wszystkie strony w PL
- [ ] Przetestuj wszystkie strony w EN
- [ ] Sprawdź routing
- [ ] Sprawdź zapisywanie preferencji

---

## 🚀 Szybki start (next-intl)

```bash
# 1. Instalacja
bun add next-intl

# 2. Utwórz strukturę
mkdir -p src/messages src/i18n
mkdir -p src/app/\[locale\]

# 3. Utwórz pliki konfiguracyjne
# (skopiuj kod z sekcji powyżej)

# 4. Przenieś istniejące strony
mv src/app/page.tsx src/app/[locale]/page.tsx
mv src/app/layout.tsx src/app/[locale]/layout.tsx

# 5. Uruchom dev server
bun run dev
```

---

## 💡 Rekomendacja

**Dla portfolio OpenFolio:**

Polecam **next-intl** ponieważ:
1. ✅ Oficjalne wsparcie Next.js 15
2. ✅ SEO-friendly URLs (`/pl`, `/en`)
3. ✅ TypeScript autocomplete
4. ✅ Łatwe w utrzymaniu
5. ✅ Świetna dokumentacja

**Kolejność implementacji:**
1. Zainstaluj i skonfiguruj `next-intl`
2. Stwórz pliki tłumaczeń (pl.json, en.json)
3. Przenieś strony do `[locale]/`
4. Zmiguj komponenty jeden po drugim
5. Dodaj selektor języka
6. Testuj!

---

**Masz pytania? Otwórz Issue!** 🌍

*Ostatnia aktualizacja: 2024-01-21*  
*Wersja: 1.0.0*

