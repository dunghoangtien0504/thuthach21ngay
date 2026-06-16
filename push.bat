@echo off
chcp 65001 > nul
color 0A
echo ===================================================
echo   FORMEN SYSTEM - AUTOMATIC GIT DEPLOYMENT
echo ===================================================
echo.

:: Stage all changes
echo Staging all changes...
git add .
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Failed to stage changes.
    pause
    exit /b %errorlevel%
)

:: Get commit message
set "msg="
set /p msg="Enter commit message (press Enter for 'auto update'): "
if "%msg%"=="" set "msg=auto update: %date% %time%"

:: Commit changes
echo.
echo Committing changes with message: "%msg%"...
git commit -m "%msg%"
if %errorlevel% neq 0 (
    color 0E
    echo [WARNING] Nothing new to commit or commit failed.
)

:: Push to GitHub
echo.
echo Pushing to GitHub (origin/main)...
git push origin main
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Push failed. Please check your internet connection or credentials.
    pause
    exit /b %errorlevel%
)

color 0A
echo.
echo ===================================================
echo [SUCCESS] Pushed successfully! Deployment triggered.
echo ===================================================
echo.
pause
