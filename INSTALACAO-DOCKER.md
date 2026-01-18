# 📦 Guia Rápido de Instalação do Docker

Este guia ajudará você a instalar o Docker na sua máquina para poder executar o S.I.N.G.E.D INSS.

## 🖥️ Windows

### Windows 10/11 Pro, Enterprise ou Education

1. **Requisitos mínimos**:
   - Windows 10 versão 2004 ou superior (Build 19041)
   - Windows 11
   - Virtualização habilitada na BIOS
   - Mínimo 4GB de RAM (recomendado 8GB)

2. **Instalar WSL2** (Windows Subsystem for Linux):
   
   Abra o PowerShell como Administrador e execute:
   ```powershell
   wsl --install
   ```
   
   Reinicie o computador quando solicitado.

3. **Baixar Docker Desktop**:
   - Acesse: https://www.docker.com/products/docker-desktop/
   - Clique em "Download for Windows"
   - Execute o instalador baixado (`Docker Desktop Installer.exe`)

4. **Instalação**:
   - Siga o assistente de instalação
   - Marque a opção "Use WSL 2 instead of Hyper-V"
   - Reinicie quando solicitado

5. **Verificar instalação**:
   
   Abra o PowerShell e execute:
   ```powershell
   docker --version
   docker-compose --version
   ```

### Windows 7/8/10 Home (Versões antigas)

⚠️ **ATENÇÃO**: Docker Desktop não funciona nessas versões!

**Opção 1: Docker Toolbox (descontinuado)**
- Download: https://github.com/docker-archive/toolbox/releases
- Usa VirtualBox para criar uma VM Linux
- Não é mais mantido oficialmente
- Funciona mas pode ter problemas

**Opção 2: Atualizar para Windows 10/11** (Recomendado)
- Windows 10 Home também funciona com WSL2
- Melhor desempenho e suporte

**Opção 3: Usar uma VM Linux**
- Instalar VirtualBox: https://www.virtualbox.org/
- Criar uma VM com Ubuntu
- Instalar Docker na VM (veja seção Linux abaixo)

## 🐧 Linux (Ubuntu/Debian)

### Método rápido (Ubuntu/Debian):

```bash
# Atualizar pacotes
sudo apt-get update

# Instalar Docker
sudo apt-get install -y docker.io

# Instalar Docker Compose
sudo apt-get install -y docker-compose

# Adicionar seu usuário ao grupo docker
sudo usermod -aG docker $USER

# IMPORTANTE: Faça logout e login novamente para aplicar as mudanças
```

### Verificar instalação:

```bash
docker --version
docker-compose --version
```

### Iniciar o serviço Docker:

```bash
sudo systemctl start docker
sudo systemctl enable docker
```

## 🍎 macOS

### Requisitos:
- macOS 11 (Big Sur) ou superior
- Hardware Apple de 2010 ou mais recente
- Mínimo 4GB de RAM

### Instalação:

1. **Baixar Docker Desktop**:
   - Acesse: https://www.docker.com/products/docker-desktop/
   - Clique em "Download for Mac"
   - Escolha a versão correta:
     - **Apple Silicon** (M1/M2/M3)
     - **Intel Chip**

2. **Instalar**:
   - Abra o arquivo `.dmg` baixado
   - Arraste o Docker para a pasta Applications
   - Abra o Docker da pasta Applications
   - Siga as instruções na tela

3. **Verificar**:
   ```bash
   docker --version
   docker-compose --version
   ```

## ✅ Testando a Instalação

Após instalar, teste se tudo está funcionando:

```bash
# Testar Docker
docker run hello-world

# Se aparecer "Hello from Docker!", está funcionando!
```

## 🚀 Próximos Passos

Depois de instalar o Docker, volte para o [README-DOCKER.md](README-DOCKER.md) para:
1. Construir e executar o container do S.I.N.G.E.D INSS
2. Acessar a aplicação em http://localhost:8080

## 🆘 Problemas Comuns

### Windows: "WSL 2 installation is incomplete"

```powershell
# Execute no PowerShell como Admin:
wsl --update
wsl --set-default-version 2
```

### Linux: "Permission denied"

```bash
# Adicione seu usuário ao grupo docker
sudo usermod -aG docker $USER

# Faça logout e login novamente
# Ou reinicie o sistema
```

### "Docker daemon is not running"

**Windows/Mac**: 
- Abra o Docker Desktop
- Aguarde ele inicializar completamente

**Linux**:
```bash
sudo systemctl start docker
sudo systemctl enable docker
```

### Porta 8080 já está em uso

```bash
# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 8080).OwningProcess

# Linux/Mac
lsof -i :8080

# Ou mude a porta no docker-compose.yml:
# ports:
#   - "8081:8080"  # Use 8081 no lugar de 8080
```

## 📚 Documentação Oficial

- Docker: https://docs.docker.com/
- Docker Compose: https://docs.docker.com/compose/
- WSL2: https://learn.microsoft.com/pt-br/windows/wsl/

## 💡 Dicas

1. **Windows**: O Docker Desktop precisa estar rodando para usar Docker
2. **Linux**: Sempre adicione seu usuário ao grupo docker
3. **Recursos**: Docker pode consumir bastante RAM, feche outros programas se necessário
4. **Firewall**: Pode precisar permitir Docker no firewall
5. **Antivírus**: Alguns antivírus podem interferir, adicione exceção se necessário

## 🎯 Configurações Recomendadas

### Docker Desktop (Windows/Mac):

1. Abra Docker Desktop
2. Vá em Settings/Preferences
3. Resources:
   - **CPUs**: 2-4 (dependendo da sua máquina)
   - **Memory**: 4-8 GB
   - **Disk**: 20 GB mínimo

## ✨ Pronto!

Agora você está pronto para rodar o S.I.N.G.E.D INSS em Docker! 🎉

Continue com o [README-DOCKER.md](README-DOCKER.md) para instruções de uso.
