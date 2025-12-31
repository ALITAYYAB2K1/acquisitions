# Development startup script for Acquisition App with Neon Local
# This script starts the application in development mode with Neon Local

Write-Host "Starting Acquisition App in Development Mode" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Check if .env.development exists
if (-not (Test-Path ".env.development")) {
    Write-Host "Error: .env.development file not found!" -ForegroundColor Red
    Write-Host "Please copy .env.development from the template and update with your Neon credentials." -ForegroundColor Yellow
    exit 1
}

# Check if Docker is running
try {
    docker info 2>$null | Out-Null
    if ($LASTEXITCODE -ne 0) { throw }
} catch {
    Write-Host "Error: Docker is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again." -ForegroundColor Yellow
    exit 1
}

# Create .neon_local directory if it doesn't exist
if (-not (Test-Path ".neon_local")) {
    New-Item -ItemType Directory -Path ".neon_local" | Out-Null
    Write-Host "Created .neon_local directory" -ForegroundColor Green
}

Write-Host ""
Write-Host "Building and starting development containers..." -ForegroundColor Yellow
Write-Host "Neon Local proxy will create an ephemeral database branch"
Write-Host "Application will run with hot reload enabled"
Write-Host ""

# Start development environment
docker compose -f docker-compose.dev.yml up --build
