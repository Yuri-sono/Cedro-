"""
test_upload.py — Testes de API para o upload de foto de perfil.

Cobre o endpoint crítico:
  - POST /api/auth/foto-perfil-upload (arquivo JPG/PNG válido e inválido, >2MB)

Mensagens de erro exatas extraídas do DOCUMENTO_TECNICO_CEDRO.md (ETAPA 9).
"""

import io

import pytest

import config

MSG_ARQUIVO_OBRIGATORIO = "Arquivo de imagem obrigatorio"
MSG_IMAGEM_GRANDE = "Imagem muito grande (max. 2MB)"
MSG_FORMATO_INVALIDO = "Formato invalido. Use JPG, PNG ou WebP"

# Tamanho máximo: 2_000_000 bytes (2MB)
FOTO_MAX_BYTES = 2_000_000


def _gerar_jpg_valido(tamanho: int = 1024) -> bytes:
    """Gera um arquivo JPG válido (mínimo) com o tamanho especificado."""
    # Cabeçalho JPEG mínimo + dados de preenchimento
    cabecalho = b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00"
    dados = cabecalho + b"\x00" * max(0, tamanho - len(cabecalho))
    return dados


def _gerar_png_valido(tamanho: int = 1024) -> bytes:
    """Gera um arquivo PNG válido (mínimo) com o tamanho especificado."""
    # Assinatura PNG + dados de preenchimento
    assinatura = b"\x89PNG\r\n\x1a\n"
    dados = assinatura + b"\x00" * max(0, tamanho - len(assinatura))
    return dados


class TestUploadFoto:
    """Testes do endpoint POST /api/auth/foto-perfil-upload."""

    def test_upload_jpg_valido(self, http_session, auth_headers, evidencia):
        """CT: Upload de imagem JPG válida → 200 com fotoUrl."""
        arquivo = _gerar_jpg_valido(1024)
        resp = http_session.post(
            f"{config.BASE_URL}/api/auth/foto-perfil-upload",
            files={"file": ("foto.jpg", io.BytesIO(arquivo), "image/jpeg")},
            headers=auth_headers,
        )
        evidencia("upload_jpg_valido", {
            "requisicao": {"file": "foto.jpg (1024 bytes, image/jpeg)"},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 200, f"Esperado 200, obtido {resp.status_code}: {resp.text}"
        body = resp.json()
        assert body.get("message") == "Foto atualizada"
        assert "fotoUrl" in body

    def test_upload_png_valido(self, http_session, auth_headers, evidencia):
        """CT: Upload de imagem PNG válida → 200 com fotoUrl."""
        arquivo = _gerar_png_valido(1024)
        resp = http_session.post(
            f"{config.BASE_URL}/api/auth/foto-perfil-upload",
            files={"file": ("foto.png", io.BytesIO(arquivo), "image/png")},
            headers=auth_headers,
        )
        evidencia("upload_png_valido", {
            "requisicao": {"file": "foto.png (1024 bytes, image/png)"},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 200, f"Esperado 200, obtido {resp.status_code}: {resp.text}"
        assert "fotoUrl" in resp.json()

    def test_upload_imagem_grande(self, http_session, auth_headers, evidencia):
        """CT: Upload de imagem > 2MB → 400 com mensagem exata."""
        arquivo = _gerar_jpg_valido(FOTO_MAX_BYTES + 1)
        resp = http_session.post(
            f"{config.BASE_URL}/api/auth/foto-perfil-upload",
            files={"file": ("foto_grande.jpg", io.BytesIO(arquivo), "image/jpeg")},
            headers=auth_headers,
        )
        evidencia("upload_imagem_grande", {
            "requisicao": {"file": f"foto_grande.jpg ({FOTO_MAX_BYTES + 1} bytes, image/jpeg)"},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 400
        assert resp.json().get("error") == MSG_IMAGEM_GRANDE

    def test_upload_formato_invalido(self, http_session, auth_headers, evidencia):
        """CT: Upload de arquivo não-imagem (text/plain) → 400 com mensagem exata."""
        arquivo = b"conteudo de texto qualquer"
        resp = http_session.post(
            f"{config.BASE_URL}/api/auth/foto-perfil-upload",
            files={"file": ("arquivo.txt", io.BytesIO(arquivo), "text/plain")},
            headers=auth_headers,
        )
        evidencia("upload_formato_invalido", {
            "requisicao": {"file": "arquivo.txt (text/plain)"},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 400
        assert resp.json().get("error") == MSG_FORMATO_INVALIDO

    def test_upload_sem_arquivo(self, http_session, auth_headers, evidencia):
        """CT: Upload sem arquivo → 400 com mensagem exata."""
        resp = http_session.post(
            f"{config.BASE_URL}/api/auth/foto-perfil-upload",
            headers=auth_headers,
        )
        evidencia("upload_sem_arquivo", {
            "requisicao": {"file": "<vazio>"},
            "resposta": {"status": resp.status_code, "body": resp.json()},
        })
        assert resp.status_code == 400
        assert resp.json().get("error") == MSG_ARQUIVO_OBRIGATORIO

    def test_upload_sem_token(self, http_session, evidencia):
        """CT: Upload sem token JWT → 401."""
        arquivo = _gerar_jpg_valido(1024)
        resp = http_session.post(
            f"{config.BASE_URL}/api/auth/foto-perfil-upload",
            files={"file": ("foto.jpg", io.BytesIO(arquivo), "image/jpeg")},
        )
        evidencia("upload_sem_token", {
            "requisicao": {"file": "foto.jpg"},
            "resposta": {"status": resp.status_code, "body": resp.text},
        })
        assert resp.status_code == 401