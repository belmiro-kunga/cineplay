#!/bin/bash

# Script para criar o banco de dados PostgreSQL no Linux/macOS

# Carregar variáveis do arquivo .env
if [ -f .env ]; then
    # Extrair DATABASE_URL do arquivo .env
    DB_URL=$(grep DATABASE_URL .env | cut -d '=' -f2)
    
    # Extrair componentes da URL
    if [[ $DB_URL =~ postgresql://([^:]+):([^@]+)@([^:]+):([0-9]+)/(.+) ]]; then
        username="${BASH_REMATCH[1]}"
        password="${BASH_REMATCH[2]}"
        hostname="${BASH_REMATCH[3]}"
        port="${BASH_REMATCH[4]}"
        dbname="${BASH_REMATCH[5]}"
        
        echo "Tentando criar o banco de dados '$dbname'..."
        
        # Definir senha do PostgreSQL como variável de ambiente
        export PGPASSWORD="$password"
        
        # Criar o banco de dados
        psql -h "$hostname" -p "$port" -U "$username" -d postgres -c "CREATE DATABASE $dbname WITH ENCODING 'UTF8' LC_COLLATE='en_US.UTF-8' LC_CTYPE='en_US.UTF-8';"
        
        # Verificar o resultado
        if [ $? -eq 0 ]; then
            echo -e "\e[32mBanco de dados '$dbname' criado com sucesso!\e[0m"
        else
            echo -e "\e[31mErro ao criar o banco de dados. Ele já pode existir ou houve um problema de conexão.\e[0m"
        fi
        
        # Limpar a variável de ambiente para segurança
        unset PGPASSWORD
    else
        echo -e "\e[31mFormato de DATABASE_URL inválido no arquivo .env. Por favor, verifique o formato.\e[0m"
        exit 1
    fi
else
    echo -e "\e[31mArquivo .env não encontrado.\e[0m"
    exit 1
fi 