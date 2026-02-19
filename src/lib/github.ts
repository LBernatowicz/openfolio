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
    console.warn('🔧 Please check your environment variables:');
    console.warn('   - Local: .env.local file');
    console.warn('   - Production (Vercel): Settings → Environment Variables');
    console.warn('   - Production (Docker): .env file or docker-compose.yml');
    // Return empty array instead of throwing error
    return [];
  }

  const url = `${GITHUB_API_BASE}${endpoint}`;
  console.log(`🌐 Fetching: ${url}`);

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'OpenFolio-App'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ GitHub API error for ${endpoint}: ${response.status} - ${errorText}`);
    
    // Log more details for debugging
    if (response.status === 404) {
      console.error(`   ℹ️  Endpoint not found - this might be expected for some endpoints (e.g., /sub_issues)`);
      console.error(`   📍 Requested: ${GITHUB_OWNER}/${GITHUB_REPO}`);
    } else if (response.status === 401 || response.status === 403) {
      console.error(`   ⚠️  Authentication error - check GITHUB_TOKEN permissions`);
      console.error(`   🔑 Token exists: ${!!GITHUB_TOKEN}, length: ${GITHUB_TOKEN?.length || 0}`);
    } else if (response.status === 422) {
      console.error(`   ⚠️  Validation error - check request parameters`);
      console.error(`   📍 Requested: ${GITHUB_OWNER}/${GITHUB_REPO}`);
    }
    
    // Return empty array instead of throwing error
    return [];
  }

  const data = await response.json();
  console.log(`✅ Successfully fetched data from ${endpoint} (${Array.isArray(data) ? data.length : 1} items)`);
  return data;
}

// Fetch projects with their sub-issues and comments from GitHub
export async function fetchGitHubProjectsWithArticles(): Promise<{ projects: GitHubIssue[], articlesByProject: { [projectNumber: number]: GitHubIssue[] }, commentsByProject: { [projectNumber: number]: GitHubComment[] } }> {
  try {
    console.log(`🔍 Fetching projects from: ${GITHUB_OWNER}/${GITHUB_REPO}`);
    console.log(`🔑 GITHUB_TOKEN exists: ${!!GITHUB_TOKEN}`);
    
    // Step 1: Fetch open issues with label "project" (exclude closed issues)
    const endpoint = `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues?labels=project&state=open&per_page=100`;
    console.log(`📡 Calling GitHub API: ${endpoint}`);
    
    const projectIssues = await fetchGitHubAPI(endpoint);
    
    console.log(`📦 Received ${projectIssues.length} issues from GitHub`);
    
    if (projectIssues.length === 0) {
      console.log('⚠️ No open issues found with label "project"');
      console.log(`📍 Checking repo: ${GITHUB_OWNER}/${GITHUB_REPO}`);
      console.log(`🔑 Token exists: ${!!GITHUB_TOKEN}`);
      
      // Try fetching open issues to see if any exist
      const allIssues = await fetchGitHubAPI(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues?state=open&per_page=10`);
      console.log(`📋 Total open issues in repo: ${allIssues.length}`);
      
      if (allIssues.length > 0) {
        console.log(`🏷️  First issue labels:`, allIssues[0]?.labels?.map((l: {name: string}) => l.name) || []);
        console.log(`📝 First issue title: ${allIssues[0]?.title || 'N/A'}`);
        console.log(`🔍 Looking for label "project" in all issues...`);
        
        // Check if any issues have the "project" label
        const issuesWithProjectLabel = allIssues.filter((issue: GitHubIssue) => 
          issue.labels?.some((label: {name: string}) => label.name.toLowerCase() === 'project')
        );
        console.log(`✅ Found ${issuesWithProjectLabel.length} issues with "project" label (but they might be closed)`);
      } else {
        console.log(`⚠️  No open issues found at all in repo ${GITHUB_OWNER}/${GITHUB_REPO}`);
        console.log(`💡 Check if repo name is correct and if issues exist`);
      }
      
      return { projects: [], articlesByProject: {}, commentsByProject: {} };
    }
    
    // Step 2: For each project, fetch its sub-issues and comments
    const articlesByProject: { [projectNumber: number]: GitHubIssue[] } = {};
    const commentsByProject: { [projectNumber: number]: GitHubComment[] } = {};
    
    for (const project of projectIssues) {
      const projectNumber = project.number;
      console.log(`📄 Processing project #${projectNumber}: ${project.title}`);
      
      // Fetch sub-issues for this project
      // Note: sub_issues endpoint might not be available in standard GitHub API
      // We'll try it, but if it fails, we'll use an alternative approach
      let subIssues: GitHubIssue[] = [];
      
      try {
        const subIssuesResponse = await fetchGitHubAPI(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${projectNumber}/sub_issues`);
        if (Array.isArray(subIssuesResponse) && subIssuesResponse.length > 0) {
          subIssues = subIssuesResponse;
          console.log(`  📝 Found ${subIssues.length} sub-issues via API for project #${projectNumber}`);
        } else {
          console.log(`  📝 No sub-issues found via API for project #${projectNumber}`);
        }
      } catch (subIssueError) {
        console.log(`  ⚠️ Sub-issues endpoint not available for project #${projectNumber}, trying alternative...`);
        // Alternative: Fetch open issues with label "article" and check if they reference this project
        // This is a fallback if sub_issues endpoint doesn't work
        try {
          const allArticles = await fetchGitHubAPI(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues?labels=article&state=open&per_page=100`);
          if (Array.isArray(allArticles)) {
            // Filter articles that might be related to this project
            // You can customize this logic based on your naming convention
            subIssues = allArticles.filter((article: GitHubIssue) => {
              // Check if article body or title references the project
              const projectRef = `#${projectNumber}`;
              return article.body?.includes(projectRef) || article.title?.includes(projectRef);
            });
            console.log(`  📝 Found ${subIssues.length} related articles for project #${projectNumber}`);
          }
        } catch (altError) {
          console.log(`  ⚠️ Alternative method also failed for project #${projectNumber}`);
        }
      }
      
      articlesByProject[projectNumber] = subIssues;
      
      // Fetch comments for this project
      try {
        const comments = await fetchGitHubAPI(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${projectNumber}/comments`);
        console.log(`  💬 Found ${comments.length} comments for project #${projectNumber}`);
        if (comments.length > 0) {
          commentsByProject[projectNumber] = comments;
        } else {
          commentsByProject[projectNumber] = [];
        }
      } catch (commentError) {
        console.log(`  ⚠️ Could not fetch comments for project #${projectNumber}:`, commentError);
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
export function convertGitHubIssueToProject(issue: GitHubIssue): {id: string, title: string, description: string, content?: string, thumbnailImage: string, mainImage: string, technologies: string[], status: string, githubUrl: string, liveUrl?: string, comments: unknown[], entries: unknown[]} {
  const { frontmatter, content } = parseFrontmatter(issue.body || '');
  
  // Create slug from title
  const slug = issue.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
  
  // Ensure technologies is always an array of strings
  let technologies: string[] = [];
  if (frontmatter.technologies) {
    if (Array.isArray(frontmatter.technologies)) {
      technologies = frontmatter.technologies.map(t => String(t));
    } else {
      technologies = [String(frontmatter.technologies)];
    }
  } else if (issue.labels && Array.isArray(issue.labels)) {
    technologies = issue.labels.map(label => String(label.name || label));
  }

  // Ensure description is always a string (short version for list view)
  const description = cleanMarkdownForDescription(content || issue.body || '');
  
  // Full content for detail page (without frontmatter, but with all markdown)
  const fullContent = content || issue.body || '';
  
  // Ensure title is always a string
  const title = String((frontmatter.title as string) || issue.title || 'Untitled Project');

  // Handle link field - if "link" exists in frontmatter, use it as liveUrl
  // Priority: frontmatter.link > frontmatter.liveUrl > extracted from body
  const projectLink = frontmatter.link 
    ? String(frontmatter.link) 
    : (frontmatter.liveUrl ? String(frontmatter.liveUrl) : extractLiveUrl(issue.body));

  const projectData = {
    id: issue.number.toString(), // Use issue number as ID
    title: title,
    description: String(description || 'Brak opisu projektu'),
    content: fullContent, // Full content for detail page
    thumbnailImage: String((frontmatter.thumbnailImage as string) || '/next.svg'),
    mainImage: String((frontmatter.mainImage as string) || '/next.svg'),
    technologies: technologies,
    status: String((frontmatter.status as string) || (issue.state === 'closed' ? 'completed' : 'in-progress')),
    githubUrl: String(issue.html_url || ''),
    liveUrl: projectLink,
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
