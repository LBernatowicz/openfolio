// Test GitHub API connection
require('dotenv/config');

async function testGitHub() {
  console.log('Testing GitHub API connection...');
  console.log('GITHUB_TOKEN:', process.env.GITHUB_TOKEN ? 'SET' : 'NOT SET');
  console.log('GITHUB_TOKEN length:', process.env.GITHUB_TOKEN ? process.env.GITHUB_TOKEN.length : 0);

  if (process.env.GITHUB_TOKEN) {
    console.log('✅ GitHub token is available');
    
    // Test API call
    const GITHUB_OWNER = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'lukaszbernatowicz';
    const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO || 'openfolio';
    
    console.log(`Testing API call to: ${GITHUB_OWNER}/${GITHUB_REPO}`);
    
    try {
      // Use built-in fetch for Node 18+
      const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues?labels=project&state=all&per_page=10`, {
        headers: {
          'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'User-Agent': 'OpenFolio-Test'
        }
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Successfully fetched data from GitHub API');
        console.log('Number of issues:', data.length);
        if (data.length > 0) {
          console.log('First issue:', data[0].title);
        }
      } else {
        console.log('❌ Error from GitHub API:', response.status, response.statusText);
        const errorText = await response.text();
        console.log('Error details:', errorText);
      }
    } catch (error) {
      console.log('❌ Error making API call:', error.message);
    }
  } else {
    console.log('❌ GitHub token is not available');
  }
}

testGitHub();
