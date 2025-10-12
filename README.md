# OpenFolio - Portfolio & Blog

Modern portfolio website with blog functionality, built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Git

### Local Development
```bash
# Clone repository
git clone https://github.com/your-username/openfolio.git
cd openfolio

# Install dependencies
bun install

# Start development server
bun run dev
```

### Production Deployment

#### Option 1: Docker Compose (Recommended)
```bash
# Copy environment variables
cp env.example .env
# Edit .env with your values
nano .env

# Deploy
chmod +x deploy.sh
./deploy.sh
```

#### Option 2: Manual Docker Compose
```bash
# Copy environment variables
cp env.example .env
# Edit .env with your values

# Build and start
docker-compose up -d --build
```

#### Option 3: Portainer
1. Upload `docker-compose.yml` to Portainer
2. Create stack with environment variables
3. Deploy

## 🔧 Configuration

### Required Environment Variables
- `NEXTAUTH_URL` - Your domain URL
- `NEXTAUTH_SECRET` - Random secret key
- `GITHUB_CLIENT_ID` - GitHub OAuth Client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth Client Secret
- `GITHUB_TOKEN` - GitHub API Token

### GitHub OAuth Setup
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create new OAuth App
3. Set Authorization callback URL: `https://your-domain.com/api/auth/callback/github`
4. Copy Client ID and Client Secret to `.env`

## 🤖 CI/CD Pipeline

The repository includes GitHub Actions workflow for automatic deployment:

1. Push to `main` branch triggers deployment
2. SSH to production server
3. Pull latest code
4. Rebuild and restart containers

### Required GitHub Secrets
- `PROD_HOST` - Production server IP/domain
- `PROD_USERNAME` - SSH username
- `PROD_SSH_KEY` - SSH private key

## 📁 Project Structure

```
src/
├── app/                 # Next.js app router
├── components/          # React components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── messages/           # i18n translations
└── types/              # TypeScript types
```

## 🌐 Features

- 🌍 Multi-language support (PL/EN)
- 📱 Responsive design
- 🔐 GitHub OAuth authentication
- 💬 Comment system
- 📝 Blog functionality
- 🎨 Modern UI with Tailwind CSS
- 🚀 Docker containerization
- 🔄 CI/CD pipeline

## 📄 License

MIT License - see LICENSE file for details