# Sobe o Expo/Metro em processo persistente e valida o bundle web
$log = 'c:\Cedro-\Cedro-\mobile\metro-web.log'
$err = 'c:\Cedro-\Cedro-\mobile\metro-web.err.log'
if (Test-Path $log) { Remove-Item $log -Force }
if (Test-Path $err) { Remove-Item $err -Force }

# Mata qualquer Metro antigo na porta 8081
Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty OwningProcess -Unique |
  ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }

# Inicia em processo independente (sobrevive a este script)
Start-Process -FilePath 'cmd.exe' -ArgumentList '/c npx expo start --web --port 8081' `
  -WorkingDirectory 'c:\Cedro-\Cedro-\mobile' `
  -RedirectStandardOutput $log -RedirectStandardError $err -WindowStyle Hidden

Start-Sleep -Seconds 40
$status = curl.exe -s -o "$env:TEMP\bundle-check.out" -w '%{http_code}' "http://localhost:8081/index.ts.bundle?platform=web&dev=true&hot=false&lazy=true&transform.engine=hermes&transform.routerRoot=app&unstable_transformProfile=hermes-stable"
Write-Output "BUNDLE_HTTP_STATUS=$status"
Write-Output "ABRA: http://localhost:8081"
