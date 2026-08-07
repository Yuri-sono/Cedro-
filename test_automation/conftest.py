"""
conftest.py — Fixtures compartilhadas para a suíte de testes de API (pytest).

Fornece:
  - Sessão HTTP reutilizável
  - Tokens JWT dinâmicos (paciente, psicólogo, admin)
  - IDs de usuários demo
  - Helpers de requisição com registro de evidências
"""

import json
import os
import uuid
from datetime import datetime

import pytest
import requests

import config

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _salvar_evidencia(nome: str, payload: dict) -> str:
    """
    Salva um payload de requisição/resposta como evidência em JSON.

    Args:
        nome: Nome base do arquivo de evidência.
        payload: Dicionário com dados da requisição/resposta.

    Returns:
        str: Caminho do arquivo de evidência salvo.
    """
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    caminho = os.path.join(config.EVIDENCIAS_DIR, f"{nome}_{timestamp}.json")
    with open(caminho, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2, default=str)
    return caminho


def _login(email: str, senha: str) -> dict:
    """
    Realiza login e retorna o corpo da resposta.

    Args:
        email: Email do usuário.
        senha: Senha do usuário.

    Returns:
        dict: Corpo da resposta (token, usuario).
    """
    resp = requests.post(
        f"{config.BASE_URL}/api/auth/login",
        json={"email": email, "senha": senha},
        timeout=30,
        verify=config.SSL_VERIFY,
    )
    resp.raise_for_status()
    return resp.json()


# ---------------------------------------------------------------------------
# Fixtures de sessão e autenticação
# ---------------------------------------------------------------------------

@pytest.fixture(scope="session")
def http_session() -> requests.Session:
    """Sessão HTTP reutilizável para toda a suíte."""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    session.verify = config.SSL_VERIFY
    yield session
    session.close()


@pytest.fixture(scope="session")
def paciente_token() -> str:
    """Token JWT do paciente demo (gerado dinamicamente)."""
    data = _login(config.PACIENTE_EMAIL, config.PACIENTE_SENHA)
    return data["token"]


@pytest.fixture(scope="session")
def psicologo_token() -> str:
    """Token JWT do psicólogo demo (gerado dinamicamente)."""
    data = _login(config.PSICOLOGO_EMAIL, config.PSICOLOGO_SENHA)
    return data["token"]


@pytest.fixture(scope="session")
def admin_token() -> str:
    """Token JWT do admin demo (gerado dinamicamente)."""
    data = _login(config.ADMIN_EMAIL, config.ADMIN_SENHA)
    return data["token"]


@pytest.fixture(scope="session")
def paciente_id() -> int:
    """ID do paciente demo."""
    data = _login(config.PACIENTE_EMAIL, config.PACIENTE_SENHA)
    return data["usuario"]["id"]


@pytest.fixture(scope="session")
def psicologo_id() -> int:
    """ID do psicólogo demo."""
    data = _login(config.PSICOLOGO_EMAIL, config.PSICOLOGO_SENHA)
    return data["usuario"]["id"]


@pytest.fixture(scope="session")
def admin_id() -> int:
    """ID do admin demo."""
    data = _login(config.ADMIN_EMAIL, config.ADMIN_SENHA)
    return data["usuario"]["id"]


@pytest.fixture(scope="session")
def auth_headers(paciente_token: str) -> dict:
    """Headers de autenticação padrão (paciente)."""
    return {"Authorization": f"Bearer {paciente_token}"}


@pytest.fixture(scope="session")
def psicologo_headers(psicologo_token: str) -> dict:
    """Headers de autenticação do psicólogo."""
    return {"Authorization": f"Bearer {psicologo_token}"}


@pytest.fixture(scope="session")
def admin_headers(admin_token: str) -> dict:
    """Headers de autenticação do admin."""
    return {"Authorization": f"Bearer {admin_token}"}


# ---------------------------------------------------------------------------
# Fixtures de dados de teste
# ---------------------------------------------------------------------------

@pytest.fixture(scope="session")
def email_unico() -> str:
    """Email único para testes de registro (evita conflitos em execuções repetidas)."""
    return f"teste.{uuid.uuid4().hex[:10]}@teste.cedro"


@pytest.fixture(scope="session")
def crp_unico() -> str:
    """CRP único para testes de registro de psicólogo."""
    return f"06/{uuid.uuid4().hex[:6].upper()}"


@pytest.fixture(scope="session")
def data_futura() -> str:
    """Data futura (7 dias) no formato ISO para agendamento."""
    from datetime import date, timedelta
    return (date.today() + timedelta(days=7)).isoformat()


@pytest.fixture(scope="session")
def mensagem_2000_chars() -> str:
    """Mensagem com exatamente 2000 caracteres (limite máximo)."""
    return "a" * 2000


@pytest.fixture(scope="session")
def mensagem_2001_chars() -> str:
    """Mensagem com 2001 caracteres (acima do limite)."""
    return "a" * 2001


# ---------------------------------------------------------------------------
# Fixture de evidência
# ---------------------------------------------------------------------------

@pytest.fixture
def evidencia():
    """
    Fixture que registra requisições/respostas como evidência.

    Uso:
        def test_algo(evidencia):
            resp = requests.post(...)
            evidencia("test_algo", {
                "requisicao": {...},
                "resposta": {"status": resp.status_code, "body": resp.json()},
            })
    """
    def _registrar(nome: str, payload: dict) -> str:
        return _salvar_evidencia(nome, payload)
    return _registrar