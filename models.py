from sqlalchemy import TIMESTAMP, Column, ForeignKey, Integer, String, Boolean, Date, Text, func
from database import Base

class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    email = Column(String, unique=True, index=True)

class Dispositivo(Base):
    __tablename__ = "dispositivos"

    id_tomb = Column(Integer, primary_key=True, index=True)
    tipo_de_disp = Column(String(50), nullable=False)
    qnt_ram = Column(Integer)
    qnt_armaz = Column(Integer)
    tipo_armaz = Column(String(10))
    marca = Column(String(50), nullable=False)
    modelo = Column(String(50), nullable=False)  # Alterar para permitir valores nulos
    funcionando = Column(Boolean)
    data_de_an = Column(Date)
    locat_do_disp = Column(String(100))
    descricao = Column(Text)

class LogAtualizacao(Base):
    __tablename__ = "log_atualizacoes"

    id_log = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_tomb = Column(Integer, ForeignKey("dispositivos.id_tomb"), nullable=False)
    campo_alterado = Column(String(50))
    valor_antigo = Column(Text)
    valor_novo = Column(Text)
    data_hora_alteracao = Column(TIMESTAMP, server_default=func.now())