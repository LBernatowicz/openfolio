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
    entries: [
      {
        id: '1',
        title: 'Inicjalizacja projektu',
        content: 'Konfiguracja Next.js 14, TypeScript, Tailwind CSS',
        date: '2024-01-15',
        image: '/next.svg'
      },
      {
        id: '2',
        title: 'Implementacja sekcji głównej',
        content: 'WelcomeSection z animacjami i responsywnym layoutem',
        date: '2024-01-20',
        image: '/bitmoji.png'
      },
      {
        id: '3',
        title: 'Dodanie systemu nawigacji',
        content: 'Responsywny Navbar z smooth scroll i active states',
        date: '2024-01-25'
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
    entries: [
      {
        id: '1',
        title: 'Backend API',
        content: 'Stworzenie REST API z Express.js i MongoDB. Implementacja autoryzacji JWT, CRUD operacji dla produktów i użytkowników.',
        date: '2023-11-10',
        image: '/vercel.svg'
      },
      {
        id: '2',
        title: 'Frontend React',
        content: 'Budowa interfejsu użytkownika z React i Redux. Implementacja koszyka, wyszukiwania i filtrowania produktów.',
        date: '2023-11-25'
      },
      {
        id: '3',
        title: 'Integracja płatności',
        content: 'Dodanie integracji ze Stripe dla bezpiecznych płatności. Implementacja webhooków i obsługa błędów płatności.',
        date: '2023-12-05'
      },
      {
        id: '4',
        title: 'Panel administracyjny',
        content: 'Stworzenie panelu admina do zarządzania produktami, zamówieniami i użytkownikami. Dodanie dashboardu z statystykami.',
        date: '2023-12-15'
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
    entries: [
      {
        id: '1',
        title: 'Podstawowa funkcjonalność',
        content: 'Implementacja CRUD operacji dla zadań. Dodanie kategoryzacji, priorytetów i dat deadline.',
        date: '2023-09-01',
        image: '/file.svg'
      },
      {
        id: '2',
        title: 'Drag & Drop',
        content: 'Dodanie funkcjonalności przeciągania zadań między kolumnami. Implementacja smooth animations i visual feedback.',
        date: '2023-09-15'
      },
      {
        id: '3',
        title: 'Współpraca zespołowa',
        content: 'Dodanie możliwości współdzielenia projektów i zadań między użytkownikami. Implementacja real-time updates.',
        date: '2023-09-30'
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
    entries: [
      {
        id: '1',
        title: 'Podstawowa funkcjonalność',
        content: 'Implementacja pobierania danych pogodowych z API. Dodanie wyświetlania aktualnej pogody i prognozy.',
        date: '2024-01-01',
        image: '/globe.svg'
      },
      {
        id: '2',
        title: 'Lokalizacja GPS',
        content: 'Dodanie automatycznego wykrywania lokalizacji użytkownika. Implementacja uprawnień i obsługa błędów.',
        date: '2024-01-10'
      },
      {
        id: '3',
        title: 'Mapy radarowe',
        content: 'Integracja z mapami radarowymi pogody. Dodanie interaktywnych map z animacjami opadów.',
        date: '2024-01-20'
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
    entries: [
      {
        id: '1',
        title: 'Planowanie architektury',
        content: 'Projektowanie struktury bazy danych i API endpoints. Wybór technologii i narzędzi do implementacji.',
        date: '2024-02-01'
      }
    ]
  }
];
