# Configuração do Banco de Dados - CinePlay

Este documento contém instruções para configurar o banco de dados PostgreSQL para a aplicação CinePlay.

## Pré-requisitos

- Docker e Docker Compose (recomendado)
- PostgreSQL 14+ (instalação local, caso não use Docker)
- Redis (instalação local, caso não use Docker)
- Node.js 18+
- npm 9+

## Configuração com Docker (Recomendada)

O método mais fácil para configurar o ambiente de desenvolvimento é usando Docker:

1. Certifique-se de que Docker e Docker Compose estão instalados
2. Copie o arquivo `.env.example` para `.env` e ajuste as variáveis de ambiente se necessário
3. Execute os contêineres:

```bash
# Iniciar os contêineres (PostgreSQL e Redis)
npm run docker:up

# Para parar os contêineres
npm run docker:down
```

## Configuração Manual

Se preferir não usar Docker, você pode configurar manualmente:

### 1. Instale PostgreSQL e Redis

- [Instalação do PostgreSQL](https://www.postgresql.org/download/)
- [Instalação do Redis](https://redis.io/download)

### 2. Configure o arquivo .env

Copie o arquivo `.env.example` para `.env` e ajuste as variáveis:

```
DATABASE_URL=postgresql://seu_usuario:sua_senha@localhost:5432/cineplaydb
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 3. Crie o banco de dados

No Windows:
```bash
npm run db:create:win
```

No Linux/macOS:
```bash
npm run db:create:unix
```

## Migrações do Banco de Dados

As migrações permitem evoluir o esquema do banco de dados de forma controlada:

```bash
# Gerar uma nova migração baseada nas alterações das entidades
npm run migration:generate -- src/database/migrations/NomeDaMigracao

# Executar migrações pendentes
npm run migration:run

# Reverter a última migração aplicada
npm run migration:revert

# Mostrar migrações aplicadas/pendentes
npm run migration:show
```

## Sincronização Automática (Apenas Desenvolvimento)

Em ambiente de desenvolvimento, a sincronização automática está habilitada por padrão (`synchronize: true`). 
Isso significa que o TypeORM atualiza automaticamente o esquema do banco de dados.

**IMPORTANTE**: Em ambiente de produção, esta opção deve estar desativada e as migrações devem ser usadas para qualquer alteração no banco de dados.

## Troubleshooting

### Problemas de Conexão

Verifique se:
- O PostgreSQL está em execução
- As credenciais no arquivo `.env` estão corretas
- O banco de dados especificado existe

### Problemas com Migrações

Se houver problemas ao gerar ou executar migrações:
- Certifique-se de que o esquema atual do banco está correto
- Verifique se não há migrações conflitantes
- Tente limpar a pasta `dist/` e reconstruir o projeto: `npm run build` 