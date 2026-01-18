from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from pathlib import Path

# Obtém o diretório base do projeto
BASE_DIR = Path(__file__).resolve().parent

# Configuração do banco de dados usando caminho relativo
# Se estiver em Docker, usa /app/data, caso contrário usa o diretório atual
if os.path.exists('/app/data'):
    db_path = Path('/app/data') / 'dispositivos.db'
else:
    db_path = BASE_DIR / 'dispositivos.db'
DATABASE_URL = f"sqlite:///{db_path}"

# Configuração do engine com tratamento de erros
try:
    # Garante que o diretório existe e tem permissões de escrita
    os.makedirs(BASE_DIR, exist_ok=True)
    
    # Configura o engine
    engine = create_engine(
        DATABASE_URL,
        connect_args={
            "check_same_thread": False,
            "timeout": 30,
            "isolation_level": "DEFERRED"  # Nível de isolamento correto para SQLite
        },
        pool_pre_ping=True
    )
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base = declarative_base()
except Exception as e:
    print(f"Erro ao configurar o banco de dados: {e}")
    raise

def init_db():
    try:
        import models
        # Cria as tabelas
        Base.metadata.create_all(bind=engine)
        
        # Tenta carregar o script SQL se existir
        sql_file = BASE_DIR / 'BANCO DE DADOS DOS DISPOSITIVOS .sql'
        if sql_file.exists():
            load_sql_script(str(sql_file))
    except Exception as e:
        print(f"Erro ao inicializar o banco de dados: {e}")
        raise

def load_sql_script(filepath: str):
    try:
        with open(filepath, 'r', encoding='utf-8-sig') as file:
            sql_script = file.read()
        with engine.connect() as connection:
            # Inicia uma transação
            with connection.begin():
                for statement in sql_script.split(';'):
                    if statement.strip():
                        try:
                            # Verifica se é um INSERT e se já existe o registro
                            if 'INSERT' in statement.upper():
                                # Extrai o id_tomb do INSERT
                                import re
                                id_tomb_match = re.search(r"VALUES\s*\(['\"]?(\d+)", statement)
                                if id_tomb_match:
                                    id_tomb = id_tomb_match.group(1)
                                    # Verifica se o registro já existe
                                    result = connection.execute(
                                        text("SELECT 1 FROM dispositivos WHERE id_tomb = :id"),
                                        {"id": id_tomb}
                                    ).scalar()
                                    if result:
                                        print(f"Registro com id_tomb {id_tomb} já existe. Pulando...")
                                        continue
                            
                            connection.execute(text(statement.strip()))
                        except Exception as e:
                            print(f"Erro ao executar comando SQL: {e}")
                            continue
    except Exception as e:
        print(f"Erro ao carregar o script SQL: {e}")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


