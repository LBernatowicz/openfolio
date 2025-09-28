import { NextRequest, NextResponse } from 'next/server';
import { fetchIssueComments, createIssueComment, convertGitHubCommentToComment } from '../../../../../lib/github';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const issueNumber = parseInt(params.id);
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
  { params }: { params: { id: string } }
) {
  try {
    const issueNumber = parseInt(params.id);
    const { content } = await request.json();
    
    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }
    
    const comment = await createIssueComment(issueNumber, content);
    const convertedComment = convertGitHubCommentToComment(comment);
    
    return NextResponse.json(convertedComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
