# de Sá Incorporações - API

> API REST para gestão de imóveis, usuários e agendamentos de visitas com autenticação JWT e sistema de notificações por email.

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://docker.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)](https://prisma.io/)

## 🚀 Início Rápido

### Pré-requisitos
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Execução com Docker (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/odair-dev/db_desa.git
cd db_desa

# Inicie todos os serviços
make up
```

**Pronto!** A aplicação estará disponível em:
- 🌐 **API**: http://localhost:3000
- 📚 **Swagger UI**: http://localhost:3000/api
- 🗄️ **PostgreSQL**: localhost:5432
- 🔴 **Redis**: localhost:6379

## 🛠️ Comandos Disponíveis

```bash
make up          # Iniciar todos os serviços
make down        # Parar todos os serviços  
make logs        # Ver logs da aplicação
make status      # Status dos containers
make restart     # Reiniciar aplicação
make reset       # Reset completo (remove dados)
make shell       # Acessar shell da aplicação
make db-shell    # Acessar PostgreSQL CLI
make migrate     # Executar migrações manualmente
```

## 🏗️ Arquitetura

### Stack Tecnológico
- **Backend**: NestJS + TypeScript
- **Banco de Dados**: PostgreSQL 15
- **ORM**: Prisma
- **Cache/Filas**: Redis 7
- **Autenticação**: JWT + Passport
- **Documentação**: Swagger/OpenAPI
- **Containerização**: Docker + Docker Compose

### Estrutura da API
- **Usuários**: Cadastro, autenticação e recuperação de senha
- **Imóveis**: Gestão de propriedades e endereços
- **Agendamentos**: Sistema de visitas com notificações
- **Autenticação**: JWT com diferentes tipos de usuário (admin, corretor, cliente)

## 🗃️ Banco de Dados

### Modelos Principais
- **User**: Usuários do sistema (admin, corretor, cliente)
- **Property**: Imóveis disponíveis
- **Address**: Endereços dos imóveis
- **Schedule**: Agendamentos de visitas

### Migrações
As migrações são executadas automaticamente na inicialização do container.

## 🔐 Configuração

### Variáveis de Ambiente

As principais variáveis estão pré-configuradas no `docker-compose.yml`. Para personalizar:

```env
DATABASE_URL=postgresql://postgres:postgres123@postgres:5432/desa_db
SECRET_KEY=sua_chave_jwt_segura
SMTP_USER=seu_email@dominio.com
SMTP_PASS=sua_senha_email
```

## 📡 Endpoints Principais

### Autenticação
```
POST /auth/login        # Login de usuário
POST /auth/reset        # Solicitação de reset de senha
```

### Usuários
```
POST /users             # Criar usuário
GET  /users             # Listar usuários (autenticado)
GET  /users/:id         # Buscar usuário
PATCH /users/:id        # Atualizar usuário
```

### Propriedades
```
POST /properties        # Criar propriedade
GET  /properties        # Listar propriedades
GET  /properties/:id    # Buscar propriedade
PATCH /properties/:id   # Atualizar propriedade
```

### Agendamentos
```
POST /schedules/property/:id    # Agendar visita
GET  /schedules                 # Listar agendamentos
POST /schedules/contato         # Contato via email
```

> 📖 **Documentação completa**: http://localhost:3000/api

## 🧪 Desenvolvimento

### Desenvolvimento Local (sem Docker)
```bash
# Instalar dependências
npm install

# Configurar banco local
cp .env.example .env
# Editar .env com suas configurações

# Executar migrações
npx prisma migrate dev

# Iniciar em modo desenvolvimento
npm run start:dev
```

### Comandos úteis
```bash
# Gerar Prisma Client
npx prisma generate

# Visualizar banco (Prisma Studio)
npx prisma studio

# Reset do banco
npx prisma migrate reset
```

## 📦 Deploy

### Produção com Docker
```bash
# Definir variáveis de produção
cp .env.example .env
# Configurar variáveis para produção

# Subir ambiente
docker-compose up -d
```

### Considerações para Produção
- Configure `SECRET_KEY` com valor seguro
- Configure SMTP real para emails
- Use banco PostgreSQL externo se necessário
- Configure reverse proxy (nginx) se aplicável

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença UNLICENSED.

---

**Desenvolvido para de Sá Incorporações** | 2025
 <a href="#licenca">Licença</a> 
</p>

<h3 id="pre">Pré-requisitos</h3>

---

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com) e [Docker](https://www.docker.com/)

Para desenvolvimento local (opcional): [Node](https://nodejs.org/en) e [VSCode](https://code.visualstudio.com/)

<h3 id="docker">🐳 Execução com Docker (Recomendado)</h3>

---

A maneira mais simples de executar o projeto é usando Docker. Isso irá configurar automaticamente o banco de dados PostgreSQL, Redis e a aplicação.

**Opção 1: Script automático**
```bash
# Clone o projeto
git clone <url-do-repositorio>
cd db_desa

# Execute o script de inicialização
./start.sh
```

**Opção 2: Docker Compose manual**
```bash
# Clone o projeto
git clone <url-do-repositorio>
cd db_desa

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env conforme necessário

# Inicie os containers
docker-compose up --build -d
```

Após alguns minutos, a aplicação estará disponível em:
- **API**: http://localhost:3000
- **Documentação (Swagger)**: http://localhost:3000/api
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

<h3 id="rodando">⚙️ Instalação Manual (Desenvolvimento)</h3>

---

Caso prefira executar sem Docker, siga os passos abaixo:

Após clonar o projeto para o seu computador e abri-lo com o vscode, instale as dependencias.

```bash
  npm install
```

Agora para executar a aplicação utilize:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

<h3 id="linkLocal">Link Documentação</h3>

---

[http://localhost:3000/api](http://localhost:3000/api)

<h3 id="tecnologias">Tecnologias</h3>

---

- Nest
- Prisma
- Typescript
- bcryptjs
- passport-jwt
- class-validator
- class-transformer
- redis
- bullmq
- nodemailer
- mailgen
- swagger

<h3 id="autor">Autor</h3>

---

Desenvolvido por Odair Sobrinho 🚀 Entre em contato!

[![Website Badge](https://img.shields.io/badge/Website-www.odairsobrinho.com-blue?style=flat-square&logo=safari&logoColor=white&link=https://www.odairsobrinho.com)](https://www.odairsobrinho.com)
[![Linkedin Badge](https://img.shields.io/badge/-Odair-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/odair-sobrinho/)](https://www.linkedin.com/in/odair-sobrinho/)
[![Gmail Badge](https://img.shields.io/badge/-odairodriguez@yahoo.com.br-slateblue?style=flat-square&logo=Yahoo&logoColor=white&link=mailto:odairodriguez@yahoo.com.br)](mailto:odairodriguez@yahoo.com.br)

<h3 id="licenca">Licença</h3>

---

Este projeto está licenciado sob a licença MIT
