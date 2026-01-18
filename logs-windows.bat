@echo off
chcp 65001 >nul
echo.
echo ====================================
echo   Logs do S.I.N.G.E.D INSS
echo ====================================
echo.
echo Pressione Ctrl+C para sair
echo.

REM Verifica se docker-compose está disponível
docker-compose --version >nul 2>&1
if errorlevel 1 (
    set DOCKER_COMPOSE=docker compose
) else (
    set DOCKER_COMPOSE=docker-compose
)

%DOCKER_COMPOSE% logs -f

exit /b 0
