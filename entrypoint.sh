#!/bin/bash

# Script de inicialização para o container Docker

echo "🚀 Iniciando S.I.N.G.E.D INSS..."

# Cria diretórios necessários
mkdir -p /app/data /app/static

# Verifica se o banco de dados existe, se não, executa migrações
if [ ! -f /app/data/dispositivos.db ]; then
    echo "📊 Banco de dados não encontrado. Criando novo banco..."
    # Executa as migrações do Alembic se disponível
    if [ -f alembic.ini ]; then
        echo "⬆️  Executando migrações Alembic..."
        alembic upgrade head || echo "⚠️  Aviso: Falha nas migrações Alembic"
    fi
fi

# Verifica se o arquivo de opções existe
if [ ! -f /app/static/options.json ]; then
    echo "⚙️  Criando arquivo de opções padrão..."
fi

echo "✅ Inicialização completa!"
echo "🌐 Servidor disponível em http://localhost:8080"
echo "👤 Login admin - Usuário: admin | Senha: inss"

# Inicia a aplicação
exec uvicorn app:app --host 0.0.0.0 --port 8080
