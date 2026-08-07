"""
main.py — Script principal do pacote de automação de testes do Cedro Plus.

Unifica os módulos em um menu interativo (CLI):
  Opção 1: Gerar planilha de casos de teste.
  Opção 2: Executar testes de API automatizados.
  Opção 3: Registrar um novo defeito.
  Opção 4: Gerar relatório final.
  Opção 5: Executar tudo (pipeline completo).

Uso:
    python main.py
"""

import config


def opcao_gerar_planilha() -> None:
    """Opção 1: Gera a planilha de casos de teste."""
    print("\n" + "=" * 60)
    print("GERANDO PLANILHA DE CASOS DE TESTE")
    print("=" * 60)
    from generate_test_cases import gerar_planilha
    caminho = gerar_planilha()
    print(f"\n[OK] Planilha gerada em: {caminho}")


def opcao_executar_testes() -> None:
    """Opção 2: Executa os testes de API automatizados."""
    print("\n" + "=" * 60)
    print("EXECUTANDO TESTES DE API AUTOMATIZADOS")
    print("=" * 60)
    from api_test_runner import executar_testes
    codigo = executar_testes(gerar_html=True)
    if codigo == 0:
        print("\n[OK] Todos os testes de API passaram!")
    else:
        print(f"\n[AVISO] Alguns testes falharam (código de saída: {codigo}).")


def opcao_registrar_defeito() -> None:
    """Opção 3: Registra um novo defeito (modo interativo)."""
    print("\n" + "=" * 60)
    print("REGISTRO DE DEFEITO")
    print("=" * 60)
    from defect_tracker import NIVEIS_GRAVIDADE, registrar_defeito

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


def opcao_gerar_relatorio() -> None:
    """Opção 4: Gera o relatório final."""
    print("\n" + "=" * 60)
    print("GERANDO RELATÓRIO FINAL")
    print("=" * 60)
    from report_generator import gerar_relatorio
    caminho = gerar_relatorio()
    print(f"\n[OK] Relatório gerado em: {caminho}")


def opcao_pipeline_completo() -> None:
    """Opção 5: Executa o pipeline completo (1 → 2 → 3 → 4)."""
    print("\n" + "=" * 60)
    print("PIPELINE COMPLETO DE TESTES")
    print("=" * 60)

    # 1. Gera planilha
    print("\n[ETAPA 1/4] Gerando planilha de casos de teste...")
    opcao_gerar_planilha()

    # 2. Executa testes de API
    print("\n[ETAPA 2/4] Executando testes de API...")
    opcao_executar_testes()

    # 3. Registra defeitos (opcional)
    print("\n[ETAPA 3/4] Registro de defeitos...")
    resposta = input("Deseja registrar um defeito encontrado? (s/N): ").strip().lower()
    if resposta in ("s", "sim"):
        opcao_registrar_defeito()
    else:
        print("[INFO] Nenhum defeito registrado.")

    # 4. Gera relatório final
    print("\n[ETAPA 4/4] Gerando relatório final...")
    opcao_gerar_relatorio()

    print("\n" + "=" * 60)
    print("PIPELINE COMPLETO FINALIZADO")
    print("=" * 60)


def exibir_menu() -> None:
    """Exibe o menu principal."""
    print("\n" + "=" * 60)
    print("  CEDRO PLUS — PACOTE DE AUTOMAÇÃO DE TESTES (TCC)")
    print("=" * 60)
    print(f"  URL base: {config.BASE_URL}")
    print("=" * 60)
    print("  [1] Gerar planilha de casos de teste")
    print("  [2] Executar testes de API automatizados")
    print("  [3] Registrar um novo defeito")
    print("  [4] Gerar relatório final")
    print("  [5] Executar tudo (pipeline completo)")
    print("  [0] Sair")
    print("=" * 60)


def main() -> None:
    """Ponto de entrada principal."""
    while True:
        exibir_menu()
        try:
            opcao = input("\nEscolha uma opção: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\n[INFO] Saindo...")
            break

        if opcao == "1":
            opcao_gerar_planilha()
        elif opcao == "2":
            opcao_executar_testes()
        elif opcao == "3":
            opcao_registrar_defeito()
        elif opcao == "4":
            opcao_gerar_relatorio()
        elif opcao == "5":
            opcao_pipeline_completo()
        elif opcao == "0":
            print("[INFO] Saindo...")
            break
        else:
            print("[ERRO] Opção inválida. Tente novamente.")

        input("\nPressione ENTER para continuar...")


if __name__ == "__main__":
    main()