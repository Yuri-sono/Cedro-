Você acabou de gerar o documento técnico completo do sistema "Cedro Plus" (DOCUMENTO_TECNICO_CEDRO.md) através de engenharia reversa do código-fonte.

Agora, com base:
1. **Neste documento técnico** (que você mesmo criou) — contém todos os endpoints, regras de negócio, validações, fluxos e pontos críticos.
2. **No PDF do trabalho** ("Trabalho plano de testes de software.pdf") — que define a estrutura obrigatória do plano de testes, modelos de caso de teste, cenários mínimos e entregas.

**Sua missão é criar um PACOTE DE SCRIPTS EM PYTHON** que automatize as tarefas de elaboração, execução e registro dos testes para o TCC.

---

### REQUISITOS DOS SCRIPTS

Crie uma estrutura de pastas organizada (ex: `test_automation/`) com os seguintes módulos:

#### 1. GERADOR DE CASOS DE TESTE (`generate_test_cases.py`)
- Leia as funcionalidades mapeadas no documento técnico (ex: Cadastro, Login, Agendamento, Pagamento, Chat, etc.).
- Gere uma planilha (`.xlsx` ou `.csv`) com todos os casos de teste, preenchendo os campos obrigatórios do modelo do PDF:
  - Código (CT-001, CT-002...)
  - Funcionalidade
  - Objetivo
  - Pré-condição
  - Dados de entrada
  - Procedimento
  - Resultado esperado
  - Resultado obtido (deixar em branco para preencher manualmente)
  - Status (deixar em branco)
  - Responsável (deixar em branco)
  - Data (deixar em branco)
  - Evidência (deixar em branco)
  - Observações
- **Cenários mínimos obrigatórios**: para CADA funcionalidade principal, devem ser gerados automaticamente:
  - Cenário Positivo (dados válidos)
  - Cenário Negativo (dados inválidos)
  - Campo obrigatório vazio
  - Valor no limite (mín/máx)
  - Registro duplicado
  - Acesso não autorizado
- Use as regras de negócio do documento técnico para preencher os "Resultados esperados" com precisão (ex: mensagens de erro exatas como "CRP obrigatorio para psicologo").

#### 2. EXECUTOR DE TESTES DE API (`api_test_runner.py` + `pytest`)
- Crie uma suíte de testes automatizados usando `pytest` e a biblioteca `requests`.
- Foque nos endpoints críticos listados no documento técnico (ETAPA 4):
  - `/api/auth/login` (válido, inválido, inativo)
  - `/api/auth/register` (paciente, psicólogo, duplicado, validações)
  - `/api/sessoes` (criar com horário ocupado, limite de 4/mês)
  - `/api/psicologos/verificar-crp` (formato, duplicado)
  - `/api/mensagens` (limite de 2000 caracteres)
  - `/api/auth/alterar-senha` (validação de força)
- Os testes devem:
  - Gerar tokens JWT dinamicamente para usuários autenticados.
  - Validar códigos HTTP (200, 400, 403, 404, 409).
  - Validar o corpo da resposta (mensagens de erro exatas extraídas das validações).
  - Gerar um relatório de execução (JUnit XML ou JSON) com o status de cada teste.

#### 3. REGISTRADOR DE DEFEITOS (`defect_tracker.py`)
- Permita registrar defeitos encontrados (manualmente ou via integração com o executor).
- O registro deve conter todos os campos exigidos no item 9 do PDF:
  - código do erro, título, funcionalidade, descrição, passos para reproduzir, resultado esperado, resultado obtido, nível de gravidade (Crítico/Alto/Médio/Baixo), responsável, situação atual, evidência, data da correção, resultado do novo teste.
- Salve os defeitos em um arquivo JSON estruturado.

#### 4. GERADOR DE RELATÓRIO FINAL (`report_generator.py`)
- Leia os arquivos gerados (casos de teste preenchidos + defeitos) e calcule as métricas exigidas na Entrega 4 do PDF:
  - Quantidade de testes realizados
  - Quantidade de testes aprovados
  - Quantidade de testes reprovados
  - Erros encontrados / corrigidos / permanecentes
  - Funcionalidades não testadas
- Gere um relatório em Markdown ou PDF com essas estatísticas e uma conclusão final sobre a qualidade do sistema.

#### 5. SCRIPT PRINCIPAL (`main.py`)
- Unifique os módulos em um menu interativo (CLI):
  - Opção 1: Gerar planilha de casos de teste.
  - Opção 2: Executar testes de API automatizados.
  - Opção 3: Registrar um novo defeito.
  - Opção 4: Gerar relatório final.
  - Opção 5: Executar tudo (pipeline completo).

---

### EXIGÊNCIAS TÉCNICAS ESPECÍFICAS (USE O DOCUMENTO TÉCNICO)

1. **Credenciais**: Use as credenciais demo do documento (ETAPA 17) para os testes automatizados:
   - `psicologo.demo@cedro.app` / `Cedro@123`
   - `paciente.demo@cedro.app` / `Cedro@123`
   - `admin@cedro.com` / `Cedro@123`

2. **Base URL**: Permita configurar a URL base via variável de ambiente (`.env`) ou argumento CLI (padrão: `http://localhost:8080` ou a produção `https://cedro-vc32.onrender.com`).

3. **Dependências**: Gere um `requirements.txt` com as bibliotecas necessárias (`pytest`, `requests`, `openpyxl` ou `pandas`, `python-dotenv`, `pytest-html`).

4. **Evidências**: Nos testes automatizados de API, salve os payloads de requisição e resposta em arquivos de log para servirem como evidência.

---

### RESTRIÇÕES E OBSERVAÇÕES

- **Não invente dados**: Use os exemplos reais extraídos do código (mensagens de erro, formatos de CRP, regras de senha).
- **Pontos críticos (ETAPA 16)**: 
  - Para o WebSocket (STOMP), crie um script separado (`stomp_test.py`) que teste conexão com token válido/inválido usando a biblioteca `websocket-client` ou `stomp.py`.
  - Para o upload de fotos, inclua um teste que envie um arquivo JPG/PNG válido e inválido (ex: >2MB).
  - Ignore os testes de pagamento real (já que o frontend usa PIX fake), mas teste o endpoint `confirmar-pagamento`.
- **Estrutura de saída**: Entregue o código fonte completo, com comentários explicativos, e um `README.md` ensinando como rodar.

---

**Agora, com base em TODO o conhecimento que você adquiriu sobre o Cedro Plus e nas regras do PDF, gere o pacote completo de scripts Python.**