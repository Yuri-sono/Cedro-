@echo off
echo ========================================
echo    🧪 Testando API Cedro
echo ========================================
echo.

echo 📡 Testando conexão com API...
curl -s http://localhost:3001/ || echo ❌ API não está rodando na porta 3001

echo.
echo 🔍 Testando endpoint de autenticação...
curl -s http://localhost:3001/api/auth/ || echo ❌ Endpoint de auth não encontrado

echo.
echo ✅ Testes concluídos!
pause