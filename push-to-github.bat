@echo off
title Push IDITZ PERFUME to GitHub
cd /d "D:\Photo\Perfume 19"
set "PATH=C:\Users\sayya\AppData\Local\Programs\Git\cmd;C:\Users\sayya\AppData\Local\Programs\Git\mingw64\bin;%PATH%"

echo ===================================================
echo   Pushing IDITZ PERFUME to GitHub (imsayyan)
echo ===================================================
echo.
echo Connecting to https://github.com/imsayyan/IDITZ-PERFUME.git ...
echo If a browser window appears, click "Authorize GitCredentialManager".
echo.

git push -u origin main

echo.
if %ERRORLEVEL% equ 0 (
    echo ===================================================
    echo   SUCCESS! Your project is now live on GitHub!
    echo   https://github.com/imsayyan/IDITZ-PERFUME
    echo ===================================================
) else (
    echo ===================================================
    echo Push could not complete automatically.
    echo.
    echo If prompted in the terminal:
    echo - Username: imsayyan
    echo - Password: Use a GitHub Personal Access Token (PAT)
    echo   from https://github.com/settings/tokens (with 'repo' checked)
    echo ===================================================
)
echo.
pause
