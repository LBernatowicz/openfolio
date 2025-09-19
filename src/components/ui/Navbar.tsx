"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Palette, Sun, Moon, Monitor, Globe } from "lucide-react";

type Theme = "dark" | "light" | "system";
type Language = "pl" | "en";

export default function Navbar() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [language, setLanguage] = useState<Language>("pl");
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setIsThemeMenuOpen(false);
    
    // Tutaj można dodać logikę zmiany motywu
    if (newTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      // System theme - usuń wszystkie klasy i pozwól systemowi decydować
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setIsLanguageMenuOpen(false);
    // Tutaj można dodać logikę zmiany języka
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
    switch (language) {
      case "pl":
        return "🇵🇱";
      case "en":
        return "🇺🇸";
    }
  };

  const getLanguageName = () => {
    switch (language) {
      case "pl":
        return "Polski";
      case "en":
        return "English";
    }
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
                        language === "pl" ? "text-cyan-400 bg-slate-700" : "text-white"
                      }`}
                    >
                      <span className="text-lg">🇵🇱</span>
                      <span>Polski</span>
                    </button>
                    <button
                      onClick={() => handleLanguageChange("en")}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-700 transition-colors duration-200 ${
                        language === "en" ? "text-cyan-400 bg-slate-700" : "text-white"
                      }`}
                    >
                      <span className="text-lg">🇺🇸</span>
                      <span>English</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Przełącznik palety kolorów */}
            <div className="relative">
              <button
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-all duration-200 group"
              >
                <Palette className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-white">Paleta</span>
                {getThemeIcon()}
              </button>

              {/* Theme dropdown menu */}
              {isThemeMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-600 rounded-lg shadow-xl overflow-hidden">
                  <div className="py-1">
                    <button
                      onClick={() => handleThemeChange("dark")}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-700 transition-colors duration-200 ${
                        theme === "dark" ? "text-blue-400 bg-slate-700" : "text-white"
                      }`}
                    >
                      <Moon className="w-4 h-4" />
                      <span>Ciemny</span>
                    </button>
                    <button
                      onClick={() => handleThemeChange("light")}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-700 transition-colors duration-200 ${
                        theme === "light" ? "text-blue-400 bg-slate-700" : "text-white"
                      }`}
                    >
                      <Sun className="w-4 h-4" />
                      <span>Jasny</span>
                    </button>
                    <button
                      onClick={() => handleThemeChange("system")}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-700 transition-colors duration-200 ${
                        theme === "system" ? "text-blue-400 bg-slate-700" : "text-white"
                      }`}
                    >
                      <Monitor className="w-4 h-4" />
                      <span>System</span>
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
