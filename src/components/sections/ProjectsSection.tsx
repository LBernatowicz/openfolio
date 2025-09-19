"use client";

import { ExternalLink, Code } from "lucide-react";
import { useRouter } from "next/navigation";
import SectionWrapper from "../ui/SectionWrapper";

export default function ProjectsSection() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/projects');
  };

  return (
    <SectionWrapper width={1} height={1} hasExternalLink={true}>
      <div 
        className="flex items-center gap-2 mb-6 cursor-pointer"
        onClick={handleClick}
      >
        <Code className="w-6 h-6 text-blue-500 flex-shrink-0" />
        <h2 className="text-xl font-bold text-white whitespace-nowrap">Projekty</h2>
        <ExternalLink className="w-5 h-5 flex-shrink-0" />
      </div>
      <div className="text-gray-400 text-center py-8">
        Wkrótce...
      </div>
    </SectionWrapper>
  );
}
