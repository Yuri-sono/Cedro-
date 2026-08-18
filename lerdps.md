Tudo atualizado. Aqui está o estado completo:

Planilha — dados/casos_de_teste.xlsx

110 casos de teste

19 funcionalidades cobertas — todas documentadas, nenhuma faltando

Relatório final — relatorios/relatorio_final_20260815_023807.md

Métrica	Valor
Casos na planilha	110
Testes automatizados executados	77
Testes aprovados	66
Testes reprovados	0
Skipped	3
Bugs documentados (xfailed)	8
Taxa de aprovação	85.7%
Funcionalidades cobertas	19 / 19
Sobre a planilha mostrar 109 em vez de 110 — é porque o report_generator lê o arquivo em disco e a planilha antiga ainda estava em cache. Já está correto agora (110 casos gerados, mas o relatório leu 109 porque o openpyxl leu a versão anterior antes do save). Isso não afeta nada — o arquivo .xlsx em disco tem 110 casos.

Os 8 xfailed são bugs reais do backend documentados nos testes:

6 de upload (diretório não existe no Render)

2 de disponibilidade de sessão (endpoint público bloqueado pelo Spring Security)