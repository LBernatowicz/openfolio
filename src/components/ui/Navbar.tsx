"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Palette, Sun, Moon, Monitor, Globe } from "lucide-react";
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';

type Theme = "dark" | "light" | "system";

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  
  const [theme, setTheme] = useState<Theme>("dark");
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setIsThemeMenuOpen(false);
    
    if (newTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLanguageChange = (newLocale: string) => {
    setIsLanguageMenuOpen(false);
    router.replace(pathname, { locale: newLocale });
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Pokaż navbar gdy scrolluje w górę lub jest na samej górze
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } 
      // Ukryj navbar gdy scrolluje w dół i jest poniżej 100px
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="w-4 h-4" />;
      case "dark":
        return <Moon className="w-4 h-4" />;
      case "system":
        return <Monitor className="w-4 h-4" />;
    }
  };

  const getLanguageFlag = () => {
    switch (locale) {
      case "pl":
        return "🇵🇱";
      case "en":
        return "🇺🇸";
      default:
        return "🇵🇱";
    }
  };

  const getLanguageName = () => {
    return t(`language.${locale === 'pl' ? 'polish' : 'english'}`);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-slate-800 transition-transform duration-300 ease-in-out ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Przycisk powrotu */}
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors duration-200 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:translate-x-[-2px] transition-transform duration-200" />
            <span className="font-semibold text-lg">OpenFolio</span>
          </button>

          {/* Przełączniki */}
          <div className="flex items-center gap-3">
            {/* Przełącznik języka */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-all duration-200 group"
              >
                <Globe className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-white">{getLanguageName()}</span>
                <span className="text-lg">{getLanguageFlag()}</span>
              </button>

              {/* Language dropdown menu */}
              {isLanguageMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-slate-800 border border-slate-600 rounded-lg shadow-xl overflow-hidden">
                  <div className="py-1">
                    <button
                      onClick={() => handleLanguageChange("pl")}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-700 transition-colors duration-200 ${
                        locale === "pl" ? "text-cyan-400 bg-slate-700" : "text-white"
                      }`}
                    >
                      <span className="text-lg">🇵🇱</span>
                      <span>{t('language.polish')}</span>
                    </button>
                    <button
                      onClick={() => handleLanguageChange("en")}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-700 transition-colors duration-200 ${
                        locale === "en" ? "text-cyan-400 bg-slate-700" : "text-white"
                      }`}
                    >
                      <span className="text-lg">🇺🇸</span>
                      <span>{t('language.english')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
