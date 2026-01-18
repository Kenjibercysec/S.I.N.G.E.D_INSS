@echo off
chcp 65001 >nul
echo.
echo ====================================
echo   Parando S.I.N.G.E.D INSS
echo ====================================
echo.

REM Verifica se docker-compose está disponível
docker-compose --version >nul 2>&1
if errorlevel 1 (
    set DOCKER_COMPOSE=docker compose
) else (
    set DOCKER_COMPOSE=docker-compose
)

echo Parando o container...
%DOCKER_COMPOSE% down

if errorlevel 1 (
    echo.
    echo [ERRO] Falha ao parar o container!
    echo.
    pause
    exit /b 1
)

echo.
echo [OK] Container parado com sucesso!
echo.
pause
exit /b 0
