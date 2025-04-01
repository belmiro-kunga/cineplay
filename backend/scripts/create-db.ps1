# Definindo variáveis
$DB_USER = "usuario"
$DB_PASSWORD = "senha"
$DB_HOST = "localhost"
$DB_PORT = "5432"
$DB_NAME = "streamingdb"

# Verificando se o PostgreSQL está instalado
try {
    $psqlPath = (Get-Command psql -ErrorAction Stop).Source
    Write-Host "PostgreSQL encontrado em: $psqlPath"
} catch {
    Write-Host "PostgreSQL não está instalado ou não está no PATH. Por favor, instale-o primeiro."
    exit 1
}

# Criar banco de dados
Write-Host "Criando banco de dados..."
try {
    # Cria o usuário
    $cmd = "psql -h $DB_HOST -p $DB_PORT -U postgres -c ""CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"""
    Invoke-Expression $cmd -ErrorAction SilentlyContinue
    
    # Cria o banco de dados
    $cmd = "psql -h $DB_HOST -p $DB_PORT -U postgres -c ""CREATE DATABASE $DB_NAME OWNER $DB_USER;"""
    Invoke-Expression $cmd -ErrorAction SilentlyContinue
    
    # Concede privilégios
    $cmd = "psql -h $DB_HOST -p $DB_PORT -U postgres -c ""GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"""
    Invoke-Expression $cmd -ErrorAction SilentlyContinue
    
    Write-Host "Banco de dados criado com sucesso!"
    Write-Host "Você pode conectar-se usando: postgresql://$DB_USER`:$DB_PASSWORD@$DB_HOST`:$DB_PORT/$DB_NAME"
} catch {
    Write-Host "Erro ao criar o banco de dados: $_"
    exit 1
} 