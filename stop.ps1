# Moods Enter - Stop Script
# עוצר את כל ה-processes של Backend ו-Frontend

Write-Host ""
Write-Host "Stopping Moods Enter application..." -ForegroundColor Yellow
Write-Host ""

# Stop uvicorn processes (Backend)
$uvicornProcesses = Get-Process -Name "python" -ErrorAction SilentlyContinue | Where-Object {
    $_.CommandLine -like "*uvicorn*" -or $_.CommandLine -like "*backend*"
}

if ($uvicornProcesses) {
    Write-Host "Stopping Backend (uvicorn)..." -ForegroundColor Yellow
    $uvicornProcesses | Stop-Process -Force
    Write-Host "  Backend stopped" -ForegroundColor Green
} else {
    Write-Host "  No Backend process found" -ForegroundColor Gray
}

# Stop Node processes (Frontend)
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
    $_.CommandLine -like "*next*" -or $_.CommandLine -like "*dev*"
}

if ($nodeProcesses) {
    Write-Host "Stopping Frontend (Node)..." -ForegroundColor Yellow
    $nodeProcesses | Stop-Process -Force
    Write-Host "  Frontend stopped" -ForegroundColor Green
} else {
    Write-Host "  No Frontend process found" -ForegroundColor Gray
}

# Alternative: Stop by port
Write-Host ""
Write-Host "Checking ports 8000 and 3000..." -ForegroundColor Yellow

$port8000 = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if ($port8000) {
    $pid8000 = $port8000.OwningProcess
    Write-Host "  Stopping process on port 8000 (PID: $pid8000)..." -ForegroundColor Yellow
    Stop-Process -Id $pid8000 -Force -ErrorAction SilentlyContinue
}

$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port3000) {
    $pid3000 = $port3000.OwningProcess
    Write-Host "  Stopping process on port 3000 (PID: $pid3000)..." -ForegroundColor Yellow
    Stop-Process -Id $pid3000 -Force -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "Done!" -ForegroundColor Green
Write-Host ""

