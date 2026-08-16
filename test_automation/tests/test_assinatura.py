"""
test_assinatura.py — Testes de API para o módulo de Assinatura (/api/assinatura/*).

Cobre os endpoints críticos:
  - POST /api/assinatura/webhook (autorização, payload inválido)
  - GET /api/assinatura/status (limites de uso)

Mensagens de erro exatas extraídas do DOCUMENTO_TECNICO_CEDRO.md (ETAPA 9).
"""

import pytest

import config

MSG_WEBHOOK_NAO_AUTORIZADO = "Webhook nao autorizado"
MSG_PAYLOAD_INVALIDO = "Payload RevenueCat invalido"

# Secret do webhook (configurável via variável de ambiente)
WEBHOOK_SECRET = config.REVENUECAT_WEBHOOK_SECRET


class TestWebhook:
    """Testes do endpoint POST /api/assinatura/webhook."""

    def test_webhook_nao_autorizado(self, http_session, evidencia):
        """CT: Webhook com secret incorreto → 401 com mensagem exata."""
        resp = http_session.post(
            f"{config.BASE_URL}/api/assinatura/webhook",
            json={"event": {"type": "INITIAL_PURCHASE", "app_user_id": "1"}},
            headers={"Authorization": "Bearer secret_errado"},
        )
        evidencia("webhook_nao_autorizado", {
            "requisicao": {"Authorization": "Bearer ***"},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 401
        assert resp.json().get("error") == MSG_WEBHOOK_NAO_AUTORIZADO

    def test_webhook_sem_authorization(self, http_session, evidencia):
        """CT: Webhook sem header Authorization → 401."""
        resp = http_session.post(
            f"{config.BASE_URL}/api/assinatura/webhook",
            json={"event": {"type": "INITIAL_PURCHASE", "app_user_id": "1"}},
        )
        evidencia("webhook_sem_authorization", {
            "requisicao": {},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 401

    @pytest.mark.skipif(not WEBHOOK_SECRET, reason="REVENUECAT_WEBHOOK_SECRET não configurado")
    def test_webhook_payload_invalido(self, http_session, evidencia):
        """CT: Webhook autorizado com payload inválido → 400 com mensagem exata."""
        resp = http_session.post(
            f"{config.BASE_URL}/api/assinatura/webhook",
            json={"event": {}},
            headers={"Authorization": WEBHOOK_SECRET},
        )
        evidencia("webhook_payload_invalido", {
            "requisicao": {"event": {}},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 400
        assert resp.json().get("error") == MSG_PAYLOAD_INVALIDO

    @pytest.mark.skipif(not WEBHOOK_SECRET, reason="REVENUECAT_WEBHOOK_SECRET não configurado")
    def test_webhook_autorizado(self, http_session, evidencia):
        """CT: Webhook autorizado com payload válido → 200."""
        resp = http_session.post(
            f"{config.BASE_URL}/api/assinatura/webhook",
            json={
                "event": {
                    "type": "INITIAL_PURCHASE",
                    "app_user_id": "1",
                    "expiration_at_ms": 1750000000000,
                    "product_id": "premium_mensal",
                    "transaction_id": "tx123",
                }
            },
            headers={"Authorization": WEBHOOK_SECRET},
        )
        evidencia("webhook_autorizado", {
            "requisicao": {"event": {"type": "INITIAL_PURCHASE", "app_user_id": "1"}},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 200
        assert resp.json().get("message") == "Webhook processado"


class TestStatusAssinatura:
    """Testes do endpoint GET /api/assinatura/status."""

    def test_status_sem_token(self, http_session, evidencia):
        """CT: Verificar status sem token JWT → 401 ou 403 (Spring Security)."""
        resp = http_session.get(f"{config.BASE_URL}/api/assinatura/status")
        evidencia("status_assinatura_sem_token", {
            "requisicao": {},
            "resposta": {"status": resp.status_code, "body": resp.text},
        })
        assert resp.status_code in (401, 403)

    def test_status_paciente(self, http_session, auth_headers, evidencia):
        """CT: Verificar status de assinatura do paciente → 200 com limites."""
        resp = http_session.get(
            f"{config.BASE_URL}/api/assinatura/status",
            headers=auth_headers,
        )
        evidencia("status_assinatura_paciente", {
            "requisicao": {},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 200
        body = resp.json()
        assert "isPremium" in body
        assert "chamadasRealizadas" in body
        assert "limiteMensal" in body
        # Paciente demo pode ter assinatura ativa no banco de produção
        assert isinstance(body["limiteMensal"], int)