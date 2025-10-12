import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // Dostępne języki
  locales: ['pl', 'en'],
  
  // Domyślny język
  defaultLocale: 'pl',
  
  // Strategia wykrywania języka
  localeDetection: true
});

// Wyeksportuj komponenty nawigacji z i18n
export const { Link, redirect, usePathname, useRouter } = 
  createNavigation(routing);

