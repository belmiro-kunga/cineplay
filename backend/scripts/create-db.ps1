# Script para criar o banco de dados PostgreSQL no Windows com psql

# Carregar variáveis de ambiente do arquivo .env
$envFile = ".env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "DATABASE_URL=(.*)") {
            $dbUrl = $matches[1]
        }
    }
}

# Extrair componentes da URL
if ($dbUrl -match "postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)") {
    $username = $matches[1]
    $password = $matches[2]
    $hostname = $matches[3]
    $port = $matches[4]
    $dbname = $matches[5]
    
    Write-Host "Tentando criar o banco de dados '$dbname'..."
    
    # Criar o banco de dados usando psql
    $env:PGPASSWORD = $password
    & psql -h $hostname -p $port -U $username -d postgres -c "CREATE DATABASE $dbname WITH ENCODING 'UTF8' LC_COLLATE='en_US.UTF-8' LC_CTYPE='en_US.UTF-8';"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Banco de dados '$dbname' criado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "Erro ao criar o banco de dados. Ele já pode existir ou houve um problema de conexão." -ForegroundColor Red
    }
} else {
    Write-Host "Formato de DATABASE_URL inválido no arquivo .env. Por favor, verifique o formato." -ForegroundColor Red
} 