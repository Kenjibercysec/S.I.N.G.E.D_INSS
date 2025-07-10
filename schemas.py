from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date

class DispositivoBase(BaseModel):
    tipo_de_disp: Optional[str] = None
    qnt_ram: Optional[int] = None
    qnt_armaz: Optional[int] = None
    tipo_armaz: Optional[str] = None
    marca: Optional[str] = None
    modelo: Optional[str] = None
    funcionando: Optional[bool] = None
    data_de_an: Optional[date] = None
    locat_do_disp: Optional[str] = None
    descricao: Optional[str] = None
    estagiario: Optional[str] = None


class DispositivoCreate(DispositivoBase):
    id_tomb: int
    tipo_de_disp: str
    marca: str
    modelo: str

class DispositivoUpdate(DispositivoBase):
    pass

class DispositivoOut(DispositivoBase):
    id_tomb: int

    model_config = ConfigDict(from_attributes=True)

class LogAtualizacaoOut(BaseModel):
    id_log: int
    id_tomb: int
    campo_alterado: str
    valor_antigo: Optional[str]
    valor_novo: Optional[str]
    data_hora_alteracao: date

    model_config = ConfigDict(from_attributes=True)