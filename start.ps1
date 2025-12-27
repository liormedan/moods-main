# Moods Enter - Start Script
# מריץ את ה-Backend וה-Frontend יחד

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Moods Enter - Starting Application" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get the script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# Check if backend venv exists
Write-Host "Checking backend setup..." -ForegroundColor Yellow
if (-not (Test-Path "backend\venv")) {
    Write-Host "ERROR: Backend venv not found!" -ForegroundColor Red
    Write-Host "Please run: cd backend; py -m venv venv; .\venv\Scripts\Activate.ps1; pip install -r requirements.txt" -ForegroundColor Yellow
    exit 1
}

# Check if .env exists
if (-not (Test-Path "backend\.env")) {
    Write-Host "WARNING: backend\.env not found!" -ForegroundColor Yellow
    Write-Host "The backend might not work without environment variables." -ForegroundColor Yellow
}

# Check if node_modules exists
Write-Host "Checking frontend setup..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install frontend dependencies!" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Starting Backend..." -ForegroundColor Green
Write-Host "  URL: http://localhost:8000" -ForegroundColor Gray
Write-Host "  Docs: http://localhost:8000/docs" -ForegroundColor Gray
Write-Host ""

# Start Backend in new window
$backendScript = @"
cd `"$scriptDir`"
`$env:Path = `"$scriptDir\backend\venv\Scripts;`$env:Path`"
& `"$scriptDir\backend\venv\Scripts\python.exe`" -m uvicorn backend.app.main:app --reload --port 8000
pause
"@

$backendScriptPath = "$env:TEMP\start-backend.ps1"
$backendScript | Out-File -FilePath $backendScriptPath -Encoding UTF8

Start-Process powershell -ArgumentList "-NoExit", "-File", $backendScriptPath

# Wait a bit for backend to start
Start-Sleep -Seconds 3

Write-Host "Starting Frontend..." -ForegroundColor Green
Write-Host "  URL: http://localhost:3000" -ForegroundColor Gray
Write-Host ""

# Start Frontend in new window
$frontendScript = @"
cd `"$scriptDir`"
pnpm dev
pause
"@

$frontendScriptPath = "$env:TEMP\start-frontend.ps1"
$frontendScript | Out-File -FilePath $frontendScriptPath -Encoding UTF8

Start-Process powershell -ArgumentList "-NoExit", "-File", $frontendScriptPath

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Application Started!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  http://localhost:8000" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "Docs:     http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host ""
Write-Host "Two PowerShell windows opened:" -ForegroundColor Cyan
Write-Host "  - Backend window (port 8000)" -ForegroundColor White
Write-Host "  - Frontend window (port 3000)" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C in each window to stop." -ForegroundColor Gray
Write-Host ""

