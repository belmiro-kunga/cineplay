#!/bin/bash

# Definindo variáveis
DB_USER="usuario"
DB_PASSWORD="senha"
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="streamingdb"

# Verificando se o PostgreSQL está instalado
which psql > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "PostgreSQL não está instalado. Por favor, instale-o primeiro."
  exit 1
fi

# Criar banco de dados
echo "Criando banco de dados..."
psql -h $DB_HOST -p $DB_PORT -U postgres -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" 2>/dev/null || true
psql -h $DB_HOST -p $DB_PORT -U postgres -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;" 2>/dev/null || true
psql -h $DB_HOST -p $DB_PORT -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" 2>/dev/null || true

echo "Banco de dados criado com sucesso!"
echo "Você pode conectar-se usando: postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME" 