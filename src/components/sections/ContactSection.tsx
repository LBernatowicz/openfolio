"use client";

import { Mail, MapPin, Linkedin, Github, ExternalLink, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import SectionWrapper from "../ui/SectionWrapper";
import Image from "next/image";

export default function ContactSection() {
  const t = useTranslations('contact');
  
  const handleLinkedInClick = () => {
    window.open('https://www.linkedin.com/in/%C5%82ukasz-bernatowicz/', '_blank');
  };

  const handleGitHubClick = () => {
    window.open('https://github.com/LBernatowicz', '_blank');
  };
  
  return (
    <SectionWrapper width={3} height={1} hasExternalLink={true} style={{gridRow: '4'}} className="!p-0">
        <div className="flex items-stretch justify-between h-full p-4">
          {/* Lewa strona - Bitmoji2 */}
          <div className="flex-shrink-0">
            <div className="w-56 h-full lg:w-64 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center overflow-hidden">
              <Image
                src="/bitmoji2.png"
                alt="Łukasz Bernatowicz"
                width={240}
                height={240}
                className="w-full h-full object-cover rounded-2xl"
                priority
              />
            </div>
          </div>
          
          {/* Prawa strona - zawartość */}
          <div className="flex-1 pl-4 flex flex-col justify-start">
            <div className="flex items-center gap-2 mb-6">
              <MessageCircle className="w-6 h-6 text-blue-500 flex-shrink-0" />
              <h2 className="text-xl font-bold text-white whitespace-nowrap">{t('title')}</h2>
            </div>
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="text-gray-300">lukasz@bernatowicz.com.pl</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-gray-300">{t('location')}</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={handleLinkedInClick}
                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors cursor-pointer"
              >
                <Linkedin className="w-5 h-5" />
              </button>
              <button 
                onClick={handleGitHubClick}
                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors cursor-pointer"
              >
                <Github className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
    </SectionWrapper>
  );
}
