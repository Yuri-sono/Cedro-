@echo off
echo ========================================
echo    🚀 Iniciando API Cedro Spring Boot
echo ========================================
echo.
echo 📋 Configurações:
echo - Porta: 3001
echo - Banco: Cedro_banco.mssql.somee.com
echo - Profile: development
echo.
echo 🔄 Compilando e executando...
for /F "eol=# tokens=1,* delims==" %%i in (.env) do set "%%i=%%j"
mvnw.cmd clean spring-boot:run

echo.
echo ❌ Aplicação encerrada.
pause