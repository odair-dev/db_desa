# Makefile para facilitar comandos do projeto

.PHONY: help build up down logs clean reset restart status

help: ## Mostrar esta ajuda
	@echo "Comandos disponíveis:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

setup: ## Configurar ambiente (cria .env se não existir)
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "📁 Arquivo .env criado. Configure as variáveis antes de continuar."; \
	else \
		echo "✅ Arquivo .env já existe."; \
	fi

build: ## Construir as imagens Docker
	docker-compose build

up: setup ## Iniciar todos os serviços
	docker-compose up -d
	@echo "✅ Serviços iniciados!"
	@echo "🌐 API: http://localhost:3000"
	@echo "📚 Swagger: http://localhost:3000/api"

down: ## Parar todos os serviços
	docker-compose down

logs: ## Ver logs da aplicação
	docker-compose logs -f app

logs-all: ## Ver logs de todos os serviços
	docker-compose logs -f

clean: ## Parar serviços e remover containers
	docker-compose down --rmi all

reset: ## Reset completo (remove volumes e recria tudo)
	docker-compose down -v
	docker-compose up --build -d
	@echo "✅ Reset completo realizado!"

restart: ## Reiniciar a aplicação
	docker-compose restart app

status: ## Ver status dos containers
	docker-compose ps

shell: ## Acessar shell da aplicação
	docker-compose exec app sh

db-shell: ## Acessar shell do PostgreSQL
	docker-compose exec postgres psql -U postgres -d desa_db

redis-shell: ## Acessar shell do Redis
	docker-compose exec redis redis-cli

migrate: ## Executar migrações manualmente
	docker-compose exec app npx prisma migrate deploy

seed: ## Executar seed (dados iniciais) manualmente
	docker-compose exec app npx prisma db seed

studio: ## Abrir Prisma Studio (interface web do banco)
	docker-compose exec app npx prisma studio

dev: ## Modo desenvolvimento local (sem Docker)
	npm run start:dev