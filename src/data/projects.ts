import { Project } from '../types/section';

export const mockProjects: Project[] = [
  {
    id: 'openfolio',
    title: 'OpenFolio',
    description: 'Nowoczesne portfolio programistyczne zbudowane w Next.js 14, TypeScript i Tailwind CSS. Zawiera interaktywne sekcje, animacje i responsywny design.',
    thumbnailImage: '/next.svg',
    mainImage: '/next.svg',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'React', 'Framer Motion'],
    status: 'in-progress',
    githubUrl: 'https://github.com/lukaszbernatowicz/openfolio',
    liveUrl: 'https://openfolio.vercel.app',
    comments: [
      {
        id: '1',
        author: 'Jan Kowalski',
        content: 'Świetny projekt! Bardzo podoba mi się design i animacje.',
        date: '2024-01-26T10:30:00Z',
        likes: 5,
        isLiked: false
      },
      {
        id: '2',
        author: 'Anna Nowak',
        content: 'Czy planujesz dodać więcej funkcjonalności?',
        date: '2024-01-26T14:15:00Z',
        likes: 2,
        isLiked: true
      },
      {
        id: '3',
        author: 'Piotr Wiśniewski',
        content: 'Tak, w planach jest system komentarzy i więcej interaktywnych elementów.',
        date: '2024-01-26T15:45:00Z',
        parentId: '2',
        likes: 1,
        isLiked: false
      }
    ],
    entries: [
      {
        id: '1',
        title: 'Inicjalizacja projektu',
        content: 'Konfiguracja Next.js 14, TypeScript, Tailwind CSS',
        date: '2024-01-15',
        image: '/next.svg',
        comments: [
          {
            id: '1',
            author: 'Marek Zieliński',
            content: 'Czy używasz App Router czy Pages Router?',
            date: '2024-01-16T09:20:00Z',
            likes: 0,
            isLiked: false
          }
        ]
      },
      {
        id: '2',
        title: 'Implementacja sekcji głównej',
        content: 'WelcomeSection z animacjami i responsywnym layoutem',
        date: '2024-01-20',
        image: '/bitmoji.png',
        comments: []
      },
      {
        id: '3',
        title: 'Dodanie systemu nawigacji',
        content: 'Responsywny Navbar z smooth scroll i active states',
        date: '2024-01-25',
        comments: []
      },
      {
        id: '4',
        title: 'Budowa nowoczesnej aplikacji e-commerce z React i Node.js',
        content: `## Wprowadzenie

W tym artykule pokażę, jak zbudować kompletną platformę e-commerce używając React, Node.js i MongoDB. Projekt obejmuje system zarządzania produktami, koszyk zakupów i integrację z systemami płatności.

## Główne wyzwania

### 1. Architektura aplikacji
- **Frontend**: React z TypeScript
- **Backend**: Node.js z Express
- **Baza danych**: MongoDB z Mongoose
- **Autentykacja**: JWT tokens

### 2. Kluczowe funkcjonalności

- **Katalog produktów** z filtrowaniem i wyszukiwaniem
- **Koszyk zakupów** z persystencją danych
- **System płatności** z Stripe
- **Panel administracyjny** dla zarządzania

## Implementacja

### Frontend (React)

\`\`\`typescript
// Przykład komponentu produktu
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <span className="price">\${product.price}</span>
    </div>
  );
};
\`\`\`

### Backend (Node.js)

\`\`\`javascript
// Endpoint do pobierania produktów
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Błąd serwera' });
  }
});
\`\`\`

## Wyniki

- **Wydajność**: Ładowanie strony w < 2 sekundy
- **SEO**: 95+ punktów w Google PageSpeed
- **Konwersja**: 15% wzrost sprzedaży

## Wnioski

Projekt pokazał, że React i Node.js to doskonały stack do budowy aplikacji e-commerce. Kluczem do sukcesu była odpowiednia architektura i dbałość o wydajność.

## Linki

- [Demo aplikacji](https://ecommerce-demo.com)
- [Kod źródłowy](https://github.com/username/ecommerce-app)
- [Dokumentacja API](https://api-docs.ecommerce.com)`,
        date: '2024-01-30',
        image: '/next.svg',
        comments: [
          {
            id: '1',
            author: 'Anna Kowalska',
            content: 'Świetny artykuł! Czy planujesz dodać więcej przykładów kodu?',
            date: '2024-01-31T10:30:00Z',
            likes: 3,
            isLiked: false
          },
          {
            id: '2',
            author: 'Piotr Nowak',
            content: 'Bardzo pomocne! Dzięki za szczegółowe wyjaśnienia.',
            date: '2024-02-01T14:20:00Z',
            likes: 1,
            isLiked: true
          }
        ]
      }
    ]
  },
  {
    id: 'ecommerce-platform',
    title: 'Platforma E-commerce',
    description: 'Pełnofunkcjonalna platforma e-commerce z koszykiem, płatnościami i panelem administracyjnym. Zbudowana z wykorzystaniem MERN stack.',
    thumbnailImage: '/vercel.svg',
    mainImage: '/vercel.svg',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe', 'JWT'],
    status: 'completed',
    githubUrl: 'https://github.com/lukaszbernatowicz/ecommerce-platform',
    liveUrl: 'https://ecommerce-demo.vercel.app',
    comments: [
      {
        id: '1',
        author: 'Tomasz Krawczyk',
        content: 'Imponujący projekt! Jak długo zajęła Ci implementacja?',
        date: '2023-12-20T16:30:00Z',
        likes: 8,
        isLiked: false
      },
      {
        id: '2',
        author: 'Magdalena Szymańska',
        content: 'Czy planujesz dodać więcej metod płatności?',
        date: '2023-12-21T11:15:00Z',
        likes: 3,
        isLiked: true
      }
    ],
    entries: [
      {
        id: '1',
        title: 'Backend API',
        content: 'Stworzenie REST API z Express.js i MongoDB. Implementacja autoryzacji JWT, CRUD operacji dla produktów i użytkowników.',
        date: '2023-11-10',
        image: '/vercel.svg',
        comments: []
      },
      {
        id: '2',
        title: 'Frontend React',
        content: 'Budowa interfejsu użytkownika z React i Redux. Implementacja koszyka, wyszukiwania i filtrowania produktów.',
        date: '2023-11-25',
        comments: []
      },
      {
        id: '3',
        title: 'Integracja płatności',
        content: 'Dodanie integracji ze Stripe dla bezpiecznych płatności. Implementacja webhooków i obsługa błędów płatności.',
        date: '2023-12-05',
        comments: []
      },
      {
        id: '4',
        title: 'Panel administracyjny',
        content: 'Stworzenie panelu admina do zarządzania produktami, zamówieniami i użytkownikami. Dodanie dashboardu z statystykami.',
        date: '2023-12-15',
        comments: []
      }
    ]
  },
  {
    id: 'task-manager',
    title: 'Task Manager',
    description: 'Aplikacja do zarządzania zadaniami z funkcjami drag & drop, kategoryzacją i współpracą zespołową. Zbudowana z Vue.js i Firebase.',
    thumbnailImage: '/file.svg',
    mainImage: '/file.svg',
    technologies: ['Vue.js', 'Firebase', 'Vuex', 'Vuetify', 'PWA'],
    status: 'completed',
    githubUrl: 'https://github.com/lukaszbernatowicz/task-manager',
    liveUrl: 'https://taskmanager-demo.vercel.app',
    comments: [
      {
        id: '1',
        author: 'Krzysztof Nowak',
        content: 'Bardzo przydatna aplikacja! Używam jej w zespole.',
        date: '2023-10-05T14:20:00Z',
        likes: 12,
        isLiked: false
      }
    ],
    entries: [
      {
        id: '1',
        title: 'Podstawowa funkcjonalność',
        content: 'Implementacja CRUD operacji dla zadań. Dodanie kategoryzacji, priorytetów i dat deadline.',
        date: '2023-09-01',
        image: '/file.svg',
        comments: []
      },
      {
        id: '2',
        title: 'Drag & Drop',
        content: 'Dodanie funkcjonalności przeciągania zadań między kolumnami. Implementacja smooth animations i visual feedback.',
        date: '2023-09-15',
        comments: []
      },
      {
        id: '3',
        title: 'Współpraca zespołowa',
        content: 'Dodanie możliwości współdzielenia projektów i zadań między użytkownikami. Implementacja real-time updates.',
        date: '2023-09-30',
        comments: []
      }
    ]
  },
  {
    id: 'weather-app',
    title: 'Weather App',
    description: 'Aplikacja pogodowa z prognozą na 7 dni, mapami radarowymi i powiadomieniami. Zbudowana z React Native i OpenWeather API.',
    thumbnailImage: '/globe.svg',
    mainImage: '/globe.svg',
    technologies: ['React Native', 'Expo', 'OpenWeather API', 'AsyncStorage', 'Push Notifications'],
    status: 'in-progress',
    githubUrl: 'https://github.com/lukaszbernatowicz/weather-app',
    comments: [],
    entries: [
      {
        id: '1',
        title: 'Podstawowa funkcjonalność',
        content: 'Implementacja pobierania danych pogodowych z API. Dodanie wyświetlania aktualnej pogody i prognozy.',
        date: '2024-01-01',
        image: '/globe.svg',
        comments: []
      },
      {
        id: '2',
        title: 'Lokalizacja GPS',
        content: 'Dodanie automatycznego wykrywania lokalizacji użytkownika. Implementacja uprawnień i obsługa błędów.',
        date: '2024-01-10',
        comments: []
      },
      {
        id: '3',
        title: 'Mapy radarowe',
        content: 'Integracja z mapami radarowymi pogody. Dodanie interaktywnych map z animacjami opadów.',
        date: '2024-01-20',
        comments: []
      }
    ]
  },
  {
    id: 'blog-cms',
    title: 'Blog CMS',
    description: 'System zarządzania treścią dla bloga z edytorem WYSIWYG, SEO optimization i systemem komentarzy. Zbudowany z Next.js i Strapi.',
    thumbnailImage: '/window.svg',
    mainImage: '/window.svg',
    technologies: ['Next.js', 'Strapi', 'PostgreSQL', 'TinyMCE', 'SEO'],
    status: 'planned',
    githubUrl: 'https://github.com/lukaszbernatowicz/blog-cms',
    comments: [],
    entries: [
      {
        id: '1',
        title: 'Planowanie architektury',
        content: 'Projektowanie struktury bazy danych i API endpoints. Wybór technologii i narzędzi do implementacji.',
        date: '2024-02-01',
        comments: []
      }
    ]
  }
];
