# Build Frontend for Production with SSL
# This script builds the React frontend and prepares it for deployment

Write-Host "Building JobTrackr Frontend for Production..." -ForegroundColor Cyan

# Set API URL (update if your SSL domain is different)
$API_URL = "https://isjpreenrollnow.me/api"

# Navigate to frontend directory
Set-Location frontend

Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm ci

Write-Host "Building for production with API URL: $API_URL" -ForegroundColor Yellow
$env:VITE_API_BASE_URL = $API_URL
npm run build

Write-Host "`nBuild completed successfully!" -ForegroundColor Green
Write-Host "Build output is in: frontend/dist" -ForegroundColor Green
Write-Host "`nTo deploy to your web server:" -ForegroundColor Cyan
Write-Host "1. Copy the contents of frontend/dist to your web server root (e.g., /var/www/html)" -ForegroundColor White
Write-Host "2. Configure your web server (Nginx/Apache) to serve the static files" -ForegroundColor White
Write-Host "3. Ensure SSL is configured for HTTPS" -ForegroundColor White

# Return to root directory
Set-Location ..
