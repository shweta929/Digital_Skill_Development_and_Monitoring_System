@echo off
setlocal
echo ============================================
echo   Career Portal - Complete System Startup
echo ============================================
echo.

echo [1/7] Starting PROJECT Backend (Auth - Port 5000)...
start "PROJECT-Backend" cmd /c ".\PROJECT\backend\run.bat"
timeout /t 5 /nobreak > nul

echo [2/7] Starting Project_Cdac Backend (Mentorship - Port 5001)...
start "Mentorship-Backend" cmd /c ".\Project_Cdac\backend\run.bat"
timeout /t 5 /nobreak > nul

echo [3/7] Starting AI Backend (Spring Boot - Port 8080)...
start "AI-Backend" cmd /c ".\career-ai-backend\run.bat"
timeout /t 10 /nobreak > nul

echo [4/7] Starting Admin Backend (Spring Boot - Port 8081)...
start "Admin-Backend" cmd /c ".\Admin\backend\run.bat"
timeout /t 5 /nobreak > nul

echo [5/7] Starting Resume Builder API (.NET - Port 5003)...
start "Resume-API" cmd /c ".\SmartResumeBuilder\run_api.bat"
timeout /t 5 /nobreak > nul

echo [6/7] Starting Resume Builder Web (.NET - Port 5002)...
start "Resume-Builder" cmd /c ".\SmartResumeBuilder\run_web.bat"
timeout /t 5 /nobreak > nul

echo [7/7] Starting Main Frontend (React/Vite - Port 3000)...
start "Integrated-Frontend" cmd /c ".\Project_Cdac\frontend\run.bat"

echo.
echo ============================================
echo   All services are launching in separate windows.
echo ============================================
echo.
echo   Summary:
echo   - Frontend:           http://localhost:3000
echo   - Auth Backend:       http://localhost:5000
echo   - Mentorship Backend: http://localhost:5001
echo   - AI Backend:         http://localhost:8080
echo   - Admin Backend:      http://localhost:8081
echo   - Resume Web:         http://localhost:5002
echo   - Resume API:         http://localhost:5003
echo.
echo   Check each window for any errors.
echo ============================================
pause
