#!/bin/bash
# Build Frontend for Production with SSL
# This script builds the React frontend and prepares it for deployment

echo "Building JobTrackr Frontend for Production..."

# Set API URL (update if your SSL domain is different)
API_URL="https://isjpreenrollnow.me/api"

# Navigate to frontend directory
cd frontend || exit

echo "Installing dependencies..."
npm ci

echo "Building for production with API URL: $API_URL"
VITE_API_BASE_URL=$API_URL npm run build

echo ""
echo "Build completed successfully!"
echo "Build output is in: frontend/dist"
echo ""
echo "To deploy to your web server:"
echo "1. Copy the contents of frontend/dist to your web server root"
echo "   Example: sudo cp -r dist/* /var/www/html/"
echo "2. Configure your web server (Nginx/Apache) to serve the static files"
echo "3. Ensure SSL is configured for HTTPS"

# Return to root directory
cd ..
