from pydantic import BaseModel
from typing import Optional
from datetime import date

class DeviceBase(BaseModel):
    tipo_de_disp: str
    qnt_armaz: str
    tipo_armaz: str
    marca: str
    funcionando: bool
    data_de_an: date
    locat_do_disp: str
    descricao: Optional[str] = None

class DeviceCreate(DeviceBase):
    pass

class Device(DeviceBase):
    id_tomb: int

    class Config:
        from_attributes = True
