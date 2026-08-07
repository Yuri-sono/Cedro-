"""
config.py — Configurações centrais lidas do .env ou variáveis de ambiente.
"""
import os
from dotenv import load_dotenv

_env = os.path.join(os.path.dirname(__file__), ".env")
if not os.path.exists(_env):
    _env = os.path.join(os.path.dirname(__file__), ".env.example")
load_dotenv(_env)

BASE_URL: str          = os.getenv("BASE_URL", "http://localhost:8080").rstrip("/")

# Desabilitar verificação SSL (útil para ambientes com certificados auto-assinados)
SSL_VERIFY: bool = os.getenv("SSL_VERIFY", "true").lower() in ("true", "1", "yes")
PSICOLOGO_EMAIL: str   = os.getenv("PSICOLOGO_EMAIL", "psicologo.demo@cedro.app")
PSICOLOGO_SENHA: str   = os.getenv("PSICOLOGO_SENHA", "Cedro@123")
PACIENTE_EMAIL: str    = os.getenv("PACIENTE_EMAIL",  "paciente.demo@cedro.app")
PACIENTE_SENHA: str    = os.getenv("PACIENTE_SENHA",  "Cedro@123")
ADMIN_EMAIL: str       = os.getenv("ADMIN_EMAIL",     "admin@cedro.com")
ADMIN_SENHA: str       = os.getenv("ADMIN_SENHA",     "Cedro@123")

# Secret do webhook RevenueCat (opcional)
REVENUECAT_WEBHOOK_SECRET: str = os.getenv("REVENUECAT_WEBHOOK_SECRET", "")

EVIDENCIAS_DIR: str = os.path.join(os.path.dirname(__file__), "evidencias")
RELATORIOS_DIR: str = os.path.join(os.path.dirname(__file__), "relatorios")
DADOS_DIR: str      = os.path.join(os.path.dirname(__file__), "dados")

for _d in (EVIDENCIAS_DIR, RELATORIOS_DIR, DADOS_DIR):
    os.makedirs(_d, exist_ok=True)
