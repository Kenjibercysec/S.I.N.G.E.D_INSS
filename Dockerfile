# Use uma imagem Python oficial leve
FROM python:3.11-slim

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Variáveis de ambiente para Python
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Instala dependências do sistema necessárias
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copia o arquivo de requirements primeiro (para aproveitar o cache do Docker)
COPY requirements.txt .

# Instala as dependências Python
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo o código da aplicação
COPY . .

# Cria o diretório para o banco de dados e arquivos estáticos
RUN mkdir -p /app/data /app/static

# Expõe a porta que a aplicação vai usar
EXPOSE 8080

# Copia o script de inicialização
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Define o volume para persistência de dados
VOLUME ["/app/data", "/app/static"]

# Comando para iniciar a aplicação
ENTRYPOINT ["/app/entrypoint.sh"]
