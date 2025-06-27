@echo off
echo Starting SkinVision-AI Application...
echo.

echo Step 1: Installing Python dependencies...
cd backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Error installing Python dependencies!
    pause
    exit /b 1
)

echo.
echo Step 2: Starting Flask backend server...
start "Flask Backend" cmd /k "python app.py"

echo.
echo Step 3: Starting Next.js frontend server...
cd ..\frontend
start "Next.js Frontend" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo.
echo Press any key to exit this window (servers will continue running)
pause > nul
