// GitHub API integration for projects and comments
import 'dotenv/config';

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  user: {
    login: string;
    avatar_url: string;
  };
  labels: Array<{
    name: string;
    color: string;
  }>;
  comments: number;
  html_url: string;
  // GitHub Relations
  timeline_url?: string;
}

export interface GitHubComment {
  id: number;
  body: string;
  user: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
  html_url: string;
}

// GitHub API configuration
const GITHUB_OWNER = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'lukaszbernatowicz';
const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO || 'openfolio';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Base API URL
const GITHUB_API_BASE = 'https://api.github.com';

// Helper function to make GitHub API requests
async function fetchGitHubAPI(endpoint: string) {
  if (!GITHUB_TOKEN) {
    console.warn('⚠️ GITHUB_TOKEN is not set. GitHub API calls will likely fail.');
    console.warn('🔧 Please check your .env.local file for GITHUB_TOKEN');
    // Return empty array instead of throwing error
    return [];
  }

  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'OpenFolio-App'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`GitHub API error for ${endpoint}: ${response.status} - ${errorText}`);
    // Return empty array instead of throwing error
    return [];
  }

  const data = await response.json();
  return data;
}

// Fetch projects with their sub-issues and comments from GitHub
export async function fetchGitHubProjectsWithArticles(): Promise<{ projects: GitHubIssue[], articlesByProject: { [projectNumber: number]: GitHubIssue[] }, commentsByProject: { [projectNumber: number]: GitHubComment[] } }> {
  try {
<<<<<<< HEAD
    // Step 1: Fetch all issues with label "project"
    const projectIssues = await fetchGitHubAPI(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues?labels=project&state=all&per_page=100`);
=======
    console.log('🚀 === FETCHING GITHUB PROJECTS WITH SUB-ISSUES AND COMMENTS ===');
    console.log('Fetching from:', `${GITHUB_OWNER}/${GITHUB_REPO}`);
    
    // Step 1: Fetch all open issues with label "project" (closed issues are hidden)
    console.log('📋 Step 1: Fetching open issues with label "project"');
    const projectIssues = await fetchGitHubAPI(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues?labels=project&state=open&per_page=100`);
    console.log(`✅ Found ${projectIssues.length} open project issues`);
>>>>>>> 73564c9c9999fdc906ddf17546b10348a0bcfcab
    
    if (projectIssues.length === 0) {
      return { projects: [], articlesByProject: {}, commentsByProject: {} };
    }
    
    // Step 2: For each project, fetch its sub-issues and comments
    const articlesByProject: { [projectNumber: number]: GitHubIssue[] } = {};
    const commentsByProject: { [projectNumber: number]: GitHubComment[] } = {};
    
    for (const project of projectIssues) {
      const projectNumber = project.number;
      
      // Fetch sub-issues for this project
      const subIssues = await fetchGitHubAPI(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${projectNumber}/sub_issues`);
      
      if (subIssues.length > 0) {
        articlesByProject[projectNumber] = subIssues;
      } else {
        articlesByProject[projectNumber] = [];
      }
      
      // Fetch comments for this project
      const comments = await fetchGitHubAPI(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${projectNumber}/comments`);
      
      if (comments.length > 0) {
        commentsByProject[projectNumber] = comments;
      } else {
        commentsByProject[projectNumber] = [];
      }
    }
    
    return { projects: projectIssues, articlesByProject, commentsByProject };
  } catch (error) {
    console.error('❌ Error fetching GitHub projects with sub-issues and comments:', error);
    return { projects: [], articlesByProject: {}, commentsByProject: {} };
  }
}


// Fetch comments for a specific issue
export async function fetchIssueComments(issueNumber: number): Promise<GitHubComment[]> {
  try {
    return await fetchGitHubAPI(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${issueNumber}/comments`);
  } catch (error) {
    console.error(`Error fetching comments for issue ${issueNumber}:`, error);
    return [];
  }
}

// Create a new comment on an issue using user's access token
export async function createIssueCommentWithToken(issueNumber: number, body: string, accessToken: string): Promise<GitHubComment> {
  try {
    const url = `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${issueNumber}/comments`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'OpenFolio-App',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ body })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ GitHub API error: ${response.status} - ${errorText}`);
      throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
    }

    const comment = await response.json();
    return comment;
  } catch (error) {
    console.error(`❌ Error creating comment on issue ${issueNumber}:`, error);
    throw error;
  }
}

// Parse frontmatter from issue body
function parseFrontmatter(body: string): {frontmatter: Record<string, unknown>, content: string} {
  if (!body) return { frontmatter: {}, content: '' };
  
  // Try YAML frontmatter format first (---)
  const yamlFrontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const yamlMatch = body.match(yamlFrontmatterRegex);
  
  if (yamlMatch) {
    const frontmatterText = yamlMatch[1];
    const content = yamlMatch[2];
    
    const frontmatter: Record<string, unknown> = {};
    const lines = frontmatterText.split('\n');
    
    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) continue;
      
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // Remove quotes
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      // Parse arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        try {
          value = JSON.parse(value);
        } catch {
          // If JSON parsing fails, treat as string
        }
      }
      
      frontmatter[key] = value;
    }
    
    return { frontmatter, content };
  }
  
  // Try key: value format (no ---)
  const keyValueRegex = /^([^:\n]+:[^\n]*\n?)+/;
  const keyValueMatch = body.match(keyValueRegex);
  
  if (keyValueMatch) {
    const frontmatterText = keyValueMatch[0];
    const content = body.substring(frontmatterText.length);
    
    const frontmatter: Record<string, unknown> = {};
    const lines = frontmatterText.split('\n');
    
    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) continue;
      
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // Remove quotes
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      // Parse arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        try {
          value = JSON.parse(value);
        } catch {
          // If JSON parsing fails, treat as string
        }
      }
      
      frontmatter[key] = value;
    }
    
    return { frontmatter, content };
  }
  
  return { frontmatter: {}, content: body };
}

// Clean markdown content for project description (remove headers, keep only text)
function cleanMarkdownForDescription(content: string): string {
  if (!content) return 'Brak opisu projektu';
  
  // Remove markdown headers (##, ###, etc.)
  let cleaned = content.replace(/^#{1,6}\s+/gm, '');
  
  // Remove markdown links but keep the text
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // Remove markdown bold/italic formatting
  cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '$1');
  cleaned = cleaned.replace(/\*([^*]+)\*/g, '$1');
  
  // Remove code blocks
  cleaned = cleaned.replace(/```[\s\S]*?```/g, '');
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');
  
  // Remove extra whitespace and newlines
  cleaned = cleaned.replace(/\n\s*\n/g, '\n');
  cleaned = cleaned.trim();
  
  // Get first paragraph or first 200 characters
  const firstParagraph = cleaned.split('\n')[0];
  if (firstParagraph.length > 200) {
    return firstParagraph.substring(0, 200) + '...';
  }
  
  return firstParagraph || cleaned.substring(0, 200) + '...';
}

// Convert GitHub issue to Project format
export function convertGitHubIssueToProject(issue: GitHubIssue): {id: string, title: string, description: string, thumbnailImage: string, mainImage: string, technologies: string[], status: string, githubUrl: string, liveUrl?: string, comments: unknown[], entries: unknown[]} {
  const { frontmatter, content } = parseFrontmatter(issue.body || '');
  
  // Create slug from title
  const slug = issue.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
  
  const projectData = {
    id: issue.number.toString(), // Use issue number as ID
    title: (frontmatter.title as string) || issue.title,
    description: cleanMarkdownForDescription(content || issue.body || ''),
    thumbnailImage: (frontmatter.thumbnailImage as string) || '/next.svg',
    mainImage: (frontmatter.mainImage as string) || '/next.svg',
    technologies: (frontmatter.technologies as string[]) || issue.labels.map(label => label.name),
    status: (frontmatter.status as string) || (issue.state === 'closed' ? 'completed' : 'in-progress'),
    githubUrl: issue.html_url,
    liveUrl: (frontmatter.liveUrl as string) || extractLiveUrl(issue.body),
    comments: [], // Will be loaded separately
    entries: [] // Will be loaded from related issues
  };

  return projectData;
}

// Extract live URL from issue body
function extractLiveUrl(body: string): string | undefined {
  if (!body) return undefined;
  
  // Look for common URL patterns
  const urlPatterns = [
    /(?:live|demo|url|link):\s*(https?:\/\/[^\s]+)/i,
    /(?:https?:\/\/[^\s]+)/g
  ];
  
  for (const pattern of urlPatterns) {
    const match = body.match(pattern);
    if (match) {
      return match[1] || match[0];
    }
  }
  
  return undefined;
}

// Convert GitHub issue to Article format
export function convertGitHubIssueToArticle(issue: GitHubIssue): {id: string, title: string, content: string, date: string, image?: string, version?: string, comments: unknown[], status?: string} {
  const { frontmatter, content } = parseFrontmatter(issue.body || '');
  
  const article = {
    id: issue.number.toString(), // Use issue number as ID
    title: (frontmatter.title as string) || issue.title,
    content: content || issue.body || '',
    date: (frontmatter.date as string) || issue.created_at,
    image: frontmatter.image as string | undefined,
    version: frontmatter.version as string | undefined,
    status: (frontmatter.status as string) || (issue.state === 'closed' ? 'completed' : undefined),
    comments: []
  };
  
  return article;
}


// Convert GitHub comment to Comment format
export function convertGitHubCommentToComment(comment: GitHubComment): {id: string, author: string, content: string, date: string, likes: number, isLiked: boolean, githubUrl: string, avatar: string} {
  return {
    id: comment.id.toString(),
    author: comment.user.login,
    content: comment.body,
    date: comment.created_at,
    likes: 0, // GitHub doesn't have likes, could use reactions API
    isLiked: false,
    githubUrl: comment.html_url,
    avatar: comment.user.avatar_url
  };
}
