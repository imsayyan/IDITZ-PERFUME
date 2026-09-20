@echo off
title Starting IDITZ PERFUME...
echo ========================================================
echo        IDITZ PERFUME - Starting Full-Stack Application
echo ========================================================
echo.

set PATH=C:\Users\sayya\AppData\Local\Programs\nodejs;%PATH%

echo Checking Backend Server (Port 5000)...
netstat -ano | findstr ":5000" >nul
if %errorlevel% neq 0 (
    echo Starting Backend on http://localhost:5000...
    start "IDITZ Backend" /b powershell -WindowStyle Hidden -Command "$env:Path = 'C:\Users\sayya\AppData\Local\Programs\nodejs;' + $env:Path; Set-Location 'D:\Photo\Perfume 19\backend'; node src/server.js"
) else (
    echo Backend is already running on port 5000.
)

echo Checking Frontend Server (Port 5173)...
netstat -ano | findstr ":5173" >nul
if %errorlevel% neq 0 (
    echo Starting Frontend on http://localhost:5173...
    start "IDITZ Frontend" /b powershell -WindowStyle Hidden -Command "$env:Path = 'C:\Users\sayya\AppData\Local\Programs\nodejs;' + $env:Path; Set-Location 'D:\Photo\Perfume 19\frontend'; npm.cmd run dev"
) else (
    echo Frontend is already running on port 5173.
)

echo.
echo Waiting 2 seconds for servers to ready...
timeout /t 2 /nobreak >nul

echo Opening IDITZ PERFUME in browser: http://localhost:5173
start http://localhost:5173

echo.
echo ========================================================
echo IDITZ PERFUME is live at http://localhost:5173
echo ========================================================
