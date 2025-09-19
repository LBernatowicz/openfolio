"use client";

import { GraduationCap, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import SectionWrapper from "../ui/SectionWrapper";

export default function StudySection() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/education');
  };

  return (
    <SectionWrapper width={1} height={1} hasExternalLink={true}>
        <div 
          className="flex items-center gap-2 mb-6 cursor-pointer"
          onClick={handleClick}
        >
          <GraduationCap className="w-6 h-6 text-blue-500 flex-shrink-0" />
          <h2 className="text-xl font-bold text-white whitespace-nowrap">Edukacja</h2>
          <ExternalLink className="w-5 h-5 flex-shrink-0" />
        </div>
        <div className="space-y-4">
          <div className="border-l-2 border-blue-500 pl-4">
            <h3 className="font-semibold text-white">Informatyka</h3>
            <p className="text-gray-400 text-sm">Politechnika Warszawska • 2018 - 2022</p>
            <p className="text-gray-300 text-xs mt-1">Specjalizacja: Inżynieria oprogramowania</p>
          </div>
          <div className="border-l-2 border-blue-500 pl-4">
            <h3 className="font-semibold text-white">Kursy i certyfikaty</h3>
            <p className="text-gray-400 text-sm">Różne platformy • 2020 - Obecnie</p>
            <p className="text-gray-300 text-xs mt-1">React, Node.js, AWS, Docker</p>
          </div>
        </div>
        <button className="text-blue-400 hover:text-blue-300 text-sm mt-4">
          Zobacz więcej
        </button>
    </SectionWrapper>
  );
}
