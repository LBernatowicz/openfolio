"use client";

import { User } from "lucide-react";
import SectionWrapper from "../ui/SectionWrapper";
import { useState } from "react";
import { useTranslations } from 'next-intl';

export default function AboutSection() {
  const t = useTranslations('about');
  const [activeCategory, setActiveCategory] = useState<'developer' | 'engineer'>('developer');

  const categories = {
    developer: {
      title: t('developerTools'),
      tools: [ 'React', 'React Native', 'LLM', 'Docker', 'MongoDB', 'SQL', 'Node.js', 'TypeScript', 'Next.js', 'Tailwind', 'ROS2', 'YOLOv8'],
      description: t('developerDescription')
    },
    engineer: {
      title: t('engineerTools'),
      tools: ['Inventor', 'SolidWorks', 'Nastram', 'CAM', 'CAD', 'PCB', 'MES', 'ROBOTICS', 'ROS2', 'YOLOv8'],
      description: t('engineerDescription')
    }
  };

  const currentCategory = categories[activeCategory];

  return (
    <SectionWrapper width={1} height={2}>
        <div className="flex items-center gap-2 mb-6">
          <User className="w-6 h-6 text-blue-500 flex-shrink-0" />
          <h2 className="text-xl font-bold text-white whitespace-nowrap">{t('title')}</h2>
        </div>
        <p className="text-gray-300 mb-6">
          {t('greeting')}
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
              {t('developer')}
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
              {t('engineer')}
            </button>
          </div>

          <h3 className="text-sm font-semibold mb-3 text-white transition-all duration-300">
            {currentCategory.title}
          </h3>
          
          {/* Static Tags Container */}
          <div className="flex flex-wrap gap-2">
            {currentCategory.tools.map((tech) => (
              <span 
                key={`${activeCategory}-${tech}`}
                className="px-3 py-1.5 rounded-md text-xs font-medium bg-gray-800/60 text-gray-400 border border-gray-700/50 hover:bg-gray-700/60 hover:text-gray-300 hover:border-gray-600/50 transition-all duration-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
        
        <p className="text-gray-300 text-sm break-words transition-all duration-500">
          {currentCategory.description}
        </p>
    </SectionWrapper>
  );
}
