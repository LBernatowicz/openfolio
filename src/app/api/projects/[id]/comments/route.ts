import { NextRequest, NextResponse } from 'next/server';
import { fetchIssueComments, createIssueCommentWithToken, convertGitHubCommentToComment } from '../../../../../lib/github';

// Function to get user avatar from GitHub API
async function getUserAvatarFromGitHub(username: string): Promise<string | null> {
  try {
    console.log(`🔍 Fetching avatar for user: ${username}`);
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      }
    });
    
    console.log(`📊 GitHub API response status for ${username}: ${response.status}`);
    
    if (response.ok) {
      const userData = await response.json();
      console.log(`✅ Avatar found for ${username}: ${userData.avatar_url}`);
      return userData.avatar_url;
    } else {
      console.log(`❌ No avatar found for ${username}: ${response.status}`);
    }
  } catch (error) {
    console.error(`❌ Error fetching avatar for ${username}:`, error);
  }
  
  return null;
}

// Function to generate avatar URL based on username
function generateAvatarUrl(username: string): string {
  // Use a service like Gravatar or generate initials-based avatar
  const initials = username.substring(0, 2).toUpperCase();
  const colors = ['FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FFEAA7', 'DDA0DD', '98D8C8', 'F7DC6F'];
  const colorIndex = username.charCodeAt(0) % colors.length;
  const backgroundColor = colors[colorIndex];
  
  return `https://ui-avatars.com/api/?name=${initials}&background=${backgroundColor}&color=fff&size=64`;
}

// Function to extract user info from comment content
function extractUserInfoFromComment(content: string) {
  console.log(`🔍 Extracting user info from comment: ${content.substring(0, 100)}...`);
  
  // More flexible regex to catch different line endings and whitespace
  const headerRegex = /^<!-- USER_INFO: (.+?) -->\s*\n?\s*([\s\S]*)$/;
  const match = content.match(headerRegex);
  
  if (match) {
    try {
      const userInfo = JSON.parse(match[1]);
      // Clean up the content - remove any leading/trailing whitespace
      const cleanContent = match[2].trim();
      
      console.log('✅ Extracted user info:', userInfo);
      console.log('✅ Clean content:', cleanContent);
      
      return { 
        userInfo, 
        cleanContent,
        hasCustomUser: true 
      };
    } catch (error) {
      console.error('❌ Error parsing user info:', error);
    }
  }
  
  console.log('❌ No user info header found in comment');
  
  // Return original content if no header found
  return { 
    userInfo: { username: null, avatar: null }, 
    cleanContent: content,
    hasCustomUser: false
  };
}

// Function to add user info header to comment content
function addUserInfoToComment(content: string, userInfo: any) {
  const header = `<!-- USER_INFO: ${JSON.stringify(userInfo)} -->\n`;
  return header + content;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const issueNumber = parseInt(id);
    const comments = await fetchIssueComments(issueNumber);
    
    // Process comments to extract user info from headers
    const processedComments = await Promise.all(comments.map(async comment => {
      const { userInfo, cleanContent, hasCustomUser } = extractUserInfoFromComment(comment.body);
      
      let avatarUrl = comment.user.avatar_url;
      
      if (hasCustomUser) {
        console.log(`👤 Processing custom user: ${userInfo.username}`);
        // For custom users, check if it's anonymous
        if (userInfo.isAnonymous) {
          console.log(`👻 Anonymous user, using placeholder`);
          // Use null for anonymous users to show placeholder icon
          avatarUrl = null;
        } else {
          console.log(`🔍 Authenticated user, trying GitHub API...`);
          // Try to get avatar from GitHub API for authenticated users
          const githubAvatar = await getUserAvatarFromGitHub(userInfo.username);
          if (githubAvatar) {
            console.log(`✅ GitHub avatar found: ${githubAvatar}`);
            avatarUrl = githubAvatar;
          } else {
            // Fallback to provided avatar or generate one
            avatarUrl = userInfo.avatar || generateAvatarUrl(userInfo.username);
            console.log(`🎨 Using fallback avatar: ${avatarUrl}`);
          }
        }
      } else {
        console.log(`👤 Using GitHub user: ${comment.user.login}`);
      }
      
      return {
        ...comment,
        body: cleanContent,
        user: {
          login: hasCustomUser ? userInfo.username : comment.user.login,
          avatar_url: avatarUrl
        }
      };
    }));
    
    const convertedComments = processedComments.map(comment => ({
      ...convertGitHubCommentToComment(comment),
      avatar: comment.user.avatar_url
    }));
    
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
    console.log('🚀 API: POST /api/projects/[id]/comments called');
    
    const { id } = await params;
    console.log(`🔍 API: Received id: ${id}`);
    
    const issueNumber = parseInt(id);
    console.log(`🔢 API: Parsed issue number: ${issueNumber}`);
    
    if (isNaN(issueNumber)) {
      console.error('❌ API: Invalid issue number:', id);
      return NextResponse.json(
        { error: 'Invalid issue number' },
        { status: 400 }
      );
    }
    
    const { content, accessToken, userInfo, isAnonymous } = await request.json();
    console.log(`💬 API: Creating comment on issue #${issueNumber}`);
    console.log(`📝 API: Comment content: ${content?.substring(0, 100)}${content?.length > 100 ? '...' : ''}`);
    console.log(`🔑 API: Access token provided:`, !!accessToken);
    console.log(`👤 API: User info:`, userInfo);
    console.log(`👻 API: Is anonymous:`, isAnonymous);
    
    if (!content) {
      console.error('❌ API: Content is required');
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    if (!accessToken && !isAnonymous) {
      console.error('❌ API: Access token is required for non-anonymous comments');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    console.log(`🔑 API: User access token provided:`, !!accessToken);
    console.log(`🔑 API: Access token length:`, accessToken?.length || 0);
    
    console.log('📞 API: Calling createIssueCommentWithToken...');
    
    // Use our admin token instead of user token for creating comments
    const adminToken = process.env.GITHUB_TOKEN;
    if (!adminToken) {
      console.error('❌ API: No admin token available');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }
    
    // Add user info header to comment content
    const commentWithHeader = addUserInfoToComment(content, {
      username: userInfo?.username || 'Anonimowy',
      avatar: userInfo?.avatar || null,
      isAnonymous: !!isAnonymous
    });
    
    console.log('📝 API: Comment with header:', commentWithHeader.substring(0, 200) + '...');
    
    const comment = await createIssueCommentWithToken(issueNumber, commentWithHeader, adminToken);
    console.log('✅ API: createIssueCommentWithToken completed');
    
    console.log('🔄 API: Converting comment...');
    // Override the comment with user info from session
    const commentWithUserInfo = {
      ...comment,
      body: content, // Use original content without header
      user: {
        login: userInfo?.username || 'Anonimowy',
        avatar_url: userInfo?.avatar || ''
      }
    };
    const convertedComment = convertGitHubCommentToComment(commentWithUserInfo);
    console.log('✅ API: Comment converted');
    
    console.log(`✅ API: Comment created successfully with ID: ${comment.id}`);
    
    return NextResponse.json(convertedComment);
  } catch (error) {
    console.error('❌ API: Error creating comment:', error);
    console.error('❌ API: Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Return detailed error for debugging
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';
    
    return NextResponse.json(
      { 
        error: 'Failed to create comment',
        details: errorMessage,
        stack: errorStack
      },
      { status: 500 }
    );
  }
}
