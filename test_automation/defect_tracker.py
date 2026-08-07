"""
defect_tracker.py — Registrador de Defeitos para o TCC "Cedro Plus".

Permite registrar defeitos encontrados (manualmente ou via integração com o
executor de testes). O registro contém todos os campos exigidos no item 9 do
PDF do trabalho.

Os defeitos são salvos em um arquivo JSON estruturado.

Uso:
    python defect_tracker.py [--list] [--status STATUS]
"""

import argparse
import json
import os
import uuid
from datetime import datetime

import config

# Níveis de gravidade permitidos (item 9 do PDF)
NIVEIS_GRAVIDADE = ["Crítico", "Alto", "Médio", "Baixo"]

# Situações possíveis
SITUACOES = ["Aberto", "Em análise", "Corrigido", "Fechado", "Reaberto"]


def _caminho_defeitos() -> str:
    """Caminho do arquivo JSON de defeitos."""
    return os.path.join(config.DADOS_DIR, "defeitos.json")


def _carregar_defeitos() -> list:
    """Carrega a lista de defeitos do arquivo JSON."""
    caminho = _caminho_defeitos()
    if not os.path.exists(caminho):
        return []
    with open(caminho, "r", encoding="utf-8") as f:
        return json.load(f)


def _salvar_defeitos(defeitos: list) -> None:
    """Salva a lista de defeitos no arquivo JSON."""
    caminho = _caminho_defeitos()
    os.makedirs(os.path.dirname(caminho), exist_ok=True)
    with open(caminho, "w", encoding="utf-8") as f:
        json.dump(defeitos, f, ensure_ascii=False, indent=2, default=str)


def registrar_defeito(
    titulo: str,
    funcionalidade: str,
    descricao: str,
    passos_reproducao: str,
    resultado_esperado: str,
    resultado_obtido: str,
    gravidade: str = "Médio",
    responsavel: str = "",
    evidencia: str = "",
    codigo_erro: str = "",
) -> dict:
    """
    Registra um novo defeito.

    Args:
        titulo: Título resumido do defeito.
        funcionalidade: Funcionalidade afetada.
        descricao: Descrição detalhada do defeito.
        passos_reproducao: Passos para reproduzir o defeito.
        resultado_esperado: O que deveria acontecer.
        resultado_obtido: O que realmente aconteceu.
        gravidade: Nível de gravidade (Crítico/Alto/Médio/Baixo).
        responsavel: Responsável pela correção.
        evidencia: Caminho/descrição da evidência.
        codigo_erro: Código do erro (ex: HTTP 400).

    Returns:
        dict: O defeito registrado.
    """
    if gravidade not in NIVEIS_GRAVIDADE:
        raise ValueError(f"Gravidade inválida: {gravidade}. Use: {', '.join(NIVEIS_GRAVIDADE)}")

    defeito = {
        "id": f"DEF-{uuid.uuid4().hex[:8].upper()}",
        "codigo_erro": codigo_erro,
        "titulo": titulo,
        "funcionalidade": funcionalidade,
        "descricao": descricao,
        "passos_reproducao": passos_reproducao,
        "resultado_esperado": resultado_esperado,
        "resultado_obtido": resultado_obtido,
        "gravidade": gravidade,
        "responsavel": responsavel,
        "situacao": "Aberto",
        "evidencia": evidencia,
        "data_registro": datetime.now().isoformat(),
        "data_correcao": "",
        "resultado_novo_teste": "",
    }

    defeitos = _carregar_defeitos()
    defeitos.append(defeito)
    _salvar_defeitos(defeitos)

    print(f"[OK] Defeito registrado: {defeito['id']} — {titulo}")
    return defeito


def atualizar_defeito(
    defeito_id: str,
    situacao: str | None = None,
    responsavel: str | None = None,
    data_correcao: str | None = None,
    resultado_novo_teste: str | None = None,
) -> dict | None:
    """
    Atualiza um defeito existente.

    Args:
        defeito_id: ID do defeito (ex: DEF-ABC12345).
        situacao: Nova situação (Aberto/Em análise/Corrigido/Fechado/Reaberto).
        responsavel: Responsável pela correção.
        data_correcao: Data da correção.
        resultado_novo_teste: Resultado do novo teste após correção.

    Returns:
        dict | None: O defeito atualizado, ou None se não encontrado.
    """
    defeitos = _carregar_defeitos()
    for defeito in defeitos:
        if defeito["id"] == defeito_id:
            if situacao:
                if situacao not in SITUACOES:
                    raise ValueError(f"Situação inválida: {situacao}. Use: {', '.join(SITUACOES)}")
                defeito["situacao"] = situacao
            if responsavel:
                defeito["responsavel"] = responsavel
            if data_correcao:
                defeito["data_correcao"] = data_correcao
            if resultado_novo_teste:
                defeito["resultado_novo_teste"] = resultado_novo_teste
            _salvar_defeitos(defeitos)
            print(f"[OK] Defeito atualizado: {defeito_id}")
            return defeito
    print(f"[ERRO] Defeito não encontrado: {defeito_id}")
    return None


def listar_defeitos(status: str | None = None) -> list:
    """
    Lista os defeitos registrados.

    Args:
        status: Filtro por situação (opcional).

    Returns:
        list: Lista de defeitos.
    """
    defeitos = _carregar_defeitos()
    if status:
        defeitos = [d for d in defeitos if d["situacao"].lower() == status.lower()]
    return defeitos


def main() -> None:
    """Ponto de entrada da CLI."""
    parser = argparse.ArgumentParser(description="Registrador de Defeitos do Cedro Plus")
    parser.add_argument("--list", action="store_true", help="Lista os defeitos registrados")
    parser.add_argument("--status", help="Filtra defeitos por situação (ex: Aberto, Corrigido)")
    args = parser.parse_args()

    if args.list:
        defeitos = listar_defeitos(args.status)
        if not defeitos:
            print("[INFO] Nenhum defeito registrado.")
            return
        print(f"\n{'='*80}")
        print(f"DEFEITOS REGISTRADOS ({len(defeitos)})")
        print(f"{'='*80}")
        for d in defeitos:
            print(f"\nID: {d['id']}")
            print(f"  Título: {d['titulo']}")
            print(f"  Funcionalidade: {d['funcionalidade']}")
            print(f"  Gravidade: {d['gravidade']}")
            print(f"  Situação: {d['situacao']}")
            print(f"  Código do erro: {d['codigo_erro']}")
            print(f"  Responsável: {d['responsavel']}")
            print(f"  Data registro: {d['data_registro']}")
            if d.get("data_correcao"):
                print(f"  Data correção: {d['data_correcao']}")
            if d.get("resultado_novo_teste"):
                print(f"  Resultado novo teste: {d['resultado_novo_teste']}")
        return

    # Modo interativo
    print("=== REGISTRO DE DEFEITO ===")
    titulo = input("Título: ").strip()
    funcionalidade = input("Funcionalidade: ").strip()
    descricao = input("Descrição: ").strip()
    passos = input("Passos para reproduzir: ").strip()
    esperado = input("Resultado esperado: ").strip()
    obtido = input("Resultado obtido: ").strip()
    codigo_erro = input("Código do erro (ex: HTTP 400): ").strip()
    gravidade = input(f"Gravidade ({'/'.join(NIVEIS_GRAVIDADE)}): ").strip() or "Médio"
    responsavel = input("Responsável: ").strip()
    evidencia = input("Evidência (caminho/descrição): ").strip()

    registrar_defeito(
        titulo=titulo,
        funcionalidade=funcionalidade,
        descricao=descricao,
        passos_reproducao=passos,
        resultado_esperado=esperado,
        resultado_obtido=obtido,
        gravidade=gravidade,
        responsavel=responsavel,
        evidencia=evidencia,
        codigo_erro=codigo_erro,
    )


if __name__ == "__main__":
    main()