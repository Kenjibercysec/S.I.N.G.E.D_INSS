# 🪟 Guia para Windows - S.I.N.G.E.D INSS

Guia específico para usuários Windows que querem rodar o sistema em Docker.

## 📋 Antes de Começar

### ✅ Você tem Windows 10 ou 11?

Ótimo! Você pode usar Docker Desktop, que é a forma mais fácil.

[Pule para: Instalação Windows 10/11](#instalação-windows-1011)

### ⚠️ Você tem Windows 7 ou 8?

Docker Desktop **NÃO funciona** no Windows 7/8. Você tem 3 opções:

1. **Atualizar para Windows 10/11** (Recomendado)
2. **Usar Docker Toolbox** (descontinuado, mas funciona)
3. **Usar VirtualBox com Linux** (mais trabalhoso)

[Veja: Opções para Windows 7/8](#opções-para-windows-78)

---

## 🚀 Instalação Windows 10/11

### Passo 1: Verificar Requisitos

Você precisa de:
- ✅ Windows 10 versão 2004+ (Build 19041) ou Windows 11
- ✅ 4GB de RAM (recomendado 8GB)
- ✅ 20GB de espaço livre
- ✅ Virtualização habilitada na BIOS

### Passo 2: Habilitar WSL2

1. Abra o **PowerShell como Administrador**
   - Clique com botão direito no menu Iniciar
   - Selecione "Windows PowerShell (Admin)"

2. Execute o comando:
   ```powershell
   wsl --install
   ```

3. **Reinicie** o computador quando solicitado

4. Após reiniciar, abra o PowerShell novamente e verifique:
   ```powershell
   wsl --list --verbose
   ```

### Passo 3: Instalar Docker Desktop

1. Acesse: https://www.docker.com/products/docker-desktop/
2. Clique em **"Download for Windows"**
3. Execute o instalador `Docker Desktop Installer.exe`
4. Durante a instalação:
   - ✅ Marque "Use WSL 2 instead of Hyper-V"
   - ✅ Marque "Add shortcut to desktop"
5. Clique em **"Install"**
6. **Reinicie** quando solicitado

### Passo 4: Configurar Docker Desktop

1. Abra o **Docker Desktop** do ícone na área de trabalho
2. Aguarde inicializar (aparece uma baleia na bandeja do sistema)
3. Aceite os termos de serviço
4. Pode pular o tutorial (Skip)
5. Vá em **Settings** (ícone de engrenagem):
   - **Resources → CPUs**: 2-4
   - **Resources → Memory**: 4-6 GB
   - **Resources → Disk**: 20 GB
6. Clique em **"Apply & Restart"**

### Passo 5: Verificar Instalação

1. Abra o **PowerShell** (não precisa ser admin)

2. Execute:
   ```powershell
   docker --version
   docker-compose --version
   ```

3. Se aparecer as versões, **está funcionando!** ✅

### Passo 6: Executar o Sistema

1. Abra o **PowerShell** ou **Terminal**

2. Navegue até a pasta do projeto:
   ```powershell
   cd C:\caminho\para\S.I.N.G.E.D_INSS
   ```

3. **Opção Fácil** - Use o script automático:
   ```powershell
   .\iniciar-windows.bat
   ```

4. **Opção Manual**:
   ```powershell
   docker-compose up -d
   ```

5. Aguarde alguns segundos e acesse:
   ```
   http://localhost:8080
   ```

6. Login:
   - **Usuário**: admin
   - **Senha**: inss

### ✅ Pronto! Sistema rodando!

---

## 🔧 Opções para Windows 7/8

### Opção 1: Atualizar para Windows 10 (Recomendado)

**Por que?**
- Docker funciona perfeitamente
- Melhor performance
- Suporte e atualizações de segurança
- Windows 10 é gratuito para quem tem Windows 7/8 original

**Como atualizar:**
1. Baixe a ferramenta de criação de mídia do Windows 10
2. Execute e escolha "Atualizar este PC agora"
3. Siga o assistente

### Opção 2: Docker Toolbox (Windows 7/8)

⚠️ **Atenção**: Docker Toolbox foi descontinuado e não é mais mantido!

**Requisitos:**
- Windows 7/8/10
- Virtualização habilitada na BIOS
- 4GB RAM (recomendado 8GB)

**Instalação:**

1. **Baixar Docker Toolbox**:
   - Acesse: https://github.com/docker-archive/toolbox/releases
   - Baixe: `DockerToolbox-xx.xx.x.exe`

2. **Instalar**:
   - Execute o instalador
   - Marque todas as opções (VirtualBox, Git, etc.)
   - Clique em "Install"

3. **Configurar**:
   - Abra o **Docker Quickstart Terminal** (ícone na área de trabalho)
   - Aguarde criar a VM (primeira vez demora mais)
   - Anote o IP que aparece (ex: 192.168.99.100)

4. **Testar**:
   ```bash
   docker --version
   docker-compose --version
   ```

5. **Executar o Sistema**:
   ```bash
   cd /c/caminho/para/S.I.N.G.E.D_INSS
   docker-compose up -d
   ```

6. **Acessar**:
   - ⚠️ **NÃO use localhost!**
   - Use o IP da VM: `http://192.168.99.100:8080`

**Problemas Comuns:**

- **VirtualBox não instala**: Desinstale e reinstale manualmente
- **VM não inicia**: Aumentar RAM na configuração do VirtualBox
- **Muito lento**: Normal, Docker Toolbox usa VM

### Opção 3: VirtualBox com Linux

**Para quem tem mais experiência:**

1. Baixar VirtualBox: https://www.virtualbox.org/
2. Baixar Ubuntu: https://ubuntu.com/download/desktop
3. Criar uma VM no VirtualBox com Ubuntu
4. Instalar Docker no Ubuntu (veja [README-DOCKER.md](README-DOCKER.md))
5. Configurar rede em modo Bridge
6. Executar o sistema na VM
7. Acessar do Windows usando o IP da VM

---

## 🎯 Scripts Prontos (Windows)

Criei scripts para facilitar o uso no Windows:

### `iniciar-windows.bat`
Inicia o sistema automaticamente
```cmd
iniciar-windows.bat
```

### `parar-windows.bat`
Para o sistema
```cmd
parar-windows.bat
```

### `logs-windows.bat`
Mostra os logs do sistema
```cmd
logs-windows.bat
```

**Como usar:**
1. Clique duas vezes no arquivo `.bat`
2. Ou execute no PowerShell/CMD

---

## 🌐 Acessar de Outros Computadores na Rede

### Descobrir seu IP

**Método 1: Interface Gráfica**
1. Abra "Configurações"
2. Vá em "Rede e Internet"
3. Clique em "Propriedades"
4. Procure "Endereço IPv4" (ex: 192.168.1.100)

**Método 2: CMD**
```cmd
ipconfig
```
Procure por "Endereço IPv4" na seção "Adaptador de Rede"

### Configurar Firewall

1. Abra o **Painel de Controle**
2. Vá em **Sistema e Segurança** → **Firewall do Windows**
3. Clique em **"Configurações avançadas"** (lado esquerdo)
4. Clique em **"Regras de Entrada"** (lado esquerdo)
5. Clique em **"Nova Regra..."** (lado direito)
6. Selecione **"Porta"** → Avançar
7. Selecione **"TCP"** e digite **8080** → Avançar
8. Selecione **"Permitir a conexão"** → Avançar
9. Marque todas as redes → Avançar
10. Nome: **S.I.N.G.E.D INSS** → Concluir

### Acessar de Outro PC

No outro computador, abra o navegador e acesse:
```
http://192.168.1.100:8080
```
(substitua pelo seu IP)

---

## 🆘 Problemas Comuns

### Docker Desktop não abre

**Solução 1: Verificar Virtualização**
- Reinicie o PC
- Entre na BIOS (geralmente F2, F10, Del)
- Procure "Virtualization" ou "VT-x" ou "AMD-V"
- Habilite e salve

**Solução 2: Reinstalar**
- Desinstale Docker Desktop
- Reinicie
- Instale novamente

### "WSL 2 installation is incomplete"

```powershell
# Execute no PowerShell como Admin:
wsl --update
wsl --set-default-version 2
```

Reinicie o computador.

### Porta 8080 em uso

**Descobrir o que está usando:**
```powershell
netstat -ano | findstr :8080
```

**Opção 1: Matar o processo**
```powershell
# Anote o PID (último número) e:
taskkill /PID 1234 /F
```

**Opção 2: Usar outra porta**
Edite `docker-compose.yml`:
```yaml
ports:
  - "8081:8080"
```
Acesse em: http://localhost:8081

### Docker muito lento

1. **Configurações Docker Desktop**:
   - Settings → Resources
   - Aumente CPUs para 4
   - Aumente Memory para 6-8 GB

2. **Mover dados para WSL2**:
   - Mantenha o projeto dentro do WSL2
   - Acesso mais rápido ao disco

3. **Excluir do antivírus**:
   - Adicione exceção para Docker Desktop
   - E para a pasta do projeto

### Container não inicia

```powershell
# Ver logs
docker-compose logs

# Remover tudo e reconstruir
docker-compose down
docker-compose up -d --build
```

---

## 💡 Dicas para Windows

### 1. Usar Windows Terminal

Melhor que CMD/PowerShell:
- Download: Microsoft Store → "Windows Terminal"
- Suporta múltiplas abas
- Copiar/colar funciona melhor

### 2. Docker Desktop Auto-Start

Settings → General → "Start Docker Desktop when you log in"

### 3. Atalhos Úteis

Crie atalhos na área de trabalho:

**Iniciar Sistema:**
- Botão direito → Novo → Atalho
- Local: `C:\caminho\para\iniciar-windows.bat`
- Nome: "Iniciar S.I.N.G.E.D"

**Abrir Sistema:**
- Botão direito → Novo → Atalho
- Local: `http://localhost:8080`
- Nome: "S.I.N.G.E.D INSS"

### 4. Backup Automático

Crie um script `backup.bat`:
```batch
@echo off
set DATA=%date:~-4,4%%date:~-10,2%%date:~-7,2%
mkdir backups 2>nul
xcopy /Y data\* backups\backup-%DATA%\
echo Backup completo!
pause
```

Execute semanalmente.

---

## 📚 Recursos Adicionais

- [README-DOCKER.md](README-DOCKER.md) - Guia completo
- [INSTALACAO-DOCKER.md](INSTALACAO-DOCKER.md) - Instalação detalhada
- [INICIO-RAPIDO.md](INICIO-RAPIDO.md) - Início rápido

---

## ✅ Checklist

Antes de pedir ajuda, verifique:

- [ ] Docker Desktop está instalado?
- [ ] Docker Desktop está rodando? (ícone na bandeja)
- [ ] WSL2 está instalado? (`wsl --list`)
- [ ] Virtualização está habilitada na BIOS?
- [ ] Porta 8080 está livre?
- [ ] Firewall permite Docker?
- [ ] Tentou reiniciar o computador?
- [ ] Tentou `docker-compose down` e `docker-compose up -d`?

---

**Dúvidas específicas do Windows?** Abra uma issue! 🤝
