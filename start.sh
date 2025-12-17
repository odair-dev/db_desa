#!/bin/bash

# Script para inicializar o ambiente completo do projeto

echo "🚀 Iniciando configuração do ambiente de desenvolvimento..."

# Verificar se o Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

# Criar arquivo .env se não existir
if [ ! -f ".env" ]; then
    echo "📁 Criando arquivo .env a partir do .env.example..."
    cp .env.example .env
    echo "⚠️  Por favor, configure as variáveis de ambiente no arquivo .env antes de continuar."
    echo "📝 Especialmente JWT_SECRET e configurações de email."
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Remover volumes antigos se solicitado
if [ "$1" = "--reset" ]; then
    echo "🗑️  Removendo volumes existentes..."
    docker-compose down -v
fi

# Construir e iniciar os containers
echo "🔨 Construindo e iniciando os containers..."
docker-compose up --build -d

# Aguardar os serviços ficarem prontos
echo "⏳ Aguardando serviços ficarem prontos..."
sleep 20

# Verificar se os serviços estão rodando
if docker-compose ps | grep -q "Up"; then
    echo "✅ Containers iniciados com sucesso!"
    echo ""
    echo "🌐 A aplicação está disponível em: http://localhost:3000"
    echo "📚 Documentação da API (Swagger): http://localhost:3000/api"
    echo "🗄️  Banco PostgreSQL: localhost:5432"
    echo "🔴 Redis: localhost:6379"
    echo ""
    echo "📋 Para ver os logs da aplicação:"
    echo "   docker-compose logs -f app"
    echo ""
    echo "🛑 Para parar os containers:"
    echo "   docker-compose down"
else
    echo "❌ Erro ao iniciar os containers. Verifique os logs:"
    echo "   docker-compose logs"
fi