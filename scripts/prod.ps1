# Production startup script for Acquisition App
# This script starts the application in production mode with Neon Cloud

Write-Host "🚀 Starting Acquisition App in Production Mode" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# Check if .env.production exists
if (-not (Test-Path ".env.production")) {
    Write-Host "❌ Error: .env.production file not found!" -ForegroundColor Red
    Write-Host "   Please create .env.production with your Neon Cloud DATABASE_URL." -ForegroundColor Yellow
    exit 1
}

# Check if Docker is running
try {
    docker info 2>$null | Out-Null
    if ($LASTEXITCODE -ne 0) { throw }
} catch {
    Write-Host "❌ Error: Docker is not running!" -ForegroundColor Red
    Write-Host "   Please start Docker Desktop and try again." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "📦 Building and starting production container..." -ForegroundColor Yellow
Write-Host "   - Connecting directly to Neon Cloud database"
Write-Host ""

# Start production environment in detached mode
docker compose -f docker-compose.prod.yml up --build -d

Write-Host ""
Write-Host "🎉 Production environment started!" -ForegroundColor Green
Write-Host "   Application: http://localhost:3000"
Write-Host ""
Write-Host "To view logs: docker compose -f docker-compose.prod.yml logs -f" -ForegroundColor Cyan
Write-Host "To stop: docker compose -f docker-compose.prod.yml down" -ForegroundColor Cyan
