# Pacote de Automação de Testes — Cedro Plus (TCC)

Este pacote automatiza a elaboração, execução e registro dos testes de software para o TCC do sistema **Cedro Plus**, plataforma de saúde mental que conecta pacientes e psicólogos.

## 📁 Estrutura do Pacote

```
test_automation/
├── main.py                    # Script principal (menu interativo CLI)
├── generate_test_cases.py     # Gerador de casos de teste (planilha .xlsx)
├── api_test_runner.py         # Executor de testes de API (pytest)
├── stomp_test.py              # Testes de WebSocket STOMP
├── defect_tracker.py          # Registrador de defeitos (JSON)
├── report_generator.py        # Gerador de relatório final (Markdown)
├── config.py                  # Configurações centrais (.env)
├── conftest.py                # Fixtures compartilhadas do pytest
├── requirements.txt           # Dependências
├── .env.example               # Exemplo de configuração
├── tests/                     # Suíte de testes de API (pytest)
│   ├── test_auth.py           # Autenticação (login, register, senha)
│   ├── test_sessoes.py        # Sessões (agendamento, pagamento)
│   ├── test_psicologos.py     # Psicólogos (CRP, lista, financeiro)
│   ├── test_mensagens.py      # Mensagens (chat REST)
│   ├── test_upload.py         # Upload de foto de perfil
│   ├── test_usuarios.py       # Gestão de usuários (admin)
│   └── test_assinatura.py     # Assinatura (webhook, status)
├── dados/                     # Dados gerados (planilha, defeitos)
├── evidencias/                # Evidências de testes (JSON)
└── relatorios/                # Relatórios (JUnit XML, JSON, HTML, MD)
```

## 🚀 Instalação

```bash
cd test_automation
pip install -r requirements.txt
```

## ⚙️ Configuração

Copie o arquivo `.env.example` para `.env` e ajuste conforme necessário:

```bash
cp .env.example .env
```

### Variáveis de ambiente

| Variável | Descrição | Padrão |
|---|---|---|
| `BASE_URL` | URL base da API | `http://localhost:8080` |
| `PSICOLOGO_EMAIL` | Email do psicólogo demo | `psicologo.demo@cedro.app` |
| `PSICOLOGO_SENHA` | Senha do psicólogo demo | `Cedro@123` |
| `PACIENTE_EMAIL` | Email do paciente demo | `paciente.demo@cedro.app` |
| `PACIENTE_SENHA` | Senha do paciente demo | `Cedro@123` |
| `ADMIN_EMAIL` | Email do admin demo | `admin@cedro.com` |
| `ADMIN_SENHA` | Senha do admin demo | `Cedro@123` |
| `REVENUECAT_WEBHOOK_SECRET` | Secret do webhook RevenueCat (opcional) | vazio |

**URLs de produção:**
- Backend: `https://cedro-vc32.onrender.com`
- Frontend: `https://cedro-eight.vercel.app`

## 🖥️ Uso

### Menu interativo (recomendado)

```bash
python main.py
```

Opções:
1. **Gerar planilha de casos de teste** — gera `dados/casos_de_teste.xlsx`
2. **Executar testes de API automatizados** — roda a suíte pytest
3. **Registrar um novo defeito** — modo interativo
4. **Gerar relatório final** — gera `relatorios/relatorio_final_*.md`
5. **Executar tudo (pipeline completo)** — 1 → 2 → 3 → 4
0. **Sair**

### Executar módulos individualmente

```bash
# Gerar planilha de casos de teste
python generate_test_cases.py

# Executar testes de API (com relatório HTML)
python api_test_runner.py --html

# Executar testes de API contra produção
python api_test_runner.py --base-url https://cedro-vc32.onrender.com --html

# Testes de WebSocket STOMP
python stomp_test.py

# Registrar defeito (modo interativo)
python defect_tracker.py

# Listar defeitos
python defect_tracker.py --list

# Gerar relatório final
python report_generator.py
```

### Executar apenas a suíte pytest

```bash
cd test_automation
pytest tests/ -v
```

## 📊 Saídas Geradas

### Planilha de casos de teste (`dados/casos_de_teste.xlsx`)

Contém todos os casos de teste com os campos obrigatórios do modelo do PDF:
- Código (CT-001, CT-002...)
- Funcionalidade
- Objetivo
- Pré-condição
- Dados de entrada
- Procedimento
- Resultado esperado
- Resultado obtido (em branco)
- Status (em branco)
- Responsável (em branco)
- Data (em branco)
- Evidência (em branco)
- Observações

Para cada funcionalidade principal são gerados automaticamente:
- Cenário Positivo
- Cenário Negativo
- Campo obrigatório vazio
- Valor no limite (mín/máx)
- Registro duplicado
- Acesso não autorizado

### Evidências (`evidencias/`)

Cada teste de API salva o payload de requisição e resposta em arquivos JSON com timestamp.

### Relatórios (`relatorios/`)

- `junit_*.xml` — relatório JUnit XML (para CI/CD)
- `report_*.json` — relatório JSON (para análise)
- `report_*.html` — relatório HTML (para visualização)
- `relatorio_final_*.md` — relatório final com métricas e conclusão

### Defeitos (`dados/defeitos.json`)

Registra defeitos com todos os campos exigidos no item 9 do PDF:
- Código do erro, título, funcionalidade, descrição, passos para reproduzir
- Resultado esperado, resultado obtido, nível de gravidade
- Responsável, situação atual, evidência, data da correção, resultado do novo teste

## 🔍 Funcionalidades Testadas

| Módulo | Endpoints | Cenários |
|---|---|---|
| **Auth** | `/api/auth/login`, `/api/auth/register`, `/api/auth/alterar-senha`, `/api/auth/recuperar-senha`, `/api/auth/redefinir-senha` | Login válido/inválido, registro paciente/psicólogo, validações de senha, CRP, duplicidade |
| **Sessões** | `/api/sessoes`, `/api/sessoes/{id}/confirmar-pagamento`, `/api/sessoes/{id}/link-reuniao`, `/api/sessoes/disponibilidade/{id}` | Agendamento, horário ocupado, limite de 4/mês, permissões |
| **Psicólogos** | `/api/psicologos/verificar-crp`, `/api/psicologos`, `/api/psicologos/financeiro` | Formato CRP, CRP duplicado, lista pública, permissões |
| **Mensagens** | `/api/mensagens`, `/api/mensagens/conversa/{id}`, `/api/mensagens/nao-lidas/count`, `/api/mensagens/conversas` | Limite de 2000 caracteres, permissões |
| **Upload** | `/api/auth/foto-perfil-upload` | JPG/PNG válido, >2MB, formato inválido |
| **Usuários** | `/api/usuarios`, `/api/usuarios/{id}`, `/api/usuarios/{id}/ativar` | Permissões admin, acesso próprio |
| **Assinatura** | `/api/assinatura/webhook`, `/api/assinatura/status` | Autorização webhook, limites |
| **WebSocket** | `/ws-chat` | Token válido/inválido/sem token |

## ⚠️ Observações

- **Pagamento real**: O frontend usa PIX fake (não é real). Os testes cobrem apenas o endpoint real `confirmar-pagamento`.
- **Google Meet**: Depende de credenciais Google reais. Se ausentes, o backend retorna sessão sem link.
- **Webhook RevenueCat**: Os testes de webhook autorizado são ignorados se `REVENUECAT_WEBHOOK_SECRET` não estiver configurado.
- **Dados demo**: Os usuários demo são criados automaticamente pelo seeder Java na inicialização do backend.

## 📝 Requisitos

- Python 3.10+
- Backend Cedro Plus em execução (local ou produção)
- Dependências instaladas via `requirements.txt`