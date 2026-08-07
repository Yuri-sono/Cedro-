"""
test_usuarios.py — Testes de API para o módulo de Usuários (/api/usuarios/*).

Cobre os endpoints críticos:
  - GET /api/usuarios (admin apenas)
  - GET /api/usuarios/{id} (admin ou próprio usuário)
  - PUT /api/usuarios/{id}/ativar (admin apenas)

Mensagens de erro exatas extraídas do DOCUMENTO_TECNICO_CEDRO.md (ETAPA 9).
"""

import pytest

import config

MSG_ACESSO_NEGADO = "Acesso negado"


class TestListarUsuarios:
    """Testes do endpoint GET /api/usuarios."""

    def test_listar_usuarios_admin(self, http_session, admin_headers, evidencia):
        """CT: Admin lista todos os usuários → 200."""
        resp = http_session.get(
            f"{config.BASE_URL}/api/usuarios",
            headers=admin_headers,
        )
        evidencia("listar_usuarios_admin", {
            "requisicao": {},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 200, f"Esperado 200, obtido {resp.status_code}: {resp.text}"
        assert isinstance(resp.json(), list)

    def test_listar_usuarios_paciente(self, http_session, auth_headers, evidencia):
        """CT: Paciente tenta listar todos os usuários → 403 com mensagem exata."""
        resp = http_session.get(
            f"{config.BASE_URL}/api/usuarios",
            headers=auth_headers,
        )
        evidencia("listar_usuarios_paciente", {
            "requisicao": {},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 403
        assert resp.json().get("error") == MSG_ACESSO_NEGADO

    def test_listar_usuarios_sem_token(self, http_session, evidencia):
        """CT: Listar usuários sem token JWT → 401."""
        resp = http_session.get(f"{config.BASE_URL}/api/usuarios")
        evidencia("listar_usuarios_sem_token", {
            "requisicao": {},
            "resposta": {"status": resp.status_code, "body": resp.text},
        })
        assert resp.status_code == 401


class TestBuscarUsuario:
    """Testes do endpoint GET /api/usuarios/{id}."""

    def test_buscar_proprio_usuario(self, http_session, auth_headers, paciente_id, evidencia):
        """CT: Usuário busca a si mesmo → 200."""
        resp = http_session.get(
            f"{config.BASE_URL}/api/usuarios/{paciente_id}",
            headers=auth_headers,
        )
        evidencia("buscar_proprio_usuario", {
            "requisicao": {"id": paciente_id},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 200, f"Esperado 200, obtido {resp.status_code}: {resp.text}"
        assert resp.json().get("id") == paciente_id

    def test_buscar_outro_usuario(self, http_session, auth_headers, psicologo_id, evidencia):
        """CT: Paciente busca outro usuário → 403."""
        resp = http_session.get(
            f"{config.BASE_URL}/api/usuarios/{psicologo_id}",
            headers=auth_headers,
        )
        evidencia("buscar_outro_usuario", {
            "requisicao": {"id": psicologo_id},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 403


class TestAtivarUsuario:
    """Testes do endpoint PUT /api/usuarios/{id}/ativar."""

    def test_ativar_usuario_paciente(self, http_session, auth_headers, psicologo_id, evidencia):
        """CT: Paciente tenta ativar/desativar usuário → 403."""
        resp = http_session.put(
            f"{config.BASE_URL}/api/usuarios/{psicologo_id}/ativar",
            json={"ativo": False},
            headers=auth_headers,
        )
        evidencia("ativar_usuario_paciente", {
            "requisicao": {"id": psicologo_id, "ativo": False},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 403

    def test_ativar_usuario_sem_token(self, http_session, evidencia):
        """CT: Ativar usuário sem token JWT → 401."""
        resp = http_session.put(
            f"{config.BASE_URL}/api/usuarios/1/ativar",
            json={"ativo": False},
        )
        evidencia("ativar_usuario_sem_token", {
            "requisicao": {"id": 1, "ativo": False},
            "resposta": {"status": resp.status_code, "body": resp.text},
        })
        assert resp.status_code == 401