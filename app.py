from fastapi import FastAPI, Depends, Request, HTTPException, Form
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse, HTMLResponse
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from database import get_db, init_db
from models import Usuario, Device as DeviceModel
from schemas import Device, DeviceCreate
import logging
import multipart  # Ensure this is imported
from pydantic import BaseModel
from typing import Optional
from datetime import date

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

init_db()

app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up...")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down...")

@app.get("/health")
def health_check():
    logger.info("Health check route accessed")
    return {"status": "ok"}

@app.get("/")
def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/outra-pagina")
def outra_pagina(request: Request):
    logger.info("Accessing outra-pagina route")
    return templates.TemplateResponse("outra_pagina.html", {"request": request})

@app.get("/selecao")
def selecao(request: Request):
    logger.info("Accessing selecao route")
    return templates.TemplateResponse("selecao.html", {"request": request})

@app.post("/selecao")
def selecao_post(request: Request, device_type: str = Form(...)):
    logger.info(f"Accessing selecao route with device_type: {device_type}")
    return templates.TemplateResponse("selecao.html", {"request": request})

@app.get("/cadpc.html", response_class=HTMLResponse)
def cadpc(request: Request):
    logger.info("Accessing cadpc route")
    return templates.TemplateResponse("cadpc.html", {"request": request})

@app.get("/api/usuarios")
def get_usuarios(db: Session = Depends(get_db)):
    logger.info("Accessing api/usuarios route")
    usuarios = db.query(Usuario).all()
    return [{"id": u.id, "nome": u.nome, "email": u.email} for u in usuarios]

class DeviceCreateForm(BaseModel):
    id_tomb: int
    tipo_de_disp: str
    qnt_armaz: str
    tipo_armaz: str
    marca: str
    funcionando: bool
    data_de_an: date
    locat_do_disp: str
    descricao: Optional[str] = None

@app.post("/devices/", response_model=Device)
def create_device(
    id_tomb: int = Form(...),
    tipo_de_disp: str = Form(...),
    qnt_armaz: str = Form(...),
    tipo_armaz: str = Form(...),
    marca: str = Form(...),
    funcionando: bool = Form(...),
    data_de_an: date = Form(...),
    locat_do_disp: str = Form(...),
    descricao: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    logger.info("Creating a new device")
    device_data = DeviceCreateForm(
        id_tomb=id_tomb,
        tipo_de_disp=tipo_de_disp,
        qnt_armaz=str(qnt_armaz),  # Ensure qnt_armaz is handled as a string
        tipo_armaz=tipo_armaz,
        marca=marca,
        funcionando=funcionando,
        data_de_an=data_de_an,
        locat_do_disp=locat_do_disp,
        descricao=descricao
    )
    db_device = DeviceModel(**device_data.dict())
    try:
        db.add(db_device)
        db.commit()
        db.refresh(db_device)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Device with this ID already exists")
    return db_device

@app.get("/devices/{id_tomb}", response_model=Device)
def read_device(id_tomb: int, db: Session = Depends(get_db)):
    logger.info(f"Reading device with id_tomb: {id_tomb}")
    device = db.query(DeviceModel).filter(DeviceModel.id_tomb == id_tomb).first()
    if device is None:
        raise HTTPException(status_code=404, detail="Device not found")
    return device

@app.delete("/devices/{id_tomb}")
def delete_device(id_tomb: int, db: Session = Depends(get_db)):
    logger.info(f"Deleting device with id_tomb: {id_tomb}")
    device = db.query(DeviceModel).filter(DeviceModel.id_tomb == id_tomb).first()
    if device is None:
        raise HTTPException(status_code=404, detail="Device not found")
    db.delete(device)
    db.commit()
    return {"detail": "Device deleted successfully"}

@app.get("/devices/{query}")
def search_devices(query: int, db: Session = Depends(get_db)):
    logger.info(f"Searching devices with query: {query}")
    device = db.query(DeviceModel).filter(DeviceModel.id_tomb == query).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    return device

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)