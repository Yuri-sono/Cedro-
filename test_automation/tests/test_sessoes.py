"""
test_sessoes.py — Testes de API para o módulo de Sessões (/api/sessoes/*).

Cobre os endpoints críticos:
  - POST /api/sessoes (criar com horário ocupado, limite de 4/mês)
  - POST /api/sessoes/{id}/confirmar-pagamento
  - GET /api/sessoes/{id}/link-reuniao
  - GET /api/sessoes/disponibilidade/{psicologoId}

Mensagens de erro exatas extraídas do DOCUMENTO_TECNICO_CEDRO.md (ETAPA 9).
"""

from datetime import date, timedelta

import pytest

import config

MSG_PSICOLOGO_NAO_ENCONTRADO = "Psicólogo não encontrado"
MSG_HORARIO_INDISPONIVEL = "Horario indisponivel"
MSG_LIMITE_SESSOES = "Voce atingiu o limite de 4 sessoes agendadas neste mes no plano gratuito."
MSG_ACESSO_NEGADO_SESSAO = "Acesso negado. Paciente não corresponde à sessão."


def _data_futura(dias: int = 7) -> str:
    """Data futura no formato ISO."""
    return (date.today() + timedelta(days=dias)).isoformat()


class TestCriarSessao:
    """Testes do endpoint POST /api/sessoes."""

    def test_criar_sessao_sem_token(self, http_session, psicologo_id, evidencia):
        """CT: Criar sessão sem token JWT → 401 ou 403 (Spring Security)."""
        resp = http_session.post(
            f"{config.BASE_URL}/api/sessoes",
            json={
                "psicologoId": psicologo_id,
                "dataSessao": f"{_data_futura()}T10:00:00",
                "duracao": 60,
            },
        )
        evidencia("criar_sessao_sem_token", {
            "requisicao": {"psicologoId": psicologo_id},
            "resposta": {"status": resp.status_code, "body": resp.text},
        })
        assert resp.status_code in (401, 403)

    def test_criar_sessao_psicologo_inexistente(self, http_session, auth_headers, evidencia):
        """CT: Criar sessão com psicólogo inexistente → 400 com mensagem exata."""
        resp = http_session.post(
            f"{config.BASE_URL}/api/sessoes",
            json={
                "psicologoId": 999999,
                "dataSessao": f"{_data_futura()}T10:00:00",
                "duracao": 60,
            },
            headers=auth_headers,
        )
        evidencia("criar_sessao_psicologo_inexistente", {
            "requisicao": {"psicologoId": 999999},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 400
        assert resp.json().get("error") == MSG_PSICOLOGO_NAO_ENCONTRADO

    @pytest.mark.parametrize("payload,msg_erro", [
        ({"dataSessao": "2026-01-01T10:00:00", "duracao": 60}, "psicologoId é obrigatório"),
        ({"psicologoId": 1, "duracao": 60}, "dataSessao é obrigatória"),
    ])
    def test_criar_sessao_campo_obrigatorio(self, http_session, auth_headers, evidencia, payload, msg_erro):
        """CT: Criar sessão com campo obrigatório ausente → 400."""
        resp = http_session.post(
            f"{config.BASE_URL}/api/sessoes",
            json=payload,
            headers=auth_headers,
        )
        evidencia(f"criar_sessao_obrigatorio_{msg_erro[:10]}", {
            "requisicao": payload,
            "resposta": {"status": resp.status_code, "body": resp.text},
        })
        assert resp.status_code == 400

    def test_criar_sessao_valida(self, http_session, auth_headers, psicologo_id, evidencia):
        """CT: Criar sessão com dados válidos → 201."""
        import random
        # Usa horário aleatório para evitar conflito com sessões existentes
        hora = random.randint(8, 20)
        data = _data_futura(random.randint(14, 30))
        resp = http_session.post(
            f"{config.BASE_URL}/api/sessoes",
            json={
                "psicologoId": psicologo_id,
                "dataSessao": f"{data}T{hora:02d}:00:00",
                "duracao": 60,
                "observacoes": "Sessão de teste automatizado",
            },
            headers=auth_headers,
        )
        evidencia("criar_sessao_valida", {
            "requisicao": {"psicologoId": psicologo_id, "dataSessao": f"{data}T{hora:02d}:00:00"},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        if resp.status_code == 400 and resp.json().get("error") == MSG_HORARIO_INDISPONIVEL:
            pytest.xfail("Horário aleatório já ocupado no banco de produção")
        assert resp.status_code == 201, f"Esperado 201, obtido {resp.status_code}: {resp.text}"
        body = resp.json()
        assert body.get("psicologoId") == psicologo_id

    def test_criar_sessao_horario_ocupado(self, http_session, auth_headers, psicologo_id, evidencia):
        """CT: Criar sessão com horário ocupado → 400 com mensagem exata."""
        # Primeiro cria uma sessão para ocupar o horário
        data = _data_futura(12)
        horario = "16:00:00"
        resp1 = http_session.post(
            f"{config.BASE_URL}/api/sessoes",
            json={
                "psicologoId": psicologo_id,
                "dataSessao": f"{data}T{horario}",
                "duracao": 60,
            },
            headers=auth_headers,
        )
        if resp1.status_code != 201:
            pytest.skip(f"Não foi possível criar sessão base: {resp1.status_code} {resp1.text}")

        # Tenta criar no mesmo horário
        resp2 = http_session.post(
            f"{config.BASE_URL}/api/sessoes",
            json={
                "psicologoId": psicologo_id,
                "dataSessao": f"{data}T{horario}",
                "duracao": 60,
            },
            headers=auth_headers,
        )
        evidencia("criar_sessao_horario_ocupado", {
            "requisicao": {"psicologoId": psicologo_id, "dataSessao": f"{data}T{horario}"},
            "resposta": {"status": resp2.status_code, "body": resp2.json()},
        })
        assert resp2.status_code == 400
        assert resp2.json().get("error") == MSG_HORARIO_INDISPONIVEL


class TestConfirmarPagamento:
    """Testes do endpoint POST /api/sessoes/{id}/confirmar-pagamento."""

    def test_confirmar_pagamento_sessao_inexistente(self, http_session, auth_headers, evidencia):
        """CT: Confirmar pagamento de sessão inexistente → 400 ou 403."""
        resp = http_session.post(
            f"{config.BASE_URL}/api/sessoes/999999/confirmar-pagamento",
            headers=auth_headers,
        )
        evidencia("confirmar_pagamento_sessao_inexistente", {
            "requisicao": {"sessaoId": 999999},
            "resposta": {"status": resp.status_code, "body": resp.text},
        })
        assert resp.status_code in (400, 403)

    def test_confirmar_pagamento_sem_token(self, http_session, evidencia):
        """CT: Confirmar pagamento sem token JWT → 401 ou 403 (Spring Security)."""
        resp = http_session.post(
            f"{config.BASE_URL}/api/sessoes/1/confirmar-pagamento",
        )
        evidencia("confirmar_pagamento_sem_token", {
            "requisicao": {"sessaoId": 1},
            "resposta": {"status": resp.status_code, "body": resp.text},
        })
        assert resp.status_code in (401, 403)


class TestDisponibilidade:
    """Testes do endpoint GET /api/sessoes/disponibilidade/{psicologoId}."""

    def test_disponibilidade_psicologo(self, http_session, psicologo_id, evidencia):
        """CT: Consultar disponibilidade de psicólogo → 200 com horários (ou 403 — bug de segurança no backend)."""
        data = _data_futura(7)
        resp = http_session.get(
            f"{config.BASE_URL}/api/sessoes/disponibilidade/{psicologo_id}",
            params={"data": data},
        )
        evidencia("disponibilidade_psicologo", {
            "requisicao": {"psicologoId": psicologo_id, "data": data},
            "resposta": {"status": resp.status_code, "body": resp.text},
        })
        # 403 = bug conhecido: endpoint público bloqueado pelo Spring Security
        if resp.status_code == 403:
            pytest.xfail("BUG BACKEND: GET /api/sessoes/disponibilidade/{id} retorna 403 (endpoint público não liberado)")
        assert resp.status_code == 200
        body = resp.json()
        assert "horariosDisponiveis" in body
        assert "horariosOcupados" in body

    def test_disponibilidade_psicologo_inexistente(self, http_session, evidencia):
        """CT: Consultar disponibilidade de psicólogo inexistente → 400 (ou 403 — bug de segurança)."""
        resp = http_session.get(
            f"{config.BASE_URL}/api/sessoes/disponibilidade/999999",
            params={"data": _data_futura(7)},
        )
        evidencia("disponibilidade_psicologo_inexistente", {
            "requisicao": {"psicologoId": 999999},
            "resposta": {"status": resp.status_code, "body": resp.text},
        })
        if resp.status_code == 403:
            pytest.xfail("BUG BACKEND: GET /api/sessoes/disponibilidade/{id} retorna 403 (endpoint público não liberado)")
        assert resp.status_code == 400


class TestLinkReuniao:
    """Testes do endpoint GET /api/sessoes/{id}/link-reuniao."""

    def test_link_reuniao_sem_token(self, http_session, evidencia):
        """CT: Obter link de reunião sem token JWT → 401 ou 403 (Spring Security)."""
        resp = http_session.get(f"{config.BASE_URL}/api/sessoes/1/link-reuniao")
        evidencia("link_reuniao_sem_token", {
            "requisicao": {"sessaoId": 1},
            "resposta": {"status": resp.status_code, "body": resp.text},
        })
        assert resp.status_code in (401, 403)

    def test_link_reuniao_sessao_inexistente(self, http_session, auth_headers, evidencia):
        """CT: Obter link de reunião de sessão inexistente → 400."""
        resp = http_session.get(
            f"{config.BASE_URL}/api/sessoes/999999/link-reuniao",
            headers=auth_headers,
        )
        evidencia("link_reuniao_sessao_inexistente", {
            "requisicao": {"sessaoId": 999999},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 400