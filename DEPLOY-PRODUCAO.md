# 🚀 Deploy em Produção - S.I.N.G.E.D INSS

Guia para colocar o sistema em produção de forma segura e escalável.

## ⚠️ Checklist de Segurança

Antes de colocar em produção, **OBRIGATORIAMENTE**:

- [ ] Alterar senha do admin
- [ ] Configurar HTTPS
- [ ] Configurar backup automático
- [ ] Limitar acesso à porta/rede
- [ ] Revisar logs
- [ ] Testar em ambiente de staging

## 🔐 1. Alterar Credenciais Padrão

### Opção 1: Variáveis de Ambiente

Crie um arquivo `.env`:
```env
ADMIN_USERNAME=seu_usuario
ADMIN_PASSWORD=sua_senha_forte_aqui_123!
COOKIE_EXPIRE_SECONDS=3600
```

Atualize `docker-compose.yml`:
```yaml
services:
  singed-app:
    env_file:
      - .env
    environment:
      - ADMIN_USERNAME=${ADMIN_USERNAME}
      - ADMIN_PASSWORD=${ADMIN_PASSWORD}
```

Modifique `app.py`:
```python
import os

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "inss")
```

### Opção 2: Direto no Código

Edite `app.py`:
```python
ADMIN_PASSWORD = "SuaSenhaForteMesmo@2024!"
ADMIN_USERNAME = "administrador"
```

**IMPORTANTE**: Nunca commite senhas no git!

## 🌐 2. Configurar Domínio e HTTPS

### Usando Nginx como Proxy Reverso

1. **Instalar Certbot** (para SSL grátis):
```bash
sudo apt-get install certbot python3-certbot-nginx
```

2. **Criar arquivo nginx.conf**:
```nginx
server {
    listen 80;
    server_name seu-dominio.com.br;

    location / {
        proxy_pass http://singed-app:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

3. **Obter certificado SSL**:
```bash
sudo certbot --nginx -d seu-dominio.com.br
```

4. **Atualizar docker-compose.prod.yml**:

Descomente a seção nginx no arquivo.

### Usando Cloudflare (Simples e Grátis)

1. Registre seu domínio no Cloudflare
2. Configure DNS apontando para seu IP
3. Ative SSL/TLS no Cloudflare (Full)
4. Mantenha porta 8080 aberta no firewall

## 🗄️ 3. Backup Automático

### Script de Backup Automático

Crie `backup.sh`:
```bash
#!/bin/bash

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="singed_backup_$DATE.tar.gz"

# Criar diretório de backup
mkdir -p $BACKUP_DIR

# Fazer backup do banco de dados e arquivos
docker exec singed-inss-prod tar -czf /tmp/$BACKUP_FILE /app/data /app/static

# Copiar backup para o host
docker cp singed-inss-prod:/tmp/$BACKUP_FILE $BACKUP_DIR/

# Remover backups antigos (manter últimos 30 dias)
find $BACKUP_DIR -name "singed_backup_*.tar.gz" -mtime +30 -delete

echo "Backup criado: $BACKUP_DIR/$BACKUP_FILE"
```

### Agendar Backup Diário

```bash
# Editar crontab
crontab -e

# Adicionar linha (backup diário às 3h da manhã)
0 3 * * * /caminho/para/backup.sh >> /var/log/singed-backup.log 2>&1
```

### Backup em Nuvem

**Google Drive** (usando rclone):
```bash
# Instalar rclone
curl https://rclone.org/install.sh | sudo bash

# Configurar Google Drive
rclone config

# Adicionar ao script de backup
rclone copy $BACKUP_DIR remote:singed-backups
```

## 🔥 4. Configurar Firewall

### Ubuntu/Debian (UFW)

```bash
# Permitir SSH
sudo ufw allow 22/tcp

# Permitir HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Se não usar nginx, permitir porta 8080
sudo ufw allow 8080/tcp

# Ativar firewall
sudo ufw enable

# Verificar status
sudo ufw status
```

### Windows

1. Painel de Controle → Firewall
2. Regras de Entrada → Nova Regra
3. Permitir portas: 80, 443 (e 8080 se necessário)
4. Aplicar para todas as redes

### Acesso Restrito por IP

Para permitir apenas IPs específicos:

```bash
# Exemplo: Permitir apenas rede local 192.168.1.0/24
sudo ufw allow from 192.168.1.0/24 to any port 8080
```

## 📊 5. Monitoramento

### Logs em Tempo Real

```bash
# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Ver últimas 100 linhas
docker-compose -f docker-compose.prod.yml logs --tail=100
```

### Configurar Limites de Log

Já configurado em `docker-compose.prod.yml`:
```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

### Monitorar Recursos

```bash
# Ver uso de CPU/RAM do container
docker stats singed-inss-prod
```

### Alertas por Email (Opcional)

Instale `mailutils`:
```bash
sudo apt-get install mailutils
```

Script de monitoramento `monitor.sh`:
```bash
#!/bin/bash

if ! docker ps | grep -q singed-inss-prod; then
    echo "Container parado!" | mail -s "ALERTA: SINGED INSS" seu@email.com
    docker-compose -f docker-compose.prod.yml up -d
fi
```

Agendar verificação a cada 5 minutos:
```bash
crontab -e
*/5 * * * * /caminho/para/monitor.sh
```

## 🚀 6. Deploy

### Primeira Vez

```bash
# Clonar repositório
git clone <URL_REPO>
cd S.I.N.G.E.D_INSS

# Criar diretórios
mkdir -p data backups

# Configurar permissões
chmod +x *.sh

# Alterar credenciais (ver seção 1)
nano app.py

# Iniciar em produção
docker-compose -f docker-compose.prod.yml up -d --build

# Verificar
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs
```

### Atualizações

```bash
# Parar sistema
docker-compose -f docker-compose.prod.yml down

# Fazer backup
./backup.sh

# Atualizar código
git pull

# Reconstruir e reiniciar
docker-compose -f docker-compose.prod.yml up -d --build

# Verificar
docker-compose -f docker-compose.prod.yml logs -f
```

## 🔄 7. Alta Disponibilidade (Avançado)

### Load Balancer com Nginx

Para múltiplas instâncias:

```yaml
# docker-compose.prod.yml
services:
  singed-app-1:
    ...
  singed-app-2:
    ...
  
  nginx:
    image: nginx:alpine
    volumes:
      - ./nginx-lb.conf:/etc/nginx/nginx.conf
    ports:
      - "80:80"
```

```nginx
# nginx-lb.conf
upstream singed_backend {
    server singed-app-1:8080;
    server singed-app-2:8080;
}

server {
    listen 80;
    location / {
        proxy_pass http://singed_backend;
    }
}
```

### Banco de Dados Compartilhado

Para múltiplas instâncias, considere:
- PostgreSQL no lugar de SQLite
- Volume compartilhado (NFS)
- Sincronização de dados

## 📈 8. Performance

### Otimizações Docker

```dockerfile
# Usar imagem Python slim
FROM python:3.11-slim

# Multi-stage build (reduz tamanho)
FROM python:3.11 as builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user -r requirements.txt

FROM python:3.11-slim
COPY --from=builder /root/.local /root/.local
```

### Otimizações Aplicação

Em `app.py`:
```python
# Adicionar cache
from functools import lru_cache

@lru_cache(maxsize=128)
def load_options():
    ...

# Usar compressão
from fastapi.middleware.gzip import GZipMiddleware
app.add_middleware(GZipMiddleware, minimum_size=1000)
```

## 🧪 9. Ambiente de Staging

Antes de atualizar produção, teste em staging:

```yaml
# docker-compose.staging.yml
version: '3.8'
services:
  singed-app:
    ports:
      - "8081:8080"  # Porta diferente
    container_name: singed-inss-staging
    ...
```

```bash
# Testar em staging
docker-compose -f docker-compose.staging.yml up -d

# Se OK, aplicar em produção
docker-compose -f docker-compose.prod.yml up -d --build
```

## 📋 10. Checklist Final

Antes de ir ao ar:

- [ ] Senha alterada
- [ ] HTTPS configurado
- [ ] Backup automático funcionando
- [ ] Firewall configurado
- [ ] Logs sendo monitorados
- [ ] Testado em staging
- [ ] Domínio configurado
- [ ] Alertas configurados
- [ ] Documentação atualizada
- [ ] Plano de rollback pronto

## 🆘 11. Plano de Rollback

Se algo der errado:

```bash
# 1. Parar versão problemática
docker-compose -f docker-compose.prod.yml down

# 2. Restaurar backup
tar -xzf /backups/singed_backup_XXXXXX.tar.gz

# 3. Voltar para versão anterior do código
git checkout <commit-anterior>

# 4. Reconstruir e iniciar
docker-compose -f docker-compose.prod.yml up -d --build

# 5. Verificar
docker-compose -f docker-compose.prod.yml logs -f
```

## 📞 12. Suporte

Problemas em produção:

1. Verificar logs: `docker-compose logs`
2. Verificar recursos: `docker stats`
3. Verificar conectividade: `curl http://localhost:8080`
4. Restaurar backup se necessário
5. Abrir issue no GitHub com logs

---

## 📚 Recursos Adicionais

- [Docker Production Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)

---

**Importante**: Sempre teste em ambiente de staging antes de produção! 🚨
