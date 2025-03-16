from sqlalchemy import create_engine, text
from database import Base, engine

def load_sql_file(filepath: str):
    with open(filepath, 'r', encoding='utf-8') as file:
        sql_commands = file.read()
    
    with engine.connect() as connection:
        connection.execute(text(sql_commands))
        connection.commit()

if __name__ == "__main__":
    sql_file_path = "C:/Users/silas/OneDrive/Desktop/SINGED_/BANCO DE DADOS DOS DISPOSITIVOS .sql"  # Update this path to your .sql file
    load_sql_file(sql_file_path)
    print("SQL file loaded successfully")
