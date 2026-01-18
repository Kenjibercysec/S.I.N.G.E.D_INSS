#!/bin/bash

# Script para atualizar o sistema S.I.N.G.E.D INSS

echo "🔄 Atualizando S.I.N.G.E.D INSS..."
echo ""

# Verifica se está em um repositório git
if [ -d .git ]; then
    echo "📥 Baixando últimas alterações do repositório..."
    git pull
    if [ $? -ne 0 ]; then
        echo "⚠️  Erro ao atualizar do repositório"
        echo "Continue mesmo assim? (s/n)"
        read -r resposta
        if [ "$resposta" != "s" ]; then
            exit 1
        fi
    fi
else
    echo "⚠️  Não é um repositório git, pulando git pull"
fi

echo ""
echo "🛑 Parando container atual..."
docker-compose down

if [ $? -ne 0 ]; then
    echo "❌ Erro ao parar container"
    exit 1
fi

echo ""
echo "🔨 Reconstruindo imagem Docker..."
docker-compose build --no-cache

if [ $? -ne 0 ]; then
    echo "❌ Erro ao construir imagem"
    exit 1
fi

echo ""
echo "🚀 Iniciando container atualizado..."
docker-compose up -d

if [ $? -ne 0 ]; then
    echo "❌ Erro ao iniciar container"
    exit 1
fi

echo ""
echo "✅ Atualização concluída com sucesso!"
echo ""
echo "📊 Status do container:"
docker-compose ps

echo ""
echo "🌐 Sistema disponível em: http://localhost:8080"
echo ""
echo "💡 Para ver os logs: docker-compose logs -f"
