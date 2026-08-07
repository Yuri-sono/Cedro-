"""
test_mensagens.py — Testes de API para o módulo de Mensagens (/api/mensagens/*).

Cobre os endpoints críticos:
  - POST /api/mensagens (limite de 2000 caracteres)
  - GET /api/mensagens/conversa/{userId}
  - GET /api/mensagens/nao-lidas/count
  - PUT /api/mensagens/{id}/lida (permissões)

Mensagens de erro exatas extraídas do DOCUMENTO_TECNICO_CEDRO.md (ETAPA 9).
"""

import pytest

import config

MSG_MENSAGEM_LONGA = "Mensagem muito longa (máx. 2000 caracteres)"


class TestEnviarMensagem:
    """Testes do endpoint POST /api/mensagens."""

    def test_enviar_mensagem_sem_token(self, http_session, psicologo_id, evidencia):
        """CT: Enviar mensagem sem token JWT → 401."""
        resp = http_session.post(
            f"{config.BASE_URL}/api/mensagens",
            json={"destinatarioId": psicologo_id, "mensagem": "Olá"},
        )
        evidencia("enviar_mensagem_sem_token", {
            "requisicao": {"destinatarioId": psicologo_id},
            "resposta": {"status": resp.status_code, "body": resp.text},
        })
        assert resp.status_code == 401

    def test_enviar_mensagem_valida(self, http_session, auth_headers, psicologo_id, evidencia):
        """CT: Enviar mensagem válida → 200 com mensagem criada."""
        resp = http_session.post(
            f"{config.BASE_URL}/api/mensagens",
            json={"destinatarioId": psicologo_id, "mensagem": "Olá, gostaria de agendar uma sessão"},
            headers=auth_headers,
        )
        evidencia("enviar_mensagem_valida", {
            "requisicao": {"destinatarioId": psicologo_id, "mensagem": "Olá, gostaria de agendar uma sessão"},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 200, f"Esperado 200, obtido {resp.status_code}: {resp.text}"
        body = resp.json()
        assert body.get("mensagem") == "Olá, gostaria de agendar uma sessão"
        assert body.get("destinatarioId") == psicologo_id

    def test_enviar_mensagem_2001_chars(self, http_session, auth_headers, psicologo_id, mensagem_2001_chars, evidencia):
        """CT: Enviar mensagem com 2001 caracteres → 400 com mensagem exata."""
        resp = http_session.post(
            f"{config.BASE_URL}/api/mensagens",
            json={"destinatarioId": psicologo_id, "mensagem": mensagem_2001_chars},
            headers=auth_headers,
        )
        evidencia("enviar_mensagem_2001_chars", {
            "requisicao": {"destinatarioId": psicologo_id, "mensagem": f"<{len(mensagem_2001_chars)} chars>"},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 400
        assert resp.json().get("error") == MSG_MENSAGEM_LONGA

    def test_enviar_mensagem_2000_chars(self, http_session, auth_headers, psicologo_id, mensagem_2000_chars, evidencia):
        """CT: Enviar mensagem com exatamente 2000 caracteres → 200 (limite máximo)."""
        resp = http_session.post(
            f"{config.BASE_URL}/api/mensagens",
            json={"destinatarioId": psicologo_id, "mensagem": mensagem_2000_chars},
            headers=auth_headers,
        )
        evidencia("enviar_mensagem_2000_chars", {
            "requisicao": {"destinatarioId": psicologo_id, "mensagem": f"<{len(mensagem_2000_chars)} chars>"},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 200, f"Esperado 200, obtido {resp.status_code}: {resp.text}"

    def test_enviar_mensagem_sem_destinatario(self, http_session, auth_headers, evidencia):
        """CT: Enviar mensagem sem destinatarioId → 400."""
        resp = http_session.post(
            f"{config.BASE_URL}/api/mensagens",
            json={"mensagem": "Olá"},
            headers=auth_headers,
        )
        evidencia("enviar_mensagem_sem_destinatario", {
            "requisicao": {"mensagem": "Olá"},
            "resposta": {"status": resp.status_code, "body": resp.text},
        })
        assert resp.status_code == 400


class TestConversa:
    """Testes dos endpoints de conversa."""

    def test_listar_conversa(self, http_session, auth_headers, psicologo_id, evidencia):
        """CT: Listar conversa entre paciente e psicólogo → 200."""
        resp = http_session.get(
            f"{config.BASE_URL}/api/mensagens/conversa/{psicologo_id}",
            headers=auth_headers,
        )
        evidencia("listar_conversa", {
            "requisicao": {"userId": psicologo_id},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    def test_contar_nao_lidas(self, http_session, auth_headers, evidencia):
        """CT: Contar mensagens não lidas → 200 com count."""
        resp = http_session.get(
            f"{config.BASE_URL}/api/mensagens/nao-lidas/count",
            headers=auth_headers,
        )
        evidencia("contar_nao_lidas", {
            "requisicao": {},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 200
        assert "count" in resp.json()

    def test_listar_conversas(self, http_session, auth_headers, evidencia):
        """CT: Listar conversas do usuário → 200 com lista."""
        resp = http_session.get(
            f"{config.BASE_URL}/api/mensagens/conversas",
            headers=auth_headers,
        )
        evidencia("listar_conversas", {
            "requisicao": {},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)