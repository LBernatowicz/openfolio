# Architektura OpenFolio — Pod maską portfolio z GitHub Issues

> Jak zbudować nowoczesne portfolio w Next.js 14, które wykorzystuje GitHub Issues jako CMS? Zanurz się w architekturę OpenFolio.

---

## 🏗️ Stack technologiczny

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  Next.js 14 (App Router) + TypeScript + Tailwind CSS        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER                               │
│  Next.js API Routes → GitHub REST API                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   DATA SOURCE (CMS)                          │
│              GitHub Issues + Sub-issues                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Struktura projektu

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Obsługa i18n
│   │   ├── projects/      # Strony projektów
│   │   └── page.tsx       # Strona główna
│   └── api/               # API Routes
│       └── projects/      # Endpoint projektów
│
├── components/            # Komponenty React
│   ├── sections/          # Sekcje strony głównej
│   │   └── PortfolioSection.tsx
│   └── ui/                # Komponenty UI
│       ├── CommentSection.tsx
│       └── MarkdownRenderer.tsx
│
├── hooks/                 # Custom React Hooks
│   └── useGitHubData.ts   # Hook do pobierania danych
│
├── lib/                   # Logika biznesowa
│   ├── github.ts          # Integracja z GitHub API
│   ├── dataSource.ts      # Konfiguracja źródła danych
│   └── auth.ts            # NextAuth.js konfiguracja
│
├── types/                 # TypeScript types
│   └── section.ts         # Definicje Project, Comment, etc.
│
└── messages/              # Tłumaczenia i18n
    ├── en.json
    └── pl.json
```

---

## 🔌 Integracja z GitHub API

### Główny plik integracji: `src/lib/github.ts`

```typescript
// Konfiguracja GitHub API
const GITHUB_OWNER = process.env.NEXT_PUBLIC_GITHUB_USERNAME;
const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Helper do wykonywania requestów
async function fetchGitHubAPI(endpoint: string) {
  const response = await fetch(`https://api.github.com${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });
  return response.json();
}
```

### Pobieranie projektów z sub-issues

```typescript
export async function fetchGitHubProjectsWithArticles() {
  // 1. Pobierz wszystkie Issues z label "project"
  const projectIssues = await fetchGitHubAPI(
    `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues?labels=project&state=all`
  );
  
  const articlesByProject = {};
  const commentsByProject = {};
  
  // 2. Dla każdego projektu pobierz sub-issues i komentarze
  for (const project of projectIssues) {
    // Sub-issues (artykuły)
    const subIssues = await fetchGitHubAPI(
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${project.number}/sub_issues`
    );
    articlesByProject[project.number] = subIssues;
    
    // Komentarze
    const comments = await fetchGitHubAPI(
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${project.number}/comments`
    );
    commentsByProject[project.number] = comments;
  }
  
  return { projects: projectIssues, articlesByProject, commentsByProject };
}
```

---

## 📝 Parsowanie Frontmatter

OpenFolio obsługuje YAML frontmatter w treści Issues:

```typescript
function parseFrontmatter(body: string) {
  // Szukaj bloku --- na początku i końcu frontmatter
  const yamlFrontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = body.match(yamlFrontmatterRegex);
  
  if (match) {
    const frontmatterText = match[1];
    const content = match[2];
    
    const frontmatter = {};
    // Parsowanie linii: klucz: wartość
    for (const line of frontmatterText.split('\n')) {
      const [key, ...valueParts] = line.split(':');
      frontmatter[key.trim()] = valueParts.join(':').trim();
    }
    
    return { frontmatter, content };
  }
  
  return { frontmatter: {}, content: body };
}
```

**Przykład Issue z frontmatter:**

```markdown
---
title: "OpenFolio - Nowoczesne Portfolio"
thumbnailImage: "https://example.com/thumb.jpg"
technologies: ["Next.js", "TypeScript", "Tailwind CSS"]
status: "in-progress"
liveUrl: "https://openfolio.vercel.app"
---

# OpenFolio

Nowoczesne portfolio programistyczne...
```

---

## 🎣 Custom Hook: useGitHubData

```typescript
// src/hooks/useGitHubData.ts
export function useGitHubProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        // Fallback do danych mockowych
        setProjects(getFallbackProjects());
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, loading, error };
}
```

---

## 🔐 Autentykacja GitHub OAuth

OpenFolio używa **NextAuth.js** do autentykacji:

```typescript
// src/lib/auth.ts
export const authOptions: AuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email repo"
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.githubUsername = profile?.login;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.githubUsername = token.githubUsername;
      return session;
    }
  }
};
```

### Flow dodawania komentarza

```
┌──────────────┐    ┌─────────────────┐    ┌──────────────────┐
│   Użytkownik │───▶│  Logowanie via  │───▶│  Access Token    │
│   klika      │    │  GitHub OAuth   │    │  zapisany w      │
│   "Komentuj" │    │                 │    │  session         │
└──────────────┘    └─────────────────┘    └──────────────────┘
                                                    │
                                                    ▼
┌──────────────┐    ┌─────────────────┐    ┌──────────────────┐
│   Komentarz  │◀───│  POST /api/     │◀───│  Użytkownik      │
│   w GitHub   │    │  projects/:id/  │    │  wpisuje         │
│   Issue      │    │  comments       │    │  komentarz       │
└──────────────┘    └─────────────────┘    └──────────────────┘
```

---

## 📊 API Route: /api/projects

```typescript
// src/app/api/projects/route.ts
export async function GET() {
  try {
    // Sprawdź czy mamy token do GitHub
    if (!isGitHubAvailableServerSide()) {
      return NextResponse.json(getFallbackProjects());
    }
    
    // Pobierz dane z GitHub
    const { projects, articlesByProject, commentsByProject } = 
      await fetchGitHubProjectsWithArticles();
    
    // Konwertuj Issues na format projektu
    const formattedProjects = projects.map(issue => {
      const project = convertGitHubIssueToProject(issue);
      
      // Dodaj artykuły (sub-issues)
      project.entries = articlesByProject[issue.number]
        ?.map(convertGitHubIssueToArticle) || [];
      
      // Dodaj komentarze
      project.comments = commentsByProject[issue.number]
        ?.map(convertGitHubCommentToComment) || [];
      
      return project;
    });
    
    return NextResponse.json(formattedProjects);
  } catch (error) {
    // Fallback do danych mockowych
    return NextResponse.json(getFallbackProjects());
  }
}
```

---

## 🎨 Komponenty UI

### PortfolioSection — karta projektu

```tsx
// src/components/sections/PortfolioSection.tsx
export default function PortfolioSection() {
  const { projects, loading, error } = useGitHubProjects();

  return (
    <SectionWrapper>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage />}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {projects.map((project) => (
          <ProjectCard 
            key={project.id}
            title={project.title}
            description={project.description}
            status={project.status}
            technologies={project.technologies}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}
```

### CommentSection — system komentarzy

```tsx
// src/components/ui/CommentSection.tsx
export default function CommentSection({ 
  comments, 
  onAddComment 
}: Props) {
  const { data: session } = useSession();
  const [newComment, setNewComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      // Pokaż modal logowania
      setShowLoginModal(true);
      return;
    }
    await onAddComment(newComment);
    setNewComment("");
  };

  return (
    <div>
      {/* Formularz komentarza */}
      <form onSubmit={handleSubmit}>
        <textarea 
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Napisz komentarz..."
        />
        <button type="submit">Wyślij</button>
      </form>
      
      {/* Lista komentarzy */}
      {comments.map(comment => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
```

---

## 🐳 Docker & Deployment

### docker-compose.yml

```yaml
version: '3.8'
services:
  openfolio:
    build: .
    ports:
      - "3000:3000"
    environment:
      - GITHUB_TOKEN=${GITHUB_TOKEN}
      - GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID}
      - GITHUB_CLIENT_SECRET=${GITHUB_CLIENT_SECRET}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
```

### Zmienne środowiskowe

```bash
# .env.local
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
NEXT_PUBLIC_GITHUB_USERNAME=lukaszbernatowicz
NEXT_PUBLIC_GITHUB_REPO=openfolio
NEXT_PUBLIC_DATA_SOURCE=github

GITHUB_CLIENT_ID=Iv1.xxxxxxxxxxxx
GITHUB_CLIENT_SECRET=xxxxxxxxxxxxxx
NEXTAUTH_SECRET=your-super-secret-key
NEXTAUTH_URL=http://localhost:3000
```

---

## 📈 Przepływ danych

```
┌─────────────────────────────────────────────────────────────────┐
│                     GitHub Repository                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Issue #1     │  │ Issue #2     │  │ Issue #3     │          │
│  │ label:project│  │ sub-issue    │  │ sub-issue    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ GitHub REST API
┌─────────────────────────────────────────────────────────────────┐
│              Next.js API Routes (/api/projects)                  │
│  fetchGitHubProjectsWithArticles() → convertToProject()         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ JSON Response
┌─────────────────────────────────────────────────────────────────┐
│                   React Components                               │
│  useGitHubProjects() → PortfolioSection → ProjectCard           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        UI / Browser                              │
│           Karty projektów, artykuły, komentarze                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔑 Kluczowe pliki

| Plik | Odpowiedzialność |
|------|------------------|
| `src/lib/github.ts` | Integracja z GitHub API |
| `src/lib/dataSource.ts` | Przełączanie między GitHub a mock data |
| `src/hooks/useGitHubData.ts` | Custom hooks do pobierania danych |
| `src/app/api/projects/route.ts` | API endpoint dla projektów |
| `src/types/section.ts` | TypeScript interfaces |
| `src/components/ui/CommentSection.tsx` | System komentarzy |

---

## 🎯 Następny artykuł

W następnym artykule dowiesz się, jak **tworzyć treści** w GitHub Issues — system tagów, etykiet i oznaczeń, które OpenFolio rozpoznaje i wyświetla.

➡️ [System tagów i oznaczeń](./02-system-tagow-i-oznaczen.md)
