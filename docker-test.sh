#!/bin/bash

# Script para testar a instalação Docker

echo "🧪 Testando configuração Docker..."
echo ""

# Verifica se o Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado!"
    echo "📥 Instale o Docker:"
    echo "   - Windows 10/11: https://www.docker.com/products/docker-desktop/"
    echo "   - Linux: sudo apt-get install docker.io docker-compose"
    echo "   - macOS: https://www.docker.com/products/docker-desktop/"
    exit 1
fi

echo "✅ Docker está instalado"
docker --version

# Verifica se o Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "⚠️  Docker Compose não está instalado!"
    echo "📥 Instale com: sudo apt-get install docker-compose"
    exit 1
fi

echo "✅ Docker Compose está instalado"
docker-compose --version

# Verifica se o Docker está rodando
if ! docker info &> /dev/null; then
    echo "❌ Docker não está rodando!"
    echo "🔄 Inicie o Docker Desktop ou o serviço Docker"
    exit 1
fi

echo "✅ Docker está rodando"
echo ""

# Testa a construção da imagem
echo "🔨 Construindo a imagem (pode levar alguns minutos na primeira vez)..."
if docker-compose build; then
    echo "✅ Imagem construída com sucesso!"
else
    echo "❌ Erro ao construir a imagem"
    exit 1
fi

echo ""
echo "🚀 Iniciando o container..."
if docker-compose up -d; then
    echo "✅ Container iniciado com sucesso!"
else
    echo "❌ Erro ao iniciar o container"
    exit 1
fi

echo ""
echo "⏳ Aguardando a aplicação inicializar (10 segundos)..."
sleep 10

echo ""
echo "🌐 Testando conexão..."
if curl -s http://localhost:8080 > /dev/null; then
    echo "✅ Aplicação está respondendo!"
    echo ""
    echo "🎉 Teste concluído com sucesso!"
    echo "📱 Acesse: http://localhost:8080"
    echo "👤 Login: admin / Senha: inss"
else
    echo "⚠️  Aplicação não está respondendo ainda"
    echo "📋 Verifique os logs com: docker-compose logs"
fi

echo ""
echo "📊 Status do container:"
docker-compose ps

echo ""
echo "💡 Comandos úteis:"
echo "   - Ver logs: docker-compose logs -f"
echo "   - Parar: docker-compose down"
echo "   - Reiniciar: docker-compose restart"
