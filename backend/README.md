<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

## Configuração do Banco de Dados PostgreSQL

### Pré-requisitos
- PostgreSQL instalado e rodando
- Node.js e npm instalados

### Configuração do Ambiente
1. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
PORT=3000
DATABASE_URL=postgresql://usuario:senha@localhost:5432/streamingdb
JWT_SECRET=minha_chave_secreta
AWS_ACCESS_KEY_ID=sua_chave
AWS_SECRET_ACCESS_KEY=sua_chave_secreta
AWS_REGION=sua_regiao
AWS_BUCKET=sua_bucket
REDIS_HOST=localhost
REDIS_PORT=6379
```

2. Crie o banco de dados PostgreSQL:

**No Windows:**
```bash
npm run db:create:win
```

**No Linux/Mac:**
```bash
npm run db:create:unix
```

Ou crie manualmente usando o PostgreSQL:
```sql
CREATE USER usuario WITH PASSWORD 'senha';
CREATE DATABASE streamingdb OWNER usuario;
GRANT ALL PRIVILEGES ON DATABASE streamingdb TO usuario;
```

### Executar o Projeto
```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run start:dev
```

## Configuração com Docker

### Pré-requisitos
- Docker e Docker Compose instalados

### Iniciar os Serviços
Execute o seguinte comando na pasta do projeto:

```bash
docker-compose up -d
```

Isso irá iniciar:
- PostgreSQL na porta 5432
- Redis na porta 6379

### Parar os Serviços
```bash
docker-compose down
```

Para remover os volumes também:
```bash
docker-compose down -v
```

## Configuração da Plataforma de Streaming

Esta aplicação é uma plataforma de streaming semelhante à Netflix, construída com NestJS e PostgreSQL. Oferece autenticação segura (JWT), gerenciamento de usuários, filmes, séries e um painel administrativo.

### Recursos

- **Autenticação:** JWT + Passport para autenticação segura
- **Gestão de Usuários:** Cadastro, login e perfis de usuários
- **Conteúdo:** Upload e gerenciamento de vídeos, séries e episódios
- **Painel Admin:** Interface para administradores gerenciarem conteúdos
- **Streaming:** API para streaming de conteúdo audiovisual

### Pré-requisitos

- Node.js 16+
- Docker e Docker-Compose
- PostgreSQL
- Redis (opcional, para cache e filas)

### Instalação

1. Clone o repositório
2. Instale as dependências:

```bash
cd backend
npm run install:deps
```

3. Configure o banco de dados usando Docker:

```bash
docker-compose up -d
```

4. Execute a aplicação:

```bash
npm run dev
```

### Endpoints da API

#### Autenticação

- `POST /auth/register` - Registrar um novo usuário
- `POST /auth/login` - Login de usuário
- `GET /auth/profile` - Obter perfil do usuário autenticado

#### Usuários

- `GET /users` - Listar todos os usuários (admin)
- `GET /users/:id` - Obter usuário específico
- `PATCH /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Remover usuário (admin)

#### Vídeos

- `POST /videos` - Adicionar novo vídeo
- `GET /videos` - Listar todos os vídeos
- `GET /videos/:id` - Obter vídeo específico
- `PATCH /videos/:id` - Atualizar vídeo
- `DELETE /videos/:id` - Remover vídeo

#### Séries

- `POST /series` - Adicionar nova série
- `GET /series` - Listar todas as séries
- `GET /series/:id` - Obter série específica
- `PATCH /series/:id` - Atualizar série
- `DELETE /series/:id` - Remover série
