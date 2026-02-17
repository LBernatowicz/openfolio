import 'dotenv/config';
import { NextResponse } from 'next/server';
import { fetchGitHubProjectsWithArticles, convertGitHubIssueToProject, convertGitHubIssueToArticle, convertGitHubCommentToComment } from '../../../lib/github';
import { getFallbackProjects, isGitHubAvailableServerSide } from '../../../lib/dataSource';

export async function GET() {
  try {
    // TEMPORARY: Force GitHub to be available for testing
    const forceGitHub = true; // CHANGED: Use real GitHub projects
    
    if (!forceGitHub) {
      // Check if GitHub is available (has token)
      const isGitHubAvailable = isGitHubAvailableServerSide();
      
      if (!isGitHubAvailable) {
        const mockProjects = getFallbackProjects();
        return NextResponse.json(mockProjects);
      }
    }
    
    // Fetch projects and their sub-issues and comments in one optimized call
    const { projects: projectIssues, articlesByProject, commentsByProject } = await fetchGitHubProjectsWithArticles();
    
    // If no projects from GitHub, fallback to mock data
    if (projectIssues.length === 0) {
      const mockProjects = getFallbackProjects();
      const response = NextResponse.json(mockProjects);
      response.headers.set('X-Data-Source', 'mock');
      return response;
    }
    
    // Convert project issues to project format
    const projects = projectIssues.map(convertGitHubIssueToProject);
    
    // Add sub-issues (articles) and comments to their respective projects
    projects.forEach(project => {
      // Find the original project issue by number (since project.id is now the issue number)
      const originalProjectIssue = projectIssues.find(issue => 
        issue.number.toString() === project.id
      );
      
      if (originalProjectIssue) {
        const projectNumber = originalProjectIssue.number;
        
        // Add sub-issues as articles
        if (articlesByProject[projectNumber]) {
          const projectArticles = articlesByProject[projectNumber]
            .map(convertGitHubIssueToArticle)
            .sort((a, b) => {
              // Sort by version first (highest first)
              const versionA = a.version || '0.0.0';
              const versionB = b.version || '0.0.0';
              
              // Parse version strings (e.g., "2.0.0" -> [2, 0, 0])
              const parseVersion = (version: string) => {
                return version.split('.').map(num => parseInt(num) || 0);
              };
              
              const versionPartsA = parseVersion(versionA);
              const versionPartsB = parseVersion(versionB);
              
              // Compare major, minor, patch versions
              for (let i = 0; i < Math.max(versionPartsA.length, versionPartsB.length); i++) {
                const partA = versionPartsA[i] || 0;
                const partB = versionPartsB[i] || 0;
                
                if (partA !== partB) {
                  return partB - partA; // Descending order (highest first)
                }
              }
              
              // If versions are equal, sort by date (newest first)
              const dateA = new Date(a.date).getTime();
              const dateB = new Date(b.date).getTime();
              return dateB - dateA;
            });
          project.entries = projectArticles;
        } else {
          project.entries = [];
        }
        
        // Add comments
        if (commentsByProject[projectNumber]) {
          const projectComments = commentsByProject[projectNumber].map(convertGitHubCommentToComment);
          project.comments = projectComments;
        } else {
          project.comments = [];
        }
      } else {
        project.entries = [];
        project.comments = [];
      }
    });
    
    const response = NextResponse.json(projects);
    response.headers.set('X-Data-Source', 'github');
    return response;
  } catch (error) {
    console.error('❌ Error fetching projects:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    const mockProjects = getFallbackProjects();
    const response = NextResponse.json(mockProjects);
    response.headers.set('X-Data-Source', 'mock-error');
    return response;
  }
}
