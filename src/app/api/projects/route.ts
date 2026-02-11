import 'dotenv/config';
import { NextResponse } from 'next/server';
import { fetchGitHubProjectsWithArticles, convertGitHubIssueToProject, convertGitHubIssueToArticle, convertGitHubCommentToComment } from '../../../lib/github';
import { getFallbackProjects, isGitHubAvailableServerSide } from '../../../lib/dataSource';

export async function GET() {
  try {
    console.log('=== API ROUTE: /api/projects ===');
    console.log('Environment check:');
    console.log('GITHUB_TOKEN:', process.env.GITHUB_TOKEN ? 'SET' : 'NOT SET');
    console.log('NEXT_PUBLIC_GITHUB_USERNAME:', process.env.NEXT_PUBLIC_GITHUB_USERNAME);
    console.log('NEXT_PUBLIC_GITHUB_REPO:', process.env.NEXT_PUBLIC_GITHUB_REPO);
    
    // TEMPORARY: Force GitHub to be available for testing
    const forceGitHub = true; // CHANGED: Use real GitHub projects
    
    if (!forceGitHub) {
      // Check if GitHub is available (has token)
      const isGitHubAvailable = isGitHubAvailableServerSide();
      console.log('GitHub available (server-side):', isGitHubAvailable);
      
      // Debug: Check all environment variables
      console.log('All env vars with GITHUB:', Object.keys(process.env).filter(key => key.includes('GITHUB')));
      console.log('GITHUB_TOKEN value:', process.env.GITHUB_TOKEN ? 'SET' : 'NOT SET');
      console.log('GITHUB_TOKEN length:', process.env.GITHUB_TOKEN ? process.env.GITHUB_TOKEN.length : 0);
      
      if (!isGitHubAvailable) {
        console.log('GitHub not available, using mock data');
        const mockProjects = getFallbackProjects();
        return NextResponse.json(mockProjects);
      }
    }
    
    // Fetch projects and their sub-issues and comments in one optimized call
    console.log('About to call fetchGitHubProjectsWithArticles...');
    console.log('Environment variables in API route:');
    console.log('GITHUB_TOKEN:', process.env.GITHUB_TOKEN ? 'SET' : 'NOT SET');
    console.log('NEXT_PUBLIC_GITHUB_USERNAME:', process.env.NEXT_PUBLIC_GITHUB_USERNAME);
    console.log('NEXT_PUBLIC_GITHUB_REPO:', process.env.NEXT_PUBLIC_GITHUB_REPO);
    
    console.log('🚀 Starting GitHub API call...');
    const { projects: projectIssues, articlesByProject, commentsByProject } = await fetchGitHubProjectsWithArticles();
    console.log('✅ GitHub API call completed');
    console.log('Project issues received:', projectIssues.length);
    console.log('Sub-issues grouped by project:', Object.keys(articlesByProject).length, 'projects have sub-issues');
    console.log('Comments grouped by project:', Object.keys(commentsByProject).length, 'projects have comments');
    
    // If no projects from GitHub, fallback to mock data
    if (projectIssues.length === 0) {
      console.log('No projects from GitHub, using mock data');
      const mockProjects = getFallbackProjects();
      const response = NextResponse.json(mockProjects);
      response.headers.set('X-Data-Source', 'mock');
      return response;
    }
    
    console.log('SUCCESS: Got projects from GitHub:', projectIssues.length);
    
    // Convert project issues to project format
    const projects = projectIssues.map(convertGitHubIssueToProject);
    console.log('Converted projects:', projects.length);
    
    // Add sub-issues (articles) and comments to their respective projects
    projects.forEach(project => {
      // Find the original project issue by number (since project.id is now the issue number)
      const originalProjectIssue = projectIssues.find(issue => 
        issue.number.toString() === project.id
      );
      
      if (originalProjectIssue) {
        const projectNumber = originalProjectIssue.number;
        console.log(`🔍 Processing project: ${project.id} (issue #${projectNumber})`);
        
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
          console.log(`✅ Found ${projectArticles.length} sub-issues for project ${project.id}`);
          console.log(`📝 Sub-issue IDs (sorted by version):`, projectArticles.map(a => ({ id: a.id, version: a.version, date: a.date })));
          project.entries = projectArticles;
        } else {
          console.log(`❌ No sub-issues found for project ${project.id}`);
          project.entries = [];
        }
        
        // Add comments
        if (commentsByProject[projectNumber]) {
          const projectComments = commentsByProject[projectNumber].map(convertGitHubCommentToComment);
          console.log(`✅ Found ${projectComments.length} comments for project ${project.id}`);
          console.log(`Comments data:`, projectComments);
          project.comments = projectComments;
        } else {
          console.log(`❌ No comments found for project ${project.id}`);
          project.comments = [];
        }
      } else {
        console.log(`❌ Could not find original issue for project ${project.id}`);
        project.entries = [];
        project.comments = [];
      }
    });
    
    console.log('Final projects with entries and comments:', projects.map(p => ({ 
      id: p.id, 
      entries: p.entries?.length || 0, 
      comments: p.comments?.length || 0 
    })));
    
    const response = NextResponse.json(projects);
    response.headers.set('X-Data-Source', 'github');
    return response;
  } catch (error) {
    console.error('❌ Error fetching projects:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.log('Falling back to mock data due to error');
    const mockProjects = getFallbackProjects();
    const response = NextResponse.json(mockProjects);
    response.headers.set('X-Data-Source', 'mock-error');
    return response;
  }
}
