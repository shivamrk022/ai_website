@echo off
cd /d "%~dp0"
echo.
echo ===================================
echo   SHIVAM AI - Auto Push to GitHub
echo ===================================
echo.

:: Stage all changes
git add -A

:: Check if there's anything to commit
git diff --cached --quiet
if %ERRORLEVEL% == 0 (
    echo [INFO] No changes to push. Everything is up to date.
    pause
    exit /b 0
)

:: Ask for commit message
set /p MSG=Enter commit message (or press Enter for auto message): 
if "%MSG%"=="" (
    for /f "tokens=1-4 delims=/ " %%a in ('date /t') do set DATE=%%a-%%b-%%c
    for /f "tokens=1-2 delims=: " %%a in ('time /t') do set TIME=%%a:%%b
    set MSG=Update - %DATE% %TIME%
)

:: Commit
git commit -m "%MSG%"

:: Push
echo.
echo [INFO] Pushing to GitHub...
git push origin main

if %ERRORLEVEL% == 0 (
    echo.
    echo [SUCCESS] Changes pushed to GitHub successfully!
) else (
    echo.
    echo [ERROR] Push failed. Check your internet connection or GitHub credentials.
)

echo.
pause
