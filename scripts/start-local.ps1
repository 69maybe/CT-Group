<#
.SYNOPSIS
  Start full local stack: PostgreSQL (Docker) -> Spring Boot :5000 -> Next.js :3000

.DESCRIPTION
  Run from repo root: .\scripts\start-local.ps1
#>
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$composeFile = Join-Path $root "docker-compose.dev.yml"
if (-not (Test-Path $composeFile)) {
    Write-Error "Missing docker-compose.dev.yml at $composeFile"
}

Write-Host "`n[1/4] Docker: PostgreSQL (ctgroup @ localhost:5433 -> container :5432)..." -ForegroundColor Cyan
docker compose -f $composeFile up -d

Write-Host "[2/4] Waiting for PostgreSQL..." -ForegroundColor Cyan
$deadline = (Get-Date).AddSeconds(90)
$ready = $false
while ((Get-Date) -lt $deadline) {
    $null = docker exec ctgroup-postgres pg_isready -U postgres -d ctgroup 2>$null
    if ($LASTEXITCODE -eq 0) {
        $ready = $true
        break
    }
    Start-Sleep -Seconds 2
}
if (-not $ready) {
    Write-Error "PostgreSQL did not respond within 90s. Is Docker Desktop running?"
}
Write-Host "       PostgreSQL OK." -ForegroundColor Green

Write-Host "[3/4] Backend Spring Boot (profile dev mac dinh trong application.yml)..." -ForegroundColor Cyan
$backendDir = (Join-Path $root "backend") -replace "'", "''"
$backendCmd = "Set-Location -LiteralPath '$backendDir'; Write-Host 'Backend http://localhost:5000' -ForegroundColor Green; mvn spring-boot:run"
Start-Process powershell -ArgumentList @("-NoExit", "-Command", $backendCmd)

$apiUrl = "http://localhost:5000/api/public/business-sectors"
Write-Host "       Waiting for API: $apiUrl ..." -ForegroundColor DarkGray
$deadline = (Get-Date).AddSeconds(180)
$apiOk = $false
while ((Get-Date) -lt $deadline) {
    try {
        $r = Invoke-WebRequest -Uri $apiUrl -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
        if ($r.StatusCode -eq 200) {
            $apiOk = $true
            break
        }
    } catch {
        Start-Sleep -Seconds 3
    }
}
if (-not $apiOk) {
    Write-Warning "API not ready after 180s. Check the backend window (port 5432, Java, Maven)."
} else {
    Write-Host "       API OK (business-sectors)." -ForegroundColor Green
}

Write-Host "[4/4] Frontend Next.js (npm run dev)..." -ForegroundColor Cyan
$frontendDir = (Join-Path $root "frontend") -replace "'", "''"
$frontendCmd = "Set-Location -LiteralPath '$frontendDir'; Write-Host 'Frontend http://localhost:3000' -ForegroundColor Green; npm run dev"
Start-Process powershell -ArgumentList @("-NoExit", "-Command", $frontendCmd)

Write-Host ""
Write-Host "Done." -ForegroundColor Green
Write-Host "  Web:       http://localhost:3000"
Write-Host "  API:       http://localhost:5000"
Write-Host "  Postgres:  localhost:5433  db=ctgroup  user=postgres  password=postgres"
Write-Host "  Seed:      First empty DB gets sectors, articles, roles, admin (see backend logs)."
Write-Host ""
