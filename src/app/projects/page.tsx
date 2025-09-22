"use client";

import { ArrowLeft, Code, ExternalLink, Github, Calendar, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { mockProjects } from "../../data/projects";
import { Project } from "../../types/section";

export default function ProjectsPage() {
  const router = useRouter();

  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-400/10';
      case 'in-progress':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'planned':
        return 'text-blue-400 bg-blue-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusText = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return 'Ukończony';
      case 'in-progress':
        return 'W trakcie';
      case 'planned':
        return 'Planowany';
      default:
        return 'Nieznany';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:translate-x-[-2px] transition-transform duration-200" />
              <span className="font-semibold text-lg">Powrót do strony głównej</span>
            </button>
            
            <div className="flex items-center gap-2">
              <Code className="w-6 h-6 text-blue-500" />
              <h1 className="text-xl font-bold text-white">Projekty</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Moje Projekty</h2>
          <p className="text-gray-400 text-lg">Kolekcja moich najważniejszych projektów programistycznych</p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleProjectClick(project.id)}
              className="group cursor-pointer p-5 rounded-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors duration-200 leading-tight">
                  {project.title}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  project.status === 'completed' ? 'text-green-400 bg-green-400/15 border border-green-400/20' :
                  project.status === 'in-progress' ? 'text-yellow-400 bg-yellow-400/15 border border-yellow-400/20' :
                  'text-blue-400 bg-blue-400/15 border border-blue-400/20'
                }`}>
                  {project.status === 'completed' ? '✓ Ukończony' :
                   project.status === 'in-progress' ? '⚡ W trakcie' : '📋 Planowany'}
                </span>
              </div>
              
              <p className="text-sm text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                {project.description}
              </p>
              
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                <Calendar className="w-4 h-4" />
                <span>{project.entries.length} wpisów w historii</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="flex items-center gap-1 px-2 py-1 bg-slate-700/60 text-slate-200 rounded text-xs font-medium border border-slate-600/30"
                  >
                    <Tag className="w-2 h-2" />
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="px-2 py-1 text-xs text-gray-400 bg-slate-800/40 rounded border border-slate-700/30">
                    +{project.technologies.length - 3}
                  </span>
                )}
              </div>

              {/* Action Links */}
              <div className="flex items-center gap-3">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-colors duration-200"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 rounded-lg text-xs font-medium transition-colors duration-200"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Live</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
