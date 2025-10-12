#!/bin/bash

# Deploy script for OpenFolio
# Usage: ./deploy.sh

set -e

echo "🚀 Starting OpenFolio deployment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "📋 Please copy env.example to .env and fill in your values:"
    echo "   cp env.example .env"
    echo "   nano .env"
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose not found!"
    echo "📋 Please install docker-compose first"
    exit 1
fi

echo "📦 Building and starting containers..."

# Stop existing containers
docker-compose down || true

# Build and start containers
docker-compose up -d --build

echo "✅ Deployment completed!"
echo "🌐 Your app should be available at: http://localhost"
echo "📊 Check logs with: docker-compose logs -f"

# Show container status
echo "📋 Container status:"
docker-compose ps
