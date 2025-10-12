import { NextRequest, NextResponse } from 'next/server';
import { fetchIssueComments, createIssueCommentWithToken, convertGitHubCommentToComment } from '../../../../../lib/github';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const issueNumber = parseInt(id);
    const comments = await fetchIssueComments(issueNumber);
    const convertedComments = comments.map(convertGitHubCommentToComment);
    
    return NextResponse.json(convertedComments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const issueNumber = parseInt(id);
    const { content, accessToken } = await request.json();
    
    console.log(`💬 API: Creating comment on issue #${issueNumber}`);
    console.log(`📝 API: Comment content: ${content.substring(0, 100)}${content.length > 100 ? '...' : ''}`);
    
    if (!content) {
      console.error('❌ API: Content is required');
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    if (!accessToken) {
      console.error('❌ API: Access token is required');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    console.log(`🔑 API: User access token provided:`, !!accessToken);
    
    const comment = await createIssueCommentWithToken(issueNumber, content, accessToken);
    const convertedComment = convertGitHubCommentToComment(comment);
    
    console.log(`✅ API: Comment created successfully with ID: ${comment.id}`);
    
    return NextResponse.json(convertedComment);
  } catch (error) {
    console.error('❌ API: Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
