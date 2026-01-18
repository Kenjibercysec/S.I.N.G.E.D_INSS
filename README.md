# S.I.N.G.E.D INSS

Sistema Integrado de Navegação e Gestão Eletrônica de Dispositivos do INSS

## 📋 Descrição

O S.I.N.G.E.D INSS é um sistema desenvolvido para gerenciar e navegar dispositivos eletrônicos do INSS. O projeto utiliza FastAPI como framework backend, SQLAlchemy para ORM e Jinja2 para templates.

## 🐳 Execução com Docker (Recomendado)

A forma mais fácil de executar o sistema é usando Docker! Funciona em qualquer máquina:

### Início Rápido

```bash
# 1. Instalar Docker (se necessário)
# Veja: INSTALACAO-DOCKER.md

# 2. Executar
docker-compose up -d

# 3. Acessar
# http://localhost:8080
# Usuário: admin | Senha: inss
```

### 📚 Documentação Docker

- **[INICIO-RAPIDO.md](INICIO-RAPIDO.md)** - Comece aqui! Guia em 3 passos
- **[INSTALACAO-DOCKER.md](INSTALACAO-DOCKER.md)** - Como instalar Docker
- **[README-DOCKER.md](README-DOCKER.md)** - Guia completo Docker
- **[GUIA-WINDOWS.md](GUIA-WINDOWS.md)** - Específico para Windows
- **[DEPLOY-PRODUCAO.md](DEPLOY-PRODUCAO.md)** - Deploy em produção

### Scripts Prontos

**Linux/Mac:**
- `./docker-test.sh` - Testar instalação
- `./atualizar.sh` - Atualizar sistema

**Windows:**
- `iniciar-windows.bat` - Iniciar sistema
- `parar-windows.bat` - Parar sistema
- `logs-windows.bat` - Ver logs
- `atualizar-windows.bat` - Atualizar sistema

---

## 🚀 Tecnologias Utilizadas

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Jinja2
- Alembic (Migrações de banco de dados)
- SQLite

## 📦 Dependências

```bash
fastapi
uvicorn
sqlalchemy
pydantic
pylance
fastapi.staticfiles
jinja2
python-multipart
alembic
```

## 🛠️ Instalação Manual (Sem Docker)

Se preferir executar sem Docker:

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITORIO]
cd S.I.N.G.E.D_INSS
```

2. Crie um ambiente virtual (recomendado):
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
.\venv\Scripts\activate   # Windows
```

3. Instale as dependências:
```bash
pip install -r requirements.txt
```

4. Configure o banco de dados:
```bash
alembic upgrade head
```

5. Execute o script de carregamento de dados (se necessário):
```bash
python load_data.py
```

## 🚀 Executando o Projeto (Sem Docker)

Para iniciar o servidor:
```bash
uvicorn app:app --host 0.0.0.0 --port 8080
# ou
uvicorn app:app --reload  # modo desenvolvimento
```

O servidor estará disponível em `http://localhost:8080`

## 🗄️ Estrutura do Projeto

- `app.py`: Arquivo principal da aplicação com as rotas e lógica do FastAPI
- `models.py`: Definição dos modelos do SQLAlchemy
- `schemas.py`: Schemas Pydantic para validação de dados
- `database.py`: Configuração do banco de dados
- `load_data.py`: Script para carregar dados iniciais
- `templates/`: Diretório com templates Jinja2
- `static/`: Arquivos estáticos (CSS, JavaScript, imagens)
- `alembic/`: Configurações e scripts de migração do banco de dados

## 📝 Funcionalidades

- Gerenciamento de dispositivos
- Sistema de busca e filtros
- Interface web responsiva
- Autenticação e autorização
- Geração de relatórios
- Histórico de alterações

## 🔐 Variáveis de Ambiente

O projeto utiliza as seguintes variáveis de ambiente (configure em um arquivo `.env`):

```env
DATABASE_URL=sqlite:///dispositivos.db
```

## 👥 Contribuição

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença [inserir tipo de licença]. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para [inserir email de suporte] ou abra uma issue no repositório. 
