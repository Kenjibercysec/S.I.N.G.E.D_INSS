# ❓ FAQ - Perguntas Frequentes sobre Docker

Respostas para as dúvidas mais comuns sobre executar o S.I.N.G.E.D INSS com Docker.

## 🤔 Perguntas Gerais

### O que é Docker?

Docker é uma plataforma que permite empacotar uma aplicação e todas as suas dependências em um "container". É como uma máquina virtual, mas muito mais leve e rápida.

**Vantagens:**
- ✅ Funciona igual em qualquer máquina
- ✅ Não precisa instalar Python, bibliotecas, etc.
- ✅ Fácil de atualizar e fazer backup
- ✅ Isolado do resto do sistema

### Preciso saber Docker para usar?

**Não!** Basta instalar o Docker e executar os comandos prontos que fornecemos. Os scripts `.bat` (Windows) e `.sh` (Linux) fazem tudo automaticamente.

### Docker é grátis?

**Sim!** Docker é open source e gratuito para uso pessoal e empresarial.

### Quanto de espaço ocupa?

- Docker Desktop: ~500MB-1GB
- Imagem do S.I.N.G.E.D: ~200-300MB
- Dados do sistema: depende do uso (inicial ~10MB)

**Total:** ~1-2GB

### Funciona offline?

Sim! Depois da primeira instalação e download, funciona completamente offline.

## 💻 Compatibilidade

### Funciona no Windows 7?

Docker Desktop **NÃO** funciona no Windows 7. Você tem 3 opções:

1. **Atualizar para Windows 10/11** (melhor opção)
2. **Docker Toolbox** (descontinuado, mas funciona)
3. **VirtualBox + Linux** (mais trabalhoso)

Veja detalhes em: [GUIA-WINDOWS.md](GUIA-WINDOWS.md)

### Funciona no Windows 10 Home?

**Sim!** Desde a versão 2004, Windows 10 Home suporta WSL2 e Docker Desktop.

### Funciona no macOS antigo?

Docker Desktop requer macOS 11 (Big Sur) ou superior. Para versões antigas, seria necessário uma VM com Linux.

### Funciona no Linux?

**Perfeitamente!** Linux é a plataforma nativa do Docker. Funciona em:
- Ubuntu/Debian
- Fedora/RHEL/CentOS
- Arch Linux
- E qualquer outra distribuição

## 🔧 Instalação e Configuração

### Não consigo instalar Docker Desktop no Windows

**Possíveis problemas:**

1. **Virtualização desabilitada**
   - Entre na BIOS e habilite VT-x (Intel) ou AMD-V (AMD)
   
2. **Windows muito antigo**
   - Precisa Windows 10 Build 19041+ ou Windows 11
   
3. **Conflito com Hyper-V**
   - Use WSL2 em vez de Hyper-V
   
4. **Falta WSL2**
   - Execute: `wsl --install` no PowerShell (Admin)

### Docker Desktop não inicia

1. **Verificar virtualização** (BIOS)
2. **Atualizar Windows**
3. **Reinstalar Docker Desktop**
4. **Ver logs**: `%LOCALAPPDATA%\Docker\log.txt`

### "WSL 2 installation is incomplete"

```powershell
# PowerShell como Admin
wsl --update
wsl --set-default-version 2
```

Reinicie o computador.

## 🚀 Uso do Sistema

### Como iniciar o sistema?

**Windows:**
```cmd
iniciar-windows.bat
```

**Linux/Mac:**
```bash
docker-compose up -d
```

### Como parar o sistema?

**Windows:**
```cmd
parar-windows.bat
```

**Linux/Mac:**
```bash
docker-compose down
```

### Como ver os logs?

**Windows:**
```cmd
logs-windows.bat
```

**Linux/Mac:**
```bash
docker-compose logs -f
```

### O sistema inicia automaticamente?

Sim! O container está configurado para reiniciar automaticamente quando você reinicia o computador.

Para desabilitar:
```yaml
# docker-compose.yml
restart: "no"  # em vez de "unless-stopped"
```

### Como atualizar o sistema?

**Windows:**
```cmd
atualizar-windows.bat
```

**Linux/Mac:**
```bash
./atualizar.sh
```

## 💾 Dados e Backup

### Onde ficam os dados?

- **Banco de dados**: `./data/dispositivos.db`
- **Configurações**: `./static/options.json`

Esses arquivos persistem mesmo se você deletar o container!

### Como fazer backup?

**Manual:**
```bash
# Copiar arquivos
cp -r data/ backup-$(date +%Y%m%d)/
cp static/options.json backup-$(date +%Y%m%d)/
```

**Windows:**
```cmd
xcopy data backup-%date% /E /I
xcopy static\options.json backup-%date%\
```

**Automático:**
Veja: [DEPLOY-PRODUCAO.md](DEPLOY-PRODUCAO.md) seção de backup

### Como restaurar backup?

1. Pare o sistema: `docker-compose down`
2. Substitua os arquivos em `data/` e `static/`
3. Inicie: `docker-compose up -d`

### Os dados são perdidos ao atualizar?

**Não!** Os dados estão em volumes separados do container. Você pode atualizar, reconstruir, deletar o container - os dados permanecem.

## 🌐 Acesso e Rede

### Como acessar de outro computador?

1. Descubra seu IP:
   - Windows: `ipconfig`
   - Linux: `ip addr` ou `ifconfig`
   
2. Libere a porta 8080 no firewall

3. Acesse de outro PC: `http://SEU_IP:8080`

Exemplo: `http://192.168.1.100:8080`

### Porta 8080 já está em uso

**Opção 1: Descobrir o que está usando**
```bash
# Windows
netstat -ano | findstr :8080

# Linux/Mac
lsof -i :8080
```

**Opção 2: Usar outra porta**

Edite `docker-compose.yml`:
```yaml
ports:
  - "8081:8080"  # usa 8081 em vez de 8080
```

Acesse: `http://localhost:8081`

### Como usar HTTPS?

Para produção com HTTPS, veja: [DEPLOY-PRODUCAO.md](DEPLOY-PRODUCAO.md)

Resumo:
- Use Nginx como proxy reverso
- Configure Let's Encrypt (SSL grátis)
- Ou use Cloudflare

## 🐛 Problemas Comuns

### Container não inicia

```bash
# Ver o erro
docker-compose logs

# Verificar se Docker está rodando
docker ps

# Reconstruir do zero
docker-compose down
docker-compose up -d --build
```

### "Cannot connect to the Docker daemon"

**Causa:** Docker não está rodando

**Solução:**
- Windows/Mac: Abrir Docker Desktop
- Linux: `sudo systemctl start docker`

### Container inicia mas não responde

```bash
# Ver logs
docker-compose logs -f

# Entrar no container
docker exec -it singed-inss bash

# Verificar processo
ps aux | grep uvicorn
```

### Muito lento no Windows

1. **Aumentar recursos do Docker Desktop:**
   - Settings → Resources
   - CPUs: 4
   - Memory: 6-8 GB

2. **Mover projeto para WSL2:**
   - Coloque o projeto dentro do WSL2
   - Acesso mais rápido ao disco

3. **Excluir do antivírus:**
   - Adicione exceção para Docker
   - E para a pasta do projeto

### Erro "permission denied" no Linux

```bash
# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Fazer logout e login novamente
# Ou reiniciar
```

### Banco de dados não persiste

```bash
# Verificar se a pasta existe
ls -la data/

# Criar se não existir
mkdir -p data

# Verificar permissões
chmod 755 data/

# Verificar volumes
docker volume ls
```

## 🔐 Segurança

### Como mudar a senha do admin?

Edite `app.py`:
```python
ADMIN_PASSWORD = "sua_senha_forte_aqui"
ADMIN_USERNAME = "seu_usuario"
```

Depois:
```bash
docker-compose up -d --build
```

### É seguro usar em produção?

Com as devidas configurações, sim!

**Obrigatório:**
- ✅ Mudar senha padrão
- ✅ Usar HTTPS
- ✅ Configurar firewall
- ✅ Fazer backups regulares

Veja: [DEPLOY-PRODUCAO.md](DEPLOY-PRODUCAO.md)

### Alguém pode acessar meu banco de dados?

Não, se você:
- Configurou o firewall corretamente
- Não expôs a porta para internet
- Mantém acesso apenas na rede local

## ⚡ Performance

### Docker deixa o sistema lento?

Docker consome recursos, mas é bem otimizado:
- CPU: 5-10% em idle, 20-30% em uso
- RAM: 512MB - 1GB
- Disco: escrita ocasional

### Posso rodar em máquina fraca?

**Requisitos mínimos:**
- 2GB RAM (recomendado 4GB)
- 2 cores CPU
- 10GB espaço livre

Funciona em máquinas antigas, mas pode ser mais lento.

### Como otimizar performance?

1. **Aumentar recursos Docker**
2. **Usar SSD** em vez de HD
3. **Fechar programas desnecessários**
4. **Limitar logs** (já configurado)

## 🔄 Múltiplas Instâncias

### Posso rodar em vários computadores?

**Sim!** Cada computador terá sua própria instância com seu próprio banco de dados.

### Posso sincronizar entre computadores?

**Opção 1: Compartilhar pasta `data/`**
- Use NFS ou SMB para compartilhar
- Mas cuidado com concorrência!

**Opção 2: Usar banco central**
- PostgreSQL no lugar de SQLite
- Requer modificação do código

**Opção 3: Git para sincronização**
- Commitar arquivo .db (não recomendado)
- Melhor: script de export/import

### Posso ter múltiplos containers na mesma máquina?

Sim! Mude a porta:

```yaml
# docker-compose.yml para 2ª instância
ports:
  - "8081:8080"
```

## 📱 Mobile

### Funciona no celular/tablet?

A interface web sim! Acesse `http://IP_DO_SERVIDOR:8080` do navegador do celular.

Mas o Docker só roda em PC/servidor.

## 🆘 Onde Pedir Ajuda?

1. **Veja a documentação:**
   - [README-DOCKER.md](README-DOCKER.md)
   - [GUIA-WINDOWS.md](GUIA-WINDOWS.md)
   - [INSTALACAO-DOCKER.md](INSTALACAO-DOCKER.md)

2. **Verifique logs:**
   ```bash
   docker-compose logs -f
   ```

3. **Tente reconstruir:**
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

4. **Abra uma issue no GitHub:**
   - Inclua logs
   - Descreva o problema
   - Informe SO e versão do Docker

## 💡 Dicas Extras

### Comandos úteis

```bash
# Ver containers rodando
docker ps

# Ver todos (incluindo parados)
docker ps -a

# Uso de recursos
docker stats

# Limpar espaço
docker system prune

# Reconstruir do zero
docker-compose down -v
docker-compose up -d --build

# Acessar bash do container
docker exec -it singed-inss bash
```

### Atalhos Windows

Crie arquivos `.bat` com:
```batch
@echo off
start http://localhost:8080
```

Salve como `abrir-singed.bat` e clique duas vezes para abrir no navegador.

### Inicialização rápida

**Linux - Adicionar ao .bashrc:**
```bash
alias singed-start='cd /caminho/projeto && docker-compose up -d'
alias singed-stop='cd /caminho/projeto && docker-compose down'
alias singed-logs='cd /caminho/projeto && docker-compose logs -f'
```

**Windows - PowerShell Profile:**
```powershell
function Start-Singed { 
    cd C:\caminho\projeto
    docker-compose up -d 
}
```

---

## 🎓 Quer Aprender Mais sobre Docker?

**Tutoriais Recomendados:**
- [Docker Get Started](https://docs.docker.com/get-started/)
- [Docker Compose Tutorial](https://docs.docker.com/compose/gettingstarted/)
- [Docker para Iniciantes (PT-BR)](https://docker-curriculum.com/)

**Comandos Essenciais:**
- [Docker Cheat Sheet](https://dockerlabs.collabnix.com/docker/cheatsheet/)

---

**Não encontrou sua dúvida?** Abra uma issue! 🤝
