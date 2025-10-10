"use client";

import { User } from "lucide-react";
import SectionWrapper from "../ui/SectionWrapper";
import { useState } from "react";

export default function AboutSection() {
  const [activeCategory, setActiveCategory] = useState<'developer' | 'engineer'>('developer');

  const categories = {
    developer: {
      title: "Główne narzędzia dla programisty",
      tools: ['JavaScript', 'React', 'Astro', 'Python', 'PHP', 'MongoDB', 'SQL', 'Node.js', 'TypeScript', 'Next.js', 'Tailwind'],
      description: "Poza programowaniem, pasjonuję się muzyką, podróżowaniem i fotografią. Niezwykłym hobby jest dla mnie gra na gitarze i tworzenie muzyki elektronicznej."
    },
    engineer: {
      title: "Główne narzędzia dla inżyniera",
      tools: ['Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Git', 'AWS', 'Terraform', 'Jenkins', 'Nginx', 'PostgreSQL', 'Redis'],
      description: "Jako inżynier systemów, skupiam się na budowaniu skalowalnej infrastruktury i automatyzacji procesów. Pasjonuje mnie DevOps i architektura chmurowa."
    }
  };

  const currentCategory = categories[activeCategory];

  return (
    <SectionWrapper width={1} height={2}>
        <div className="flex items-center gap-2 mb-6">
          <User className="w-6 h-6 text-blue-500 flex-shrink-0" />
          <h2 className="text-xl font-bold text-white whitespace-nowrap">About me</h2>
        </div>
        <p className="text-gray-300 mb-6">
          Cześć, jestem Łukasz, fullstack developer z Polski 🇵🇱
        </p>
        
        <div className="mb-6">
          {/* Category Toggle */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setActiveCategory('developer')}
              onMouseEnter={() => setActiveCategory('developer')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                activeCategory === 'developer' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Programista
            </button>
            <button
              onClick={() => setActiveCategory('engineer')}
              onMouseEnter={() => setActiveCategory('engineer')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                activeCategory === 'engineer' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Inżynier
            </button>
          </div>

          <h3 className="text-sm font-semibold mb-3 text-white transition-all duration-300">
            {currentCategory.title}
          </h3>
          
          {/* Scrolling Tags Container */}
          <div className="relative overflow-hidden h-16 rounded-lg bg-gray-900/50 border border-gray-800">
            <div className="absolute inset-0 flex items-center">
              <div className="flex gap-2 animate-scroll-tags">
                {/* First set of tags */}
                {currentCategory.tools.map((tech) => (
                  <span 
                    key={`${activeCategory}-${tech}-1`}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all duration-300 ${
                      activeCategory === 'developer'
                        ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 hover:bg-blue-600/30 hover:border-blue-400'
                        : 'bg-purple-600/20 text-purple-300 border border-purple-500/40 hover:bg-purple-600/30 hover:border-purple-400'
                    }`}
                  >
                    {tech}
                  </span>
                ))}
                {/* Duplicate set for seamless loop */}
                {currentCategory.tools.map((tech) => (
                  <span 
                    key={`${activeCategory}-${tech}-2`}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all duration-300 ${
                      activeCategory === 'developer'
                        ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 hover:bg-blue-600/30 hover:border-blue-400'
                        : 'bg-purple-600/20 text-purple-300 border border-purple-500/40 hover:bg-purple-600/30 hover:border-purple-400'
                    }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Simple gradient overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-900/50 to-transparent pointer-events-none z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-900/50 to-transparent pointer-events-none z-10"></div>
          </div>
        </div>
        
        <p className="text-gray-300 text-sm break-words transition-all duration-500">
          {currentCategory.description}
        </p>
    </SectionWrapper>
  );
}
