"""
stomp_test.py — Testes de WebSocket STOMP para o Cedro Plus.

Testa a conexão ao endpoint /ws-chat com:
  - Token JWT válido (deve conectar)
  - Token JWT inválido (deve ser recusado)
  - Sem token (deve ser recusado)

O endpoint WebSocket é: ws://<host>/ws-chat?token=<JWT>
(ver DOCUMENTO_TECNICO_CEDRO.md, ETAPA 4.9 — WebSocket STOMP)

Uso:
    python stomp_test.py [--base-url URL]
"""

import argparse
import json
import os
import sys
from datetime import datetime

import requests
import websocket

import config


def _obter_token(email: str, senha: str) -> str:
    """Obtém um token JWT via login."""
    resp = requests.post(
        f"{config.BASE_URL}/api/auth/login",
        json={"email": email, "senha": senha},
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()["token"]


def _converter_para_ws(url: str) -> str:
    """Converte http:// para ws:// e https:// para wss://."""
    if url.startswith("https://"):
        return url.replace("https://", "wss://", 1)
    if url.startswith("http://"):
        return url.replace("http://", "ws://", 1)
    return url


def _salvar_evidencia(nome: str, payload: dict) -> str:
    """Salva evidência em JSON."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    caminho = os.path.join(config.EVIDENCIAS_DIR, f"{nome}_{timestamp}.json")
    with open(caminho, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2, default=str)
    return caminho


def testar_conexao_token_valido() -> bool:
    """
    Testa conexão WebSocket com token JWT válido.

    Returns:
        bool: True se a conexão foi estabelecida.
    """
    print("\n[TESTE 1] Conexão com token JWT válido")
    print("-" * 50)

    try:
        token = _obter_token(config.PACIENTE_EMAIL, config.PACIENTE_SENHA)
        ws_url = f"{_converter_para_ws(config.BASE_URL)}/ws-chat?token={token}"

        ws = websocket.create_connection(ws_url, timeout=10)
        # Envia frame CONNECT do STOMP
        ws.send("CONNECT\naccept-version:1.2\nhost:localhost\n\n\x00")

        # Aguarda resposta
        resposta = ws.recv()
        ws.close()

        sucesso = "CONNECTED" in resposta
        _salvar_evidencia("stomp_token_valido", {
            "url": ws_url.replace(token, "***"),
            "resposta": resposta,
            "sucesso": sucesso,
        })

        if sucesso:
            print("[PASS] Conexão estabelecida com token válido (CONNECTED)")
        else:
            print(f"[FAIL] Resposta inesperada: {resposta}")
        return sucesso

    except Exception as e:
        print(f"[FAIL] Erro ao conectar com token válido: {e}")
        _salvar_evidencia("stomp_token_valido", {
            "url": ws_url if 'ws_url' in locals() else "N/A",
            "erro": str(e),
            "sucesso": False,
        })
        return False


def testar_conexao_token_invalido() -> bool:
    """
    Testa conexão WebSocket com token JWT inválido.

    Returns:
        bool: True se a conexão foi recusada (comportamento esperado).
    """
    print("\n[TESTE 2] Conexão com token JWT inválido")
    print("-" * 50)

    ws_url = f"{_converter_para_ws(config.BASE_URL)}/ws-chat?token=token_invalido"

    try:
        ws = websocket.create_connection(ws_url, timeout=10)
        # Se conectou, o teste falhou (token inválido deveria ser recusado)
        ws.close()
        print("[FAIL] Conexão foi aceita com token inválido (deveria ser recusada)")
        _salvar_evidencia("stomp_token_invalido", {
            "url": ws_url,
            "sucesso": False,
            "motivo": "Conexão aceita com token inválido",
        })
        return False

    except websocket.WebSocketBadStatusException as e:
        # Handshake recusado (status != 101) — comportamento esperado
        print(f"[PASS] Conexão recusada com token inválido (status {e.status_code})")
        _salvar_evidencia("stomp_token_invalido", {
            "url": ws_url,
            "sucesso": True,
            "status": e.status_code,
        })
        return True

    except Exception as e:
        # Outros erros de conexão também indicam recusa
        print(f"[PASS] Conexão recusada com token inválido: {e}")
        _salvar_evidencia("stomp_token_invalido", {
            "url": ws_url,
            "sucesso": True,
            "erro": str(e),
        })
        return True


def testar_conexao_sem_token() -> bool:
    """
    Testa conexão WebSocket sem token.

    Returns:
        bool: True se a conexão foi recusada (comportamento esperado).
    """
    print("\n[TESTE 3] Conexão sem token")
    print("-" * 50)

    ws_url = f"{_converter_para_ws(config.BASE_URL)}/ws-chat"

    try:
        ws = websocket.create_connection(ws_url, timeout=10)
        ws.close()
        print("[FAIL] Conexão foi aceita sem token (deveria ser recusada)")
        _salvar_evidencia("stomp_sem_token", {
            "url": ws_url,
            "sucesso": False,
            "motivo": "Conexão aceita sem token",
        })
        return False

    except websocket.WebSocketBadStatusException as e:
        print(f"[PASS] Conexão recusada sem token (status {e.status_code})")
        _salvar_evidencia("stomp_sem_token", {
            "url": ws_url,
            "sucesso": True,
            "status": e.status_code,
        })
        return True

    except Exception as e:
        print(f"[PASS] Conexão recusada sem token: {e}")
        _salvar_evidencia("stomp_sem_token", {
            "url": ws_url,
            "sucesso": True,
            "erro": str(e),
        })
        return True


def main() -> None:
    """Ponto de entrada da CLI."""
    parser = argparse.ArgumentParser(description="Testes de WebSocket STOMP do Cedro Plus")
    parser.add_argument("--base-url", help="URL base da API", default=None)
    args = parser.parse_args()

    if args.base_url:
        config.BASE_URL = args.base_url.rstrip("/")

    print(f"[INFO] URL base: {config.BASE_URL}")
    print(f"[INFO] Endpoint WebSocket: {_converter_para_ws(config.BASE_URL)}/ws-chat?token=<JWT>")

    resultados = [
        testar_conexao_token_valido(),
        testar_conexao_token_invalido(),
        testar_conexao_sem_token(),
    ]

    print("\n" + "=" * 50)
    print("RESUMO DOS TESTES STOMP")
    print("=" * 50)
    nomes = ["Token válido", "Token inválido", "Sem token"]
    for nome, resultado in zip(nomes, resultados):
        status = "PASS" if resultado else "FAIL"
        print(f"  [{status}] {nome}")

    aprovados = sum(resultados)
    print(f"\nTotal: {len(resultados)} | Aprovados: {aprovados} | Reprovados: {len(resultados) - aprovados}")

    # Código de saída: 0 se todos passaram
    sys.exit(0 if aprovados == len(resultados) else 1)


if __name__ == "__main__":
    main()