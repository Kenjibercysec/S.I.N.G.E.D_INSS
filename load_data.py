from sqlalchemy import text
from database import Base, engine
import models  # garante que as tabelas estão registradas no metadata

def load_sql_file(filepath: str):
    with open(filepath, 'r', encoding='utf-8') as file:
        sql_commands = file.read()

    # Cria as tabelas se não existirem
    Base.metadata.create_all(bind=engine)

    # Evita erro de duplicidade ao reprocessar o arquivo
    sql_commands = sql_commands.replace(
        "INSERT INTO dispositivos",
        "INSERT OR IGNORE INTO dispositivos"
    )

    with engine.connect() as connection:
        connection.execute(text(sql_commands))
        connection.commit()

if __name__ == "__main__":
    ##sql_file_path = "C:/Users/silas/OneDrive/Desktop/SINGED_/BANCO DE DADOS DOS DISPOSITIVOS .sql"  # Update this path to your .sql file
    sql_file_path = "/home/kenji/Documents/projetos/S.I.N.G.E.D_INSS/BANCO DE DADOS DOS DISPOSITIVOS.sql"
    ##sql_file_path = "C:/Users/vitor/PROJETOS/S.I.N.G.E.D_INSS/BANCO DE DADOS DOS DISPOSITIVOS.sql"
    
    load_sql_file(sql_file_path)
    print("SQL file loaded successfully")
