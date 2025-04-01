# Encerrar processos nas portas 3000, 3001 e 3002
Write-Host "Encerrando processos nas portas 3000, 3001 e 3002..."
$ports = @(3000, 3001, 3002)

foreach ($port in $ports) {
    try {
        $processIds = (Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue).OwningProcess
        if ($processIds) {
            foreach ($processId in $processIds) {
                $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
                if ($process) {
                    Write-Host "Encerrando processo $($process.Name) (PID: $processId) na porta $port"
                    Stop-Process -Id $processId -Force
                }
            }
        }
    } catch {
        Write-Host "Erro ao encerrar processos na porta $port: $_"
    }
}

# Iniciar o servidor
Write-Host "Iniciando o servidor na porta definida no .env..."
npm run dev 