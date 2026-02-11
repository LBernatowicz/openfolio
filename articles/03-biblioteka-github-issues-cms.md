# Budowa biblioteki npm — GitHub Issues jako CMS dla każdego

> Ostatni krok: wyciągamy logikę z OpenFolio i tworzymy uniwersalną bibliotekę npm, którą każdy może użyć w swoim projekcie.

---

## 🎯 Cel: Od projektu do biblioteki

OpenFolio działa świetnie, ale cała logika integracji z GitHub jest "zahardkodowana". Czas to zmienić:

```
┌─────────────────────────────────────────────────────────────┐
│                    OpenFolio (teraz)                         │
│  src/lib/github.ts → tylko dla tego projektu                │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                github-issues-cms (biblioteka)                │
│  npm install github-issues-cms                              │
│  → uniwersalna, dla każdego projektu                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Struktura biblioteki

```
github-issues-cms/
├── src/
│   ├── index.ts              # Główny export
│   ├── client.ts             # GitHubIssuesCMS class
│   ├── types.ts              # TypeScript interfaces
│   │
│   ├── parsers/
│   │   ├── frontmatter.ts    # Parser YAML frontmatter
│   │   └── markdown.ts       # Pomocniki do Markdown
│   │
│   ├── transformers/
│   │   ├── project.ts        # Issue → Project
│   │   ├── article.ts        # Issue → Article
│   │   └── comment.ts        # Comment → Comment
│   │
│   └── react/
│       ├── hooks.ts          # useProjects, useComments
│       ├── provider.tsx      # GitHubCMSProvider
│       └── index.ts          # React exports
│
├── tests/
│   ├── client.test.ts
│   ├── parsers.test.ts
│   └── transformers.test.ts
│
├── examples/
│   ├── nextjs/               # Przykład z Next.js
│   ├── remix/                # Przykład z Remix
│   └── astro/                # Przykład z Astro
│
├── package.json
├── tsconfig.json
├── README.md
└── LICENSE
```

---

## 🔧 Główny klient: `client.ts`

```typescript
// src/client.ts
import { GitHubConfig, Project, Article, Comment } from './types';
import { parseFrontmatter } from './parsers/frontmatter';
import { transformIssueToProject } from './transformers/project';
import { transformIssueToArticle } from './transformers/article';
import { transformComment } from './transformers/comment';

export class GitHubIssuesCMS {
  private config: GitHubConfig;
  private baseUrl = 'https://api.github.com';

  constructor(config: GitHubConfig) {
    this.config = config;
    
    if (!config.token) {
      console.warn('GitHubIssuesCMS: No token provided. API calls may fail.');
    }
  }

  /**
   * Wykonaj request do GitHub API
   */
  private async fetch<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.config.token}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'github-issues-cms'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Pobierz wszystkie projekty (Issues z label "project")
   */
  async getProjects(): Promise<Project[]> {
    const { owner, repo, projectLabel = 'project' } = this.config;
    
    const issues = await this.fetch<GitHubIssue[]>(
      `/repos/${owner}/${repo}/issues?labels=${projectLabel}&state=all&per_page=100`
    );

    const projects: Project[] = [];

    for (const issue of issues) {
      const project = transformIssueToProject(issue);
      
      // Pobierz sub-issues (artykuły)
      const subIssues = await this.getSubIssues(issue.number);
      project.articles = subIssues.map(transformIssueToArticle);
      
      // Pobierz komentarze
      project.comments = await this.getComments(issue.number);
      
      projects.push(project);
    }

    return projects;
  }

  /**
   * Pobierz pojedynczy projekt po ID (issue number)
   */
  async getProject(id: string | number): Promise<Project | null> {
    const { owner, repo } = this.config;
    
    try {
      const issue = await this.fetch<GitHubIssue>(
        `/repos/${owner}/${repo}/issues/${id}`
      );
      
      const project = transformIssueToProject(issue);
      
      // Pobierz sub-issues i komentarze
      const subIssues = await this.getSubIssues(issue.number);
      project.articles = subIssues.map(transformIssueToArticle);
      project.comments = await this.getComments(issue.number);
      
      return project;
    } catch {
      return null;
    }
  }

  /**
   * Pobierz sub-issues dla danego Issue
   */
  private async getSubIssues(issueNumber: number): Promise<GitHubIssue[]> {
    const { owner, repo } = this.config;
    
    try {
      return await this.fetch<GitHubIssue[]>(
        `/repos/${owner}/${repo}/issues/${issueNumber}/sub_issues`
      );
    } catch {
      return [];
    }
  }

  /**
   * Pobierz komentarze dla danego Issue
   */
  async getComments(issueNumber: number): Promise<Comment[]> {
    const { owner, repo } = this.config;
    
    const comments = await this.fetch<GitHubComment[]>(
      `/repos/${owner}/${repo}/issues/${issueNumber}/comments`
    );
    
    return comments.map(transformComment);
  }

  /**
   * Dodaj komentarz do Issue (wymaga tokenu z uprawnieniami)
   */
  async addComment(issueNumber: number, body: string): Promise<Comment> {
    const { owner, repo } = this.config;
    
    const response = await fetch(
      `${this.baseUrl}/repos/${owner}/${repo}/issues/${issueNumber}/comments`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.token}`,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ body })
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to add comment: ${response.status}`);
    }

    const comment = await response.json();
    return transformComment(comment);
  }
}
```

---

## 📝 Typy TypeScript: `types.ts`

```typescript
// src/types.ts

/**
 * Konfiguracja klienta
 */
export interface GitHubConfig {
  /** Właściciel repozytorium (username lub organizacja) */
  owner: string;
  
  /** Nazwa repozytorium */
  repo: string;
  
  /** Personal Access Token lub OAuth token */
  token: string;
  
  /** Label oznaczający projekty (default: "project") */
  projectLabel?: string;
  
  /** Label oznaczający artykuły (default: "changelog") */
  articleLabel?: string;
  
  /** Opcjonalna konfiguracja cache */
  cache?: CacheConfig;
}

export interface CacheConfig {
  /** Czas życia cache w sekundach */
  ttl: number;
  
  /** Typ storage */
  storage: 'memory' | 'localStorage' | 'sessionStorage';
}

/**
 * Projekt (z GitHub Issue z label "project")
 */
export interface Project {
  /** ID projektu (numer Issue) */
  id: string;
  
  /** Tytuł projektu */
  title: string;
  
  /** Opis (treść Markdown) */
  description: string;
  
  /** Pełna treść body w Markdown */
  content: string;
  
  /** URL miniaturki */
  thumbnailImage?: string;
  
  /** URL głównego obrazka */
  mainImage?: string;
  
  /** Lista technologii */
  technologies: string[];
  
  /** Status projektu */
  status: 'completed' | 'in-progress' | 'planned';
  
  /** URL do repozytorium GitHub */
  githubUrl: string;
  
  /** URL do live demo */
  liveUrl?: string;
  
  /** Lista artykułów (sub-issues) */
  articles: Article[];
  
  /** Lista komentarzy */
  comments: Comment[];
  
  /** Data utworzenia */
  createdAt: string;
  
  /** Data ostatniej aktualizacji */
  updatedAt: string;
}

/**
 * Artykuł (sub-issue projektu)
 */
export interface Article {
  /** ID artykułu (numer Issue) */
  id: string;
  
  /** Tytuł artykułu */
  title: string;
  
  /** Pełna treść w Markdown */
  content: string;
  
  /** Data publikacji */
  date: string;
  
  /** Opcjonalny obrazek */
  image?: string;
  
  /** Wersja (do sortowania) */
  version?: string;
  
  /** Lista komentarzy */
  comments: Comment[];
}

/**
 * Komentarz
 */
export interface Comment {
  /** ID komentarza */
  id: string;
  
  /** Autor (GitHub username) */
  author: string;
  
  /** Avatar URL */
  avatarUrl: string;
  
  /** Treść komentarza */
  content: string;
  
  /** Data utworzenia */
  createdAt: string;
  
  /** URL do komentarza na GitHubie */
  githubUrl: string;
}

/**
 * Surowe dane z GitHub API
 */
export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  html_url: string;
  user: {
    login: string;
    avatar_url: string;
  };
  labels: Array<{
    name: string;
    color: string;
  }>;
}

export interface GitHubComment {
  id: number;
  body: string;
  created_at: string;
  html_url: string;
  user: {
    login: string;
    avatar_url: string;
  };
}
```

---

## 🔄 Transformery: `transformers/`

### project.ts

```typescript
// src/transformers/project.ts
import { GitHubIssue, Project } from '../types';
import { parseFrontmatter } from '../parsers/frontmatter';

export function transformIssueToProject(issue: GitHubIssue): Project {
  const { frontmatter, content } = parseFrontmatter(issue.body || '');
  
  // Wyciągnij technologie z frontmatter lub labels
  const technologies = (frontmatter.technologies as string[]) || 
    issue.labels
      .map(l => l.name)
      .filter(name => !['project', 'changelog'].includes(name));
  
  // Określ status
  const status = (frontmatter.status as string) || 
    (issue.state === 'closed' ? 'completed' : 'in-progress');
  
  return {
    id: issue.number.toString(),
    title: (frontmatter.title as string) || issue.title,
    description: extractDescription(content),
    content,
    thumbnailImage: frontmatter.thumbnailImage as string,
    mainImage: frontmatter.mainImage as string,
    technologies,
    status: status as Project['status'],
    githubUrl: issue.html_url,
    liveUrl: frontmatter.liveUrl as string,
    articles: [],
    comments: [],
    createdAt: issue.created_at,
    updatedAt: issue.updated_at
  };
}

function extractDescription(content: string): string {
  if (!content) return '';
  
  // Usuń nagłówki Markdown
  let cleaned = content.replace(/^#{1,6}\s+.*/gm, '');
  
  // Usuń linki, zachowaj tekst
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // Usuń bloki kodu
  cleaned = cleaned.replace(/```[\s\S]*?```/g, '');
  
  // Weź pierwszy paragraf, max 200 znaków
  const firstParagraph = cleaned.split('\n\n')[0]?.trim() || '';
  
  return firstParagraph.length > 200 
    ? firstParagraph.slice(0, 200) + '...' 
    : firstParagraph;
}
```

### article.ts

```typescript
// src/transformers/article.ts
import { GitHubIssue, Article } from '../types';
import { parseFrontmatter } from '../parsers/frontmatter';

export function transformIssueToArticle(issue: GitHubIssue): Article {
  const { frontmatter, content } = parseFrontmatter(issue.body || '');
  
  return {
    id: issue.number.toString(),
    title: (frontmatter.title as string) || issue.title,
    content,
    date: (frontmatter.date as string) || issue.created_at,
    image: frontmatter.image as string,
    version: frontmatter.version as string,
    comments: []
  };
}
```

### comment.ts

```typescript
// src/transformers/comment.ts
import { GitHubComment, Comment } from '../types';

export function transformComment(comment: GitHubComment): Comment {
  return {
    id: comment.id.toString(),
    author: comment.user.login,
    avatarUrl: comment.user.avatar_url,
    content: comment.body,
    createdAt: comment.created_at,
    githubUrl: comment.html_url
  };
}
```

---

## 📜 Parser frontmatter: `parsers/frontmatter.ts`

```typescript
// src/parsers/frontmatter.ts

export interface ParsedContent {
  frontmatter: Record<string, unknown>;
  content: string;
}

/**
 * Parsuje YAML frontmatter z treści Markdown
 * 
 * @example
 * ```markdown
 * ---
 * title: "Mój projekt"
 * technologies: ["React", "TypeScript"]
 * ---
 * 
 * # Treść projektu
 * ```
 */
export function parseFrontmatter(body: string): ParsedContent {
  if (!body) {
    return { frontmatter: {}, content: '' };
  }

  // Regex dla bloku frontmatter: ---\n...\n---
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = body.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, content: body };
  }

  const [, frontmatterText, content] = match;
  const frontmatter: Record<string, unknown> = {};

  // Parsuj każdą linię frontmatter
  for (const line of frontmatterText.split('\n')) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value: unknown = line.slice(colonIndex + 1).trim();

    // Usuń cudzysłowy
    if (typeof value === 'string') {
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      // Parsuj tablice JSON
      if (value.startsWith('[') && value.endsWith(']')) {
        try {
          value = JSON.parse(value);
        } catch {
          // Zachowaj jako string jeśli JSON invalid
        }
      }
    }

    frontmatter[key] = value;
  }

  return { frontmatter, content };
}
```

---

## ⚛️ React Hooks: `react/hooks.ts`

```typescript
// src/react/hooks.ts
import { useState, useEffect, useCallback, useContext } from 'react';
import { GitHubIssuesCMS } from '../client';
import { Project, Comment } from '../types';
import { GitHubCMSContext } from './provider';

/**
 * Hook do pobierania wszystkich projektów
 */
export function useProjects() {
  const cms = useContext(GitHubCMSContext);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!cms) {
      setError(new Error('GitHubCMSProvider not found'));
      setLoading(false);
      return;
    }

    cms.getProjects()
      .then(setProjects)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [cms]);

  return { projects, loading, error };
}

/**
 * Hook do pobierania pojedynczego projektu
 */
export function useProject(id: string | number) {
  const cms = useContext(GitHubCMSContext);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!cms) {
      setError(new Error('GitHubCMSProvider not found'));
      setLoading(false);
      return;
    }

    cms.getProject(id)
      .then(setProject)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [cms, id]);

  return { project, loading, error };
}

/**
 * Hook do zarządzania komentarzami
 */
export function useComments(issueNumber: number) {
  const cms = useContext(GitHubCMSContext);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!cms) return;

    cms.getComments(issueNumber)
      .then(setComments)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [cms, issueNumber]);

  const addComment = useCallback(async (body: string) => {
    if (!cms) throw new Error('GitHubCMSProvider not found');

    const newComment = await cms.addComment(issueNumber, body);
    setComments(prev => [...prev, newComment]);
    return newComment;
  }, [cms, issueNumber]);

  return { comments, loading, error, addComment };
}
```

---

## 🌐 React Provider: `react/provider.tsx`

```typescript
// src/react/provider.tsx
import React, { createContext, useMemo } from 'react';
import { GitHubIssuesCMS } from '../client';
import { GitHubConfig } from '../types';

export const GitHubCMSContext = createContext<GitHubIssuesCMS | null>(null);

interface GitHubCMSProviderProps {
  config: GitHubConfig;
  children: React.ReactNode;
}

/**
 * Provider dla GitHub Issues CMS
 * 
 * @example
 * ```tsx
 * <GitHubCMSProvider config={{
 *   owner: 'username',
 *   repo: 'my-portfolio',
 *   token: process.env.GITHUB_TOKEN
 * }}>
 *   <App />
 * </GitHubCMSProvider>
 * ```
 */
export function GitHubCMSProvider({ config, children }: GitHubCMSProviderProps) {
  const cms = useMemo(() => new GitHubIssuesCMS(config), [
    config.owner,
    config.repo,
    config.token
  ]);

  return (
    <GitHubCMSContext.Provider value={cms}>
      {children}
    </GitHubCMSContext.Provider>
  );
}
```

---

## 📦 Główny export: `index.ts`

```typescript
// src/index.ts

// Core client
export { GitHubIssuesCMS } from './client';

// Types
export type {
  GitHubConfig,
  CacheConfig,
  Project,
  Article,
  Comment,
  GitHubIssue,
  GitHubComment
} from './types';

// Parsers
export { parseFrontmatter } from './parsers/frontmatter';

// Transformers
export { transformIssueToProject } from './transformers/project';
export { transformIssueToArticle } from './transformers/article';
export { transformComment } from './transformers/comment';
```

```typescript
// src/react/index.ts

export { GitHubCMSProvider, GitHubCMSContext } from './provider';
export { useProjects, useProject, useComments } from './hooks';
```

---

## 📋 package.json

```json
{
  "name": "github-issues-cms",
  "version": "1.0.0",
  "description": "Use GitHub Issues as a headless CMS for your portfolio, blog, or documentation",
  "author": "Lukasz Bernatowicz",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/lukaszbernatowicz/github-issues-cms"
  },
  "keywords": [
    "github",
    "issues",
    "cms",
    "headless-cms",
    "portfolio",
    "blog",
    "markdown",
    "react",
    "nextjs"
  ],
  
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./react": {
      "import": "./dist/react/index.mjs",
      "require": "./dist/react/index.js",
      "types": "./dist/react/index.d.ts"
    }
  },
  
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  
  "scripts": {
    "build": "tsup src/index.ts src/react/index.ts --format cjs,esm --dts",
    "dev": "tsup src/index.ts src/react/index.ts --format cjs,esm --dts --watch",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src",
    "typecheck": "tsc --noEmit",
    "prepublishOnly": "npm run build"
  },
  
  "peerDependencies": {
    "react": ">=18.0.0"
  },
  
  "peerDependenciesMeta": {
    "react": {
      "optional": true
    }
  },
  
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "eslint": "^8.0.0",
    "tsup": "^8.0.0",
    "typescript": "^5.0.0",
    "vitest": "^1.0.0"
  }
}
```

---

## 🚀 Przykład użycia

### Next.js App Router

```tsx
// app/providers.tsx
'use client';

import { GitHubCMSProvider } from 'github-issues-cms/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GitHubCMSProvider config={{
      owner: 'lukaszbernatowicz',
      repo: 'openfolio',
      token: process.env.NEXT_PUBLIC_GITHUB_TOKEN!
    }}>
      {children}
    </GitHubCMSProvider>
  );
}
```

```tsx
// app/projects/page.tsx
'use client';

import { useProjects } from 'github-issues-cms/react';

export default function ProjectsPage() {
  const { projects, loading, error } = useProjects();

  if (loading) return <div>Ładowanie...</div>;
  if (error) return <div>Błąd: {error.message}</div>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

### Server-side (bez React)

```typescript
// lib/cms.ts
import { GitHubIssuesCMS } from 'github-issues-cms';

const cms = new GitHubIssuesCMS({
  owner: 'lukaszbernatowicz',
  repo: 'openfolio',
  token: process.env.GITHUB_TOKEN!
});

// Pobierz wszystkie projekty
const projects = await cms.getProjects();

// Pobierz pojedynczy projekt
const project = await cms.getProject(1);

// Dodaj komentarz
await cms.addComment(1, 'Świetny projekt!');
```

---

## 📖 README.md biblioteki

```markdown
# github-issues-cms

> 🚀 Use GitHub Issues as a headless CMS for your portfolio, blog, or documentation.

## Features

- ✅ Zero database needed - GitHub is your CMS
- ✅ Full TypeScript support
- ✅ React hooks included
- ✅ YAML frontmatter parsing
- ✅ Sub-issues as articles
- ✅ Comments system out-of-the-box
- ✅ Works with any framework

## Installation

\`\`\`bash
npm install github-issues-cms
# or
yarn add github-issues-cms
# or
pnpm add github-issues-cms
\`\`\`

## Quick Start

### With React

\`\`\`tsx
import { GitHubCMSProvider, useProjects } from 'github-issues-cms/react';

// Wrap your app
<GitHubCMSProvider config={{
  owner: 'your-username',
  repo: 'your-repo',
  token: 'ghp_...'
}}>
  <App />
</GitHubCMSProvider>

// Use in components
function Projects() {
  const { projects, loading } = useProjects();
  // ...
}
\`\`\`

### Without React

\`\`\`typescript
import { GitHubIssuesCMS } from 'github-issues-cms';

const cms = new GitHubIssuesCMS({
  owner: 'your-username',
  repo: 'your-repo',
  token: 'ghp_...'
});

const projects = await cms.getProjects();
\`\`\`

## GitHub Issue Format

Create issues with the `project` label:

\`\`\`markdown
---
title: "My Project"
technologies: ["React", "TypeScript"]
status: "in-progress"
liveUrl: "https://example.com"
---

# My Project

Description in Markdown...
\`\`\`

## License

MIT
```

---

## 🎯 Publikacja do npm

```bash
# 1. Zaloguj się do npm
npm login

# 2. Zbuduj bibliotekę
npm run build

# 3. Opublikuj
npm publish

# 4. (Opcjonalnie) Opublikuj do GitHub Packages
npm publish --registry=https://npm.pkg.github.com
```

---

## 🔮 Plany na przyszłość

### v1.1.0 — Cache & Performance
- [ ] In-memory cache z TTL
- [ ] localStorage/sessionStorage cache
- [ ] Batch requests (GraphQL)

### v1.2.0 — Advanced Features
- [ ] Search & filtering
- [ ] Pagination
- [ ] Webhooks support
- [ ] Real-time updates

### v2.0.0 — GraphQL
- [ ] Migracja na GitHub GraphQL API
- [ ] Mniej requestów, więcej danych
- [ ] Subscriptions dla real-time

---

## 🎉 Podsumowanie serii

W tej serii artykułów przeszliśmy przez:

1. **[Lead](./00-lead-openfolio-github-issues-cms.md)** — koncepcja GitHub Issues jako CMS
2. **[Architektura](./01-architektura-openfolio.md)** — jak zbudowano OpenFolio
3. **[System tagów](./02-system-tagow-i-oznaczen.md)** — instrukcja tworzenia treści
4. **[Biblioteka npm](./03-biblioteka-github-issues-cms.md)** — uniwersalne rozwiązanie (ten artykuł)

**Efekt:** Od pomysłu "a może GitHub Issues?" do działającego portfolio i biblioteki npm, którą każdy może użyć.

---

*Masz pytania? Otwórz Issue w repozytorium!*

**GitHub:** [github.com/lukaszbernatowicz/github-issues-cms](https://github.com/lukaszbernatowicz/github-issues-cms)
