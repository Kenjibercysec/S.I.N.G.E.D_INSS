from pydantic import BaseModel
from typing import Optional
from datetime import date

class DispositivoBase(BaseModel):
    id_tomb: int
    tipo_de_disp: str
    marca: str
    qnt_ram: Optional[int] = None
    qnt_armaz: Optional[int] = None
    tipo_armaz: Optional[str] = None
    funcionando: Optional[bool] = None
    locat_do_disp: Optional[str] = None
    descricao: Optional[str] = None
    data_de_an: Optional[date] = None

class DispositivoCreate(DispositivoBase):
    pass

class Dispositivo(DispositivoBase):
    class Config:
        from_attributes = True
