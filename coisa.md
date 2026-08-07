Sua missão NÃO é escrever código.

Sua missão é realizar uma engenharia reversa completa deste projeto para produzir um documento técnico que será utilizado posteriormente por outra IA especializada em automação de testes.

A próxima IA NÃO terá acesso ao código-fonte.

Portanto, tudo que ela precisará saber deverá estar descrito no documento que você irá produzir.

Não economize detalhes.

Não resuma.

Sempre que possível cite caminhos completos dos arquivos analisados.

Explique o comportamento do sistema exatamente como ele está implementado.

Se alguma informação não puder ser determinada apenas analisando o código, informe explicitamente.

──────────────────────────────
ETAPA 1 — VISÃO GERAL
──────────────────────────────

Explique:

• Qual é o objetivo do sistema.

• Qual problema ele resolve.

• Quem são os usuários.

• Principais módulos.

• Fluxo principal do sistema.

• Tecnologias utilizadas.

• Frameworks.

• Bibliotecas importantes.

• Versões encontradas.

──────────────────────────────
ETAPA 2 — ESTRUTURA DO PROJETO
──────────────────────────────

Faça um mapeamento completo da árvore do projeto.

Explique a função de cada pasta.

Explique a função dos principais arquivos.

Indique onde ficam:

- Controllers
- Models
- Services
- Repositories
- Routes
- Configurações
- Middlewares
- DTOs
- Schemas
- Utilitários
- Testes
- Scripts
- Banco de dados
- Frontend
- Componentes
- Assets
- Configurações de ambiente

──────────────────────────────
ETAPA 3 — FLUXO DE EXECUÇÃO
──────────────────────────────

Explique exatamente:

Como o sistema inicia.

Qual arquivo inicia a aplicação.

Como ocorre o bootstrap.

Como as dependências são carregadas.

Como ocorre a configuração inicial.

Como ocorre a conexão com banco.

Como ocorre o carregamento das rotas.

Como ocorre a autenticação.

Como ocorre o encerramento.

──────────────────────────────
ETAPA 4 — BACKEND
──────────────────────────────

Mapeie TODOS os endpoints.

Para CADA endpoint informe:

• arquivo

• método HTTP

• URL

• controller

• service

• repository

• autenticação

• permissões

• parâmetros

• query params

• body esperado

• validações

• regras de negócio

• resposta de sucesso

• respostas de erro

• códigos HTTP

• exceções lançadas

• tabelas utilizadas

• entidades utilizadas

Explique o fluxo completo da requisição.

──────────────────────────────
ETAPA 5 — FRONTEND
──────────────────────────────

Liste TODAS as telas.

Para cada tela explique:

• caminho

• rota

• componente

• objetivo

• funcionalidades

• estados

• hooks utilizados

• chamadas para API

• validações

• mensagens

• navegação

• permissões

• componentes filhos

Explique o fluxo entre as telas.

──────────────────────────────
ETAPA 6 — REGRAS DE NEGÓCIO
──────────────────────────────

Identifique TODAS as regras de negócio implementadas.

Explique:

• onde estão

• como funcionam

• quando são executadas

• quais exceções podem gerar

• quais validações executam

──────────────────────────────
ETAPA 7 — BANCO DE DADOS
──────────────────────────────

Mapeie completamente o banco.

Liste:

• tabelas

• entidades

• colunas

• tipos

• chaves

• índices

• relacionamentos

• constraints

• migrations

• seeds

Explique como cada entidade é utilizada.

──────────────────────────────
ETAPA 8 — AUTENTICAÇÃO
──────────────────────────────

Explique completamente:

Login

Logout

JWT

Refresh Token

Cookies

Sessão

Middleware

Autorização

Perfis

Permissões

Proteção de rotas

Tempo de expiração

──────────────────────────────
ETAPA 9 — VALIDAÇÕES
──────────────────────────────

Liste TODAS as validações existentes.

Informe:

arquivo

campo

regra

mensagem

local da validação

backend/frontend

──────────────────────────────
ETAPA 10 — FLUXOS FUNCIONAIS
──────────────────────────────

Para CADA funcionalidade existente descreva o fluxo completo.

Exemplo:

Cadastro de usuário

Tela →

Validação →

API →

Controller →

Service →

Repository →

Banco →

Resposta →

Atualização da interface

Faça isso para TODAS as funcionalidades.

──────────────────────────────
ETAPA 11 — PONTOS DE TESTE
──────────────────────────────

Para cada funcionalidade liste:

Casos positivos

Casos negativos

Campos obrigatórios

Valores inválidos

Valores limite

Duplicidade

Permissões

Possíveis falhas

Regras críticas

Essas informações serão utilizadas posteriormente para criação dos testes automatizados.

──────────────────────────────
ETAPA 12 — DEPENDÊNCIAS EXTERNAS
──────────────────────────────

Liste:

APIs

Serviços

Mensageria

Cache

Upload

Email

Storage

Pagamento

WebSocket

Fila

Cron

Arquivos

Explique como cada integração funciona.

──────────────────────────────
ETAPA 13 — AMBIENTE
──────────────────────────────

Explique exatamente como executar o projeto.

Inclua:

variáveis

docker

compose

scripts

npm

pip

poetry

venv

migrações

banco

build

produção

desenvolvimento

──────────────────────────────
ETAPA 14 — TESTES EXISTENTES
──────────────────────────────

Identifique qualquer estrutura de testes já existente.

Informe:

framework

organização

fixtures

mocks

helpers

coverage

pipelines

CI/CD

──────────────────────────────
ETAPA 15 — ANÁLISE PARA AUTOMAÇÃO
──────────────────────────────

Sem escrever código.

Apenas analise.

Informe quais funcionalidades são candidatas para:

• testes unitários

• testes de integração

• testes de API

• testes E2E

• testes de banco

• testes de regressão

• testes de segurança

• testes de performance

Explique o motivo de cada escolha.

──────────────────────────────
ETAPA 16 — PONTOS CRÍTICOS
──────────────────────────────

Liste tudo que pode dificultar uma automação.

Exemplo:

autenticação

CAPTCHA

tokens

cookies

iframes

uploads

download

websocket

renderização dinâmica

SPA

SSR

CSR

requisições assíncronas

polling

rate limit

──────────────────────────────
ETAPA 17 — SAÍDA FINAL
──────────────────────────────

Ao final produza um documento técnico estruturado contendo TODO o conhecimento necessário para que outra IA consiga desenvolver uma suíte completa de testes automatizados SEM precisar analisar novamente o projeto.

IMPORTANTE

NÃO escreva scripts.

NÃO escreva testes.

NÃO implemente nada.

NÃO proponha soluções.

Seu único objetivo é produzir contexto técnico extremamente detalhado e fiel ao código-fonte.

Se alguma informação não puder ser determinada com segurança, informe explicitamente em vez de fazer suposições.