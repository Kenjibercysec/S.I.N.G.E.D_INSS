@echo off
chcp 65001 >nul
echo.
echo ====================================
echo   S.I.N.G.E.D INSS - Iniciador
echo ====================================
echo.

REM Verifica se o Docker está instalado
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Docker não está instalado!
    echo.
    echo Por favor, instale o Docker primeiro:
    echo   - Windows 10/11: https://www.docker.com/products/docker-desktop/
    echo   - Windows 7: https://github.com/docker-archive/toolbox/releases
    echo.
    echo Consulte: INSTALACAO-DOCKER.md
    pause
    exit /b 1
)

echo [OK] Docker encontrado
docker --version
echo.

REM Verifica se o Docker está rodando
docker ps >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Docker não está rodando!
    echo.
    echo Por favor, inicie o Docker Desktop e tente novamente.
    echo.
    pause
    exit /b 1
)

echo [OK] Docker está rodando
echo.

REM Verifica se docker-compose está disponível
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [AVISO] docker-compose não encontrado, tentando usar docker compose
    set DOCKER_COMPOSE=docker compose
) else (
    set DOCKER_COMPOSE=docker-compose
)

echo ====================================
echo   Iniciando o sistema...
echo ====================================
echo.

REM Cria a pasta data se não existir
if not exist "data\" mkdir data

REM Inicia o container
%DOCKER_COMPOSE% up -d

if errorlevel 1 (
    echo.
    echo [ERRO] Falha ao iniciar o container!
    echo.
    echo Tente executar manualmente:
    echo   docker-compose up -d
    echo.
    echo Ou veja os logs:
    echo   docker-compose logs
    echo.
    pause
    exit /b 1
)

echo.
echo ====================================
echo   Sistema iniciado com sucesso!
echo ====================================
echo.
echo Aguarde alguns segundos para o sistema inicializar...
timeout /t 5 /nobreak >nul
echo.
echo [OK] Sistema disponível em:
echo.
echo    http://localhost:8080
echo.
echo Login:
echo    Usuario: admin
echo    Senha:   inss
echo.
echo ====================================
echo.
echo Comandos úteis:
echo   - Ver logs:    docker-compose logs -f
echo   - Parar:       docker-compose down
echo   - Reiniciar:   docker-compose restart
echo.
echo Pressione qualquer tecla para abrir no navegador...
pause >nul

REM Tenta abrir o navegador
start http://localhost:8080

exit /b 0
