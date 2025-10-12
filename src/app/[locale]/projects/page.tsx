"use client";

import { ArrowLeft, Code, ExternalLink, Github, Calendar, Tag } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from 'next-intl';
import { useGitHubProjects } from "../../../hooks/useGitHubData";

export default function ProjectsPage() {
  const t = useTranslations('projects');
  const tNav = useTranslations('nav');
  const router = useRouter();
  const { projects, loading, error } = useGitHubProjects();

  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`);
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
              <span className="font-semibold text-lg">{tNav('backToHome')}</span>
            </button>
            
            <div className="flex items-center gap-2">
              <Code className="w-6 h-6 text-blue-500" />
              <h1 className="text-xl font-bold text-white">{t('title')}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">{t('myProjects')}</h2>
          <p className="text-gray-400 text-lg">{t('subtitle')}</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">{t('loading')}</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{t('loadingError')} {error}</p>
            <p className="text-gray-400 text-sm">{t('checkGitHub')}</p>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleProjectClick(project.id)}
              className="group cursor-pointer p-5 rounded-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 flex flex-col h-full"
            >
                {/* Header - tytuł i status */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors duration-200 leading-tight flex-1">
                  {project.title}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                  project.status === 'completed' ? 'text-green-400 bg-green-400/15 border border-green-400/20' :
                  project.status === 'in-progress' ? 'text-yellow-400 bg-yellow-400/15 border border-yellow-400/20' :
                  'text-blue-400 bg-blue-400/15 border border-blue-400/20'
                }`}>
                  {project.status === 'completed' ? '✓ Ukończony' :
                   project.status === 'in-progress' ? '⚡ W trakcie' : '📋 Planowany'}
                </span>
              </div>
              
              {/* Opis projektu */}
              <p className="text-sm text-gray-300 mb-4 line-clamp-3 leading-relaxed flex-grow">
                {project.description}
              </p>
              
              {/* Dolna sekcja - artykuły, technologie, status i buttony */}
              <div className="mt-auto space-y-4">
                {/* Liczba artykułów */}
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{project.entries.length} wpisów w historii</span>
                </div>
                
                {/* Technologie */}
                <div className="flex flex-wrap gap-2">
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
                <div className="flex items-center gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 px-2 py-1 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white rounded text-xs font-medium transition-colors duration-200"
                    >
                      <Github className="w-3 h-3" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 rounded text-xs font-medium transition-colors duration-200"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Live</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
