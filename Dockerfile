# Use a imagem oficial do Node.js como base
FROM node:18-alpine

# Instalar bash para compatibilidade com scripts
RUN apk add --no-cache bash curl postgresql-client openssl

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json (se existir)
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production && npm cache clean --force

# Instalar dependências de desenvolvimento necessárias para build
RUN npm install --only=development

# Copiar código da aplicação
COPY . .

# Gerar o cliente Prisma
RUN npx prisma generate

# Compilar a aplicação TypeScript
RUN npm run build

# Remover dependências de desenvolvimento
RUN npm prune --production

# Criar script de inicialização
RUN echo '#!/bin/bash' > /app/start.sh && \
    echo 'set -e' >> /app/start.sh && \
    echo 'echo "🔍 Verificando conexão com banco de dados..."' >> /app/start.sh && \
    echo 'while ! pg_isready -h postgres -p 5432 -U postgres -q; do' >> /app/start.sh && \
    echo '  echo "⏳ Aguardando banco de dados..."' >> /app/start.sh && \
    echo '  sleep 2' >> /app/start.sh && \
    echo 'done' >> /app/start.sh && \
    echo 'echo "✅ Banco conectado!"' >> /app/start.sh && \
    echo 'echo "🔄 Executando migrações..."' >> /app/start.sh && \
    echo 'npx prisma migrate deploy' >> /app/start.sh && \
    echo 'echo "✅ Migrações concluídas!"' >> /app/start.sh && \
    echo 'echo "🌱 Executando seed (dados iniciais)..."' >> /app/start.sh && \
    echo 'npx prisma db seed' >> /app/start.sh && \
    echo 'echo "✅ Dados iniciais carregados!"' >> /app/start.sh && \
    echo 'echo "🚀 Iniciando aplicação..."' >> /app/start.sh && \
    echo 'node dist/src/main.js' >> /app/start.sh && \
    chmod +x /app/start.sh

# Expor a porta da aplicação
EXPOSE 3000

# Adicionar healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Comando para executar a aplicação
CMD ["/app/start.sh"]