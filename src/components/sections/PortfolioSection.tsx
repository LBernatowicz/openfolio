"use client";

import { ExternalLink, Briefcase, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import SectionWrapper from "../ui/SectionWrapper";
import { mockProjects } from "../../data/projects";

export default function PortfolioSection() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/projects');
  };

  const featuredProjects = mockProjects.slice(0, 2);

  return (
    <SectionWrapper width={2} height={1} hasExternalLink={true}>
      <div 
        className="flex items-center gap-2 mb-6 cursor-pointer"
        onClick={handleClick}
      >
        <Briefcase className="w-6 h-6 text-blue-500 flex-shrink-0" />
        <h2 className="text-xl font-bold text-white whitespace-nowrap">Portfolio & Projekty</h2>
        <ExternalLink className="w-5 h-5 flex-shrink-0" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {featuredProjects.map((project) => (
          <div
            key={project.id}
            onClick={handleClick}
            className="group cursor-pointer p-4 rounded-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200 leading-tight">
                {project.title}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                project.status === 'completed' ? 'text-green-400 bg-green-400/15 border border-green-400/20' :
                project.status === 'in-progress' ? 'text-yellow-400 bg-yellow-400/15 border border-yellow-400/20' :
                'text-blue-400 bg-blue-400/15 border border-blue-400/20'
              }`}>
                {project.status === 'completed' ? '✓' :
                 project.status === 'in-progress' ? '⚡' : '📋'}
              </span>
            </div>
            
            <p className="text-xs text-gray-300 mb-3 line-clamp-2 leading-relaxed">
              {project.description}
            </p>
            
            <div className="flex flex-wrap gap-1">
              {project.technologies.slice(0, 2).map((tech) => (
                <span
                  key={tech}
                  className="flex items-center gap-1 px-2 py-1 bg-slate-700/60 text-slate-200 rounded text-xs font-medium border border-slate-600/30"
                >
                  <Tag className="w-2 h-2" />
                  {tech}
                </span>
              ))}
              {project.technologies.length > 2 && (
                <span className="px-2 py-1 text-xs text-gray-400 bg-slate-800/40 rounded border border-slate-700/30">
                  +{project.technologies.length - 2}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center pt-3">
        <span className="text-xs text-gray-400 font-medium">
          Kliknij, aby zobaczyć wszystkie projekty →
        </span>
      </div>
    </SectionWrapper>
  );
}
