#!/bin/bash
# Space Debris Dashboard - Startup Script for macOS/Linux

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo ""
echo "========================================"
echo "Space Debris Risk Intelligence Dashboard"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install from https://nodejs.org/"
    exit 1
fi

echo "[1/4] Checking Node.js installation..."
node --version
echo ""

# Install backend dependencies if needed
if [ ! -d "backend/node_modules" ]; then
    echo "[2/4] Installing backend dependencies..."
    cd backend
    npm install
    cd "$PROJECT_DIR"
    echo ""
else
    echo "[2/4] Backend dependencies already installed"
    echo ""
fi

# Install frontend dependencies if needed
if [ ! -d "frontend/node_modules" ]; then
    echo "[3/4] Installing frontend dependencies..."
    cd frontend
    npm install
    cd "$PROJECT_DIR"
    echo ""
else
    echo "[3/4] Frontend dependencies already installed"
    echo ""
fi

# Start servers
echo "[4/4] Starting servers..."
echo ""
echo "========================================"
echo "Starting Backend Server (Port 5000)"
echo "Starting Frontend Server (Port 3000)"
echo "========================================"
echo ""

# Start backend in background
cd "$PROJECT_DIR/backend"
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 2

# Start frontend
cd "$PROJECT_DIR/frontend"
npm start &
FRONTEND_PID=$!

# Handle cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT

echo ""
echo "========================================"
echo "Servers running in background..."
echo ""
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all servers"
echo "========================================"
echo ""

# Wait for both processes
wait
