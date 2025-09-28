"use client";

import { ArrowLeft, Clock, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useEffect, useRef, useState, use } from "react";
import { Comment } from "../../../../../types/section";
import CommentSection from "../../../../../components/ui/CommentSection";
import MarkdownRenderer from "../../../../../components/ui/MarkdownRenderer";
import { useGitHubProjects } from "../../../../../hooks/useGitHubData";

interface ArticlePageProps {
  params: Promise<{
    id: string;
    articleId: string;
  }>;
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const router = useRouter();
  const [showToc, setShowToc] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  
  // Unwrap params Promise
  const { id, articleId } = use(params);

  // Use GitHub API
  const { projects, loading, error } = useGitHubProjects();
  const [comments, setComments] = useState<Comment[]>([]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Ładowanie artykułu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Błąd podczas ładowania artykułu</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }
  
  // Find project and article
  const project = projects.find(p => p.id === id);
  
  if (!project) {
    console.log('❌ Project not found:', id);
    console.log('📋 Available projects:', projects.map(p => p.id));
    notFound();
  }

  const article = project.entries?.find(e => e.id === articleId);
  
  if (!article) {
    console.log('❌ Article not found:', articleId);
    console.log('📝 Available articles:', project.entries?.map(e => e.id));
    notFound();
  }

  // Initialize comments from article
  useEffect(() => {
    if (article?.comments) {
      setComments(article.comments);
    }
  }, [article]);

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
    return project.entries.findIndex(e => e.id === articleId) + 1;
  };

  const handleAddComment = (content: string, parentId?: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      author: 'Użytkownik',
      content,
      date: new Date().toISOString(),
      parentId,
      likes: 0,
      isLiked: false
    };
    setComments(prev => [...prev, newComment]);
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked 
          }
        : comment
    ));
  };

  const handleReplyToComment = (commentId: string, content: string) => {
    handleAddComment(content, commentId);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push(`/projects/${id}`)}
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

          <div className="text-xl text-gray-300 leading-relaxed">
            <MarkdownRenderer content={article.content} />
          </div>
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
              <MarkdownRenderer content={article.content} />
              
              {/* Additional project info */}
              <div className="mt-8 pt-6 border-t border-slate-700">
                <h3 className="text-xl font-semibold text-blue-400 mb-4">Technologie użyte</h3>
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

                <div className="bg-slate-800/50 rounded-lg p-4">
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
            onClick={() => router.push(`/projects/${id}`)}
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

        {/* Sekcja komentarzy */}
        <div className="mt-16">
          <div className="max-w-4xl mx-auto">
            <CommentSection
              comments={comments}
              onAddComment={handleAddComment}
              onLikeComment={handleLikeComment}
              onReplyToComment={handleReplyToComment}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
