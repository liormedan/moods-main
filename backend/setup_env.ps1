# PowerShell script to setup Python virtual environment for backend

Write-Host "🐍 Setting up Python environment for Backend..." -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
Write-Host "Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = py --version 2>&1
    Write-Host "✓ Found: $pythonVersion" -ForegroundColor Green
    $pythonCmd = "py"
} catch {
    try {
        $pythonVersion = python --version 2>&1
        Write-Host "✓ Found: $pythonVersion" -ForegroundColor Green
        $pythonCmd = "python"
    } catch {
        Write-Host "✗ Python not found! Please install Python first." -ForegroundColor Red
        Write-Host "  Download from: https://www.python.org/downloads/" -ForegroundColor Yellow
        exit 1
    }
}

# Check if venv already exists
if (Test-Path "venv") {
    Write-Host ""
    Write-Host "⚠ Virtual environment already exists!" -ForegroundColor Yellow
    $response = Read-Host "Do you want to recreate it? (y/N)"
    if ($response -eq "y" -or $response -eq "Y") {
        Write-Host "Removing existing venv..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force venv
    } else {
        Write-Host "Using existing venv..." -ForegroundColor Green
        Write-Host ""
        Write-Host "To activate the environment, run:" -ForegroundColor Cyan
        Write-Host "  .\venv\Scripts\Activate.ps1" -ForegroundColor White
        Write-Host ""
        Write-Host "Then install dependencies:" -ForegroundColor Cyan
        Write-Host "  pip install -r requirements.txt" -ForegroundColor White
        exit 0
    }
}

# Create virtual environment
Write-Host ""
Write-Host "Creating virtual environment..." -ForegroundColor Yellow
& $pythonCmd -m venv venv

if (-not (Test-Path "venv")) {
    Write-Host "✗ Failed to create virtual environment!" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Virtual environment created successfully!" -ForegroundColor Green

# Activate virtual environment
Write-Host ""
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

# Upgrade pip
Write-Host ""
Write-Host "Upgrading pip..." -ForegroundColor Yellow
& $pythonCmd -m pip install --upgrade pip --quiet

# Install dependencies
Write-Host ""
Write-Host "Installing dependencies from requirements.txt..." -ForegroundColor Yellow
pip install -r requirements.txt

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Setup completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Create .env file (see SETUP_PYTHON_ENV.md)" -ForegroundColor White
    Write-Host "2. Get Firebase Service Account Key" -ForegroundColor White
    Write-Host "3. Run backend: uvicorn backend.app.main:app --reload --port 8000" -ForegroundColor White
    Write-Host ""
    Write-Host "To activate this environment in the future, run:" -ForegroundColor Cyan
    Write-Host "  .\venv\Scripts\Activate.ps1" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "✗ Failed to install dependencies!" -ForegroundColor Red
    Write-Host "Please check the error messages above." -ForegroundColor Yellow
    exit 1
}

