"use client";

import { ArrowLeft, Code, ExternalLink, Github, Calendar, Tag, Clock } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import Image from "next/image";
import { useGitHubProjects, useProjectComments } from "@/hooks/useGitHubData";
import { Project, ProjectEntry, Comment } from "@/types/section";
import { notFound } from "next/navigation";
import CommentSection from "@/components/ui/CommentSection";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";
import { useState, useEffect, use } from "react";
import { useTranslations } from 'next-intl';

interface ProjectDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const t = useTranslations('projects');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
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
        // Load comments from API instead of project object
        loadComments(foundProject);
      }
    }
  }, [projects, id]);

  const loadComments = async (project: Project) => {
    try {
      const issueNumber = project.githubUrl?.match(/issues\/(\d+)/)?.[1];
      if (!issueNumber) return;
      
      console.log('Loading comments for issue:', issueNumber);
      const response = await fetch(`/api/projects/${issueNumber}/comments`);
      if (response.ok) {
        const commentsData = await response.json();
        setComments(commentsData);
        console.log('Comments loaded from API:', commentsData.length);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleAddComment = async (content: string, parentId?: string, isAnonymous?: boolean, displayName?: string) => {
    try {
      console.log('Adding comment:', content, parentId, isAnonymous, displayName);
      
      // Get the issue number from the project's githubUrl
      const issueNumber = project?.githubUrl?.match(/issues\/(\d+)/)?.[1];
      if (!issueNumber) {
        console.error('Could not find issue number in project githubUrl:', project?.githubUrl);
        throw new Error('Could not find issue number for this project');
      }
      
      console.log('Issue number found:', issueNumber);
      
      // Get access token from session (only if not anonymous)
      let session = null;
      if (!isAnonymous) {
        const response = await fetch('/api/auth/session');
        session = await response.json();
        
        console.log('Session response:', session);
        
        if (!session.accessToken) {
          console.error('No access token in session');
          throw new Error('User must be logged in to add comments');
        }
        
        // Test if the access token is valid by making a simple GitHub API call
        console.log('Testing access token validity...');
        try {
          const testResponse = await fetch('https://api.github.com/user', {
            headers: {
              'Authorization': `Bearer ${session.accessToken}`,
              'Accept': 'application/vnd.github+json',
              'X-GitHub-Api-Version': '2022-11-28',
            }
          });
          
          if (!testResponse.ok) {
            console.error('Access token is invalid or expired:', testResponse.status);
            throw new Error('Access token is invalid or expired. Please log in again.');
          }
          
          const userInfo = await testResponse.json();
          console.log('Access token is valid for user:', userInfo.login);
        } catch (tokenError) {
          console.error('Token validation failed:', tokenError);
          throw new Error('Access token is invalid or expired. Please log in again.');
        }
      }
      
      console.log('Making API call to add comment...');
      
      const response2 = await fetch(`/api/projects/${issueNumber}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          accessToken: session?.accessToken || null,
          userInfo: isAnonymous ? {
            username: displayName || 'Anonimowy',
            name: displayName || 'Anonimowy',
            avatar: null
          } : {
            username: session?.githubUsername,
            name: session?.user?.name,
            avatar: session?.githubAvatar
          },
          isAnonymous: !!isAnonymous
        }),
      });
      
      console.log('API response status:', response2.status);
      
      if (!response2.ok) {
        const errorText = await response2.text();
        console.error('API error response:', errorText);
        
        // Check if it's an authentication error
        if (response2.status === 401 || response2.status === 403) {
          throw new Error('Authentication failed. Please log in again.');
        }
        
        throw new Error(`Failed to add comment: ${response2.status} - ${errorText}`);
      }
      
      const newComment = await response2.json();
      console.log('New comment received:', newComment);
      setComments(prev => [...prev, newComment]);
      console.log('Comment added successfully');
      
      // Reload comments to ensure consistency
      if (project) {
        await loadComments(project);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };

  const handleLikeComment = (commentId: string) => {
    console.log('Liking comment:', commentId);
    // TODO: Implement like functionality
  };

  const handleReplyToComment = async (commentId: string, content: string) => {
    try {
      console.log('Replying to comment:', commentId, content);
      await handleAddComment(content, commentId);
      console.log('Reply added successfully');
    } catch (error) {
      console.error('Error adding reply:', error);
      throw error;
    }
  };

  if (projectsLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">{t('loadingProject')}</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">{t('notFound')}</h1>
          <p className="text-gray-400 mb-4">{t('searchedProject')} {id}</p>
          <p className="text-gray-400 mb-4">{t('availableProjects')} {projects.map(p => p.id).join(', ')}</p>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {tNav('backToHome')}
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
        return t('status.completed');
      case 'in-progress':
        return t('status.inProgress');
      case 'planned':
        return t('status.planned');
      default:
        return t('status.unknown');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
              {project.entries.slice().reverse().map((entry, index) => (
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
