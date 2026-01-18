# 🎯 LEIA-ME PRIMEIRO - S.I.N.G.E.D INSS

## ✨ Seu projeto agora roda em Docker!

O S.I.N.G.E.D INSS foi completamente configurado para rodar em Docker, facilitando a execução em **qualquer máquina**.

---

## 🚀 Início Ultra-Rápido

### Você tem Docker instalado?

**Verificar:**
```bash
docker --version
```

**✅ SIM, tenho Docker:**
```bash
docker-compose up -d
```
Acesse: http://localhost:8080 (usuário: admin, senha: inss)

**❌ NÃO tenho Docker:**

Veja como instalar: **[INSTALACAO-DOCKER.md](INSTALACAO-DOCKER.md)**

---

## 📚 Documentação Criada

### 📖 Para Iniciantes (COMECE AQUI!)
1. **[INICIO-RAPIDO.md](INICIO-RAPIDO.md)** ⭐⭐⭐
   - 3 passos simples
   - Sem complicação
   
2. **[INSTALACAO-DOCKER.md](INSTALACAO-DOCKER.md)**
   - Como instalar Docker
   - Windows, Linux, macOS

### 🪟 Para Usuários Windows
3. **[GUIA-WINDOWS.md](GUIA-WINDOWS.md)**
   - Específico Windows 7/8/10/11
   - Scripts `.bat` prontos
   - Basta clicar duas vezes!

### 📘 Documentação Completa
4. **[README-DOCKER.md](README-DOCKER.md)**
   - Tudo sobre Docker
   - Todos os comandos
   - Solução de problemas

5. **[FAQ-DOCKER.md](FAQ-DOCKER.md)**
   - Perguntas frequentes
   - Respostas rápidas

### 🏢 Para Produção
6. **[DEPLOY-PRODUCAO.md](DEPLOY-PRODUCAO.md)**
   - Deploy profissional
   - HTTPS, backup, monitoramento

### 📑 Navegação
7. **[INDICE-DOCUMENTACAO.md](INDICE-DOCUMENTACAO.md)**
   - Índice completo
   - Encontre qualquer coisa

---

## 🎯 Scripts Prontos

### Windows (Clique Duas Vezes!)
- `iniciar-windows.bat` - Inicia o sistema
- `parar-windows.bat` - Para o sistema
- `logs-windows.bat` - Mostra logs
- `atualizar-windows.bat` - Atualiza

### Linux/Mac (Terminal)
```bash
# Dar permissão (primeira vez)
chmod +x *.sh

# Usar
./docker-test.sh      # Testar
./atualizar.sh        # Atualizar
docker-compose up -d  # Iniciar
docker-compose down   # Parar
docker-compose logs -f # Ver logs
```

---

## 💡 O Que Mudou?

### ✅ Adicionado
- 🐳 Configuração completa Docker
- 📚 9 arquivos de documentação
- 🔧 Scripts auxiliares (Windows e Linux)
- 🔒 Guias de segurança e produção
- 💾 Persistência automática de dados

### 🔧 Modificado
- `database.py` - Detecta ambiente Docker
- `README.md` - Adicionado seção Docker
- `.gitignore` - Excluir dados e Docker files

### 📦 Estrutura Criada
```
projeto/
├── 📄 Documentação (9 arquivos .md)
├── 🐳 Docker (5 arquivos)
├── 🔧 Scripts (7 arquivos)
└── 💾 data/ (será criado automaticamente)
```

---

## ⚙️ Configurações Docker

### Arquivos Docker
- `Dockerfile` - Imagem Python 3.11
- `docker-compose.yml` - Uso geral
- `docker-compose.dev.yml` - Desenvolvimento
- `docker-compose.prod.yml` - Produção
- `entrypoint.sh` - Inicialização

### Portas
- **Padrão:** 8080
- **Produção:** 80 (HTTP)
- **Customizar:** Edite `docker-compose.yml`

### Dados Persistentes
- `./data/` - Banco SQLite
- `./static/options.json` - Configurações

**Importante:** Seus dados NÃO são perdidos ao atualizar!

---

## 🎬 Próximos Passos

### 1️⃣ Primeira Vez?
Leia: **[INICIO-RAPIDO.md](INICIO-RAPIDO.md)**

### 2️⃣ Usar Windows?
Leia: **[GUIA-WINDOWS.md](GUIA-WINDOWS.md)**

### 3️⃣ Quer detalhes?
Leia: **[README-DOCKER.md](README-DOCKER.md)**

### 4️⃣ Tem dúvidas?
Leia: **[FAQ-DOCKER.md](FAQ-DOCKER.md)**

### 5️⃣ Deploy produção?
Leia: **[DEPLOY-PRODUCAO.md](DEPLOY-PRODUCAO.md)**

---

## 🆘 Ajuda Rápida

### Não inicia?
```bash
docker-compose logs  # Ver erro
docker-compose down  # Parar
docker-compose up -d # Tentar de novo
```

### Porta 8080 ocupada?
Edite `docker-compose.yml`:
```yaml
ports:
  - "8081:8080"  # Mude para 8081
```

### Windows 7?
Docker Desktop não funciona! Veja opções em:
**[GUIA-WINDOWS.md](GUIA-WINDOWS.md)**

### Mais problemas?
**[FAQ-DOCKER.md](FAQ-DOCKER.md)** tem todas as respostas!

---

## 📊 Benefícios do Docker

✅ **Funciona em qualquer máquina**
- Windows, Linux, macOS

✅ **Fácil de instalar**
- Sem instalar Python, bibliotecas, etc.

✅ **Isolado**
- Não afeta o resto do sistema

✅ **Fácil de atualizar**
- Um comando e pronto

✅ **Backup simples**
- Só copiar uma pasta

✅ **Múltiplas instâncias**
- Rode em várias máquinas

---

## 🔐 Segurança

⚠️ **IMPORTANTE:** Antes de usar em produção:

1. ✅ Mude a senha padrão (app.py)
2. ✅ Configure HTTPS
3. ✅ Configure firewall
4. ✅ Faça backups regulares

Veja: **[DEPLOY-PRODUCAO.md](DEPLOY-PRODUCAO.md)**

---

## 🎓 Aprender Mais

### Docker
- [Docker Get Started](https://docs.docker.com/get-started/)
- [Docker Compose](https://docs.docker.com/compose/)

### FastAPI
- [FastAPI Docs](https://fastapi.tiangolo.com/)

---

## 💬 Suporte

1. 📖 Leia a documentação (9 arquivos!)
2. 🔍 Procure no [FAQ-DOCKER.md](FAQ-DOCKER.md)
3. 📝 Veja logs: `docker-compose logs`
4. 🐛 Abra issue no GitHub

---

## ✅ Checklist Rápido

Antes de usar:

- [ ] Docker instalado? (`docker --version`)
- [ ] Docker rodando? (`docker ps`)
- [ ] Executou? (`docker-compose up -d`)
- [ ] Acessa? (http://localhost:8080)
- [ ] Login funciona? (admin/inss)

**Tudo ✅?** Sistema funcionando! 🎉

**Algum ❌?** Veja documentação específica.

---

## 🚀 Comandos Mais Usados

```bash
# Iniciar
docker-compose up -d

# Parar
docker-compose down

# Ver logs
docker-compose logs -f

# Reiniciar
docker-compose restart

# Atualizar
docker-compose up -d --build

# Status
docker-compose ps

# Entrar no container
docker exec -it singed-inss bash
```

---

## 📱 Acesso Remoto

Para acessar de outros computadores:

1. Descubra seu IP (Windows: `ipconfig`)
2. Configure firewall (porta 8080)
3. Acesse: `http://SEU_IP:8080`

Detalhes: **[README-DOCKER.md](README-DOCKER.md)** ou **[GUIA-WINDOWS.md](GUIA-WINDOWS.md)**

---

## 🎯 Resumo Final

### Você Ganhou:
✅ Sistema rodando em Docker
✅ 9 documentações completas
✅ Scripts automatizados
✅ Suporte Windows 7/8/10/11
✅ Suporte Linux e macOS
✅ Guia de produção
✅ FAQ completo

### Você Precisa:
1. Instalar Docker
2. Executar `docker-compose up -d`
3. Acessar http://localhost:8080

**É ISSO!** Simples assim! 🎉

---

## 📞 Contato

- 📖 Documentação: Arquivos `.md` neste diretório
- 🐛 Bugs: GitHub Issues
- 💡 Sugestões: GitHub Discussions

---

**Projeto:** S.I.N.G.E.D INSS

**Versão Docker:** 1.0.0

**Data:** Janeiro 2026

**Status:** ✅ Pronto para uso!

---

**🎉 Agora é só usar! Boa sorte! 🚀**
