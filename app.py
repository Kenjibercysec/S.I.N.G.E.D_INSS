from fastapi import FastAPI, Depends, Request, HTTPException, Form, Body  # Adicionar Body para receber JSON
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse, HTMLResponse
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from database import get_db, init_db
from models import Usuario, Dispositivo as DispositivoModel
from schemas import Dispositivo, DispositivoCreate
import logging
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

@app.get("/cadpc", response_class=HTMLResponse)
def cadpc(request: Request):
    logger.info("Accessing cadpc route")
    return templates.TemplateResponse("cadpc.html", {"request": request})

@app.get("/cadother", response_class=HTMLResponse)
def cadother(request: Request):
    logger.info("Accessing cadother route")
    return templates.TemplateResponse("cadother.html", {"request": request})

@app.get("/api/usuarios")
def get_usuarios(db: Session = Depends(get_db)):
    logger.info("Accessing api/usuarios route")
    usuarios = db.query(Usuario).all()
    return [{"id": u.id, "nome": u.nome, "email": u.email} for u in usuarios]

class DispositivoCreateForm(BaseModel):
    id_tomb: int
    tipo_de_disp: str
    qnt_armaz: str
    tipo_armaz: str
    marca: str
    funcionando: bool
    data_de_an: date
    locat_do_disp: str
    descricao: Optional[str] = None

@app.post("/dispositivos/", response_model=Dispositivo)
def create_dispositivo(
    dispositivo: DispositivoCreate = Body(...),  # Receber os dados no corpo da requisição como JSON
    db: Session = Depends(get_db)
):
    logger.info(f"Received POST request to /dispositivos/ with data: {dispositivo.dict()}")
    db_dispositivo = DispositivoModel(**dispositivo.dict())
    try:
        db.add(db_dispositivo)
        db.commit()
        db.refresh(db_dispositivo)
        logger.info(f"Dispositivo created successfully: {db_dispositivo}")
    except IntegrityError as e:
        db.rollback()
        logger.error(f"IntegrityError: {e}")
        raise HTTPException(status_code=400, detail="Dispositivo with this ID already exists")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
    return db_dispositivo

@app.get("/dispositivos/{id_tomb}", response_model=Dispositivo)
def read_dispositivo(id_tomb: int, db: Session = Depends(get_db)):
    logger.info(f"Attempting to read dispositivo with id_tomb: {id_tomb}")
    dispositivo = db.query(DispositivoModel).filter(DispositivoModel.id_tomb == id_tomb).first()
    if dispositivo is None:
        logger.warning(f"Dispositivo with id_tomb {id_tomb} not found")
        raise HTTPException(status_code=404, detail="Dispositivo not found")
    logger.info(f"Dispositivo found: {dispositivo}")
    return dispositivo

@app.delete("/dispositivos/{id_tomb}")
def delete_dispositivo(id_tomb: int, db: Session = Depends(get_db)):
    logger.info(f"Deleting dispositivo with id_tomb: {id_tomb}")
    dispositivo = db.query(DispositivoModel).filter(DispositivoModel.id_tomb == id_tomb).first()
    if dispositivo is None:
        raise HTTPException(status_code=404, detail="Dispositivo not found")
    db.delete(dispositivo)
    db.commit()
    return {"detail": "Dispositivo deleted successfully"}

@app.get("/dispositivos/search/{query}")
def search_dispositivos(query: int, db: Session = Depends(get_db)):
    logger.info(f"Searching dispositivos with query: {query}")
    dispositivo = db.query(DispositivoModel).filter(DispositivoModel.id_tomb == query).first()
    if not dispositivo:
        raise HTTPException(status_code=404, detail="Dispositivo not found")
    return dispositivo

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)