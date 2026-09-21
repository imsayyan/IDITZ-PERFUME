@echo off
title IDITZ PERFUME Launcher
cd /d "%~dp0"

echo ========================================================
echo        IDITZ PERFUME - Starting Local Application
echo ========================================================
echo.

set PATH=C:\Program Files\nodejs;C:\Users\sayya\AppData\Local\Programs\nodejs;%PATH%

:: 1. Check & Start Backend (Port 5000)
netstat -ano | findstr ":5000" >nul
if %errorlevel% neq 0 (
    echo [1/3] Starting Backend API on port 5000...
    start "IDITZ Backend" /min cmd /c "cd /d "%~dp0backend" && node src/server.js"
) else (
    echo [1/3] Backend is already running on port 5000.
)

:: 2. Check & Start Frontend (Port 5173)
netstat -ano | findstr ":5173" >nul
if %errorlevel% neq 0 (
    echo [2/3] Starting Frontend Store on port 5173...
    start "IDITZ Frontend" /min cmd /c "cd /d "%~dp0frontend" && npm.cmd run dev"
) else (
    echo [2/3] Frontend is already running on port 5173.
)

:: 3. Wait until server responds HTTP 200 before opening browser
echo [3/3] Waiting for website to be fully ready...
powershell -NoProfile -Command "for ($i=0; $i -lt 30; $i++) { try { $res = Invoke-WebRequest -Uri 'http://localhost:5173' -UseBasicParsing -TimeoutSec 1; if ($res.StatusCode -eq 200) { exit 0 } } catch {}; Start-Sleep -Milliseconds 600 }; exit 1"

echo.
echo ========================================================
echo   ✨ IDITZ PERFUME is live! Opening browser...
echo ========================================================
echo.
start http://localhost:5173
timeout /t 3 >nul
