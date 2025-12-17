# 🐳 Guia Docker para de Sá Incorporações API

Este projeto está configurado para rodar completamente com Docker, facilitando o desenvolvimento e deploy.

## 🚀 Início Rápido

### Opção 1: Script Automático (Mais Simples)
```bash
./start.sh
```

### Opção 2: Usando Makefile (Recomendado)
```bash
make up
```

### Opção 3: Docker Compose Manual
```bash
# Configurar variáveis de ambiente
cp .env.example .env

# Iniciar serviços
docker-compose up --build -d
```

## 📋 Serviços Incluídos

- **PostgreSQL 15** - Banco de dados principal
- **Redis 7** - Cache e filas de processamento
- **NestJS App** - API principal da aplicação

## 🔧 Comandos Úteis

### Usando Makefile (Recomendado)
```bash
make help          # Ver todos os comandos disponíveis
make up             # Iniciar todos os serviços
make down           # Parar todos os serviços
make logs           # Ver logs da aplicação
make restart        # Reiniciar aplicação
make status         # Ver status dos containers
make shell          # Acessar shell da aplicação
make db-shell       # Acessar PostgreSQL
make redis-shell    # Acessar Redis CLI
make reset          # Reset completo (remove dados)
```

### Usando Docker Compose
```bash
docker-compose up -d                    # Iniciar em background
docker-compose down                     # Parar serviços
docker-compose logs -f app              # Ver logs da app
docker-compose logs -f                  # Ver logs de tudo
docker-compose restart app              # Reiniciar só a app
docker-compose exec app sh              # Shell da aplicação
docker-compose exec postgres psql -U postgres -d desa_db  # PostgreSQL
docker-compose exec redis redis-cli    # Redis CLI
```

## 🌐 URLs Disponíveis

Após iniciar os containers:

- **API Principal**: http://localhost:3000
- **Documentação Swagger**: http://localhost:3000/api
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## ⚙️ Configuração

### Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure as seguintes variáveis:

```bash
# Banco de dados (já configurado para Docker)
DATABASE_URL=postgresql://postgres:postgres123@postgres:5432/desa_db

# JWT Secret (IMPORTANTE: Mude para produção)
JWT_SECRET=sua_chave_secreta_muito_forte_aqui

# Email (para reset de senha)
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_de_app
```

## 🗃️ Dados e Persistência

Os dados são persistidos em volumes Docker:
- `postgres_data`: Dados do PostgreSQL
- `redis_data`: Dados do Redis

### Para reset completo dos dados:
```bash
make reset
# ou
docker-compose down -v && docker-compose up --build -d
```

## 🔍 Diagnóstico

### Verificar se tudo está funcionando:
```bash
make status
# ou
docker-compose ps
```

### Ver logs em caso de erro:
```bash
make logs-all
# ou
docker-compose logs
```

### Testar conectividade:
```bash
# Testar API
curl http://localhost:3000

# Testar Swagger
curl http://localhost:3000/api
```

## 🛠️ Desenvolvimento

### Executar migrações manualmente:
```bash
make migrate
# ou
docker-compose exec app npx prisma migrate deploy
```

### Acessar Prisma Studio:
```bash
make studio
# ou
docker-compose exec app npx prisma studio
```

### Desenvolver sem Docker:
```bash
# Manter apenas banco e Redis no Docker
docker-compose up postgres redis -d

# Executar aplicação localmente
make dev
# ou
npm run start:dev
```

## 🚨 Solução de Problemas

### Container não inicia:
1. Verifique se as portas 3000, 5432 e 6379 não estão em uso
2. Verifique o arquivo .env
3. Veja os logs: `make logs-all`

### Erro de migração:
1. Reset do banco: `make reset`
2. Migração manual: `make migrate`

### Erro de dependências:
1. Rebuild: `docker-compose build --no-cache`
2. Reset completo: `make reset`

## 📦 Deploy

Para produção, ajuste as seguintes variáveis no `.env`:
- `NODE_ENV=production`
- `JWT_SECRET` (use uma chave forte)
- Configurações de email reais
- `DATABASE_URL` para banco de produção

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```