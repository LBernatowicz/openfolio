"use client";

import { useState, useEffect, use } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MarkdownRenderer from "../../../../../components/ui/MarkdownRenderer";

interface ArticlePageProps {
  params: Promise<{
    id: string;
    articleId: string;
  }>;
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const router = useRouter();
  const { id, articleId } = use(params);
  const [article, setArticle] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('🔍 Fetching project:', id, 'article:', articleId);
        
        const response = await fetch('/api/projects');
        const projects = await response.json();
        
        console.log('📊 Projects received:', projects.length);
        
        const foundProject = projects.find((p: any) => p.id === id);
        console.log('✅ Found project:', foundProject ? 'YES' : 'NO');
        
        if (foundProject) {
          setProject(foundProject);
          
          const foundArticle = foundProject.entries?.find((e: any) => e.id === articleId);
          console.log('✅ Found article:', foundArticle ? 'YES' : 'NO');
          
          if (foundArticle) {
            setArticle(foundArticle);
          }
        }
      } catch (error) {
        console.error('❌ Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, articleId]);

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

  if (!project || !article) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">404 - Artykuł nie znaleziony</h1>
          <p className="text-slate-400 mb-4">
            Projekt: {id} | Artykuł: {articleId}
          </p>
          <button 
            onClick={() => router.push('/projects')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Powrót do projektów
          </button>
        </div>
      </div>
    );
  }

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
              <span className="text-white font-semibold">{article.title}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Article Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">{article.title}</h1>
          
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
            <span>{new Date(article.date).toLocaleDateString('pl-PL')}</span>
            <span>Projekt: {project.title}</span>
          </div>

          <div className="bg-slate-900/30 backdrop-blur-sm rounded-3xl p-8 border border-slate-800/50">
            <MarkdownRenderer content={article.content} />
          </div>
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
        </div>
      </div>
    </div>
  );
}
