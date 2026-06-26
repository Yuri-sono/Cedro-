#!/bin/bash
# ============================================
# Cedro Backend - Script de inicialização
# Carrega o .env e sobe o servidor Spring Boot
# ============================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Arquivo .env não encontrado em $SCRIPT_DIR"
  echo "   Copie o .env.example para .env e preencha os valores."
  exit 1
fi

echo "🔧 Carregando variáveis de $ENV_FILE..."

# Exporta apenas linhas VAR=VALOR sem interpretar ;, &, ? ou outros caracteres da URL.
while IFS= read -r line || [ -n "$line" ]; do
  [[ "$line" =~ ^[[:space:]]*$ ]] && continue
  [[ "$line" =~ ^[[:space:]]*# ]] && continue
  [[ "$line" != *"="* ]] && continue

  key="${line%%=*}"
  value="${line#*=}"
  key="$(echo "$key" | xargs)"
  export "$key=$value"
done < "$ENV_FILE"

echo "🚀 Subindo o backend Cedro na porta ${PORT:-8080}..."
cd "$SCRIPT_DIR" && bash mvnw spring-boot:run
