@echo off
REM Moods Enter - Start Script (Batch version)
REM מריץ את ה-Backend וה-Frontend יחד

echo.
echo ========================================
echo   Moods Enter - Starting Application
echo ========================================
echo.

REM Get the script directory
cd /d "%~dp0"

REM Check if backend venv exists
echo Checking backend setup...
if not exist "backend\venv" (
    echo ERROR: Backend venv not found!
    echo Please run: cd backend ^&^& py -m venv venv ^&^& .\venv\Scripts\activate.bat ^&^& pip install -r requirements.txt
    pause
    exit /b 1
)

REM Check if node_modules exists
echo Checking frontend setup...
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install frontend dependencies!
        pause
        exit /b 1
    )
)

echo.
echo Starting Backend...
echo   URL: http://localhost:8000
echo   Docs: http://localhost:8000/docs
echo.

REM Start Backend in new window
start "Moods Enter - Backend" cmd /k "cd /d %~dp0backend && .\venv\Scripts\activate.bat && uvicorn backend.app.main:app --reload --port 8000"

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

echo Starting Frontend...
echo   URL: http://localhost:3000
echo.

REM Start Frontend in new window
start "Moods Enter - Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ========================================
echo   Application Started!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo Docs:     http://localhost:8000/docs
echo.
echo Two command windows opened:
echo   - Backend window (port 8000)
echo   - Frontend window (port 3000)
echo.
echo Close the windows to stop the servers.
echo.
pause

