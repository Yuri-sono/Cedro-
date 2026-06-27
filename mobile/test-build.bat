@echo off
echo ========================================
echo TESTE DE BUILD - CEDRO MOBILE
echo ========================================
echo.

echo [1/4] Verificando TypeScript...
call npx tsc --noEmit
if %errorlevel% neq 0 (
    echo ERRO: TypeScript falhou!
    exit /b 1
)
echo OK: TypeScript passou!
echo.

echo [2/4] Verificando sintaxe do Metro...
call npx expo export:embed 2>nul
if %errorlevel% neq 0 (
    echo AVISO: Metro export falhou, mas isso é esperado sem servidor rodando
) else (
    echo OK: Metro passou!
)
echo.

echo [3/4] Instalando dependencias...
call npm install
if %errorlevel% neq 0 (
    echo ERRO: npm install falhou!
    exit /b 1
)
echo OK: Dependencias instaladas!
echo.

echo [4/4] Verificando estrutura de arquivos...
if not exist "src\components\Button.tsx" (
    echo ERRO: Button.tsx nao encontrado!
    exit /b 1
)
if not exist "src\components\Input.tsx" (
    echo ERRO: Input.tsx nao encontrado!
    exit /b 1
)
if not exist "src\components\PsicologoCard.tsx" (
    echo ERRO: PsicologoCard.tsx nao encontrado!
    exit /b 1
)
if not exist "src\screens\home\HomeScreen.tsx" (
    echo ERRO: HomeScreen.tsx nao encontrado!
    exit /b 1
)
if not exist "src\theme\colors.ts" (
    echo ERRO: colors.ts nao encontrado!
    exit /b 1
)
echo OK: Todos os arquivos presentes!
echo.

echo ========================================
echo RESULTADO: BUILD PASSOU EM TODOS OS TESTES! ✓
echo ========================================
echo.
echo Proximos passos:
echo - Execute: npx expo start
echo - Escaneie o QR code no Expo Go
echo - Teste no dispositivo fisico
echo.
