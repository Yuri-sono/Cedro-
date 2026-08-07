"""
api_test_runner.py — Executor de testes de API (pytest).

Executa a suíte de testes de API do Cedro Plus e gera relatórios:
  - JUnit XML (para CI/CD)
  - JSON (para análise)
  - HTML (para visualização)

Uso:
    python api_test_runner.py [--base-url URL] [--html]
"""

import argparse
import json
import os
import subprocess
import sys
from datetime import datetime

import config


def executar_testes(base_url: str | None = None, gerar_html: bool = False) -> int:
    """
    Executa a suíte de testes de API com pytest.

    Args:
        base_url: URL base da API (sobrescreve config.BASE_URL).
        gerar_html: Se True, gera relatório HTML adicional.

    Returns:
        int: Código de saída do pytest (0 = sucesso, 1 = falha).
    """
    # Sobrescreve a URL base se fornecida
    if base_url:
        config.BASE_URL = base_url.rstrip("/")

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    relatorios_dir = config.RELATORIOS_DIR
    os.makedirs(relatorios_dir, exist_ok=True)

    # Caminhos dos relatórios
    junit_xml = os.path.join(relatorios_dir, f"junit_{timestamp}.xml")
    json_report = os.path.join(relatorios_dir, f"report_{timestamp}.json")
    html_report = os.path.join(relatorios_dir, f"report_{timestamp}.html")

    # Monta o comando pytest
    cmd = [
        sys.executable, "-m", "pytest",
        os.path.join(os.path.dirname(__file__), "tests"),
        "-v",
        "--junitxml", junit_xml,
        "--json-report", f"--json-report-file={json_report}",
    ]
    if gerar_html:
        cmd.extend(["--html", html_report, "--self-contained-html"])

    print(f"[INFO] Executando testes de API contra: {config.BASE_URL}")
    print(f"[INFO] Comando: {' '.join(cmd)}")
    print("-" * 60)

    # Executa pytest
    resultado = subprocess.run(cmd, cwd=os.path.dirname(__file__))

    print("-" * 60)
    print(f"[INFO] Relatório JUnit XML: {junit_xml}")
    print(f"[INFO] Relatório JSON: {json_report}")
    if gerar_html:
        print(f"[INFO] Relatório HTML: {html_report}")

    # Resumo do relatório JSON
    try:
        with open(json_report, "r", encoding="utf-8") as f:
            dados = json.load(f)
        resumo = dados.get("summary", {})
        print(f"[RESUMO] Total: {resumo.get('total', 0)}")
        print(f"[RESUMO] Passed: {resumo.get('passed', 0)}")
        print(f"[RESUMO] Failed: {resumo.get('failed', 0)}")
        print(f"[RESUMO] Skipped: {resumo.get('skipped', 0)}")
        print(f"[RESUMO] Erros: {resumo.get('errors', 0)}")
    except (FileNotFoundError, json.JSONDecodeError):
        print("[AVISO] Não foi possível ler o relatório JSON")

    return resultado.returncode


def main() -> None:
    """Ponto de entrada da CLI."""
    parser = argparse.ArgumentParser(description="Executor de testes de API do Cedro Plus")
    parser.add_argument(
        "--base-url",
        help="URL base da API (padrão: config.BASE_URL)",
        default=None,
    )
    parser.add_argument(
        "--html",
        action="store_true",
        help="Gera relatório HTML adicional",
    )
    args = parser.parse_args()

    codigo = executar_testes(base_url=args.base_url, gerar_html=args.html)
    sys.exit(codigo)


if __name__ == "__main__":
    main()