@echo off
REM Space Debris Dashboard - Startup Script for Windows

echo.
echo ========================================
echo Space Debris Risk Intelligence Dashboard
echo ========================================
echo.

cd /d "%~dp0"

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/4] Checking Node.js installation...
node --version
echo.

REM Check if backend dependencies are installed
if not exist "backend\node_modules" (
    echo [2/4] Installing backend dependencies...
    cd backend
    call npm install
    cd ..
    echo.
) else (
    echo [2/4] Backend dependencies already installed
    echo.
)

REM Check if frontend dependencies are installed
if not exist "frontend\node_modules" (
    echo [3/4] Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
    echo.
) else (
    echo [3/4] Frontend dependencies already installed
    echo.
)

echo [4/4] Starting servers...
echo.
echo ========================================
echo Starting Backend Server (Port 5000)
echo Starting Frontend Server (Port 3000)
echo ========================================
echo.

REM Start backend in one window
start cmd /k "cd backend && npm run dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak

REM Start frontend in another window
start cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo Servers launching in new windows...
echo 
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo 
echo Press ENTER when ready to continue
echo ========================================
echo.
pause

exit /b 0
