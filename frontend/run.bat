@echo off
echo Starting Main Frontend (Port 3000)...
cd /d "%~dp0"
npm install && npm run dev
pause
