"use client";

import { ArrowLeft, Clock, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { mockProjects } from "../../../../../data/projects";
import { notFound } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface ArticlePageProps {
  params: {
    id: string;
    articleId: string;
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const router = useRouter();
  const project = mockProjects.find(p => p.id === params.id);
  const [showToc, setShowToc] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  
  if (!project) {
    notFound();
  }

  const article = project.entries.find(e => e.id === params.articleId);
  
  if (!article) {
    notFound();
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowToc(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '-100px 0px 0px 0px'
      }
    );

    if (articleRef.current) {
      observer.observe(articleRef.current);
    }

    return () => {
      if (articleRef.current) {
        observer.unobserve(articleRef.current);
      }
    };
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getArticleIndex = () => {
    return project.entries.findIndex(e => e.id === params.articleId) + 1;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push(`/projects/${params.id}`)}
              className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:translate-x-[-2px] transition-transform duration-200" />
              <span className="font-semibold text-lg">Powrót do projektu</span>
            </button>
            
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm font-mono">v{String(getArticleIndex()).padStart(2, '0')}.0.0</span>
              <span className="text-slate-600">|</span>
              <span className="text-white font-semibold">{article.title}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Article Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-slate-400 text-sm font-mono">CHANGELOG.md</span>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">{article.title}</h1>
          
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{formatDate(article.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Artykuł #{getArticleIndex()}</span>
            </div>
          </div>

          <p className="text-xl text-gray-300 leading-relaxed">
            {article.content}
          </p>
        </div>

        {/* Article Image */}
        {article.image && (
          <div className="mb-12">
            <div className="relative w-full h-64 lg:h-80 rounded-2xl overflow-hidden bg-slate-800">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* Article Content with Sidebar */}
        <div className="relative">
          {/* Table of Contents - Fixed Position with Scroll Detection */}
          <div className={`hidden xl:block fixed left-8 top-1/2 transform -translate-y-1/2 z-10 transition-all duration-300 ${
            showToc ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
          }`}>
            <div className="bg-slate-900/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-800/50 w-64">
              <h3 className="text-lg font-semibold text-white mb-4">Spis treści</h3>
              <nav className="space-y-2">
                <a href="#szczegoly" className="block text-sm text-gray-300 hover:text-blue-400 transition-colors duration-200 py-1">
                  Szczegóły implementacji
                </a>
                <a href="#zrobione" className="block text-sm text-gray-300 hover:text-blue-400 transition-colors duration-200 py-1">
                  Co zostało zrobione
                </a>
                <a href="#technologie" className="block text-sm text-gray-300 hover:text-blue-400 transition-colors duration-200 py-1">
                  Technologie użyte
                </a>
                <a href="#nastepne" className="block text-sm text-gray-300 hover:text-blue-400 transition-colors duration-200 py-1">
                  Następne kroki
                </a>
                <a href="#info" className="block text-sm text-gray-300 hover:text-blue-400 transition-colors duration-200 py-1">
                  Informacje
                </a>
              </nav>
            </div>
          </div>

          {/* Article Content - Full Container Width */}
          <article ref={articleRef} className="prose prose-invert max-w-none">
            <div className="bg-slate-900/30 backdrop-blur-sm rounded-3xl p-8 border border-slate-800/50">
              <div className="text-gray-300 leading-relaxed">
                <h2 id="szczegoly" className="text-2xl font-bold text-white mb-6">Szczegóły implementacji</h2>
                
                <p className="text-lg mb-6">
                  Ten artykuł zawiera szczegółowe informacje o implementacji <strong>{article.title.toLowerCase()}</strong> w projekcie {project.title}.
                </p>

                <h3 id="zrobione" className="text-xl font-semibold text-blue-400 mb-4">Co zostało zrobione</h3>
                <p className="mb-6">
                  {article.content}
                </p>

                <h3 id="technologie" className="text-xl font-semibold text-blue-400 mb-4">Technologie użyte</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <h3 id="nastepne" className="text-xl font-semibold text-blue-400 mb-4">Następne kroki</h3>
                <p className="mb-6">
                  Po zakończeniu tej implementacji planowane są dalsze ulepszenia i optymalizacje projektu.
                </p>

                <div id="info" className="bg-slate-800/50 rounded-lg p-4 mt-8">
                  <p className="text-sm text-gray-400 mb-2">
                    <strong>Data publikacji:</strong> {formatDate(article.date)}
                  </p>
                  <p className="text-sm text-gray-400">
                    <strong>Wersja:</strong> v{String(getArticleIndex()).padStart(2, '0')}.0.0
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* Navigation */}
        <div className="mt-12 flex justify-between items-center">
          <button
            onClick={() => router.push(`/projects/${params.id}`)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Powrót do projektu</span>
          </button>
          
          <div className="flex items-center gap-4">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors duration-200"
              >
                <ExternalLink className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
