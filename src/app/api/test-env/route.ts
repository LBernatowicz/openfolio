import { NextResponse } from 'next/server';
import { fetchGitHubProjectsWithArticles } from '../../../lib/github';

export async function GET() {
  console.log('=== TEST ENV API ROUTE ===');
  console.log('GITHUB_TOKEN:', process.env.GITHUB_TOKEN ? 'SET' : 'NOT SET');
  console.log('NEXT_PUBLIC_GITHUB_USERNAME:', process.env.NEXT_PUBLIC_GITHUB_USERNAME);
  console.log('NEXT_PUBLIC_GITHUB_REPO:', process.env.NEXT_PUBLIC_GITHUB_REPO);
  
  // Test GitHub API connection
  let githubTest = {
    success: false,
    projectsCount: 0,
    error: null as string | null
  };
  
  try {
    const { projects } = await fetchGitHubProjectsWithArticles();
    githubTest = {
      success: true,
      projectsCount: projects.length,
      error: null
    };
  } catch (error) {
    githubTest = {
      success: false,
      projectsCount: 0,
      error: error instanceof Error ? error.message : String(error)
    };
  }
  
  return NextResponse.json({
    environment: {
      GITHUB_TOKEN: process.env.GITHUB_TOKEN ? 'SET' : 'NOT SET',
      GITHUB_TOKEN_LENGTH: process.env.GITHUB_TOKEN ? process.env.GITHUB_TOKEN.length : 0,
      NEXT_PUBLIC_GITHUB_USERNAME: process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'NOT SET',
      NEXT_PUBLIC_GITHUB_REPO: process.env.NEXT_PUBLIC_GITHUB_REPO || 'NOT SET',
      NODE_ENV: process.env.NODE_ENV,
      ALL_GITHUB_ENV_VARS: Object.keys(process.env).filter(key => key.includes('GITHUB'))
    },
    githubTest
  });
}
