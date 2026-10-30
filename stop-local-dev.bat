@echo off
chcp 65001 >nul
title KU Warehouse - Stop Local Development
echo ========================================================
echo   Stopping KU Warehouse Local Services
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/2] Stopping Docker Database...
docker compose stop db

echo [2/2] Stopping Node processes on port 8000 and 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul

echo.
echo [OK] All local development services stopped.
echo ========================================================
timeout /t 3 >nul
