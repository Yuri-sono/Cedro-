# Carrega variaveis do .env e sobe o backend
Get-Content .env | Where-Object { $_ -match '^\s*[^#]\S+=\S*' } | ForEach-Object {
    $key, $value = $_ -split '=', 2
    [System.Environment]::SetEnvironmentVariable($key.Trim(), $value.Trim(), 'Process')
}

# As credenciais do Google OAuth devem ser definidas no arquivo .env
# Exemplo:
# GOOGLE_CLIENT_ID=seu-client-id
# GOOGLE_CLIENT_SECRET=seu-client-secret
# GOOGLE_REFRESH_TOKEN=seu-refresh-token

java -jar target\cedro-backend-0.0.1-SNAPSHOT.jar
