"use client";

import { useState, useEffect, useCallback } from 'react';
import { Project, Comment } from '../types/section';
import { isGitHubAvailable, getFallbackProjects } from '../lib/dataSource';
import { useSession } from 'next-auth/react';

export function useGitHubProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('/api/projects');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Always use the data from API, even if empty
        setProjects(data);
      } catch (err) {
        console.error('Error fetching projects, using fallback data:', err);
        setProjects(getFallbackProjects());
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, loading, error };
}

export function useProjectComments(projectId: string) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingComment, setPendingComment] = useState<{content: string, parentId?: string} | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        
        // Check if GitHub is available, otherwise use empty comments
        if (!isGitHubAvailable()) {
          setComments([]);
          setLoading(false);
          return;
        }
        
        const response = await fetch(`/api/projects/${projectId}/comments`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        
        const data = await response.json();
        setComments(data);
      } catch (err) {
        console.error('Error fetching comments, using empty comments:', err);
        setComments([]);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchComments();
    }
  }, [projectId]);

  // Auto-send pending comment when user logs in
  useEffect(() => {
    if (session?.accessToken) {
      // Check for pending comment in localStorage
      const storedPendingComment = localStorage.getItem('pendingComment');
      if (storedPendingComment) {
        try {
          const { content, parentId, url } = JSON.parse(storedPendingComment);
          
          // Only send if we're on the same page
          if (window.location.pathname === url) {
            addComment(content, parentId)
              .then(() => {
                localStorage.removeItem('pendingComment');
              })
              .catch((err) => {
                console.error('Failed to send stored pending comment:', err);
                localStorage.removeItem('pendingComment');
              });
          } else {
            localStorage.removeItem('pendingComment');
          }
        } catch (err) {
          console.error('Error parsing stored pending comment:', err);
          localStorage.removeItem('pendingComment');
        }
      }
      
      // Also handle hook-level pending comment
      if (pendingComment) {
        addComment(pendingComment.content, pendingComment.parentId)
          .then(() => {
            setPendingComment(null);
          })
          .catch((err) => {
            console.error('Failed to send pending comment:', err);
            setPendingComment(null);
          });
      }
    }
  }, [session?.accessToken, pendingComment]);

  const addComment = useCallback(async (content: string, parentId?: string) => {
    try {
      // If GitHub is not available, add comment locally
      if (!isGitHubAvailable()) {
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
        return newComment;
      }

      // Check if user is logged in
      if (!session?.accessToken) {
        // Store comment for later sending
        setPendingComment({ content, parentId });
        throw new Error('User must be logged in to add comments');
      }

      const response = await fetch(`/api/projects/${projectId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content,
          accessToken: session.accessToken 
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Hook: API error: ${response.status} - ${errorText}`);
        throw new Error(`Failed to add comment: ${response.status}`);
      }

      const newComment = await response.json();
      setComments(prev => [...prev, newComment]);
      return newComment;
    } catch (err) {
      console.error('❌ Hook: Error adding comment:', err);
      throw err;
    }
  }, [projectId, session?.accessToken]);

  const likeComment = (commentId: string) => {
    // GitHub doesn't have native likes, but we can simulate it locally
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

  return { 
    comments, 
    loading, 
    error, 
    addComment, 
    likeComment 
  };
}
