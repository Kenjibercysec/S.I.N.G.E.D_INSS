# 🐳 S.I.N.G.E.D INSS - Guia Docker

Este guia explica como executar o sistema S.I.N.G.E.D INSS usando Docker, permitindo que você rode a aplicação em qualquer máquina sem precisar instalar Python ou dependências manualmente.

## 📋 Requisitos

### Para Windows 10/11 (64-bit)
- **Docker Desktop for Windows**
  - Download: https://www.docker.com/products/docker-desktop/
  - Requer Windows 10/11 Pro, Enterprise ou Education (Build 19041 ou superior)
  - Requer WSL2 habilitado

### Para Windows 7/8 (Legacy)
- **Docker Toolbox** (descontinuado, mas funcional)
  - Download: https://github.com/docker-archive/toolbox/releases
  - Usa VirtualBox internamente
  - ⚠️ **Nota**: Docker Toolbox não é mais mantido oficialmente

### Para Linux
- **Docker Engine** + **Docker Compose**
  ```bash
  # Ubuntu/Debian
  sudo apt-get update
  sudo apt-get install docker.io docker-compose
  
  # Adicionar usuário ao grupo docker
  sudo usermod -aG docker $USER
  # Faça logout e login novamente
  ```

### Para macOS
- **Docker Desktop for Mac**
  - Download: https://www.docker.com/products/docker-desktop/

## 🚀 Como Usar

### Método 1: Usar Docker Compose (Recomendado)

1. **Navegue até o diretório do projeto**
   ```bash
   cd /caminho/para/S.I.N.G.E.D_INSS
   ```

2. **Construa e inicie o container**
   ```bash
   docker-compose up -d
   ```
   
   - O `-d` executa em segundo plano (modo detached)
   - Na primeira execução, irá baixar a imagem Python e instalar todas as dependências
   - Isso pode levar alguns minutos

3. **Acesse a aplicação**
   - Abra seu navegador
   - Acesse: `http://localhost:8080`
   - Login admin: 
     - Usuário: `admin`
     - Senha: `inss`

4. **Para parar o container**
   ```bash
   docker-compose down
   ```

5. **Para ver os logs**
   ```bash
   docker-compose logs -f
   ```

6. **Para reiniciar**
   ```bash
   docker-compose restart
   ```

### Método 2: Usar Docker Diretamente

1. **Construir a imagem**
   ```bash
   docker build -t singed-inss .
   ```

2. **Executar o container**
   ```bash
   docker run -d \
     --name singed-inss \
     -p 8080:8080 \
     -v $(pwd)/data:/app/data \
     -v $(pwd)/static/options.json:/app/static/options.json \
     singed-inss
   ```

3. **Para Windows (PowerShell)**
   ```powershell
   docker run -d `
     --name singed-inss `
     -p 8080:8080 `
     -v ${PWD}/data:/app/data `
     -v ${PWD}/static/options.json:/app/static/options.json `
     singed-inss
   ```

## 🔧 Comandos Úteis

### Ver containers em execução
```bash
docker ps
```

### Ver todos os containers (incluindo parados)
```bash
docker ps -a
```

### Parar o container
```bash
docker stop singed-inss
```

### Iniciar o container novamente
```bash
docker start singed-inss
```

### Remover o container
```bash
docker rm singed-inss
```

### Remover a imagem
```bash
docker rmi singed-inss
```

### Acessar o shell dentro do container
```bash
docker exec -it singed-inss bash
```

### Ver logs em tempo real
```bash
docker logs -f singed-inss
```

### Reconstruir após mudanças no código
```bash
docker-compose up -d --build
```

## 💾 Persistência de Dados

Os dados são salvos em volumes Docker, garantindo que:
- O banco de dados SQLite persiste entre reinicializações
- As configurações em `static/options.json` são mantidas
- Os dados não são perdidos ao atualizar o container

Localização dos dados:
- `./data/` - Banco de dados SQLite
- `./static/options.json` - Configurações da aplicação

## 🌐 Acessando de Outras Máquinas na Rede

Para acessar de outros computadores na mesma rede:

1. **Descubra o IP da máquina host**
   - Windows: `ipconfig`
   - Linux/Mac: `ip addr` ou `ifconfig`

2. **Acesse usando o IP**
   - Exemplo: `http://192.168.1.100:8080`

3. **Configure o firewall**
   - Permita conexões na porta 8080
   - Windows: Painel de Controle > Firewall > Permitir aplicativo
   - Linux: `sudo ufw allow 8080`

## 🔄 Atualizando a Aplicação

Quando houver mudanças no código:

```bash
# Parar o container atual
docker-compose down

# Puxar as últimas mudanças (se usando git)
git pull

# Reconstruir e iniciar
docker-compose up -d --build
```

## ⚠️ Solução de Problemas

### Porta 8080 já está em uso
```bash
# Encontrar o processo usando a porta
# Windows
netstat -ano | findstr :8080

# Linux/Mac
lsof -i :8080

# Matar o processo ou mudar a porta no docker-compose.yml
```

### Container não inicia
```bash
# Ver logs para diagnóstico
docker-compose logs

# Verificar se o Docker está rodando
docker ps

# Reiniciar o Docker Desktop (Windows/Mac)
```

### Erro de permissão no Linux
```bash
# Adicionar seu usuário ao grupo docker
sudo usermod -aG docker $USER

# Fazer logout e login novamente
```

### Banco de dados não persiste
```bash
# Verificar se a pasta data/ existe
mkdir -p data

# Verificar permissões
chmod 755 data/
```

## 📊 Recursos do Sistema

Após iniciar, você terá acesso a:
- **Dashboard**: Visualização de todos os dispositivos
- **Cadastro**: Adicionar novos PCs e dispositivos
- **Busca**: Filtros avançados
- **Admin**: Gerenciar opções do sistema
- **Histórico**: Ver alterações nos dispositivos

## 🔐 Segurança

Para uso em produção, considere:
1. Mudar a senha padrão do admin (em `app.py`)
2. Usar HTTPS com proxy reverso (nginx/traefik)
3. Limitar acesso à porta 8080 por firewall
4. Fazer backups regulares da pasta `data/`

## 📦 Backup dos Dados

### Fazer backup
```bash
# Criar backup do banco de dados
docker exec singed-inss tar -czf /tmp/backup.tar.gz /app/data
docker cp singed-inss:/tmp/backup.tar.gz ./backup-$(date +%Y%m%d).tar.gz
```

### Restaurar backup
```bash
# Parar o container
docker-compose down

# Restaurar os arquivos
tar -xzf backup-20240101.tar.gz -C ./

# Reiniciar
docker-compose up -d
```

## 🆘 Suporte

Se encontrar problemas:
1. Verifique os logs: `docker-compose logs`
2. Verifique a documentação do Docker: https://docs.docker.com/
3. Abra uma issue no repositório do projeto

## 📝 Notas Importantes

- O container reinicia automaticamente após reboot do sistema
- Os dados são persistidos em volumes, não serão perdidos
- A primeira inicialização demora mais (download e build)
- Execuções subsequentes são muito mais rápidas
