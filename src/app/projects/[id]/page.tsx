"use client";

import { ArrowLeft, Code, ExternalLink, Github, Calendar, Tag, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useGitHubProjects, useProjectComments } from "../../../hooks/useGitHubData";
import { Project, ProjectEntry, Comment } from "../../../types/section";
import { notFound } from "next/navigation";
import CommentSection from "../../../components/ui/CommentSection";
import MarkdownRenderer from "../../../components/ui/MarkdownRenderer";
import { useState, useEffect, use } from "react";
import React from "react";

interface ProjectDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const router = useRouter();
  const { projects, loading: projectsLoading } = useGitHubProjects();
  const [project, setProject] = useState<Project | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  
  // Unwrap params Promise
  const { id } = use(params);

  useEffect(() => {
    console.log('Projects loaded:', projects);
    console.log('Looking for project with ID:', id);
    if (projects.length > 0) {
      const foundProject = projects.find(p => p.id === id);
      console.log('Found project:', foundProject);
      if (foundProject) {
        setProject(foundProject);
        // Use comments from project data
        setComments(foundProject.comments || []);
        console.log('Project comments:', foundProject.comments);
      }
    }
  }, [projects, id]);

  if (projectsLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Ładowanie projektu...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Projekt nie znaleziony</h1>
          <p className="text-gray-400 mb-4">Szukany projekt: {id}</p>
          <p className="text-gray-400 mb-4">Dostępne projekty: {projects.map(p => p.id).join(', ')}</p>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Wróć do strony głównej
          </button>
        </div>
      </div>
    );
  }


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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleAddComment = async (content: string, parentId?: string) => {
    try {
      // TODO: Implement comment adding to GitHub
      console.log('Adding comment:', content, parentId);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleLikeComment = (commentId: string) => {
    // TODO: Implement comment liking
    console.log('Liking comment:', commentId);
  };

  const handleReplyToComment = async (commentId: string, content: string) => {
    try {
      // TODO: Implement comment replying to GitHub
      console.log('Replying to comment:', commentId, content);
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push('/projects')}
              className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:translate-x-[-2px] transition-transform duration-200" />
              <span className="font-semibold text-lg">Powrót do projektów</span>
            </button>
            
            <div className="flex items-center gap-2">
              <Code className="w-6 h-6 text-blue-500" />
              <h1 className="text-xl font-bold text-white">{project.title}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Project Header with Background Image */}
        <div className="mb-12">
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden bg-slate-800">
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={project.mainImage}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
              </div>
              
              {/* Header Content */}
              <div className="relative z-10 p-8 lg:p-12">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                  <div>
                    <h2 className="text-4xl font-bold text-white mb-4">{project.title}</h2>
                    <div className="flex items-center gap-4 mb-6">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                        {getStatusText(project.status)}
                      </span>
                      <div className="flex items-center gap-1 text-gray-300 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{project.entries.length} artykułów</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-4">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-lg transition-colors duration-200 border border-white/20"
                      >
                        <Github className="w-5 h-5" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600/80 backdrop-blur-sm hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
                      >
                        <ExternalLink className="w-5 h-5" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Project Description */}
                <div className="text-gray-200 text-xl leading-relaxed mb-8">
                  <MarkdownRenderer content={project.description} />
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-3">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-white/20"
                    >
                      <Tag className="w-4 h-4" />
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Changelog */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-white mb-4">Changelog</h3>
            <p className="text-gray-400 text-lg">Historia zmian w projekcie</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-3">
              {project.entries.map((entry, index) => (
                <div
                  key={entry.id}
                  onClick={() => router.push(`/projects/${project.id}/articles/${entry.id}`)}
                  className="group cursor-pointer bg-slate-900/30 backdrop-blur-sm rounded-lg p-4 border border-slate-800/50 hover:border-slate-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
                >
                  <div className="flex items-center gap-4">
                    {/* Changelog indicator */}
                    <div className="flex-shrink-0">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    
                    {/* Entry info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors duration-200">
                          {entry.title}
                        </h4>
                        <span className="text-xs text-gray-400 font-mono">
                          v{String(index + 1).padStart(2, '0')}.0.0
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mb-2 max-h-[100px] overflow-hidden" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: 'vertical',
                        textOverflow: 'ellipsis'
                      }}>
                        {entry.content}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(entry.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" />
                          <span>Przeczytaj artykuł</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Arrow indicator */}
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-200">
                        <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
