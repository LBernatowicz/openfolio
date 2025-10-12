# 📚 Przewodnik: Korzystanie z GitHub Issues jako CMS

## 🎯 Wprowadzenie

Ten projekt wykorzystuje **GitHub Issues** jako CMS (Content Management System) do zarządzania projektami, artykułami i komentarzami. To innowacyjne podejście pozwala na:

- ✅ Bezpłatne i darmowe zarządzanie treścią
- ✅ Wbudowany system wersjonowania
- ✅ Wsparcie pełnego Markdown i syntax highlighting
- ✅ Integracja z GitHub API
- ✅ System komentarzy out-of-the-box
- ✅ Etykiety jako tagi/kategorie
- ✅ Możliwość współpracy (issues mogą dodawać różne osoby)

---

## 🚀 Szybki start

### 1. Konfiguracja tokenu GitHub

#### Krok 1: Generowanie Personal Access Token

1. Przejdź do [GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens)
2. Kliknij **"Generate new token (classic)"**
3. Nazwij token: `OpenFolio CMS`
4. Wybierz **Scopes** (uprawnienia):
   - ✅ `repo` - pełny dostęp do repozytoriów (jeśli prywatne)
   - ✅ `public_repo` - dostęp do publicznych repozytoriów
   - ✅ `read:user` - odczyt informacji o użytkowniku
5. Kliknij **"Generate token"**
6. ⚠️ **WAŻNE**: Skopiuj token natychmiast (będzie widoczny tylko raz!)

#### Krok 2: Konfiguracja zmiennych środowiskowych

Utwórz plik `.env.local` w katalogu głównym projektu:

```bash
# GitHub Personal Access Token
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Właściciel repozytorium (nazwa użytkownika)
NEXT_PUBLIC_GITHUB_USERNAME=lukaszbernatowicz

# Nazwa repozytorium
NEXT_PUBLIC_GITHUB_REPO=openfolio

# Źródło danych (github lub mock)
NEXT_PUBLIC_DATA_SOURCE=github
```

⚠️ **Bezpieczeństwo:**
- **NIE** commituj pliku `.env.local` do repozytorium
- Dodaj `.env.local` do `.gitignore`
- Token `GITHUB_TOKEN` powinien być **tylko w .env.local** (nie w .env)
- Prefix `NEXT_PUBLIC_` jest tylko dla zmiennych które mają być dostępne w przeglądarce

#### Krok 3: Restart serwera

```bash
# Zatrzymaj serwer (Ctrl+C)
# Uruchom ponownie
bun run dev
```

---

## 📋 Struktura Issues w GitHub

### Hierarchia danych

```
Repository (openfolio)
│
├── Issue #1 (Project 1) [label: "project"]
│   ├── Sub-issue #2 (Article 1) → powiązany z #1
│   ├── Sub-issue #3 (Article 2) → powiązany z #1
│   └── Comments (komentarze do projektu)
│
├── Issue #4 (Project 2) [label: "project"]
│   ├── Sub-issue #5 (Article 3) → powiązany z #4
│   └── Comments (komentarze do projektu)
│
└── ...
```

---

## 🏗️ Tworzenie projektu (Project Issue)

### Format podstawowy

**Issue z etykietą `project`** reprezentuje pojedynczy projekt w portfolio.

#### Przykład: Tworzenie nowego projektu

1. W repozytorium kliknij **"New Issue"**
2. Wypełnij formularz:

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

Nowoczesne portfolio programistyczne zbudowane w **Next.js 14** z pełnym wsparciem TypeScript i Tailwind CSS.

## 🚀 Funkcjonalności

- ✅ Responsywny design
- ✅ Dark mode
- ✅ Integracja z GitHub Issues jako CMS
- ✅ System komentarzy
- ✅ Markdown z syntax highlighting
- 🔄 Animacje (w trakcie)

## 🛠 Technologie

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS
- **CMS:** GitHub Issues API
- **Hosting:** Vercel

## 📸 Screenshoty

![Desktop view](https://example.com/screenshot-desktop.png)
![Mobile view](https://example.com/screenshot-mobile.png)

## 🎯 Cele projektu

1. Stworzenie nowoczesnego portfolio
2. Wykorzystanie GitHub jako CMS
3. Pokazanie umiejętności w Next.js i TypeScript
4. Responsywny design

## 📝 Notatki

> Ten projekt używa najnowszych technologii webowych i jest w pełni open-source.

## 🔗 Linki

- [Live Demo](https://openfolio.vercel.app)
- [GitHub Repository](https://github.com/lukaszbernatowicz/openfolio)
- [Dokumentacja](https://github.com/lukaszbernatowicz/openfolio/blob/main/README.md)
```

**Etykiety (Labels):**
- `project` (wymagane!)
- `nextjs`
- `typescript`
- `portfolio`
- `in-progress`

3. Kliknij **"Submit new issue"**

---

## 📝 Frontmatter w Issues

Frontmatter to metadata w formacie YAML na początku Issue, otoczona `---`.

### Dostępne pola dla projektów:

```yaml
---
# Tytuł projektu (nadpisuje tytuł issue)
title: "Nazwa projektu"

# Obrazek miniaturki (lista projektów)
thumbnailImage: "https://example.com/thumb.jpg"

# Obrazek główny (szczegóły projektu)
mainImage: "https://example.com/main.jpg"

# Lista technologii (array)
technologies: ["React", "TypeScript", "Node.js"]

# Status projektu: "completed", "in-progress", "planned"
status: "in-progress"

# Link do live demo
liveUrl: "https://example.com"
---
```

### Dostępne pola dla artykułów:

```yaml
---
# Tytuł artykułu (nadpisuje tytuł issue)
title: "Tytuł artykułu"

# Data publikacji (ISO 8601)
date: "2024-01-15T10:30:00Z"

# Obrazek artykułu
image: "https://example.com/article-image.jpg"
---
```

### ⚠️ Uwagi o frontmatter:

- Frontmatter jest **opcjonalny** - jeśli go nie podasz, użyte zostaną wartości domyślne
- Musi zaczynać się i kończyć `---`
- Format: klucz, dwukropek, spacja, wartość
- Listy używają notacji JSON: `["item1", "item2"]`
- Stringi mogą być w cudzysłowie lub bez (zalecane z cudzysłowem)

---

## 📰 Tworzenie artykułu (Sub-issue)

Artykuły to **sub-issues** powiązane z projektem głównym.

### Krok 1: Znajdź numer projektu

Jeśli projekt "OpenFolio" ma numer **#1**, będziesz tworzyć sub-issue powiązany z #1.

### Krok 2: Utwórz sub-issue

GitHub obecnie nie ma interfejsu UI do tworzenia sub-issues, ale możesz użyć API lub zewnętrznych narzędzi. **Najłatwiejszy sposób:**

#### Metoda 1: Używając GitHub CLI

```bash
# Zainstaluj GitHub CLI
brew install gh

# Uwierzytelnij się
gh auth login

# Utwórz sub-issue powiązany z issue #1
gh issue create \
  --title "[#1] Inicjalizacja projektu" \
  --body "$(cat article.md)" \
  --label "changelog"
```

#### Metoda 2: Używając Task Lists (zalecane!)

W opisie projektu (#1) dodaj listę zadań:

```markdown
## Artykuły / Changelog

- [ ] #2 Inicjalizacja projektu
- [ ] #3 Implementacja UI
- [ ] #4 Integracja z API
```

Gdzie #2, #3, #4 to osobne issues z etykietą `changelog`.

#### Metoda 3: Manualne powiązanie

1. Utwórz nowy Issue
2. W opisie dodaj link do projektu głównego:

```markdown
Related to #1

---
title: "Inicjalizacja projektu"
date: "2024-01-15"
---

# Inicjalizacja projektu OpenFolio

Szczegółowy opis pierwszych kroków w projekcie...
```

3. Dodaj etykietę `changelog`

### Format artykułu

**Tytuł:**
```
[#1] Inicjalizacja projektu
```

**Opis:**
```markdown
---
title: "Inicjalizacja projektu"
date: "2024-01-15T10:00:00Z"
image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97"
---

# Inicjalizacja projektu OpenFolio

## Co zostało zrobione

W tej iteracji skupiłem się na przygotowaniu fundamentów projektu:

### 1. Konfiguracja projektu

```bash
# Utworzenie projektu Next.js
bunx create-next-app@latest openfolio --typescript --tailwind --app

# Instalacja dodatkowych zależności
bun add lucide-react react-markdown remark-gfm
```

### 2. Struktura katalogów

Przygotowałem następującą strukturę:

```
src/
├── app/          # Next.js App Router
├── components/   # Komponenty React
├── lib/          # Utility functions
├── hooks/        # Custom hooks
└── types/        # TypeScript types
```

### 3. Konfiguracja Tailwind CSS

Dostosowałem konfigurację Tailwind do potrzeb projektu:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#8B5CF6'
      }
    }
  }
}
```

## Screenshoty

![Struktura projektu](https://example.com/screenshot.png)

## Następne kroki

- [ ] Implementacja komponentów UI
- [ ] Integracja z GitHub API
- [ ] Dodanie animacji
- [ ] Optymalizacja wydajności

## Napotkane problemy

1. **Problem z TypeScript typings** - rozwiązany przez dodanie `@types/node`
2. **Konfiguracja ESLint** - zaktualizowana zgodnie z Next.js 14

## Wnioski

Inicjalizacja projektu przebiegła sprawnie. Fundamenty są gotowe do dalszego rozwoju.

---

**Czas pracy:** ~4 godziny  
**Commit:** [abc123](https://github.com/user/repo/commit/abc123)
```

**Etykiety:**
- `changelog` (wymagane!)
- `setup`
- `documentation`

---

## 💬 System komentarzy

Komentarze w GitHub automatycznie pojawiają się w aplikacji!

### Dodawanie komentarzy

#### Przez GitHub:

1. Przejdź do Issue (projektu lub artykułu)
2. W sekcji komentarzy napisz komentarz w Markdown
3. Kliknij **"Comment"**

#### Przez aplikację:

Użytkownicy mogą dodawać komentarze bezpośrednio w aplikacji - będą one zapisywane do GitHub Issues przez API.

### Przykład komentarza

```markdown
Świetny projekt! 👏

Mam pytanie - czy planujesz dodać:
- Dark mode toggle w UI
- Export do PDF

Chętnie zobaczę więcej screenshotów interfejsu.
```

### Konwersacje

GitHub Issues wspiera wątki komentarzy - możesz odpowiadać na konkretne komentarze tworząc konwersacje.

---

## 🏷️ System etykiet (Labels)

Etykiety organizują Issues i są używane przez aplikację.

### Wymagane etykiety:

| Etykieta | Opis | Użycie |
|----------|------|--------|
| `project` | Oznacza główny projekt | Issue główne (projekty) |
| `changelog` | Oznacza artykuł/wpis | Sub-issues (artykuły) |

### Opcjonalne etykiety:

| Etykieta | Kolor | Opis |
|----------|-------|------|
| `in-progress` | `#FFA500` | Projekt w trakcie |
| `completed` | `#00FF00` | Projekt ukończony |
| `planned` | `#0000FF` | Projekt planowany |
| `nextjs` | `#000000` | Technologia: Next.js |
| `typescript` | `#3178C6` | Technologia: TypeScript |
| `react` | `#61DAFB` | Technologia: React |
| `bug` | `#FF0000` | Zgłoszenie błędu |
| `enhancement` | `#84B0D8` | Ulepszenie |
| `documentation` | `#0075CA` | Dokumentacja |

### Tworzenie etykiet:

1. Przejdź do **Settings → Labels** w repozytorium
2. Kliknij **"New label"**
3. Wypełnij: Name, Description, Color
4. Kliknij **"Create label"**

---

## 🔍 Przykłady pełnych Issues

### Przykład 1: Projekt E-commerce

**Issue #10**

**Tytuł:** E-commerce Platform

**Body:**
```markdown
---
title: "E-commerce Platform"
thumbnailImage: "https://images.unsplash.com/photo-1557821552-17105176677c"
mainImage: "https://images.unsplash.com/photo-1563013544-824ae1b704d3"
technologies: ["Next.js", "Stripe", "PostgreSQL", "Prisma", "TailwindCSS"]
status: "completed"
liveUrl: "https://myshop.vercel.app"
---

# E-commerce Platform

Pełnofunkcjonalna platforma e-commerce z obsługą płatności Stripe.

## 🚀 Funkcjonalności

- ✅ Koszyk zakupowy
- ✅ Płatności Stripe
- ✅ Panel administratora
- ✅ Zarządzanie produktami
- ✅ Historia zamówień
- ✅ Autentykacja użytkowników

## 🛠 Stack technologiczny

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod

### Backend
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** NextAuth.js
- **Payments:** Stripe

### Infrastructure
- **Hosting:** Vercel
- **Database:** Supabase
- **Storage:** AWS S3

## 📊 Metryki

- **Performance Score:** 95/100
- **Accessibility:** 100/100
- **SEO:** 98/100
- **Best Practices:** 100/100

## 🎯 Cele projektu

Ten projekt miał na celu:
1. Naukę integracji z Stripe
2. Praktykę z Prisma ORM
3. Implementację pełnego flow e-commerce
4. Optymalizację wydajności

## 📸 Galeria

![Homepage](https://example.com/homepage.png)
![Product page](https://example.com/product.png)
![Checkout](https://example.com/checkout.png)
![Admin panel](https://example.com/admin.png)

## 🔗 Linki

- **Live:** https://myshop.vercel.app
- **GitHub:** https://github.com/user/ecommerce
- **API Docs:** https://myshop.vercel.app/api/docs
```

**Labels:** `project`, `nextjs`, `typescript`, `completed`

---

### Przykład 2: Artykuł/Changelog

**Issue #11**

**Tytuł:** [#10] Implementacja płatności Stripe

**Body:**
```markdown
---
title: "Implementacja płatności Stripe"
date: "2024-01-20T14:30:00Z"
image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3"
---

# Implementacja płatności Stripe

W tej iteracji zintegrowałem Stripe jako główny system płatności.

## 🎯 Co zostało zrobione

### 1. Konfiguracja Stripe

```typescript
// lib/stripe.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});
```

### 2. Webhook endpoint

Utworzyłem endpoint do obsługi webhooków Stripe:

```typescript
// app/api/webhooks/stripe/route.ts
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response('Webhook error', { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Fulfill the order
      await fulfillOrder(session);
      break;
    case 'payment_intent.payment_failed':
      // Handle failed payment
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new Response(null, { status: 200 });
}
```

### 3. Checkout flow

Zaimplementowałem pełny flow płatności:

```typescript
// app/checkout/page.tsx
'use client';

import { loadStripe } from '@stripe/stripe-js';
import { useCart } from '@/hooks/useCart';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const { items } = useCart();

  const handleCheckout = async () => {
    const stripe = await stripePromise;
    
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });

    const { sessionId } = await response.json();
    
    await stripe?.redirectToCheckout({ sessionId });
  };

  return (
    <div>
      <h1>Checkout</h1>
      <button onClick={handleCheckout}>
        Pay now
      </button>
    </div>
  );
}
```

## 🧪 Testy

```typescript
import { stripe } from '@/lib/stripe';

describe('Stripe integration', () => {
  it('should create checkout session', async () => {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Test Product' },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });

    expect(session.id).toBeDefined();
  });
});
```

## 📊 Rezultaty

- ✅ Płatności działają poprawnie
- ✅ Webhooks obsługują wszystkie eventy
- ✅ Testowane z Stripe CLI
- ✅ Security best practices

## 🐛 Napotkane problemy

### Problem 1: CORS na webhooks
**Rozwiązanie:** Dodanie właściwych headers w route handler

### Problem 2: Webhook signature verification
**Rozwiązanie:** Użycie raw body zamiast JSON

## 📝 Notatki

> Pamiętaj o ustawieniu webhooks w Stripe Dashboard!

Endpoint: `https://yourapp.com/api/webhooks/stripe`

Events to listen:
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

## 🔜 Następne kroki

- [ ] Dodać obsługę subskrypcji
- [ ] Implementować refundy
- [ ] Dodać więcej metod płatności
- [ ] Zoptymalizować loading states

## 🔗 Dokumentacja

- [Stripe Docs](https://stripe.com/docs)
- [Next.js Integration](https://stripe.com/docs/stripe-js/react)
- [Webhooks Guide](https://stripe.com/docs/webhooks)

---

**Czas pracy:** 6 godzin  
**Commit:** [abc123](https://github.com/user/repo/commit/abc123)
```

**Labels:** `changelog`, `stripe`, `payment`, `backend`

---

## 🔄 Integracja API - Jak to działa

### Architektura systemu

```
GitHub Repository (Issues)
         ↓
   GitHub API v3/v4
         ↓
Next.js API Routes (/api/projects)
         ↓
  Data transformation
         ↓
   React Components
         ↓
      User Interface
```

### Flow danych

1. **Pobieranie projektów:**
   ```
   GET /api/projects
   ↓
   GitHub API: GET /repos/:owner/:repo/issues?label=project
   ↓
   Foreach project: GET /repos/:owner/:repo/issues/:number/sub_issues
   ↓
   Foreach project: GET /repos/:owner/:repo/issues/:number/comments
   ↓
   Transform & return JSON
   ```

2. **Dodawanie komentarza:**
   ```
   POST /api/projects/:id/comments
   ↓
   GitHub API: POST /repos/:owner/:repo/issues/:number/comments
   ↓
   Return created comment
   ```

### Kluczowe pliki

| Plik | Rola |
|------|------|
| `src/lib/github.ts` | Integracja z GitHub API |
| `src/app/api/projects/route.ts` | API endpoint dla projektów |
| `src/hooks/useGitHubData.ts` | React hook do pobierania danych |
| `src/lib/dataSource.ts` | Konfiguracja źródła danych |

---

## 🛠️ Przeniesienie do biblioteki npm

Chcesz udostępnić to rozwiązanie jako bibliotekę? Oto wskazówki!

### Struktura biblioteki

```
github-issues-cms/
├── src/
│   ├── index.ts              # Główny export
│   ├── client.ts             # GitHub API client
│   ├── types.ts              # TypeScript types
│   ├── parsers/
│   │   ├── frontmatter.ts    # Parser frontmatter
│   │   ├── markdown.ts       # Parser markdown
│   │   └── issues.ts         # Parser issues
│   ├── transformers/
│   │   ├── project.ts        # Issue → Project
│   │   ├── article.ts        # Issue → Article
│   │   └── comment.ts        # Comment → Comment
│   └── react/
│       ├── hooks.ts          # React hooks
│       └── components.tsx    # (opcjonalnie) komponenty
├── tests/
├── examples/
├── package.json
├── tsconfig.json
├── README.md
└── LICENSE
```

### Główny plik (index.ts)

```typescript
// src/index.ts
export { GitHubIssuesCMS } from './client';
export { useProjects, useComments } from './react/hooks';
export * from './types';

// Core client
export class GitHubIssuesCMS {
  constructor(config: Config) {
    // ...
  }

  async getProjects(): Promise<Project[]> {
    // ...
  }

  async getArticles(projectId: string): Promise<Article[]> {
    // ...
  }

  async getComments(issueId: string): Promise<Comment[]> {
    // ...
  }

  async addComment(issueId: string, body: string): Promise<Comment> {
    // ...
  }
}
```

### Typy (types.ts)

```typescript
// src/types.ts
export interface Config {
  owner: string;
  repo: string;
  token: string;
  cache?: CacheConfig;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnailImage?: string;
  mainImage?: string;
  technologies: string[];
  status: 'completed' | 'in-progress' | 'planned';
  githubUrl: string;
  liveUrl?: string;
  entries: Article[];
  comments: Comment[];
}

export interface Article {
  id: string;
  title: string;
  content: string;
  date: string;
  image?: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  likes?: number;
  githubUrl: string;
}
```

### React hooks (react/hooks.ts)

```typescript
// src/react/hooks.ts
import { useState, useEffect } from 'react';
import { GitHubIssuesCMS } from '../client';
import type { Project, Comment } from '../types';

export function useProjects(cms: GitHubIssuesCMS) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    cms.getProjects()
      .then(setProjects)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [cms]);

  return { projects, loading, error };
}

export function useComments(cms: GitHubIssuesCMS, issueId: string) {
  // Similar implementation
}
```

### Przykład użycia biblioteki

```typescript
// app/page.tsx
import { GitHubIssuesCMS } from 'github-issues-cms';
import { useProjects } from 'github-issues-cms/react';

const cms = new GitHubIssuesCMS({
  owner: 'lukaszbernatowicz',
  repo: 'openfolio',
  token: process.env.GITHUB_TOKEN!,
});

export default function HomePage() {
  const { projects, loading, error } = useProjects(cms);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

### package.json dla biblioteki

```json
{
  "name": "github-issues-cms",
  "version": "1.0.0",
  "description": "Use GitHub Issues as a CMS for your projects",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "lint": "eslint src",
    "prepublishOnly": "npm run build"
  },
  "keywords": [
    "github",
    "issues",
    "cms",
    "content-management",
    "markdown",
    "blog",
    "portfolio"
  ],
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./react": {
      "import": "./dist/react/hooks.js",
      "require": "./dist/react/hooks.cjs",
      "types": "./dist/react/hooks.d.ts"
    }
  },
  "peerDependencies": {
    "react": "^18.0.0"
  },
  "dependencies": {
    "@octokit/rest": "^20.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "typescript": "^5.0.0",
    "jest": "^29.0.0"
  }
}
```

### Funkcje do dodania w bibliotece

#### 1. Cache system
```typescript
interface CacheConfig {
  ttl: number; // Time to live w sekundach
  storage: 'memory' | 'localStorage' | 'redis';
}
```

#### 2. Rate limiting
```typescript
interface RateLimitConfig {
  maxRequests: number;
  perSeconds: number;
}
```

#### 3. Webhooks support
```typescript
async function setupWebhook(url: string, events: string[]) {
  // Automatyczna konfiguracja webhooków
}
```

#### 4. Batch operations
```typescript
async function batchGetProjects(projectIds: string[]): Promise<Project[]> {
  // Optymalizacja dla wielu projektów
}
```

#### 5. Search & filtering
```typescript
async function searchProjects(query: string): Promise<Project[]> {
  // GitHub search API
}
```

#### 6. GraphQL support
```typescript
// Opcja użycia GitHub GraphQL API zamiast REST
interface Config {
  apiVersion: 'rest' | 'graphql';
}
```

### README dla biblioteki

Utwórz pełną dokumentację:
- Installation
- Quick Start
- API Reference
- Examples
- Configuration
- Best Practices
- Troubleshooting
- Contributing
- License

### Publikacja do npm

```bash
# 1. Login do npm
npm login

# 2. Publish
npm publish

# 3. (Opcjonalnie) Dodaj do GitHub Packages
npm publish --registry=https://npm.pkg.github.com
```

### Marketing biblioteki

1. **GitHub:**
   - README z badges (npm version, downloads, license)
   - Przykłady użycia
   - Live demo
   - Contributing guide

2. **npm:**
   - Dobry opis
   - Keywords
   - Links do repo i demo

3. **Social media:**
   - Twitter/X post
   - Reddit (r/reactjs, r/nextjs)
   - Dev.to article
   - YouTube tutorial

4. **Documentation site:**
   - Docusaurus lub VitePress
   - API docs
   - Interactive examples
   - Migration guides

---

## 🔧 Troubleshooting

### Problem: Nie widzę projektów z GitHub

**Przyczyny:**
1. Brak tokenu lub błędny token
2. Brak etykiety `project` na Issues
3. Token nie ma odpowiednich uprawnień

**Rozwiązanie:**
```bash
# 1. Sprawdź .env.local
cat .env.local

# 2. Sprawdź czy token jest poprawny
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user

# 3. Sprawdź issues w repo
curl -H "Authorization: token YOUR_TOKEN" \
  https://api.github.com/repos/OWNER/REPO/issues?labels=project

# 4. Restart serwera
bun run dev
```

### Problem: Rate limiting (429 Too Many Requests)

GitHub API ma limity:
- **Bez auth:** 60 requests/hour
- **Z auth:** 5000 requests/hour

**Rozwiązanie:**
1. Dodaj caching
2. Użyj GraphQL API (więcej danych w jednym request)
3. Zaimplementuj local storage cache
4. Zwiększ TTL cache

### Problem: Sub-issues nie są widoczne

GitHub API dla sub-issues jest jeszcze w beta.

**Alternatywne rozwiązanie:**
1. Użyj Task Lists w opisie projektu
2. Parsuj issue body szukając `- [ ] #123`
3. Pobierz te issues osobno
4. Albo użyj etykiet: `project-1-article`

### Problem: Komentarze nie zapisują się

**Sprawdź:**
1. Czy token ma uprawnienia `repo` lub `public_repo`
2. Czy endpoint API działa
3. Czy nie ma błędów CORS

**Debug:**
```typescript
// src/lib/github.ts
console.log('Creating comment:', { issueNumber, body });
const response = await fetch(...);
console.log('Response:', response.status, await response.text());
```

### Problem: Markdown nie renderuje się poprawnie

**Sprawdź:**
1. Czy używasz `react-markdown`
2. Czy zainstalowałeś `remark-gfm` dla GitHub Flavored Markdown
3. Czy style CSS są załadowane

```typescript
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

<ReactMarkdown remarkPlugins={[remarkGfm]}>
  {content}
</ReactMarkdown>
```

---

## 📚 Dodatkowe zasoby

### Dokumentacja

- [GitHub REST API](https://docs.github.com/en/rest)
- [GitHub GraphQL API](https://docs.github.com/en/graphql)
- [GitHub Issues](https://docs.github.com/en/issues)
- [Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

### Narzędzia

- [Octokit](https://github.com/octokit/octokit.js) - GitHub API client
- [react-markdown](https://github.com/remarkjs/react-markdown) - Markdown renderer
- [remark-gfm](https://github.com/remarkjs/remark-gfm) - GitHub Flavored Markdown

### Inspiracje

- [utterances](https://utteranc.es/) - Comments widget using GitHub Issues
- [gitalk](https://gitalk.github.io/) - Comment component using GitHub Issues
- [GitHub Pages](https://pages.github.com/) - Free hosting

---

## 📝 Checklist implementacji

### Podstawowa konfiguracja
- [ ] Utworzenie Personal Access Token
- [ ] Konfiguracja .env.local
- [ ] Restart serwera developerskiego
- [ ] Test połączenia z API

### Tworzenie contentu
- [ ] Utworzenie pierwszego projektu (issue z label "project")
- [ ] Dodanie frontmatter z metadanymi
- [ ] Dodanie obrazków (thumbnailImage, mainImage)
- [ ] Utworzenie artykułów (sub-issues lub osobne issues)
- [ ] Dodanie komentarzy testowych

### Testowanie
- [ ] Sprawdzenie czy projekty się ładują
- [ ] Test spisu treści w artykułach
- [ ] Test systemu komentarzy
- [ ] Test responsywności
- [ ] Test markdown rendering

### Optymalizacja
- [ ] Dodanie cache dla API
- [ ] Optimistic UI updates
- [ ] Loading states
- [ ] Error handling
- [ ] Rate limiting

### Deploy
- [ ] Konfiguracja zmiennych środowiskowych na Vercel
- [ ] Test produkcyjny
- [ ] Monitoring błędów
- [ ] Backup danych

---

## 🎉 Podsumowanie

GitHub Issues jako CMS to świetne rozwiązanie dla:
- ✅ Portfolio deweloperów
- ✅ Blogów technicznych
- ✅ Dokumentacji projektów
- ✅ Prostych CMS-ów

**Zalety:**
- Darmowe
- Wbudowane wersjonowanie
- Markdown support
- API gotowe do użycia
- Współpraca wielu osób

**Wady:**
- Rate limiting
- Brak zaawansowanych funkcji CMS
- Zależność od GitHub
- Konieczność tokenu API

---

**Masz pytania? Otwórz Issue!** 🚀

---

*Ostatnia aktualizacja: 2024-01-21*  
*Wersja: 1.0.0*

