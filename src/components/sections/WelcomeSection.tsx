"use client";

import { Github, Linkedin } from "lucide-react";
import Image from "next/image";
import { useTranslations } from 'next-intl';

export default function WelcomeSection() {
  const t = useTranslations('home');
  
  const handleLinkedInClick = () => {
    window.open('https://www.linkedin.com/in/%C5%82ukasz-bernatowicz/', '_blank');
  };

  const handleGitHubClick = () => {
    window.open('https://github.com/LBernatowicz', '_blank');
  };
  
  return (
    <div>
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-4xl lg:text-5xl font-bold mb-3 text-white">
              {t('welcome')}
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-4 break-words">
              {t('intro')}
            </p>
            <div className="flex gap-4">
              <button 
                onClick={handleLinkedInClick}
                className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors cursor-pointer"
              >
                <Linkedin className="w-6 h-6" />
              </button>
              <button 
                onClick={handleGitHubClick}
                className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors cursor-pointer"
              >
                <Github className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="w-40 h-40 lg:w-48 lg:h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center overflow-hidden">
            <Image
              src="/bitmoji.png"
              alt="Łukasz Bernatowicz"
              width={192}
              height={192}
              className="w-full h-full object-cover rounded-2xl"
              priority
            />
          </div>
        </div>
    </div>
  );
}
