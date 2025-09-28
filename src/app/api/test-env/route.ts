import { NextResponse } from 'next/server';

export async function GET() {
  console.log('=== TEST ENV API ROUTE ===');
  console.log('GITHUB_TOKEN:', process.env.GITHUB_TOKEN ? 'SET' : 'NOT SET');
  console.log('NEXT_PUBLIC_GITHUB_USERNAME:', process.env.NEXT_PUBLIC_GITHUB_USERNAME);
  console.log('NEXT_PUBLIC_GITHUB_REPO:', process.env.NEXT_PUBLIC_GITHUB_REPO);
  
  return NextResponse.json({
    GITHUB_TOKEN: process.env.GITHUB_TOKEN ? 'SET' : 'NOT SET',
    GITHUB_TOKEN_LENGTH: process.env.GITHUB_TOKEN ? process.env.GITHUB_TOKEN.length : 0,
    NEXT_PUBLIC_GITHUB_USERNAME: process.env.NEXT_PUBLIC_GITHUB_USERNAME,
    NEXT_PUBLIC_GITHUB_REPO: process.env.NEXT_PUBLIC_GITHUB_REPO,
    ALL_ENV_VARS: Object.keys(process.env).filter(key => key.includes('GITHUB'))
  });
}
