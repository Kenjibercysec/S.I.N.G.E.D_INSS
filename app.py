from fastapi import FastAPI, Depends, Request, HTTPException, Form, Body  # Adicionar Body para receber JSON
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse, HTMLResponse
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from database import get_db, init_db
from models import Usuario, Dispositivo as DispositivoModel, LogAtualizacao
from schemas import DispositivoOut, DispositivoCreate, DispositivoUpdate  # Corrigir a importação
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
    qnt_ram: Optional[int] = None
    qnt_armaz: Optional[int] = None
    tipo_armaz: Optional[str] = None
    marca: str
    modelo: str
    funcionando: Optional[bool] = None
    data_de_an: Optional[date] = None
    locat_do_disp: Optional[str] = None
    descricao: Optional[str] = None

@app.post("/dispositivos/", response_model=DispositivoOut)
def create_dispositivo(
    dispositivo: DispositivoCreateForm = Body(...),
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

@app.get("/dispositivos/{id_tomb}", response_model=DispositivoOut)  # Usar DispositivoOut
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
def search_dispositivos(query: str, db: Session = Depends(get_db)):
    logger.info(f"Searching dispositivos with query: {query}")
    try:
        # Try to convert query to integer for id_tomb search
        id_tomb = None
        try:
            id_tomb = int(query)
        except ValueError:
            pass

        dispositivos = db.query(DispositivoModel).filter(
            (DispositivoModel.id_tomb == id_tomb) if id_tomb is not None else False |
            DispositivoModel.tipo_de_disp.ilike(f"%{query}%") |
            DispositivoModel.marca.ilike(f"%{query}%") |
            DispositivoModel.modelo.ilike(f"%{query}%") |
            DispositivoModel.locat_do_disp.ilike(f"%{query}%") |
            DispositivoModel.descricao.ilike(f"%{query}%")
        ).all()

        if not dispositivos:
            logger.warning(f"No dispositivos found for query: {query}")
            return {"message": "No dispositivos found", "results": []}
        
        logger.info(f"Found {len(dispositivos)} dispositivos")
        return {
            "message": "Dispositivos found successfully",
            "results": [{
                "id_tomb": d.id_tomb,
                "tipo_de_disp": d.tipo_de_disp,
                "marca": d.marca,
                "modelo": d.modelo,
                "locat_do_disp": d.locat_do_disp,
                "funcionando": d.funcionando
            } for d in dispositivos]
        }
    except Exception as e:
        logger.error(f"Error searching dispositivos: {e}")
        raise HTTPException(status_code=500, detail="Error searching dispositivos")

@app.get("/dispositivos/", response_model=list[DispositivoOut])
def list_dispositivos(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    logger.info(f"Listing dispositivos with skip={skip}, limit={limit}")
    try:
        dispositivos = db.query(DispositivoModel).offset(skip).limit(limit).all()
        return dispositivos
    except Exception as e:
        logger.error(f"Error listing dispositivos: {e}")
        raise HTTPException(status_code=500, detail="Error listing dispositivos")

@app.get("/dispositivos/{id_tomb}/history")
def get_dispositivo_history(id_tomb: int, db: Session = Depends(get_db)):
    logger.info(f"Getting history for dispositivo with id_tomb: {id_tomb}")
    try:
        history = db.query(LogAtualizacao).filter(LogAtualizacao.id_tomb == id_tomb).all()
        if not history:
            return {"message": "No history found", "results": []}
        return {
            "message": "History retrieved successfully",
            "results": [{
                "id_log": h.id_log,
                "id_tomb": h.id_tomb,
                "campo_alterado": h.campo_alterado,
                "valor_antigo": h.valor_antigo,
                "valor_novo": h.valor_novo,
                "data_hora_alteracao": h.data_hora_alteracao
            } for h in history]
        }
    except Exception as e:
        logger.error(f"Error getting history: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving history")

@app.put("/dispositivos/{id_tomb}", response_model=DispositivoOut)
def update_dispositivo(
    id_tomb: int,
    dispositivo: DispositivoCreateForm = Body(...),
    db: Session = Depends(get_db)
):
    logger.info(f"Updating dispositivo with id_tomb: {id_tomb}")
    try:
        db_dispositivo = db.query(DispositivoModel).filter(DispositivoModel.id_tomb == id_tomb).first()
        if not db_dispositivo:
            raise HTTPException(status_code=404, detail="Dispositivo not found")

        # Log changes before updating
        for field, value in dispositivo.dict().items():
            if field != "id_tomb" and getattr(db_dispositivo, field) != value:
                log = LogAtualizacao(
                    id_tomb=id_tomb,
                    campo_alterado=field,
                    valor_antigo=str(getattr(db_dispositivo, field)),
                    valor_novo=str(value)
                )
                db.add(log)
                setattr(db_dispositivo, field, value)

        db.commit()
        db.refresh(db_dispositivo)
        return db_dispositivo
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating dispositivo: {e}")
        raise HTTPException(status_code=500, detail="Error updating dispositivo")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)



