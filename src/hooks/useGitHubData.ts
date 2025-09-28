"use client";

import { useState, useEffect } from 'react';
import { Project, Comment } from '../types/section';
import { isGitHubAvailable, getFallbackProjects } from '../lib/dataSource';

export function useGitHubProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        console.log('Fetching projects from /api/projects');
        
        const response = await fetch('/api/projects');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Projects data received:', data);
        console.log('Projects with entries:', data.filter((p: any) => p.entries && p.entries.length > 0));
        console.log('First project entries:', data[0]?.entries);
        
        // Check if we're using fallback data
        const isUsingFallback = data.length > 0 && data[0].id === 'e-commerce-platform' && data[0].entries.length === 0;
        if (isUsingFallback) {
          console.log('Using fallback data - no GitHub integration');
        } else {
          console.log('Using GitHub data');
        }
        
        // Always use the data from API, even if empty
        setProjects(data);
        console.log('✅ Projects set successfully:', data.length, 'projects');
        
        // If no projects returned from GitHub, also log fallback data for comparison
        if (Array.isArray(data) && data.length === 0) {
          console.log('No projects from GitHub, fallback data would be:', getFallbackProjects());
        }
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
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        
        // Check if GitHub is available, otherwise use empty comments
        if (!isGitHubAvailable()) {
          console.log('GitHub not available, using empty comments');
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

  const addComment = async (content: string, parentId?: string) => {
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

      const response = await fetch(`/api/projects/${projectId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const newComment = await response.json();
      setComments(prev => [...prev, newComment]);
      return newComment;
    } catch (err) {
      console.error('Error adding comment:', err);
      throw err;
    }
  };

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
