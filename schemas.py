from pydantic import BaseModel
from typing import Optional
from datetime import date

class DispositivoBase(BaseModel):
    tipo_de_disp: str
    qnt_ram: Optional[int]
    qnt_armaz: Optional[int]
    tipo_armaz: Optional[str]
    marca: str
    modelo: str
    funcionando: Optional[bool]
    data_de_an: Optional[date]
    locat_do_disp: Optional[str]
    descricao: Optional[str]

class DispositivoCreate(DispositivoBase):
    pass

class DispositivoUpdate(DispositivoBase):
    pass

class DispositivoOut(DispositivoBase):
    id_tomb: int

    class Config:
        orm_mode = True

class LogAtualizacaoOut(BaseModel):
    id_log: int
    id_tomb: int
    campo_alterado: str
    valor_antigo: Optional[str]
    valor_novo: Optional[str]
    data_hora_alteracao: date


    class Config:
        orm_mode = True