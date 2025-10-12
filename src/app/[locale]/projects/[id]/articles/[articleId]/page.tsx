"use client";

import { ArrowLeft, Clock, ExternalLink } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useEffect, useRef, useState, use } from "react";
import { useTranslations, useLocale } from 'next-intl';
import { Comment } from "@/types/section";
import CommentSection from "@/components/ui/CommentSection";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";
import { useGitHubProjects } from "@/hooks/useGitHubData";

interface ArticlePageProps {
  params: Promise<{
    id: string;
    articleId: string;
  }>;
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const t = useTranslations('projects');
  const tNav = useTranslations('nav');
  const tComments = useTranslations('comments');
  const tCommon = useTranslations('common');
  const tArticle = useTranslations('projects.article');
  const locale = useLocale();
  const router = useRouter();
  const [showToc, setShowToc] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  const firstParagraphRef = useRef<HTMLParagraphElement>(null);
  const [tocItems, setTocItems] = useState<Array<{id: string, text: string, level: number}>>([]);
  const [activeSection, setActiveSection] = useState<string>('');
  
  // Unwrap params Promise
  const { id, articleId } = use(params);

  // Use GitHub API
  const { projects, loading, error } = useGitHubProjects();
  const [comments, setComments] = useState<Comment[]>([]);

  // Find project and article
  const project = projects.find(p => p.id === id);
  const article = project?.entries?.find(e => e.id === articleId);

  // Generate table of contents from markdown content
  const generateToc = (content: string) => {
    const headings = content.match(/^#{1,6}\s+(.+)$/gm);
    if (!headings) return [];
    
    return headings.map((heading, index) => {
      const level = heading.match(/^#+/)?.[0].length || 1;
      const text = heading.replace(/^#+\s+/, '');
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
      
      return { id, text, level };
    });
  };

  // Initialize comments from article
  useEffect(() => {
    if (article?.comments) {
      setComments(article.comments);
    }
  }, [article]);

  // Generate table of contents when article content changes
  useEffect(() => {
    if (article?.content) {
      const toc = generateToc(article.content);
      console.log('Generated TOC items:', toc);
      console.log('Article content preview:', article.content.substring(0, 200));
      setTocItems(toc);
    }
  }, [article?.content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        console.log('First paragraph intersection:', entry.isIntersecting);
        console.log('Setting showToc to:', entry.isIntersecting);
        setShowToc(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '-100px 0px 0px 0px'
      }
    );

    if (firstParagraphRef.current) {
      observer.observe(firstParagraphRef.current);
    }

    return () => {
      if (firstParagraphRef.current) {
        observer.unobserve(firstParagraphRef.current);
      }
    };
  }, [article?.content]);

  // Track active section for TOC highlighting
  useEffect(() => {
    if (tocItems.length === 0) return;

    const updateActiveSection = () => {
      const headingElements = tocItems
        .map(item => document.getElementById(item.id))
        .filter((el): el is HTMLElement => el !== null);

      if (headingElements.length === 0) return;

      // Find headings that are above or near the top of the viewport
      const headingsAboveViewport = headingElements.filter(heading => {
        const rect = heading.getBoundingClientRect();
        return rect.top <= 200; // Within 200px from top
      });

      if (headingsAboveViewport.length > 0) {
        // Get the last heading that's above the viewport (most recent one we scrolled past)
        const activeHeading = headingsAboveViewport[headingsAboveViewport.length - 1];
        setActiveSection(activeHeading.id);
      } else if (headingElements.length > 0) {
        // If no headings are above viewport, activate the first one
        setActiveSection(headingElements[0].id);
      }
    };

    // Initial check
    updateActiveSection();

    // Update on scroll
    window.addEventListener('scroll', updateActiveSection, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
    };
  }, [tocItems]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">{t('loadingArticle')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{t('errorLoadingArticle')}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {tCommon('tryAgain')}
          </button>
        </div>
      </div>
    );
  }
  
  if (!project) {
    console.log('❌ Project not found:', id);
    console.log('📋 Available projects:', projects.map(p => p.id));
    notFound();
  }

  if (!article) {
    console.log('❌ Article not found:', articleId);
    console.log('📝 Available articles:', project.entries?.map(e => e.id));
    notFound();
  }

  const formatDate = (dateString: string) => {
    const localeCode = locale === 'pl' ? 'pl-PL' : 'en-US';
    return new Date(dateString).toLocaleDateString(localeCode, {
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
      author: tComments('user'),
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
              <span className="font-semibold text-lg">{tArticle('backToProject')}</span>
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
        <div className="mb-12 relative overflow-hidden rounded-2xl">
          {/* Background Image */}
          <div className="absolute inset-0">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${article.image || '/next.svg'})`,
                filter: 'blur(2px) brightness(0.3)'
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-slate-900/60"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 p-8 sm:p-12 lg:p-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-slate-300 text-sm font-mono">{tArticle('changelogFile')}</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex items-center gap-4 text-sm text-gray-300 mb-6">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{formatDate(article.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>{tArticle('articleNumber')}{getArticleIndex()}</span>
              </div>
            </div>
          </div>
        </div>


        {/* Article Content with Sidebar */}
        <div className="relative">
          {/* Table of Contents - Fixed Position with Scroll Detection */}
          {tocItems.length > 0 && (
            <div className={`hidden xl:block fixed left-8 top-1/2 transform -translate-y-1/2 z-10 transition-all duration-300 opacity-100 translate-x-0`}>
              <div className="bg-slate-900/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-800/50 w-64">
                <h3 className="text-lg font-semibold text-white mb-4">{tArticle('tableOfContents')}</h3>
                <nav className="space-y-1">
                  {tocItems.map((item, index) => {
                    const isActive = activeSection === item.id;
                    return (
                      <a 
                        key={index}
                        href={`#${item.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          const element = document.getElementById(item.id);
                          if (element) {
                            const offset = -300; // 20px from top
                            const elementPosition = element.offsetTop - offset;
                            window.scrollTo({
                              top: elementPosition,
                              behavior: 'smooth'
                            });
                          }
                        }}
                        className={`block text-sm transition-all duration-200 py-1 border-l-2 pl-3 ${
                          isActive 
                            ? 'text-blue-400 border-blue-400 font-semibold bg-blue-500/10' 
                            : 'text-gray-300 border-transparent hover:text-blue-400 hover:border-blue-400/50'
                        } ${
                          item.level === 1 ? 'font-medium' : 
                          item.level === 2 ? 'ml-2' : 
                          item.level === 3 ? 'ml-4' : 'ml-6'
                        }`}
                      >
                        {item.text}
                      </a>
                    );
                  })}
                </nav>
              </div>
            </div>
          )}

          {/* Article Content - Full Container Width */}
          <article ref={articleRef} className="prose prose-invert max-w-none">
            <div className="bg-slate-900/30 backdrop-blur-sm rounded-3xl p-8 border border-slate-800/50">
              <MarkdownRenderer content={article.content} firstParagraphRef={firstParagraphRef} />
              
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
