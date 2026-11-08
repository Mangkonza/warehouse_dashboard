@echo off
chcp 65001 >nul
title KU Warehouse - Local Development Launcher
echo ========================================================
echo   KU Engineering Kamphaeng Saen Data Warehouse
echo   Fast Local Development Mode (Hot-Reload)
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Starting PostgreSQL in Docker (Port 5432)...
docker compose up -d db

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to start Docker database container.
    echo Please ensure Docker Desktop is running.
    pause
    exit /b %ERRORLEVEL%
)

echo [OK] PostgreSQL database is ready!
echo.

echo [2/3] Launching Backend API (tsx watch on port 8000)...
start "KU Backend API (Port 8000)" cmd /k "cd /d "%~dp0backend" && npm run dev"

echo [3/3] Launching Frontend Dashboard (Next.js on port 3000)...
start "KU Frontend Dashboard (Port 3000)" cmd /k "cd /d "%~dp0warehouse_dashboard" && npm run dev"

echo.
echo ========================================================
echo   All services launched!
echo   - Backend:  http://localhost:8000/api/v1/health
echo   - Frontend: http://localhost:3000/manage
echo   - Database: 127.0.0.1:5432
echo.
echo   Hot-Reload is active. Any code change will update instantly!
echo ========================================================
echo.
timeout /t 5 >nul
