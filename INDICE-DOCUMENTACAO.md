# 📚 Índice da Documentação - S.I.N.G.E.D INSS

Guia completo de toda a documentação disponível.

## 🚀 Começando

### Para Iniciantes (Nunca usou Docker)
1. **[INICIO-RAPIDO.md](INICIO-RAPIDO.md)** ⭐ COMECE AQUI!
   - Guia de 3 passos simples
   - Instruções básicas
   - Comandos essenciais

2. **[INSTALACAO-DOCKER.md](INSTALACAO-DOCKER.md)**
   - Como instalar Docker
   - Windows 10/11, 7/8, Linux, macOS
   - Solução de problemas de instalação

### Para Usuários Windows
3. **[GUIA-WINDOWS.md](GUIA-WINDOWS.md)**
   - Específico para Windows 7, 8, 10, 11
   - Scripts `.bat` prontos
   - Configurações de firewall
   - Acesso em rede local

## 📖 Documentação Completa

### Uso Geral
4. **[README.md](README.md)**
   - Visão geral do projeto
   - Funcionalidades
   - Instalação manual (sem Docker)

5. **[README-DOCKER.md](README-DOCKER.md)**
   - Guia completo Docker
   - Todos os comandos
   - Gerenciamento de dados
   - Troubleshooting detalhado

### Referência Rápida
6. **[FAQ-DOCKER.md](FAQ-DOCKER.md)**
   - Perguntas frequentes
   - Soluções para problemas comuns
   - Dicas e truques

## 🏢 Produção

### Deploy Profissional
7. **[DEPLOY-PRODUCAO.md](DEPLOY-PRODUCAO.md)**
   - Colocar em produção com segurança
   - Configurar HTTPS
   - Backup automático
   - Monitoramento
   - Alta disponibilidade

## 🔧 Arquivos Técnicos

### Docker
- **[Dockerfile](Dockerfile)** - Configuração da imagem
- **[docker-compose.yml](docker-compose.yml)** - Orquestração principal
- **[docker-compose.dev.yml](docker-compose.dev.yml)** - Ambiente desenvolvimento
- **[docker-compose.prod.yml](docker-compose.prod.yml)** - Ambiente produção
- **[.dockerignore](.dockerignore)** - Arquivos ignorados no build
- **[entrypoint.sh](entrypoint.sh)** - Script de inicialização

### Python/Backend
- **[app.py](app.py)** - Aplicação FastAPI principal
- **[models.py](models.py)** - Modelos do banco de dados
- **[schemas.py](schemas.py)** - Schemas Pydantic
- **[database.py](database.py)** - Configuração do banco
- **[requirements.txt](requirements.txt)** - Dependências Python

### Alembic (Migrações)
- **[alembic.ini](alembic.ini)** - Configuração Alembic
- **[alembic/](alembic/)** - Scripts de migração

## 🖥️ Scripts Auxiliares

### Linux/Mac
- **[docker-test.sh](docker-test.sh)** - Testar instalação Docker
- **[atualizar.sh](atualizar.sh)** - Atualizar o sistema
- Dê permissão: `chmod +x *.sh`

### Windows
- **[iniciar-windows.bat](iniciar-windows.bat)** - Iniciar sistema
- **[parar-windows.bat](parar-windows.bat)** - Parar sistema
- **[logs-windows.bat](logs-windows.bat)** - Ver logs
- **[atualizar-windows.bat](atualizar-windows.bat)** - Atualizar sistema
- Clique duas vezes para executar

## 📋 Fluxo de Leitura Recomendado

### 🎯 Usuário Final (Quer apenas usar)
```
1. INICIO-RAPIDO.md
2. INSTALACAO-DOCKER.md (se necessário)
3. GUIA-WINDOWS.md (se usar Windows)
4. FAQ-DOCKER.md (para dúvidas)
```

### 💻 Desenvolvedor (Quer contribuir)
```
1. README.md
2. README-DOCKER.md
3. docker-compose.dev.yml
4. Código fonte (app.py, models.py, etc.)
```

### 🏢 DevOps/Administrador (Deploy produção)
```
1. README-DOCKER.md
2. DEPLOY-PRODUCAO.md
3. docker-compose.prod.yml
4. FAQ-DOCKER.md (troubleshooting)
```

## 🎓 Tutoriais por Cenário

### Cenário 1: Primeira Instalação
1. Leia [INICIO-RAPIDO.md](INICIO-RAPIDO.md)
2. Siga [INSTALACAO-DOCKER.md](INSTALACAO-DOCKER.md)
3. Execute:
   - Windows: `iniciar-windows.bat`
   - Linux: `docker-compose up -d`
4. Acesse: http://localhost:8080

### Cenário 2: Problemas na Instalação
1. Consulte [FAQ-DOCKER.md](FAQ-DOCKER.md) - seção "Instalação"
2. Se Windows, veja [GUIA-WINDOWS.md](GUIA-WINDOWS.md) - "Problemas Comuns"
3. Verifique logs: `docker-compose logs`

### Cenário 3: Acessar de Outros Computadores
1. [GUIA-WINDOWS.md](GUIA-WINDOWS.md) - "Acessar de Outros Computadores"
2. Ou [README-DOCKER.md](README-DOCKER.md) - "Acessando de Outras Máquinas"
3. Configure firewall
4. Use IP do servidor

### Cenário 4: Fazer Backup
1. [README-DOCKER.md](README-DOCKER.md) - "Backup dos Dados"
2. Ou [DEPLOY-PRODUCAO.md](DEPLOY-PRODUCAO.md) - "Backup Automático"
3. Copie pasta `data/` e `static/options.json`

### Cenário 5: Atualizar Sistema
1. Execute script de atualização:
   - Windows: `atualizar-windows.bat`
   - Linux: `./atualizar.sh`
2. Ou manual: [README-DOCKER.md](README-DOCKER.md) - "Atualizando"

### Cenário 6: Deploy Produção
1. Leia completamente [DEPLOY-PRODUCAO.md](DEPLOY-PRODUCAO.md)
2. Siga checklist de segurança
3. Configure HTTPS
4. Configure backup automático
5. Use `docker-compose.prod.yml`

### Cenário 7: Sistema Lento
1. [FAQ-DOCKER.md](FAQ-DOCKER.md) - "Performance"
2. [GUIA-WINDOWS.md](GUIA-WINDOWS.md) - "Docker muito lento"
3. Aumentar recursos do Docker
4. Otimizações

### Cenário 8: Windows 7
1. [GUIA-WINDOWS.md](GUIA-WINDOWS.md) - "Opções para Windows 7/8"
2. Considere atualizar para Windows 10
3. Ou use Docker Toolbox
4. Ou VirtualBox + Linux

## 🔍 Busca Rápida

### Como...
- **Instalar**: [INSTALACAO-DOCKER.md](INSTALACAO-DOCKER.md)
- **Iniciar**: [INICIO-RAPIDO.md](INICIO-RAPIDO.md)
- **Parar**: `docker-compose down`
- **Ver logs**: `docker-compose logs -f`
- **Atualizar**: Execute script `atualizar.*`
- **Fazer backup**: Copie pasta `data/`
- **Acessar remotamente**: Configure firewall + use IP
- **Mudar porta**: Edite `docker-compose.yml`
- **Mudar senha**: Edite `app.py` → `ADMIN_PASSWORD`
- **Deploy produção**: [DEPLOY-PRODUCAO.md](DEPLOY-PRODUCAO.md)

### Resolver...
- **Erro instalação**: [INSTALACAO-DOCKER.md](INSTALACAO-DOCKER.md)
- **Container não inicia**: [FAQ-DOCKER.md](FAQ-DOCKER.md)
- **Sistema lento**: [FAQ-DOCKER.md](FAQ-DOCKER.md) - Performance
- **Porta em uso**: [FAQ-DOCKER.md](FAQ-DOCKER.md) - Rede
- **Dados não salvam**: [FAQ-DOCKER.md](FAQ-DOCKER.md) - Dados
- **Windows 7**: [GUIA-WINDOWS.md](GUIA-WINDOWS.md)
- **Acesso negado**: [FAQ-DOCKER.md](FAQ-DOCKER.md)

## 📊 Estrutura de Diretórios

```
S.I.N.G.E.D_INSS/
├── 📄 Documentação
│   ├── README.md .................... Principal
│   ├── INDICE-DOCUMENTACAO.md ....... Este arquivo
│   ├── INICIO-RAPIDO.md ............. Guia rápido ⭐
│   ├── INSTALACAO-DOCKER.md ......... Instalação
│   ├── README-DOCKER.md ............. Docker completo
│   ├── GUIA-WINDOWS.md .............. Windows específico
│   ├── FAQ-DOCKER.md ................ Perguntas frequentes
│   └── DEPLOY-PRODUCAO.md ........... Produção
│
├── 🐳 Docker
│   ├── Dockerfile ................... Imagem
│   ├── docker-compose.yml ........... Principal
│   ├── docker-compose.dev.yml ....... Desenvolvimento
│   ├── docker-compose.prod.yml ...... Produção
│   ├── .dockerignore ................ Exclusões
│   └── entrypoint.sh ................ Inicialização
│
├── 🔧 Scripts
│   ├── Linux/Mac:
│   │   ├── docker-test.sh ........... Testar
│   │   └── atualizar.sh ............. Atualizar
│   └── Windows:
│       ├── iniciar-windows.bat ...... Iniciar
│       ├── parar-windows.bat ........ Parar
│       ├── logs-windows.bat ......... Logs
│       └── atualizar-windows.bat .... Atualizar
│
├── 🐍 Backend (Python/FastAPI)
│   ├── app.py ....................... Aplicação principal
│   ├── models.py .................... Modelos BD
│   ├── schemas.py ................... Validação
│   ├── database.py .................. Configuração BD
│   ├── requirements.txt ............. Dependências
│   └── load_data.py ................. Carregar dados
│
├── 🗄️ Banco de Dados
│   ├── alembic.ini .................. Config migrações
│   └── alembic/ ..................... Scripts migração
│
├── 🎨 Frontend
│   ├── templates/ ................... HTML (Jinja2)
│   └── static/ ...................... CSS, JS, imagens
│
└── 💾 Dados (criados em runtime)
    ├── data/ ........................ Banco SQLite
    └── static/options.json .......... Configurações
```

## 🎯 Objetivos de Cada Documento

| Documento | Objetivo | Público |
|-----------|----------|---------|
| **INICIO-RAPIDO.md** | Colocar pra rodar em 3 passos | Todos |
| **INSTALACAO-DOCKER.md** | Instalar Docker corretamente | Iniciantes |
| **README-DOCKER.md** | Referência completa Docker | Intermediário |
| **GUIA-WINDOWS.md** | Resolver problemas Windows | Windows |
| **FAQ-DOCKER.md** | Responder dúvidas comuns | Todos |
| **DEPLOY-PRODUCAO.md** | Deploy seguro e profissional | DevOps |
| **README.md** | Visão geral do projeto | Todos |

## 💡 Dicas de Navegação

1. **Começando do zero?** → [INICIO-RAPIDO.md](INICIO-RAPIDO.md)
2. **Travou em algo?** → [FAQ-DOCKER.md](FAQ-DOCKER.md)
3. **Usa Windows?** → [GUIA-WINDOWS.md](GUIA-WINDOWS.md)
4. **Quer detalhes?** → [README-DOCKER.md](README-DOCKER.md)
5. **Vai pra produção?** → [DEPLOY-PRODUCAO.md](DEPLOY-PRODUCAO.md)

## 🆘 Ainda Precisa de Ajuda?

1. ✅ Verifique [FAQ-DOCKER.md](FAQ-DOCKER.md)
2. ✅ Leia a documentação específica
3. ✅ Veja os logs: `docker-compose logs`
4. ✅ Tente reconstruir: `docker-compose up -d --build`
5. 📧 Abra uma issue no GitHub

## 📝 Contribuindo

Para contribuir com a documentação:
1. Mantenha o padrão de formatação
2. Adicione exemplos práticos
3. Teste as instruções
4. Atualize este índice se adicionar novos documentos

---

**Última atualização:** Janeiro 2026

**Versão:** 1.0

**Projeto:** S.I.N.G.E.D INSS - Sistema Integrado de Navegação e Gestão Eletrônica de Dispositivos do INSS
