from fastapi import FastAPI, Depends, Request, HTTPException, Form, Body, Query  # Adicionar Body para receber JSON
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse, HTMLResponse
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from database import get_db, init_db
from models import Dispositivo as DispositivoModel, LogAtualizacao, OutroDispositivo
from schemas import DispositivoOut, DispositivoCreate, DispositivoUpdate  # Corrigir a importação
import logging
from pydantic import BaseModel
from typing import Optional
from datetime import date
from sqlalchemy.types import String
from sqlalchemy import func
import json
import os
from fastapi import Response, Cookie
from fastapi.responses import RedirectResponse
from datetime import timedelta


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


app = FastAPI()

init_db()

COOKIE_EXPIRE_SECONDS = 100 * 60

ADMIN_PASSWORD = "inss"
ADMIN_USERNAME = "admin"

app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")

OPTIONS_FILE = os.path.join('static', 'options.json')

def load_options():
    try:
        # Garantir que o diretório existe
        os.makedirs(os.path.dirname(OPTIONS_FILE), exist_ok=True)
        
        # Se o arquivo não existir, criar com valores padrão
        if not os.path.exists(OPTIONS_FILE):
            default_options = {
                'marcas': ['Positivo', 'Lenovo', 'Daten', 'Dell', 'Acer'],
                'tipos_dispositivo': ['Desktop', 'Notebook'],
                'tipos_armazenamento': ['NAN', 'HDD', 'SSD'],
                'quantidades_ram': ['0', '1', '2', '4', '6', '8', '12', '16'],
                'quantidades_armazenamento': ['0', '120', '128', '160', '240', '256', '320', '500', '1000']
            }
            with open(OPTIONS_FILE, 'w', encoding='utf-8') as f:
                json.dump(default_options, f, indent=4, ensure_ascii=False)
            return default_options
        
        # Se o arquivo existir, carregar as opções
        with open(OPTIONS_FILE, 'r', encoding='utf-8') as f:
            options = json.load(f)
            
        # Garantir que todas as chaves necessárias existam
        required_keys = ['marcas', 'tipos_dispositivo', 'tipos_armazenamento', 'quantidades_ram', 'quantidades_armazenamento']
        for key in required_keys:
            if key not in options:
                options[key] = []
                
        return options
    except Exception as e:
        logger.error(f"Erro ao carregar opções: {str(e)}")
        # Retornar opções vazias em caso de erro
        return {
            'marcas': [],
            'tipos_dispositivo': [],
            'tipos_armazenamento': [],
            'quantidades_ram': [],
            'quantidades_armazenamento': []
        }

def save_options(options):
    try:
        # Garantir que o diretório existe
        os.makedirs(os.path.dirname(OPTIONS_FILE), exist_ok=True)
        
        # Garantir que todas as chaves necessárias existam
        required_keys = ['marcas', 'tipos_dispositivo', 'tipos_armazenamento', 'quantidades_ram', 'quantidades_armazenamento']
        for key in required_keys:
            if key not in options:
                options[key] = []
        
        # Salvar as opções
        with open(OPTIONS_FILE, 'w', encoding='utf-8') as f:
            json.dump(options, f, indent=4, ensure_ascii=False)
        return True
    except Exception as e:
        logger.error(f"Erro ao salvar opções: {str(e)}")
        return False

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up...")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down...")

@app.get("/")
def read_root(request: Request):
    # Carrega todas as listas de opções do arquivo JSON
    options = load_options()
    
    # Junta as opções de PC e Outros para ter filtros completos
    all_models = sorted(list(set(options.get('modelos_pc', []) + options.get('modelo_outros', []))))
    
    # Cria o dicionário 'filtros' para ser consistente com o dashboard
    filtros = {
        "tipos": sorted(list(set(options.get('tipos_dispositivo', []) + options.get('tipos_outros', [])))),
        "marcas": sorted(list(set(options.get('marcas', []) + options.get('marcas_outros', [])))),
        "modelos": all_models,
        "funcionando": sorted(options.get('funcionando', [])),
        "tipos_armazenamento": sorted(options.get('tipos_armazenamento', [])),
        "quantidades_ram": sorted(options.get('quantidades_ram', [])),
        "quantidades_armazenamento": sorted(options.get('quantidades_armazenamento', [])),
        "estagiarios": (options.get('estagiarios', []))
    }
    
    # Envia os dados para a página dentro do 'context'
    context = {
        "request": request,
        "filtros": filtros
    }
    return templates.TemplateResponse("index.html", context)

@app.get("/login")
def login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})
    

@app.post("/login")
async def post_login(
    request: Request,
    response: Response,
    username: str = Form(...),
    password: str = Form(...)
):
    if username.strip() == ADMIN_USERNAME and password.strip() == ADMIN_PASSWORD:
        response = RedirectResponse(url="/admin", status_code=303)
        response.set_cookie(
            key="logged_in",
            value="true",
            httponly=True,
            max_age=COOKIE_EXPIRE_SECONDS,
            expires=COOKIE_EXPIRE_SECONDS
        )
        return response
    else:
        return templates.TemplateResponse("login.html", {
            "request": request,
            "error": "Credenciais inválidas",
        })


@app.get("/admin")
def admin_dashboard(request: Request, logged_in: str = Cookie(None)):
    if logged_in != "true":
        return RedirectResponse(url="/login", status_code=303)
    # seu código para renderizar dashboard aqui...
    options = load_options()
    return templates.TemplateResponse(
        "admin_dashboard.html",
        {
            "request": request,
            "marcas": options.get('marcas', []),
            "modelos_pc": options.get('modelos_pc', []),
            "tipos": options.get('tipos_dispositivo', []),
            "armazenamento": options.get('tipos_armazenamento', []),
            "quantidades_ram": options.get('quantidades_ram', []),
            "quantidades_armazenamento": options.get('quantidades_armazenamento', []),
            "marcas_outros": options.get('marcas_outros', []),
            "modelo_outros": options.get('modelo_outros', []),
            "tipos_outros": options.get('tipos_outros', []),
            "estagiarios": options.get('estagiarios', []),
            "funcionando": options.get('funcionando', [])
        }
    )


@app.get("/logout")
def logout(response: Response):
    response = RedirectResponse(url="/login", status_code=303)
    # Apaga o cookie definindo max_age=0
    response.delete_cookie(key="logged_in")
    return response

@app.get("/dashboard", response_class=HTMLResponse)
def get_dashboard(request: Request, db: Session = Depends(get_db)):
    try:
        dispositivos = db.query(DispositivoModel).all() + db.query(OutroDispositivo).all()
        total = len(dispositivos)
        funcionando_count = sum(1 for d in dispositivos if d.funcionando)
        
        def count_by(key):
            counts = {}
            for d in dispositivos:
                val = getattr(d, key) or 'N/A'
                counts[val] = counts.get(val, 0) + 1
            return counts

        contagem_por_tipo = count_by('tipo_de_disp')
        contagem_por_marca = count_by('marca')
        contagem_por_modelo = count_by('modelo')
        contagem_por_estagiario = count_by('estagiario')
        
        # SOLUÇÃO AQUI: Carrega as opções do options.json para os filtros.
        options = load_options()
        all_models = sorted(list(set(options.get('modelos_pc', []) + options.get('modelo_outros', []))))
        filtros = {
            "tipos": sorted(list(set(options.get('tipos_dispositivo', []) + options.get('tipos_outros', [])))),
            "marcas": sorted(list(set(options.get('marcas', []) + options.get('marcas_outros', [])))),
            "modelos": all_models,
            "estagiarios": sorted(options.get('estagiarios', []))
        }
        
        context = {
            "request": request,
            "total_dispositivos": total,
            "funcionando": funcionando_count,
            "nao_funcionando": total - funcionando_count,
            "contagem_por_tipo": json.dumps(contagem_por_tipo),
            "contagem_por_marca": json.dumps(contagem_por_marca),
            "contagem_por_modelo": json.dumps(contagem_por_modelo),
            "contagem_por_estagiario": json.dumps(contagem_por_estagiario),
            "dispositivos": dispositivos,
            "filtros": filtros
        }
        return templates.TemplateResponse("dashboard.html", context)
    except Exception as e:
        logger.error(f"Erro no dashboard: {e}")
        return templates.TemplateResponse("dashboard.html", {"request": request, "error": "Erro ao carregar dados."})


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
    estagiario: Optional[str] = None

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
    logger.info(f"Deletando dispositivo com id_tomb: {id_tomb}")
    dispositivo = db.query(DispositivoModel).filter(DispositivoModel.id_tomb == id_tomb).first()
    if dispositivo:
        db.delete(dispositivo)
        db.commit()
        return {"detail": "Dispositivo deletado com sucesso"}
    # Se não achou em DispositivoModel, tenta em OutroDispositivo
    outro = db.query(OutroDispositivo).filter(OutroDispositivo.id_tomb == id_tomb).first()
    if outro:
        db.delete(outro)
        db.commit()
        return {"detail": "Outro dispositivo deletado com sucesso"}
    raise HTTPException(status_code=404, detail="Dispositivo não encontrado")

@app.get("/dispositivos/search/")
def search_dispositivos(
    db: Session = Depends(get_db),
    q: str = Query(None),
    id_tomb: str = Query(None),
    marca: str = Query(None),
    modelo: str = Query(None),
    funcionando: str = Query(None),
    tipo_armaz: str = Query(None),
    qnt_ram: str = Query(None),
    qnt_armaz: str = Query(None),
    tipo_de_disp: str = Query(None),
    estagiario: str = Query(None),
    locat_do_disp: str = Query(None),
    descricao: str = Query(None),
    data_de_an: str = Query(None),
):
    logger.info(f"Searching dispositivos with advanced filters")
    try:
        from sqlalchemy import and_, or_, cast, String
        filtros_pc = []
        filtros_outros = []
        if q:
            filtros_pc.append(or_(
                DispositivoModel.id_tomb.cast(String).ilike(f"%{q}%"),
                DispositivoModel.marca.ilike(f"%{q}%"),
                DispositivoModel.modelo.ilike(f"%{q}%"),
                DispositivoModel.funcionando.cast(String).ilike(f"%{q}%"),
                DispositivoModel.tipo_armaz.ilike(f"%{q}%"),
                DispositivoModel.qnt_ram.cast(String).ilike(f"%{q}%"),
                DispositivoModel.tipo_de_disp.ilike(f"%{q}%"),
                DispositivoModel.estagiario.ilike(f"%{q}%")
            ))
            filtros_outros.append(or_(
                OutroDispositivo.id_tomb.cast(String).ilike(f"%{q}%"),
                OutroDispositivo.marca.ilike(f"%{q}%"),
                OutroDispositivo.modelo.ilike(f"%{q}%"),
                OutroDispositivo.funcionando.cast(String).ilike(f"%{q}%"),
                OutroDispositivo.estagiario.ilike(f"%{q}%")
            ))
        else:
            if id_tomb:
                filtros_pc.append(DispositivoModel.id_tomb.cast(String).ilike(f"%{id_tomb}%"))
                filtros_outros.append(OutroDispositivo.id_tomb.cast(String).ilike(f"%{id_tomb}%"))
            if marca:
                filtros_pc.append(DispositivoModel.marca.ilike(f"%{marca}%"))
                filtros_outros.append(OutroDispositivo.marca.ilike(f"%{marca}%"))
            if estagiario:
                filtros_pc.append(DispositivoModel.estagiario.cast(String).ilike(f"%{estagiario}%"))
                filtros_outros.append(OutroDispositivo.estagiario.cast(String).ilike(f"%{estagiario}%"))
            if modelo:
                filtros_pc.append(DispositivoModel.modelo.ilike(f"%{modelo}%"))
                filtros_outros.append(OutroDispositivo.modelo.ilike(f"%{modelo}%"))
            if funcionando is not None and funcionando != "":
                funcionando_bool = None
                if funcionando.lower() == "true":
                    funcionando_bool = True
                if funcionando.lower() == "false":
                    funcionando_bool = False
                if funcionando_bool is not None:
                    # Adiciona o filtro de funcionamento apenas se o valor for válido
                    filtros_pc.append(DispositivoModel.funcionando == funcionando_bool)
                    filtros_outros.append(OutroDispositivo.funcionando == funcionando_bool)
            if tipo_armaz:
                filtros_pc.append(DispositivoModel.tipo_armaz.ilike(f"%{tipo_armaz}%"))
                
            if qnt_ram:
                filtros_pc.append(DispositivoModel.qnt_ram.cast(String).ilike(f"%{qnt_ram}%"))
                
            if qnt_armaz:
                filtros_pc.append(DispositivoModel.qnt_armaz.cast(String).ilike(f"%{qnt_armaz}%"))
                
            if tipo_de_disp:
                filtros_pc.append(DispositivoModel.tipo_de_disp.ilike(f"%{tipo_de_disp}%"))
                filtros_outros.append(OutroDispositivo.tipo_de_disp.ilike(f"%{tipo_de_disp}%"))
            if estagiario:
                filtros_pc.append(DispositivoModel.estagiario.ilike(f"%{estagiario}%"))
                filtros_outros.append(OutroDispositivo.estagiario.ilike(f"%{estagiario}%"))
            if locat_do_disp:
                filtros_pc.append(DispositivoModel.locat_do_disp.ilike(f"%{locat_do_disp}%"))
                filtros_outros.append(OutroDispositivo.locat_do_disp.ilike(f"%{locat_do_disp}%"))
            if descricao:
                filtros_pc.append(DispositivoModel.descricao.ilike(f"%{descricao}%"))
                filtros_outros.append(OutroDispositivo.descricao.ilike(f"%{descricao}%"))
            if data_de_an:
                filtros_pc.append(DispositivoModel.data_de_an.cast(String).ilike(f"%{data_de_an}%"))
                filtros_outros.append(OutroDispositivo.data_de_an.cast(String).ilike(f"%{data_de_an}%"))
        if filtros_pc:
            dispositivos_pc = db.query(DispositivoModel).filter(and_(*filtros_pc)).all()
        else:
            dispositivos_pc = db.query(DispositivoModel).all()
        # Se algum filtro de computador foi usado, não busque outros dispositivos
        if tipo_armaz or qnt_ram or qnt_armaz:
            outros_dispositivos = []
        else:
            if filtros_outros:
                outros_dispositivos = db.query(OutroDispositivo).filter(and_(*filtros_outros)).all()
            else:
                outros_dispositivos = db.query(OutroDispositivo).all()
        dispositivos = dispositivos_pc + outros_dispositivos
        if not dispositivos:
            logger.warning(f"No dispositivos found for advanced filters")
            return {"message": "No dispositivos found", "results": []}
        logger.info(f"Found {len(dispositivos)} dispositivos")
        dispositivos_dict = []
        for dispositivo in dispositivos:
            dispositivo_dict = {
                "id_tomb": dispositivo.id_tomb,
                "tipo_de_disp": dispositivo.tipo_de_disp,
                "marca": dispositivo.marca,
                "modelo": dispositivo.modelo,
                "funcionando": dispositivo.funcionando,
                "data_de_an": dispositivo.data_de_an,
                "locat_do_disp": dispositivo.locat_do_disp,
                "descricao": dispositivo.descricao,
                "estagiario": dispositivo.estagiario
            }
            # Se for DispositivoModel (computador), inclua os campos extras
            if hasattr(dispositivo, "qnt_ram"):
                dispositivo_dict["qnt_ram"] = dispositivo.qnt_ram
                dispositivo_dict["qnt_armaz"] = dispositivo.qnt_armaz
                dispositivo_dict["tipo_armaz"] = dispositivo.tipo_armaz
            # Se não for, não inclui esses campos
            dispositivos_dict.append(dispositivo_dict)
        return {
            "message": "Dispositivos found successfully",
            "results": dispositivos_dict
        }
    except Exception as e:
        logger.error(f"Error searching dispositivos: {e}")
        raise HTTPException(status_code=500, detail=str(e))

from sqlalchemy import or_, cast, String

@app.get("/dispositivos/autocomplete/{query}")
def autocomplete_dispositivos(query: str, db: Session = Depends(get_db)):
    logger.info(f"Autocompleting dispositivos with query: {query}")
    try:
        # Filtros para DispositivoModel (PCs)
        dispositivos_pc = db.query(DispositivoModel).filter(
            or_(
                DispositivoModel.id_tomb.cast(String).ilike(f"%{query}%"),
                DispositivoModel.tipo_de_disp.ilike(f"%{query}%"),
                DispositivoModel.marca.ilike(f"%{query}%"),
                DispositivoModel.modelo.ilike(f"%{query}%"),
                DispositivoModel.estagiario.ilike(f"%{query}%")
            )
        ).limit(5).all()

        # Filtros para OutroDispositivo (outros dispositivos)
        dispositivos_outros = db.query(OutroDispositivo).filter(
            or_(
                OutroDispositivo.id_tomb.cast(String).ilike(f"%{query}%"),
                OutroDispositivo.tipo_de_disp.ilike(f"%{query}%"),
                OutroDispositivo.marca.ilike(f"%{query}%"),
                OutroDispositivo.modelo.ilike(f"%{query}%"),
                OutroDispositivo.estagiario.ilike(f"%{query}%")
            )
        ).limit(5).all()

        # Junta os resultados
        dispositivos = dispositivos_pc + dispositivos_outros

        return {
            "results": [{
                "id_tomb": d.id_tomb,
                "tipo_de_disp": d.tipo_de_disp,
                "marca": d.marca,
                "modelo": d.modelo,
                "estagiario": d.estagiario
            } for d in dispositivos]
        }
    except Exception as e:
        logger.error(f"Error in autocomplete: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/dispositivos/", response_model=list[DispositivoOut])
def list_dispositivos(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    logger.info(f"Listing dispositivos with skip={skip}, limit={limit}")
    try:
        # Buscar dispositivos de ambas as tabelas
        dispositivos_pc = db.query(DispositivoModel).order_by(DispositivoModel.data_de_an.desc().nullslast()).all()
        outros_dispositivos = db.query(OutroDispositivo).order_by(OutroDispositivo.data_de_an.desc().nullslast()).all()

        # Combinar os resultados
        todos_dispositivos = dispositivos_pc + outros_dispositivos
        
        # Ordenar por data_de_an (mais recente primeiro), tratando None como mais antigo
        todos_dispositivos.sort(
            key=lambda x: x.data_de_an if x.data_de_an is not None else date(1900, 1, 1),
            reverse=True
        )
        
        # Converter para dicionário para garantir que todos os campos estejam presentes
        dispositivos_dict = []
        for dispositivo in todos_dispositivos[skip:skip+limit]:
            dispositivo_dict = {
                "id_tomb": dispositivo.id_tomb,
                "tipo_de_disp": dispositivo.tipo_de_disp,
                **({"qnt_ram": dispositivo.qnt_ram} if hasattr(dispositivo, "qnt_ram") else {}),
                **({"qnt_armaz": dispositivo.qnt_armaz} if hasattr(dispositivo, "qnt_armaz") else {}),
                **({"tipo_armaz": dispositivo.tipo_armaz} if hasattr(dispositivo, "tipo_armaz") else {}),
                "marca": dispositivo.marca,
                "modelo": dispositivo.modelo,
                "funcionando": dispositivo.funcionando,
                "data_de_an": dispositivo.data_de_an,
                "locat_do_disp": dispositivo.locat_do_disp,
                "descricao": dispositivo.descricao,
                "estagiario": dispositivo.estagiario
            }
            dispositivos_dict.append(dispositivo_dict)
        
        return dispositivos_dict
    except Exception as e:
        logger.error(f"Error listing dispositivos: {e}")
        raise HTTPException(status_code=500, detail="Error listing dispositivos")

@app.get("/dispositivos/{id_tomb}/history")
def get_dispositivo_history(id_tomb: int, db: Session = Depends(get_db)):
    logger.info(f"Getting history for dispositivo with id_tomb: {id_tomb}")
    try:
        # Buscar histórico de alterações para o tombamento
        history = db.query(LogAtualizacao)\
            .filter(LogAtualizacao.id_tomb == id_tomb)\
            .order_by(LogAtualizacao.data_hora_alteracao.desc())\
            .all()

        if not history:
            return {"message": "No history found", "results": []}

        # Buscar data_de_an do dispositivo (ou outros_dispositivos)
        dispositivo = db.query(DispositivoModel).filter(DispositivoModel.id_tomb == id_tomb).first()
        if not dispositivo:
            dispositivo = db.query(OutroDispositivo).filter(OutroDispositivo.id_tomb == id_tomb).first()
        data_de_an = dispositivo.data_de_an.isoformat() if dispositivo and dispositivo.data_de_an else None

        # Organizar histórico pela data_de_an (se existir)
        # Como cada log já tem data_hora_alteracao, mas a ordenação principal é por data_de_an
        # (caso haja mais de um dispositivo com o mesmo tombamento, pode ser ajustado)

        # Exibir o snapshot salvo em estado_anterior
        return {
            "message": "History retrieved successfully",
            "data_de_an": data_de_an,
            "results": [
                {
                    "id_log": h.id_log,
                    "id_tomb": h.id_tomb,
                    "estado_anterior": json.loads(h.estado_anterior) if h.estado_anterior else None,
                    "data_hora_alteracao": h.data_hora_alteracao.strftime("%d/%m/%Y %H:%M:%S") if h.data_hora_alteracao else None
                }
                for h in sorted(history, key=lambda x: x.data_hora_alteracao, reverse=True)
            ]
        }
    except Exception as e:
        logger.error(f"Error getting history: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/dispositivos/{id_tomb}", response_model=DispositivoOut)
def update_dispositivo(
    id_tomb: int,
    dispositivo: DispositivoCreateForm = Body(...),
    db: Session = Depends(get_db)
):
    logger.info(f"Updating dispositivo with id_tomb: {id_tomb}")
    logger.info(f"Received data: {dispositivo.dict()}")  # Debug log
    try:
        # Primeiro tenta na tabela de computadores
        db_dispositivo = db.query(DispositivoModel).filter(DispositivoModel.id_tomb == id_tomb).first()
        if db_dispositivo:
            # Serializar o estado anterior completo do dispositivo
            estado_anterior = {
                "id_tomb": db_dispositivo.id_tomb,
                "tipo_de_disp": db_dispositivo.tipo_de_disp,
                "qnt_ram": db_dispositivo.qnt_ram,
                "qnt_armaz": db_dispositivo.qnt_armaz,
                "tipo_armaz": db_dispositivo.tipo_armaz,
                "marca": db_dispositivo.marca,
                "modelo": db_dispositivo.modelo,
                "funcionando": db_dispositivo.funcionando,
                "data_de_an": db_dispositivo.data_de_an.isoformat() if db_dispositivo.data_de_an else None,
                "locat_do_disp": db_dispositivo.locat_do_disp,
                "descricao": db_dispositivo.descricao,
                "estagiario": db_dispositivo.estagiario
            }
            log = LogAtualizacao(
                id_tomb=id_tomb,
                estado_anterior=json.dumps(estado_anterior, ensure_ascii=False),
                data_hora_alteracao=func.now()
            )
            db.add(log)

            # Atualizar os campos do dispositivo
            for field, new_value in dispositivo.dict().items():
                if field != "id_tomb":
                    setattr(db_dispositivo, field, new_value)

            try:
                db.commit()
                db.refresh(db_dispositivo)
                logger.info(f"Dispositivo atualizado com sucesso: {db_dispositivo.__dict__}")  # Debug log
                return db_dispositivo
            except Exception as commit_error:
                db.rollback()
                logger.error(f"Erro ao commitar alterações: {commit_error}")
                raise HTTPException(status_code=500, detail=f"Erro ao salvar alterações: {str(commit_error)}")
        
        # Se não achou, tenta na tabela de outros dispositivos
        db_outro = db.query(OutroDispositivo).filter(OutroDispositivo.id_tomb == id_tomb).first()
        if db_outro:
            # Atualizar apenas os campos válidos para OutroDispositivo
            outro_fields = [
                "tipo_de_disp", "marca", "modelo", "funcionando",
                "data_de_an", "locat_do_disp", "descricao", "estagiario"
            ]
            for field in outro_fields:
                if hasattr(db_outro, field) and hasattr(dispositivo, field):
                    setattr(db_outro, field, getattr(dispositivo, field))
            try:
                db.commit()
                db.refresh(db_outro)
                logger.info(f"OutroDispositivo atualizado com sucesso: {db_outro.__dict__}")
                return db_outro
            except Exception as commit_error:
                db.rollback()
                logger.error(f"Erro ao commitar alterações: {commit_error}")
                raise HTTPException(status_code=500, detail=f"Erro ao salvar alterações: {str(commit_error)}")

        # Se não achou em nenhuma tabela
        raise HTTPException(status_code=404, detail="Dispositivo not found")
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating dispositivo: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/outros_dispositivos/")
def create_outro_dispositivo(dispositivo: DispositivoCreateForm, db: Session = Depends(get_db)):
    logger.info(f"Received POST request to /outros_dispositivos/ with data: {dispositivo.dict()}")
    # Filtrar apenas os campos válidos para OutroDispositivo
    outro_fields = [
        "id_tomb", "tipo_de_disp", "marca", "modelo", "funcionando",
        "data_de_an", "locat_do_disp", "descricao", "estagiario"
    ]
    outro_data = {k: v for k, v in dispositivo.dict().items() if k in outro_fields}
    db_dispositivo = OutroDispositivo(**outro_data)
    try:
        db.add(db_dispositivo)
        db.commit()
        db.refresh(db_dispositivo)
        logger.info(f"Outro dispositivo created successfully: {db_dispositivo}")
    except IntegrityError as e:
        db.rollback()
        logger.error(f"IntegrityError: {e}")
        raise HTTPException(status_code=400, detail="Dispositivo with this ID already exists")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/admin/options")
def get_options():
    try:
        return load_options()
    except Exception as e:
        logger.error(f"Erro ao obter opções: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/admin/options/{option_type}")
def add_option(option_type: str, value: dict = Body(...)):
    try:
        if not value or 'value' not in value:
            raise HTTPException(status_code=400, detail="Valor não fornecido")
        
        options = load_options()
        option_key = {
            'marcas': 'marcas',
            'modelos_pc': 'modelos_pc',
            'tipos_dispositivo': 'tipos_dispositivo',
            'tipos_armazenamento': 'tipos_armazenamento',
            'quantidades_ram': 'quantidades_ram',
            'quantidades_armazenamento': 'quantidades_armazenamento',
            'marcas_outros': 'marcas_outros',
            'modelo_outros': 'modelo_outros',
            'tipos_outros': 'tipos_outros',
            'estagiarios': 'estagiarios',
            'funcionando': 'funcionando'
        }.get(option_type)
        
        if not option_key:
            raise HTTPException(status_code=400, detail="Tipo de opção inválido")
        
        # Converter para string se for número
        value_str = str(value['value'])
        
        if value_str in options[option_key]:
            raise HTTPException(status_code=400, detail="Valor já existe")
        
        options[option_key].append(value_str)
        if not save_options(options):
            raise HTTPException(status_code=500, detail="Erro ao salvar opções")
        
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao adicionar opção: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/admin/options/{option_type}/{value}")
def delete_option(option_type: str, value: str):
    try:
        options = load_options()
        option_key = {
            'marcas': 'marcas',
            'modelos_pc': 'modelos_pc',
            'tipos_dispositivo': 'tipos_dispositivo',
            'tipos_armazenamento': 'tipos_armazenamento',
            'quantidades_ram': 'quantidades_ram',
            'quantidades_armazenamento': 'quantidades_armazenamento',
            'marcas_outros': 'marcas_outros',
            'modelo_outros': 'modelo_outros',
            'tipos_outros': 'tipos_outros',
            'estagiarios': 'estagiarios',
            'funcionando': 'funcionando'
        }.get(option_type)
        
        if not option_key:
            raise HTTPException(status_code=400, detail="Tipo de opção inválido")
        
        if value not in options[option_key]:
            raise HTTPException(status_code=404, detail="Valor não encontrado")
        
        options[option_key].remove(value)
        if not save_options(options):
            raise HTTPException(status_code=500, detail="Erro ao salvar opções")
        
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao excluir opção: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)



