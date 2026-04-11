# GreenLife Backend Deployment Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GreenLife Backend Deployment Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$appName = "greenlife-backend"

# Check if fly is installed
Write-Host "`n[1/5] Checking Fly CLI..." -ForegroundColor Yellow
$flyInstalled = Get-Command fly -ErrorAction SilentlyContinue
if (-not $flyInstalled) {
    Write-Host "Fly CLI not found. Installing..." -ForegroundColor Yellow
    try {
        Start-Process powershell -Verb RunAs -Wait -ArgumentList "-Command irm https://www.fly.io/install.ps1 | iex"
        Write-Host "Fly CLI installed successfully!" -ForegroundColor Green
    } catch {
        Write-Host "Failed to install Fly CLI. Please install manually: https://fly.io/docs/flyctl/install/" -ForegroundColor Red
        exit 1
    }
}

# Check login status
Write-Host "`n[2/5] Checking Fly.io login status..." -ForegroundColor Yellow
$loginStatus = fly auth whoami 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Not logged in. Please run 'fly auth login' first." -ForegroundColor Red
    exit 1
}
Write-Host "Logged in as: $loginStatus" -ForegroundColor Green

# Check if app exists
Write-Host "`n[3/5] Checking app status..." -ForegroundColor Yellow
$appStatus = fly apps list 2>$null | Select-String $appName
if ($appStatus) {
    Write-Host "App '$appName' exists." -ForegroundColor Green
} else {
    Write-Host "App '$appName' not found. Creating..." -ForegroundColor Yellow
    fly launch --name $appName --no-deploy --org personal
}

# Check if postgres is attached
Write-Host "`n[4/5] Checking database..." -ForegroundColor Yellow
$dbStatus = fly postgres list 2>$null | Select-String "greenlife"
if (-not $dbStatus) {
    Write-Host "PostgreSQL database 'greenlife' not found." -ForegroundColor Yellow
    Write-Host "Creating database..." -ForegroundColor Yellow
    fly postgres create --name greenlife --org personal --region sin
    fly postgres attach -a $appName greenlife
} else {
    Write-Host "PostgreSQL database found." -ForegroundColor Green
}

# Deploy
Write-Host "`n[5/5] Deploying application..." -ForegroundColor Yellow
try {
    fly deploy -a $appName --no-cache
    Write-Host "Deployment completed!" -ForegroundColor Green
} catch {
    Write-Host "Deployment failed: $_" -ForegroundColor Red
}

# Show logs
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Recent logs:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
fly logs -a $appName --no-tail -n 20
