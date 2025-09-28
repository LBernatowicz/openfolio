// Data source configuration - switch between GitHub and mock data
import { mockProjects } from '../data/projects';

export const DATA_SOURCE = {
  GITHUB: 'github',
  MOCK: 'mock'
} as const;

export type DataSource = typeof DATA_SOURCE[keyof typeof DATA_SOURCE];

// Get data source from environment variable or default to mock
export function getDataSource(): DataSource {
  const dataSource = process.env.NEXT_PUBLIC_DATA_SOURCE;
  console.log('NEXT_PUBLIC_DATA_SOURCE:', dataSource);
  
  if (dataSource === 'github') {
    console.log('Using GitHub data source');
    return DATA_SOURCE.GITHUB;
  }
  
  console.log('Using mock data source');
  return DATA_SOURCE.MOCK;
}

// Check if GitHub is available on server-side (has token)
export function isGitHubAvailableServerSide(): boolean {
  const hasToken = !!process.env.GITHUB_TOKEN;
  const tokenLength = process.env.GITHUB_TOKEN ? process.env.GITHUB_TOKEN.length : 0;
  console.log('GITHUB_TOKEN available:', hasToken);
  console.log('GITHUB_TOKEN length:', tokenLength);
  console.log('GITHUB_TOKEN first 10 chars:', process.env.GITHUB_TOKEN ? process.env.GITHUB_TOKEN.substring(0, 10) + '...' : 'undefined');
  return hasToken;
}

// Check if GitHub integration is available
export function isGitHubAvailable(): boolean {
  // In client-side, we can't access server env vars directly
  // We'll check by trying to fetch from API and falling back to mock data
  const dataSource = getDataSource();
  console.log('Data source:', dataSource);
  const isAvailable = dataSource === DATA_SOURCE.GITHUB;
  console.log('GitHub available:', isAvailable);
  return isAvailable;
}

// Get fallback data when GitHub is not available
export function getFallbackProjects() {
  return mockProjects;
}
