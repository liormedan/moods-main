@echo off
REM Moods Enter - Stop Script (Batch version)
REM עוצר את כל ה-processes של Backend ו-Frontend

echo.
echo Stopping Moods Enter application...
echo.

REM Stop processes on port 8000 (Backend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do (
    echo Stopping Backend on port 8000 (PID: %%a)...
    taskkill /F /PID %%a >nul 2>&1
)

REM Stop processes on port 3000 (Frontend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    echo Stopping Frontend on port 3000 (PID: %%a)...
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo Done!
echo.
pause

