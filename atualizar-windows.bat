@echo off
chcp 65001 >nul
echo.
echo ====================================
echo   Atualizando S.I.N.G.E.D INSS
echo ====================================
echo.

REM Verifica se é um repositório git
if exist ".git\" (
    echo [1/5] Baixando atualizações do repositório...
    git pull
    if errorlevel 1 (
        echo.
        echo [AVISO] Erro ao atualizar do repositório
        echo Deseja continuar mesmo assim? (S/N^)
        set /p resposta=
        if /i not "%resposta%"=="S" exit /b 1
    )
) else (
    echo [1/5] Não é um repositório git, pulando git pull
)

echo.
echo [2/5] Parando container atual...
docker-compose down

if errorlevel 1 (
    echo [ERRO] Falha ao parar container!
    pause
    exit /b 1
)

echo.
echo [3/5] Reconstruindo imagem Docker (pode demorar)...
docker-compose build --no-cache

if errorlevel 1 (
    echo [ERRO] Falha ao construir imagem!
    pause
    exit /b 1
)

echo.
echo [4/5] Iniciando container atualizado...
docker-compose up -d

if errorlevel 1 (
    echo [ERRO] Falha ao iniciar container!
    pause
    exit /b 1
)

echo.
echo [5/5] Verificando status...
docker-compose ps

echo.
echo ====================================
echo   Atualização concluída!
echo ====================================
echo.
echo Sistema disponível em: http://localhost:8080
echo.
echo Para ver logs: docker-compose logs -f
echo.
pause
exit /b 0
