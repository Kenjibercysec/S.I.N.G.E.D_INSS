from sqlalchemy import TIMESTAMP, Column, ForeignKey, Integer, String, Boolean, Date, Text, func
from database import Base



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
    estagiario = Column(String(50))

class LogAtualizacao(Base):
    __tablename__ = "log_atualizacoes"

    id_log = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_tomb = Column(Integer, ForeignKey("dispositivos.id_tomb"), nullable=False)
    estado_anterior = Column(Text)
    data_hora_alteracao = Column(TIMESTAMP, server_default=func.now())

class OutroDispositivo(Base):
    __tablename__ = 'outros_dispositivos'

    id = Column(Integer, primary_key=True, index=True)
    id_tomb = Column(Integer, unique=True, index=True)
    tipo_de_disp = Column(String, index=True)
    marca = Column(String)
    modelo = Column(String)
    funcionando = Column(Boolean)
    data_de_an = Column(Date)
    locat_do_disp = Column(String)
    descricao = Column(String)
    estagiario = Column(String)