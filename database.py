from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = "sqlite:////home/kenji/Desktop/S.I.N.G.E.D_INSS/dispositivos.db"  # Update this to your database URL

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def init_db():
    import models
    Base.metadata.drop_all(bind=engine)  # Apagar tabelas existentes
    Base.metadata.create_all(bind=engine)  # Recriar tabelas
    load_sql_script("/home/kenji/Desktop/S.I.N.G.E.D_INSS/BANCO DE DADOS DOS DISPOSITIVOS .sql")

def load_sql_script(filepath: str):
    with open(filepath, 'r', encoding='utf-8-sig') as file:  # 'utf-8-sig' removes BOM if present
        sql_script = file.read()
    with engine.connect() as connection:
        for statement in sql_script.split(';'):
            if statement.strip():
                connection.execute(text(statement.strip()))

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


