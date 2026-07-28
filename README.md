# 🌳 Cedro Plus

**Cedro Plus** é uma plataforma de saúde mental que conecta **Pacientes** e **Psicólogos** de forma segura e eficiente. O ecossistema abrange uma aplicação Web para gestão, um aplicativo Mobile focado no paciente e um Backend unificado como fonte da verdade.

---

## 🏛️ Arquitetura do Sistema

Arquitetura **centralizada baseada em API REST + WebSocket STOMP**, garantindo que Web e Mobile consumam a mesma camada de segurança, regras de negócio e persistência.

- **Backend Central**: Spring Boot 3 (Java 17) — REST + WebSocket STOMP
- **Banco de Dados**: Microsoft SQL Server (remoto)
- **Cliente Web**: SPA React + Vite
- **Cliente Mobile**: React Native (Expo SDK)

```mermaid
graph TD
    A[📱 App Mobile (React Native / Expo)] -->|REST / JWT| C((⚙️ Backend Central - Spring Boot))
    A -->|STOMP / WebSocket| C
    A -->|OAuth2| E[🔑 Google OAuth]

    B[💻 Portal Web (React + Vite)] -->|REST / JWT| C
    B -->|STOMP / WebSocket| C

    C -->|Persistência| D[(🗄️ SQL Server)]
    C -->|Calendar API| F[📅 Google Calendar / Meet]
    F -.->|link_reuniao| C
```

---

## 🚀 Principais Tecnologias e Funcionalidades

### 1. Backend (Spring Boot 3)
- **Segurança**: Autenticação via **JWT**. Endpoints segmentados por papel: `paciente`, `psicologo`, `admin`.
- **Mensageria Realtime**: **Spring WebSocket + STOMP** para chat bidirecional em tempo real (sem polling).
- **Integração Google Meet**: Ao confirmar uma sessão, o backend usa a **Google Calendar API** (service account com OAuth2 refresh token) para criar um evento no Google Calendar e retornar o link do Google Meet. O link é armazenado em `sessoes.link_reuniao`.
- **Reset de Senha Seguro**: Fluxo com token de uso único (tabela `password_reset_tokens`, expiração 30 min). Envio de e-mail via `spring-boot-starter-mail` (configurável; quando `MAIL_ENABLED=false`, o link é logado no console para testes).
- **Gestão de Sessões**: Agendamento, controle de status e apuração financeira.

### 2. Frontend Web (React + Vite)
- Dashboard do psicólogo com agenda FullCalendar, financeiro e estatísticas (dados reais via API).
- Fluxo completo de recuperação/redefinição de senha (`/redefinir-senha?token=...`).
- Chat em tempo real via STOMP.
- Instância Axios centralizada em `src/services/api.js` com interceptors de JWT e retry.

### 3. Mobile (React Native / Expo)
- **Reuniões via Google Meet**: A tela `ReuniaoScreen` faz polling no backend e abre o link do Meet quando a sessão é liberada.
- **Notificações Push**: Expo Notifications.
- **Estado**: Zustand + TanStack Query (React Query).
- **Token seguro**: `expo-secure-store` (nunca AsyncStorage puro para JWT).

---

## 🛠️ Como Rodar Localmente

### Backend (Spring Boot)
```bash
cd backend/cedro-backend
# Configure as variáveis de ambiente (ver seção abaixo)
mvn spring-boot:run
# Porta padrão: 8080
```

### Frontend Web
```bash
cd frontend
cp .env.example .env
# Edite VITE_API_URL=http://localhost:8080
npm install && npm run dev
```

### Mobile
```bash
cd mobile
cp .env.development.example .env.development
# Edite EXPO_PUBLIC_API_URL conforme seu ambiente
npm install
npx expo start
```

---

## 🔒 Variáveis de Ambiente

### Backend (`backend/cedro-backend/.env`)

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | JDBC URL do SQL Server |
| `DATABASE_USERNAME` | Usuário do banco |
| `DATABASE_PASSWORD` | Senha do banco |
| `JWT_SECRET` | Secret para assinar tokens JWT (mín. 32 chars) |
| `GOOGLE_CLIENT_ID` | Client ID do projeto Google Cloud |
| `GOOGLE_CLIENT_SECRET` | Client Secret do projeto Google Cloud |
| `GOOGLE_REFRESH_TOKEN` | Refresh token OAuth2 da conta de serviço Google |
| `GOOGLE_MEET_RELEASE_MINUTES_BEFORE` | Minutos antes da sessão para liberar o link (padrão: 15) |
| `MAIL_ENABLED` | `true` para enviar e-mails reais, `false` para logar no console |
| `MAIL_HOST` | Servidor SMTP (ex: `smtp.gmail.com`) |
| `MAIL_PORT` | Porta SMTP (ex: `587`) |
| `MAIL_USERNAME` | Usuário SMTP |
| `MAIL_PASSWORD` | Senha SMTP |
| `FRONTEND_URL` | URL base do frontend para links de e-mail (ex: `https://cedro.vercel.app`) |

### Frontend Web (`frontend/.env`)

| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL base do backend |
| `VITE_GOOGLE_CLIENT_ID` | Client ID Google para login social |

### Mobile (`mobile/.env.development` / EAS Console)

| Variável | Descrição |
|---|---|
| `EXPO_PUBLIC_API_URL` | URL base do backend |

> **Nunca versione arquivos `.env` com valores reais.** Use o EAS Console para variáveis de produção.

---

## 🗄️ Banco de Dados

Scripts SQL em `SQL Cedro/`:

| Arquivo | Descrição |
|---|---|
| `schema_simples.sql` | Schema completo (destrutivo — apenas para setup inicial) |
| `atualizacao_banco.sql` | Migrações incrementais |
| `google_meet_columns.sql` | Colunas `link_reuniao` e `google_event_id` na tabela `sessoes` |
| `mobile_tables.sql` | Tabelas adicionais para o mobile |
| `password_reset_tokens.sql` | Tabela de tokens de reset de senha (idempotente) |
| `dados_demo_apresentacao.sql` | Seed de dados de demonstração para TCC (idempotente) |

---

## 🔗 Integração Google Meet

1. Crie um projeto no [Google Cloud Console](https://console.cloud.google.com)
2. Ative a **Google Calendar API**
3. Configure as credenciais OAuth2 e gere um refresh token com escopo `https://www.googleapis.com/auth/calendar`
4. Configure `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` e `GOOGLE_REFRESH_TOKEN` no `.env` do backend
5. Ao agendar uma sessão, o backend cria automaticamente um evento no Google Calendar com link do Meet e armazena em `sessoes.link_reuniao`

---

*Feito com propósito e dedicação para melhorar a saúde mental e expandir a acessibilidade ao suporte psicológico.* 💙
