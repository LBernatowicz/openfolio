// GitHub API integration for projects and comments
import 'dotenv/config';

// Debug environment variables
console.log('🔍 Environment variables check:');
console.log('GITHUB_TOKEN:', process.env.GITHUB_TOKEN ? 'SET' : 'NOT SET');
console.log('NEXT_PUBLIC_GITHUB_USERNAME:', process.env.NEXT_PUBLIC_GITHUB_USERNAME);
console.log('NEXT_PUBLIC_GITHUB_REPO:', process.env.NEXT_PUBLIC_GITHUB_REPO);

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
  console.log(`🌐 Making GitHub API request to: ${endpoint}`);
  console.log(`🔑 GITHUB_TOKEN exists:`, !!GITHUB_TOKEN);
  console.log(`🔑 GITHUB_TOKEN length:`, GITHUB_TOKEN ? GITHUB_TOKEN.length : 0);
  console.log(`🔑 GITHUB_OWNER:`, GITHUB_OWNER);
  console.log(`🔑 GITHUB_REPO:`, GITHUB_REPO);
  
  if (!GITHUB_TOKEN) {
    console.warn('⚠️ GITHUB_TOKEN is not set. GitHub API calls will likely fail.');
    console.warn('🔧 Please check your .env.local file for GITHUB_TOKEN');
    // Return empty array instead of throwing error
    return [];
  }

  console.log(`Making request to: ${GITHUB_API_BASE}${endpoint}`);

  console.log(`Using GitHub token: ${GITHUB_TOKEN.substring(0, 10)}...`);

  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'OpenFolio-App'
    }
  });

  console.log(`GitHub API response status: ${response.status}`);

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`GitHub API error for ${endpoint}: ${response.status} - ${errorText}`);
    // Return empty array instead of throwing error
    return [];
  }

  const data = await response.json();
  console.log(`GitHub API response data length: ${Array.isArray(data) ? data.length : 'not array'}`);
  return data;
}

// Fetch projects with their sub-issues and comments from GitHub
export async function fetchGitHubProjectsWithArticles(): Promise<{ projects: GitHubIssue[], articlesByProject: { [projectNumber: number]: GitHubIssue[] }, commentsByProject: { [projectNumber: number]: GitHubComment[] } }> {
  try {
    console.log('🚀 === FETCHING GITHUB PROJECTS WITH SUB-ISSUES AND COMMENTS ===');
    console.log('Fetching from:', `${GITHUB_OWNER}/${GITHUB_REPO}`);
    
    // Step 1: Fetch all issues with label "project"
    console.log('📋 Step 1: Fetching issues with label "project"');
    const projectIssues = await fetchGitHubAPI(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues?labels=project&state=all&per_page=100`);
    console.log(`✅ Found ${projectIssues.length} project issues`);
    
    if (projectIssues.length === 0) {
      console.log('❌ No project issues found');
      return { projects: [], articlesByProject: {}, commentsByProject: {} };
    }
    
    // Log project issues
    projectIssues.forEach((issue: GitHubIssue, index: number) => {
      console.log(`Project ${index + 1}: #${issue.number} - ${issue.title}`);
      console.log(`  Labels: ${issue.labels.map(l => l.name).join(', ')}`);
    });
    
    // Step 2: For each project, fetch its sub-issues and comments
    console.log('📋 Step 2: Fetching sub-issues and comments for each project');
    const articlesByProject: { [projectNumber: number]: GitHubIssue[] } = {};
    const commentsByProject: { [projectNumber: number]: GitHubComment[] } = {};
    
    for (const project of projectIssues) {
      const projectNumber = project.number;
      console.log(`\n🔍 Processing project #${projectNumber}: ${project.title}`);
      
      // Fetch sub-issues for this project
      console.log(`  📝 Fetching sub-issues for project #${projectNumber}`);
      const subIssues = await fetchGitHubAPI(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${projectNumber}/sub_issues`);
      console.log(`  ✅ Found ${subIssues.length} sub-issues for project #${projectNumber}`);
      
      if (subIssues.length > 0) {
        articlesByProject[projectNumber] = subIssues;
        subIssues.forEach((subIssue: GitHubIssue, index: number) => {
          console.log(`    Sub-issue ${index + 1}: #${subIssue.number} - ${subIssue.title}`);
        });
      } else {
        articlesByProject[projectNumber] = [];
        console.log(`    No sub-issues found for project #${projectNumber}`);
      }
      
      // Fetch comments for this project
      console.log(`  💬 Fetching comments for project #${projectNumber}`);
      const comments = await fetchGitHubAPI(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${projectNumber}/comments`);
      console.log(`  ✅ Found ${comments.length} comments for project #${projectNumber}`);
      console.log(`  Comments data:`, comments);
      
      if (comments.length > 0) {
        commentsByProject[projectNumber] = comments;
        comments.forEach((comment: GitHubComment, index: number) => {
          console.log(`    Comment ${index + 1}: by ${comment.user.login} - ${comment.body.substring(0, 50)}...`);
        });
      } else {
        commentsByProject[projectNumber] = [];
        console.log(`    No comments found for project #${projectNumber}`);
      }
    }
    
    console.log('\n📊 Summary:');
    console.log('Projects with sub-issues:', Object.keys(articlesByProject).map(projectNum => ({
      project: projectNum,
      subIssues: articlesByProject[parseInt(projectNum)].length
    })));
    console.log('Projects with comments:', Object.keys(commentsByProject).map(projectNum => ({
      project: projectNum,
      comments: commentsByProject[parseInt(projectNum)].length
    })));
    
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
    console.log(`💬 Creating comment on issue #${issueNumber} with user token`);
    console.log(`📝 Comment content: ${body.substring(0, 100)}${body.length > 100 ? '...' : ''}`);
    console.log(`🔑 GITHUB_OWNER:`, GITHUB_OWNER);
    console.log(`🔑 GITHUB_REPO:`, GITHUB_REPO);
    
    const url = `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${issueNumber}/comments`;
    console.log(`🌐 Making POST request to: ${url}`);

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

    console.log(`📊 GitHub API response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ GitHub API error: ${response.status} - ${errorText}`);
      throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
    }

    const comment = await response.json();
    console.log(`✅ Comment created successfully with ID: ${comment.id}`);
    console.log(`🔗 Comment URL: ${comment.html_url}`);
    
    return comment;
  } catch (error) {
    console.error(`❌ Error creating comment on issue ${issueNumber}:`, error);
    throw error;
  }
}

// Parse frontmatter from issue body
function parseFrontmatter(body: string): any {
  if (!body) return { frontmatter: {}, content: '' };
  
  console.log('Parsing frontmatter from body:', body.substring(0, 200) + '...');
  
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = body.match(frontmatterRegex);
  
  if (!match) {
    console.log('No frontmatter found in body, using entire body as content');
    return { frontmatter: {}, content: body };
  }
  
  const frontmatterText = match[1];
  const content = match[2];
  
  console.log('Frontmatter text:', frontmatterText);
  console.log('Content after frontmatter:', content.substring(0, 100) + '...');
  
  const frontmatter: any = {};
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
    console.log(`Parsed frontmatter key: ${key} = ${value}`);
  }
  
  console.log('Final frontmatter:', frontmatter);
  console.log('Final content length:', content.length);
  return { frontmatter, content };
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
export function convertGitHubIssueToProject(issue: GitHubIssue): any {
  console.log(`🔄 Converting project issue #${issue.number}: ${issue.title}`);
  console.log(`Issue body length: ${issue.body ? issue.body.length : 0}`);
  
  const { frontmatter, content } = parseFrontmatter(issue.body || '');
  console.log(`Parsed frontmatter:`, frontmatter);
  console.log(`Content length: ${content ? content.length : 0}`);
  
  // Create slug from title
  const slug = issue.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
  
  console.log(`Generated slug: ${slug}`);
  
  const projectData = {
    id: slug, // Use slug instead of issue number
    title: frontmatter.title || issue.title,
    description: cleanMarkdownForDescription(content || issue.body || ''),
    thumbnailImage: frontmatter.thumbnailImage || '/next.svg',
    mainImage: frontmatter.mainImage || '/next.svg',
    technologies: frontmatter.technologies || issue.labels.map(label => label.name),
    status: frontmatter.status || (issue.state === 'closed' ? 'completed' : 'in-progress'),
    githubUrl: issue.html_url,
    liveUrl: frontmatter.liveUrl || extractLiveUrl(issue.body),
    comments: [], // Will be loaded separately
    entries: [] // Will be loaded from related issues
  };

  console.log(`✅ Converted project:`, { id: projectData.id, title: projectData.title });
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
export function convertGitHubIssueToArticle(issue: GitHubIssue): any {
  console.log(`🔄 Converting article issue #${issue.number}: ${issue.title}`);
  console.log(`Issue body length: ${issue.body ? issue.body.length : 0}`);
  
  const { frontmatter, content } = parseFrontmatter(issue.body || '');
  console.log(`Parsed frontmatter:`, frontmatter);
  console.log(`Content length: ${content ? content.length : 0}`);
  
  const article = {
    id: issue.number.toString(), // Use issue number as ID
    title: frontmatter.title || issue.title,
    content: content || issue.body || '',
    date: frontmatter.date || issue.created_at,
    image: frontmatter.image,
    comments: []
  };
  
  console.log(`✅ Converted article:`, { id: article.id, title: article.title });
  return article;
}


// Convert GitHub comment to Comment format
export function convertGitHubCommentToComment(comment: GitHubComment): any {
  return {
    id: comment.id.toString(),
    author: comment.user.login,
    content: comment.body,
    date: comment.created_at,
    likes: 0, // GitHub doesn't have likes, could use reactions API
    isLiked: false,
    githubUrl: comment.html_url
  };
}
