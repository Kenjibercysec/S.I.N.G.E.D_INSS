from sqlalchemy import Column, Integer, String, Boolean, Date
from database import Base

class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    email = Column(String, unique=True, index=True)

class Dispositivo(Base):
    __tablename__ = "dispositivos"
    
    id_tomb = Column(Integer, primary_key=True, index=True)
    tipo_de_disp = Column(String, index=True)
    marca = Column(String)
    qnt_ram = Column(Integer)
    qnt_armaz = Column(Integer)
    tipo_armaz = Column(String)
    funcionando = Column(Boolean)
    locat_do_disp = Column(String)
    descricao = Column(String, nullable=True)
    data_de_an = Column(Date)