# DOCUMENTO TÉCNICO COMPLETO — CEDRO PLUS (ENGENHARIA REVERSA PARA AUTOMAÇÃO DE TESTES)

> **IMPORTANTE**: Este documento foi produzido exclusivamente através de análise do código-fonte. Nenhuma informação foi inventada. Quando algo não pôde ser determinado com segurança pelo código, isso está explicitamente indicado.

---

## ETAPA 1 — VISÃO GERAL

### 1.1 Objetivo do Sistema
**Cedro Plus** é uma plataforma de saúde mental que conecta **Pacientes** e **Psicólogos** de forma segura e eficiente. O ecossistema abrange:
- Aplicação Web (SPA React) para gestão — pacientes, psicólogos e administradores
- Aplicativo Mobile (React Native / Expo) focado no paciente
- Backend Central unificado (Spring Boot 3 / Java 17) como fonte da verdade

### 1.2 Problema que Resolve
Quebra o estigma sobre saúde mental, proporcionando acesso facilitado a psicólogos com:
- Agendamento online de sessões
- Atendimento via Google Meet (reuniões virtuais)
- Chat em tempo real (WebSocket STOMP)
- Assinatura Premium (RevenueCat) com limite de sessões gratuitas por mês
- Autoavaliações, guias de saúde mental, jogos de relaxamento

### 1.3 Usuários
1. **Paciente** — agenda sessões, conversa com psicólogos, acessa recursos, assina Premium
2. **Psicólogo** — gerencia agenda, pacientes, consultas, financeiro, estatísticas
3. **Admin** — gerencia todos os usuários, sessões, ativa/desativa contas

### 1.4 Principais Módulos
| Módulo | Descrição |
|---|---|
| **Auth** | Registro, login, login Google, recuperação/redefinição de senha |
| **Usuários** | CRUD de usuários (pacientes, psicólogos, admins) |
| **Psicólogos** | Lista pública, detalhe, verificação de CRP, financeiro, estatísticas |
| **Sessões** | Agendamento, disponibilidade, confirmação de pagamento, Google Meet |
| **Mensagens** | Chat REST + WebSocket STOMP em tempo real |
| **Assinatura** | Webhook RevenueCat + verificação de status/limites |
| **Notificações** | Registro de push tokens |
| **Telefone emergência** | Chat de emergência (CVV 188) |

### 1.5 Fluxo Principal do Sistema
1. Usuário se cadastra (paciente ou psicólogo) ou faz login (incluindo Google OAuth)
2. Paciente busca psicólogos (filtrados por área de interesse)
3. Paciente agenda uma sessão (verifica disponibilidade do psicólogo)
4. Backend verifica limite de sessões gratuitas (4/mês para não-premium)
5. Paciente confirma pagamento → backend cria Google Meet via Google Calendar API
6. Link é disponibilizado 15 minutos antes da sessão (configurável)
7. Chat em tempo real via STOMP WebSocket
8. Psicólogo acessa dashboard com estatísticas, agenda, financeiro
9. Admin gerencia tudo pelo painel administrativo

### 1.6 Tecnologias, Frameworks e Versões

**Backend** (`backend/cedro-backend/pom.xml`):
| Tecnologia | Versão |
|---|---|
| Spring Boot Starter Parent | 3.5.7 |
| Java | 17 |
| Spring Data JPA | (gerenciado pelo parent) |
| Spring Security | (gerenciado pelo parent) |
| Spring Validation | (gerenciado pelo parent) |
| Spring Web | (gerenciado pelo parent) |
| Spring WebSocket | (gerenciado pelo parent) |
| Spring Mail | (gerenciado pelo parent) |
| MSSQL JDBC | (runtime, gerenciado pelo parent) |
| JJWT (io.jsonwebtoken) | 0.12.6 |
| Google API Client | 2.9.0 |
| Google API Services Calendar | v3-rev20260225-2.0.0 |
| Google Auth Library OAuth2 HTTP | 1.36.0 |

**Frontend Web** (`frontend/package.json`):
| Tecnologia | Versão |
|---|---|
| React | ^18.2.0 |
| React DOM | ^18.2.0 |
| React Router DOM | ^6.8.0 |
| Axios | ^1.4.0 |
| Bootstrap | ^5.3.8 |
| Bootstrap Icons | ^1.10.0 |
| Vite | ^4.3.0 |
| @fullcalendar/core | ^6.1.19 |
| @fullcalendar/react | ^6.1.19 |
| @fullcalendar/daygrid | ^6.1.19 |
| @fullcalendar/timegrid | ^6.1.19 |
| @fullcalendar/interaction | ^6.1.19 |
| @stomp/stompjs | ^7.3.0 |
| @vitejs/plugin-react | ^4.0.0 |

**Mobile** (`mobile/package.json`):
| Tecnologia | Versão |
|---|---|
| React Native | 0.81.5 |
| React | 19.1.0 |
| Expo | ~54.0.33 |
| TypeScript | ~5.9.2 |
| @react-navigation/native | ^7.2.4 |
| @react-navigation/native-stack | ^7.15.1 |
| @react-navigation/bottom-tabs | ^7.16.1 |
| Axios | ^1.16.1 |
| @stomp/stompjs | ^7.3.0 |
| @tanstack/react-query | ^5.100.11 |
| Zustand | ^5.0.13 |
| react-native-purchases (RevenueCat) | ^10.1.2 |
| expo-secure-store | ~15.0.8 |
| expo-notifications | ~0.32.17 |
| expo-image-picker | ~17.0.11 |
| expo-auth-session | ~7.0.11 |
| expo-linear-gradient | ^56.0.4 |

**Banco de Dados**: Microsoft SQL Server (remoto, hospedagem Somee conforme `run.bat`)

---

## ETAPA 2 — ESTRUTURA DO PROJETO

### 2.1 Árvore do Projeto (caminhos completos)

```
z:\Cedronovo\Cedro-\
├── .gitignore
├── Dockerfile
├── docker-entrypoint.sh
├── README.md
├── coisa.md                          # Instruções originais (documento de requisitos)
├── o.md                              # Scripts de teste STOMP manual
├── package-lock.json
├── backend\
│   └── cedro-backend\
│       ├── .env.example
│       ├── Dockerfile                # (presente no diretório, mas não verificado)
│       ├── pom.xml
│       ├── mvnw
│       ├── mvnw.cmd
│       ├── README.md
│       ├── run.bat
│       ├── start.ps1
│       ├── start.sh
│       ├── test-api.bat
│       ├── run_output.txt
│       ├── target\                   # Build output (ignorado)
│       └── src\
│           └── main\
│               ├── java\com\cedro\
│               │   ├── CedroBackendApplication.java
│               │   ├── config\
│               │   │   ├── DatabaseSchemaFixer.java          # DESATIVADO (comentado)
│               │   │   ├── DemoPsychologistSeeder.java       # ATIVO (CommandLineRunner)
│               │   │   ├── GlobalExceptionHandler.java
│               │   │   ├── SecurityConfig.java
│               │   │   ├── StaticResourceConfig.java
│               │   │   └── WebSocketConfig.java
│               │   ├── controller\
│               │   │   ├── AssinaturaController.java
│               │   │   ├── AuthController.java
│               │   │   ├── ChatStompController.java
│               │   │   ├── MensagemController.java
│               │   │   ├── NotificacaoController.java
│               │   │   ├── PsicologoController.java
│               │   │   ├── SessaoController.java
│               │   │   └── UsuarioController.java
│               │   ├── model\
│               │   │   ├── TipoUsuario.java
│               │   │   ├── dto\
│               │   │   │   ├── AlterarSenhaRequest.java
│               │   │   │   ├── ConversaResumo.java
│               │   │   │   ├── GoogleLoginRequest.java
│               │   │   │   ├── LoginRequest.java
│               │   │   │   ├── LoginResponse.java
│               │   │   │   ├── MensagemRequest.java
│               │   │   │   ├── PsicologoResponse.java
│               │   │   │   ├── RedefinirSenhaRequest.java
│               │   │   │   ├── RegisterRequest.java
│               │   │   │   ├── SessaoRequest.java
│               │   │   │   ├── UpdatePerfilRequest.java
│               │   │   │   └── UsuarioResponse.java
│               │   │   └── entity\
│               │   │       ├── Mensagem.java
│               │   │       ├── PasswordResetToken.java
│               │   │       ├── Sessao.java
│               │   │       └── Usuario.java
│               │   ├── repository\
│               │   │   ├── MensagemRepository.java
│               │   │   ├── PasswordResetTokenRepository.java
│               │   │   ├── SessaoRepository.java
│               │   │   └── UsuarioRepository.java
│               │   ├── security\
│               │   │   ├── JwtAuthenticationFilter.java
│               │   │   ├── JwtUtil.java
│               │   │   ├── StompHandshakeInterceptor.java
│               │   │   └── StompPrincipalHandshakeHandler.java
│               │   └── service\
│               │       ├── AssinaturaService.java
│               │       ├── AuthService.java
│               │       ├── EmailService.java
│               │       ├── GoogleMeetService.java
│               │       ├── MensagemService.java
│               │       ├── NotificacaoService.java
│               │       └── SessaoService.java
│               └── resources\
│                   └── application.properties
├── backend-node\
│   ├── .env                          # Credenciais TIAGO (ver ETAPA 12)
└── (apenas .env — nenhum código)
├── frontend\
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   ├── vercel.json
│   ├── vite.config.js
│   ├── public\
│   └── src\
│       ├── App.jsx
│       ├── main.jsx
│       ├── config.js
│       ├── components\
│       │   ├── AdBanner.jsx
│       │   ├── BackToTop.jsx
│       │   ├── CursorGlow.jsx
│       │   ├── CustomModal.jsx
│       │   ├── EmergencyButton.jsx
│       │   ├── Footer.jsx
│       │   ├── LoadingSpinner.jsx
│       │   ├── Navbar.jsx
│       │   ├── NavbarPsicologo.jsx
│       │   ├── NotificationSystem.jsx
│       │   ├── PagamentoModal.jsx
│       │   ├── PageTransition.jsx
│       │   ├── PersonalizacaoMenu.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── ReuniaoModal.jsx
│       │   ├── SidebarPsicologo.jsx
│       │   ├── ThemeSelector.jsx
│       │   └── games\
│       ├── contexts\
│       │   └── AuthContext.jsx
│       ├── hooks\
│       │   └── useModal.jsx
│       ├── pages\
│       │   ├── AdminSessoes.jsx
│       │   ├── AdminUsuarios.jsx
│       │   ├── AgendaPsicologo.jsx
│       │   ├── AgendarSessao.jsx
│       │   ├── AtendimentoOnline.jsx
│       │   ├── Autoavaliacao.jsx
│       │   ├── Autoavaliacoes.jsx
│       │   ├── CadastroPsicologo.jsx
│       │   ├── Chat.jsx
│       │   ├── ChatEmergencia.jsx
│       │   ├── ChatsPsicologo.jsx
│       │   ├── ConfiguracoesPsicologo.jsx
│       │   ├── ConsultasPsicologo.jsx
│       │   ├── Contato.jsx
│       │   ├── DashboardAdmin.jsx
│       │   ├── DashboardPsicologo.jsx
│       │   ├── EstatisticasPsicologo.jsx
│       │   ├── FinanceiroPsicologo.jsx
│       │   ├── Home.jsx
│       │   ├── JogosRelaxamento.jsx
│       │   ├── ListaPsicologos.jsx
│       │   ├── Login.jsx
│       │   ├── LoginAdmin.jsx
│       │   ├── LoginPsicologo.jsx
│       │   ├── MinhasConversas.jsx
│       │   ├── MinhasSessoes.jsx
│       │   ├── NotFound.jsx
│       │   ├── PacientesPsicologo.jsx
│       │   ├── PagamentoSessao.jsx
│       │   ├── Perfil.jsx
│       │   ├── PerfilPsicologo.jsx
│       │   ├── PoliticaPrivacidade.jsx
│       │   ├── Premium.jsx
│       │   ├── RedefinirSenha.jsx
│       │   ├── SaudeMental.jsx
│       │   └── TermosUso.jsx
│       ├── services\
│       │   ├── api.js
│       │   ├── pacienteService.js
│       │   └── psicologoService.js
│       └── styles\
│           ├── ads.css
│           ├── cedro-colors.css
│           ├── chat-emergencia.css
│           ├── chat.css
│           ├── custom-modal.css
│           ├── dashboard-psicologo.css
│           ├── emergency-button.css
│           ├── home.css
│           ├── index.css
│           ├── navbar-spacing.css
│           ├── notifications.css
│           ├── page-transitions.css
│           ├── personalizacao.css
│           ├── premium.css
│           ├── saude-mental.css
│           └── theme.css
├── mobile\
│   ├── .gitignore
│   ├── App.tsx
│   ├── app.config.ts
│   ├── app.json
│   ├── babel.config.js
│   ├── BUILD_FIXES_REPORT.md
│   ├── eas.json
│   ├── index.ts
│   ├── MELHORIAS_FRONTEND.md
│   ├── metro.config.js
│   ├── package.json
│   ├── test-build.bat
│   ├── tsconfig.json
│   ├── assets\
│   ├── src\
│   │   ├── components\
│   │   │   ├── AuthScreenLayout.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── OfflineBanner.tsx
│   │   │   ├── PsicologoCard.tsx
│   │   │   ├── SessionCard.tsx
│   │   │   └── Toast.tsx
│   │   ├── config\
│   │   │   └── environment.ts
│   │   ├── constants\
│   │   │   └── api.ts
│   │   ├── hooks\
│   │   │   ├── useAuth.ts
│   │   │   ├── useChat.ts
│   │   │   ├── useConversas.ts
│   │   │   ├── useNotifications.ts
│   │   │   ├── usePerfil.ts
│   │   │   ├── usePsicologos.ts
│   │   │   ├── usePsychologistDashboard.ts
│   │   │   ├── useSessoes.ts
│   │   │   └── useSubscription.ts
│   │   ├── navigation\
│   │   │   ├── AuthStack.tsx
│   │   │   ├── ChatStack.tsx
│   │   │   ├── HomeStack.tsx
│   │   │   ├── MainTabs.tsx
│   │   │   ├── ProfileStack.tsx
│   │   │   └── RootNavigator.tsx
│   │   ├── screens\
│   │   │   ├── SplashScreen.tsx
│   │   │   ├── auth\
│   │   │   │   ├── ForgotPasswordScreen.tsx
│   │   │   │   ├── LoginScreen.tsx
│   │   │   │   └── RegisterScreen.tsx
│   │   │   ├── calls\
│   │   │   │   └── ReuniaoScreen.tsx
│   │   │   ├── chat\
│   │   │   │   ├── ChatScreen.tsx
│   │   │   │   └── ConversasScreen.tsx
│   │   │   ├── home\
│   │   │   │   ├── HomeScreen.tsx
│   │   │   │   ├── PsicologoDetailScreen.tsx
│   │   │   │   ├── PsicologoListScreen.tsx
│   │   │   │   ├── ScheduleSessionScreen.tsx
│   │   │   │   └── SessionSuccessScreen.tsx
│   │   │   ├── profile\
│   │   │   │   ├── ChangePasswordScreen.tsx
│   │   │   │   ├── EditProfileScreen.tsx
│   │   │   │   ├── ProfileScreen.tsx
│   │   │   │   └── PsychologistSettingsScreen.tsx
│   │   │   ├── sessions\
│   │   │   │   └── SessionsScreen.tsx
│   │   │   └── subscription\
│   │   │       └── PaywallScreen.tsx
│   │   ├── services\
│   │   │   ├── agendaConfigService.ts
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   ├── callService.ts
│   │   │   ├── chatService.ts
│   │   │   ├── demoCommunicationService.ts
│   │   │   ├── notificationService.ts
│   │   │   ├── psicologoService.ts
│   │   │   ├── sessaoService.ts
│   │   │   ├── subscriptionService.ts
│   │   │   ├── subscriptionService.web.ts
│   │   │   └── usuarioService.ts
│   │   ├── store\
│   │   │   ├── authStore.ts
│   │   │   └── uiStore.ts
│   │   ├── theme\
│   │   │   ├── colors.ts
│   │   │   ├── index.ts
│   │   │   ├── spacing.ts
│   │   │   └── typography.ts
│   │   ├── types\
│   │   │   ├── api.types.ts
│   │   │   └── navigation.types.ts
│   │   └── utils\
│   │       ├── psychologistAgenda.ts
│   │       └── queryClient.ts
├── path\
│   └── to\
│       └── scripts\
│           └── teste-stomp\          # Diretório vazio (sem arquivos)
├── promptgpt\
│   ├── 1.md                          # Instruções anteriores (Google Meet)
│   ├── 2.md                          # Instruções anteriores (remover Agora)
│   └── 3.md                          # Instruções anteriores (migrar STOMP)
├── scripts\
│   └── teste-stomp\                  # Diretório vazio (sem arquivos)
└── SQL Cedro\
    ├── atualizacao_banco.sql
    ├── dados_demo_apresentacao.sql
    ├── dados_exemplo.sql
    ├── google_meet_columns.sql
    ├── mobile_tables.sql
    ├── password_reset_tokens.sql
    └── schema_simples.sql
```

### 2.2 Função de Cada Pasta/Arquivo Principal

**Backend (`backend/cedro-backend/`)**:
- **`src/main/java/com/cedro/controller/`** — Controllers REST (pontos de entrada HTTP)
- **`src/main/java/com/cedro/model/entity/`** — Entidades JPA (tabelas)
- **`src/main/java/com/cedro/model/dto/`** — DTOs de requisição/resposta
- **`src/main/java/com/cedro/repository/`** — Repositórios Spring Data JPA
- **`src/main/java/com/cedro/service/`** — Lógica de negócio
- **`src/main/java/com/cedro/security/`** — JWT, filtros de autenticação, handshake WebSocket
- **`src/main/java/com/cedro/config/`** — Configurações (Security, WebSocket, CORS, uploads, seed de dados)
- **`src/main/resources/application.properties`** — Configurações da aplicação (variáveis de ambiente)

**Frontend Web (`frontend/`)**:
- **`src/pages/`** — Todas as telas da SPA
- **`src/components/`** — Componentes reutilizáveis
- **`src/services/`** — Camada de chamadas API (axios centralizado)
- **`src/contexts/AuthContext.jsx`** — Contexto de autenticação (localStorage)
- **`src/hooks/useModal.jsx`** — Hook de modais
- **`src/styles/`** — CSS da aplicação

**Mobile (`mobile/`)**:
- **`src/screens/`** — Telas do app
- **`src/components/`** — Componentes RN
- **`src/services/`** — Camada de API + serviços
- **`src/store/`** — Zustand stores (authStore, uiStore)
- **`src/hooks/`** — Hooks customizados (React Query + Zustand)
- **`src/navigation/`** — Navegação React Navigation
- **`src/theme/`** — Tema (cores, espaçamentos, tipografia)
- **`src/types/`** — Tipos TypeScript (espelham DTOs Java)
- **`src/utils/`** — Utilitários

**Banco de dados (`SQL Cedro/`)**:
- **`schema_simples.sql`** — Schema completo (destrutivo) — contém tabelas: usuarios, sessoes, pagamentos, avaliacoes, mensagens, autoavaliacoes, ebooks, meditacoes, webinars, inscricoes_webinars, grupos_terapia, participantes_grupos, sessoes_grupo, presenca_grupo, contatos, emergencias, mensagens_emergencia, downloads, reproducoes
- **`atualizacao_banco.sql`** — Migração para adicionar coluna `crp`
- **`google_meet_columns.sql`** — Migração para adicionar `link_reuniao` e `google_event_id` em `sessoes`
- **`mobile_tables.sql`** — Cria `chamadas_historico`, `assinaturas`, `push_tokens` (idempotente)
- **`password_reset_tokens.sql`** — Cria tabela `password_reset_tokens` (idempotente)
- **`dados_demo_apresentacao.sql`** — Seed de dados demo para TCC (idempotente)
- **`dados_exemplo.sql`** — Seed de dados de exemplo (18 psicólogos, 3 pacientes, admin, sessões, etc.)

### 2.3 Mapeamento de Arquitetura

| Tipo | Localização |
|---|---|
| Controllers | `backend/cedro-backend/src/main/java/com/cedro/controller/` |
| Models (entidades) | `backend/cedro-backend/src/main/java/com/cedro/model/entity/` |
| Services | `backend/cedro-backend/src/main/java/com/cedro/service/` |
| Repositories | `backend/cedro-backend/src/main/java/com/cedro/repository/` |
| DTOs | `backend/cedro-backend/src/main/java/com/cedro/model/dto/` |
| Configurações | `backend/cedro-backend/src/main/java/com/cedro/config/` + `application.properties` |
| Middleware/Security | `backend/cedro-backend/src/main/java/com/cedro/security/` |
| Schemas SQL | `SQL Cedro/` |
| Scripts de build/exec | `backend/cedro-backend/run.bat`, `start.sh`, `start.ps1`, `Dockerfile` |
| Frontend | `frontend/src/` |
| Componentes | `frontend/src/components/` + `mobile/src/components/` |
| Assets | `mobile/assets/`, `frontend/public/` |
| Config de ambiente | `backend/cedro-backend/.env.example`, `frontend/src/config.js`, `mobile/src/config/environment.ts` |

---

## ETAPA 3 — FLUXO DE EXECUÇÃO

### 3.1 Como o Sistema Inicia

**Backend (Spring Boot)**:
1. Arquivo principal: `backend/cedro-backend/src/main/java/com/cedro/CedroBackendApplication.java`
2. Anotação `@SpringBootApplication(exclude = { UserDetailsServiceAutoConfiguration.class })` — desativa UserDetailsService padrão do Spring Security
3. Também é `@RestController` com endpoint `GET /` que retorna `"ok"`
4. **Bootstrap**:
   - `DemoPsychologistSeeder implements CommandLineRunner` — roda na inicialização, cria psicólogo demo (`psicologo.demo@cedro.app` / senha `Cedro@123`) e paciente demo (`paciente.demo@cedro.app` / senha `Cedro@123`) se não existirem
   - `StaticResourceConfig` com `@PostConstruct` — cria diretório de uploads
   - `GoogleMeetService` com `@PostConstruct` — inicializa cliente Google Calendar
   - `DatabaseSchemaFixer` — **DESATIVADO** (anotação `@Component` comentada)

5. **Conexão com banco**:
   - Configurada em `application.properties` via variáveis `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`
   - Driver: `com.microsoft.sqlserver.jdbc.SQLServerDriver`
   - Hibernate `ddl-auto=none` (schema gerenciado por scripts SQL)
   - Dialeto: `org.hibernate.dialect.SQLServerDialect`

6. **Configuração inicial de segurança**:
   - `SecurityConfig` define SecurityFilterChain
   - JWT secret vindo de `jwt.secret`
   - Expiração JWT: `jwt.expiration=86400000` (24 horas)

7. **Carregamento das rotas**: Spring Boot escaneia `@RestController` automaticamente no pacote `com.cedro`

### 3.2 Fluxo de Requisição HTTP

1. Requisição chega ao servidor
2. `JwtAuthenticationFilter` (OncePerRequestFilter) processa:
   - Lê header `Authorization: Bearer <token>`
   - Extrai email do token, valida expiração
   - Se válido, seta autenticação no SecurityContext
   - **Exceção**: `/api/assinatura/webhook` é ignorado pelo filtro (shouldNotFilter)
3. Spring Security verifica permissões (baseado em SecurityConfig)
4. Dispatcher encaminha ao Controller correto
5. Controller chama Service
6. Service chama Repository ou JdbcTemplate
7. Resposta volta como JSON (Jackson serializa)
8. `GlobalExceptionHandler` captura exceções e formata resposta de erro

### 3.3 Autenticação
- JWT Stateless (sem sessão no servidor, `SessionCreationPolicy.STATELESS`)
- Token armazenado no localStorage (web) ou SecureStore/AsyncStorage (mobile)

### 3.4 Encerramento
- Nenhum shutdown hook personalizado encontrado no código
- Spring Boot gerencia o ciclo de vida padrão

### 3.5 Sequência de inicialização do Mobile (React Native/Expo) — `mobile/App.tsx`
1. `loadPreferences()` (uiStore) — carrega preferências do AsyncStorage
2. `checkAuth()` (authStore) — restaura sessão do SecureStore/AsyncStorage
3. Se `!isReady`, mostra `SplashScreen`
4. Renderiza `RootNavigator` com `NavigationContainer`
5. `RootNavigator` decide: `AuthStack` (não autenticado) ou `MainTabs` (autenticado)

---

## ETAPA 4 — BACKEND (TODOS OS ENDPOINTS)

### 4.1 GET `/` — Health Check
- **Arquivo**: `CedroBackendApplication.java`
- **Controller**: `CedroBackendApplication` (classe principal)
- **Autenticação**: Permitida publicamente (`SecurityConfig` — `requestMatchers("/").permitAll()`)
- **Resposta 200**: `"ok"` (text/plain)

### 4.2 Auth Endpoints — `/api/auth/*` (públicos — permitAll)

**POST `/api/auth/login`** (`AuthController.java`)
- **Service**: `AuthService.login(LoginRequest)`
- **Body**: `{"email": string, "senha": string}` (validação: `@NotBlank` + `@Email` + `@NotBlank`)
- **Repository**: `UsuarioRepository.findByEmailIgnoreCaseAndAtivoTrue(email)`
- **Regras**:
  - Email normalizado (trim + lowercase)
  - Usuário deve estar `ativo=true`
  - Senha validada: se hash começa com `$2a$`, `$2b$` ou `$2y$` (bcrypt) → `passwordEncoder.matches()`. Se não for bcrypt (legado texto puro) → compara string direta e atualiza hash para bcrypt
  - Erro genérico: `"Email ou senha incorretos"` (nunca revela se email existe)
- **Resposta 200**: `{token: string, usuario: UsuarioResponse}`
- **Erro 400**: `{"error": "Email ou senha incorretos"}`

**POST `/api/auth/register`** (`AuthController.java`)
- **Service**: `AuthService.register(RegisterRequest)`
- **Body** (RegisterRequest):
  - `nome` (obrigatório, max 100)
  - `email` (obrigatório, email válido, max 100)
  - `senha` (obrigatório, min 6)
  - `dataNascimento` (opcional, LocalDate)
  - `genero` (opcional)
  - `telefone` (opcional)
  - `tipoUsuario` (opcional, WRITE_ONLY — padrão `paciente`, **nunca aceita `admin`**)
  - `especialidade`, `tipoPsicologo`, `crp`, `areaInteresse`, `precoSessao` (opcionais)
- **Validações no service**:
  - Email duplicado → `"Esse email ja ta em uso"`
  - Senha < 6 → `"Senha muito curta (min. 6 caracteres)"`
  - Sem número → `"Precisa ter pelo menos 1 numero"`
  - Sem caractere especial `[!@#$%^&*(),.?\":{}|<>]` → `"Precisa ter pelo menos 1 caractere especial"`
  - Se `tipoUsuario == admin` → força para `paciente`
  - Se `tipoUsuario == psicologo`:
    - CRP obrigatório → `"CRP obrigatorio para psicologo"`
    - CRP formato `\\d{2}/\\d{5,6}` → `"CRP invalido. Use o formato 06/123456"`
    - CRP duplicado → `"Este CRP ja esta cadastrado"`
    - Especialidade obrigatória → `"Especialidade obrigatoria para psicologo"`
    - Tipo de psicólogo obrigatório → `"Tipo de psicologo obrigatorio para psicologo"`
    - Preço da sessão obrigatório > 0 → `"Valor da consulta obrigatorio para psicologo"`
- **Resposta 201**: `{"message": "Conta criada!"}`
- **Erro 400**: `{"error": "<mensagem>"}`

**POST `/api/auth/google`** (`AuthController.java`)
- **Service**: `AuthService.googleLoginWithToken(String idToken)`
- **Body**: `{"credential": string}` (token ID do Google)
- Se `credential` vazio → 400 `{"error": "Token do Google nao fornecido"}`
- **Validação server-side do ID token** (manual, sem biblioteca Google):
  - Decodifica JWT (3 partes)
  - Decodifica payload base64url
  - Verifica issuer: `accounts.google.com` ou `https://accounts.google.com`
  - Verifica expiração (`exp`)
  - Email obrigatório
  - `email_verified` deve ser true
- **Comportamento**: se email existe → login; se não → cria usuário com senha aleatória `"google_oauth_" + timestamp`
- **Resposta 200**: `{token, usuario}` (LoginResponse)
- **Erro 400**: `{"error": "<mensagem>"}`

**GET `/api/auth/health`** — retorna `"ok"` (200)

**PUT `/api/auth/perfil`** (JWT obrigatório)
- **Header**: `Authorization: Bearer <token>`
- **Service**: `AuthService.updatePerfil(Integer userId, UpdatePerfilRequest)`
- **Body** (UpdatePerfilRequest): `nome`, `telefone`, `dataNascimento`, `genero`, `endereco`, `bio`, `especialidade`, `tipoPsicologo`, `crp`, `areaInteresse`, `precoSessao` (todos opcionais)
- **Resposta 200**: `{"message": "Perfil atualizado"}`
- **Erro**: `"Usuario nao encontrado"` (400)

**PUT `/api/auth/alterar-senha`** (JWT obrigatório)
- **Service**: `AuthService.alterarSenha(Integer userId, AlterarSenhaRequest)`
- **Body**: `{"senhaAtual": string, "novaSenha": string}` (`@NotBlank` + `@Size(min=6)`)
- **Regras**: senha atual validada (mesma lógica de login); nova senha validações (min 6, 1 número, 1 caractere especial)
- **Resposta 200**: `{"message": "Senha alterada"}`
- **Erros**: `"Senha atual ta errada"`, `"Senha muito curta (min. 6 caracteres)"`, `"Precisa ter pelo menos 1 numero"`, `"Precisa ter pelo menos 1 caractere especial"`

**DELETE `/api/auth/conta`** (JWT obrigatório)
- **Service**: `AuthService.excluirConta(Integer userId)` — `@Transactional`
- **Regras**: deleta sessoes (paciente e psicologo), mensagens (remetente/destinatário), depois usuário
- **Resposta 200**: `{"message": "Conta excluída"}`

**POST `/api/auth/recuperar-senha`**
- **Body**: `{"email": string}`
- Se email vazio → 400 `{"error": "Informe o email"}`
- Service busca usuário silenciosamente (nunca revela se existe)
- Se existe: gera token UUID (64 chars hex), salva `PasswordResetToken` com expiração 30 minutos, envia email
- **Resposta 200**: `{"message": "Se o e-mail existir, enviaremos instrucoes"}` (sempre retorna esta mensagem)

**POST `/api/auth/redefinir-senha`**
- **Body**: `{"token": string, "novaSenha": string}`
- Se token ou novaSenha vazio → 400 `{"error": "Token e nova senha sao obrigatorios"}`
- Service: busca token, verifica `usado=false` e `expiraEm > now`, atualiza senha, marca token como usado
- **Resposta 200**: `{"message": "Senha redefinida com sucesso"}`
- **Erro 400**: `{"error": "Token invalido ou expirado"}`

**PUT `/api/auth/foto-perfil`** (JWT obrigatório)
- **Body**: `{"fotoUrl": string}` OU `{"foto_url": string}`
- **Service**: `AuthService.updateFotoPerfil`
- **Resposta 200**: `{"message": "Foto atualizada"}`

**POST `/api/auth/foto-perfil-upload`** (JWT obrigatório, multipart/form-data)
- **Parâmetro**: `file` (MultipartFile)
- **Validações**:
  - Arquivo vazio → 400 `{"error": "Arquivo de imagem obrigatorio"}`
  - Tamanho > 2MB (2_000_000 bytes) → 400 `{"error": "Imagem muito grande (max. 2MB)"}`
  - Content-Type não em `{image/jpeg, image/png, image/webp}` → 400 `{"error": "Formato invalido. Use JPG, PNG ou WebP"}`
- Salva em `{uploadDir}/perfil/usuario-{userId}-{UUID}.{ext}`
- **Resposta 200**: `{"message": "Foto atualizada", "fotoUrl": "<url>"}`
- **Erro 500**: `{"error": "Nao foi possivel salvar a foto no servidor"}`

### 4.3 Usuários — `/api/usuarios*` (JWT obrigatório)

**GET `/api/usuarios`** (Admin apenas)
- **Controller**: `UsuarioController.listarTodos`
- Permissão: `isAdmin(authHeader)` → verifica `jwtUtil.extractTipoUsuario(token).equals("admin")`
- Não admin → **403** `{"error": "Acesso negado"}`
- Retorna TODOS os usuários (entidade completa, incluindo senhaHash — **NOTA DE SEGURANÇA**: expõe dados sensíveis)

**GET `/api/usuarios/{id}`** (Admin ou o próprio usuário)
- **Controller**: `UsuarioController.buscarPorId`
- Regra: se não admin e id não corresponde → 403
- Não encontrado → 404
- Retorna entidade completa

**PUT `/api/usuarios/{id}`** (Admin ou o próprio usuário)
- **Controller**: `UsuarioController.atualizar`
- **Body** (Map<String, Object>): `nome`, `telefone`, `especialidade`, `tipoPsicologo`, `crp`, `areaInteresse`, `bio`, `genero`, `precoSessao`, `dataNascimento`
- **NÃO permite alterar email** (comentário de segurança)
- Não encontrado → 404

**PUT `/api/usuarios/{id}/ativar`** (Admin apenas)
- **Body**: `{"ativo": boolean}`
- Altera flag `ativo` do usuário
- **Resposta 200**: `{"message": "ok"}`

**DELETE `/api/usuarios/{id}`** (Admin apenas) — `@Transactional`
- Deleta sessoes (paciente/psicologo), mensagens (remetente/destinatário), usuário
- **Resposta 200**: `{"message": "Deletado"}`

### 4.4 Psicólogos — `/api/psicologos*`

**GET `/api/psicologos`** (público)
- **Controller**: `PsicologoController.listarPsicologos`
- Auth header **opcional**
- Se autenticado como paciente: lê `areaInteresse` do paciente e filtra psicólogos por correspondência com `tipoPsicologo`
- Filtro de correspondência: normaliza tags (remove acentos, lowercase, split por `[,;/|]`) e verifica interseção
- Retorna apenas DTO público: `{id, nome, especialidade, tipoPsicologo, bio, precoSessao, avaliacao, fotoUrl}` — **não expõe email, telefone, senha, dataCriacao, ativo**
- Status: 200

**GET `/api/psicologos/{id}`** (público)
- Se não encontrado → RuntimeException `"Não encontrado"` → 400 pelo GlobalExceptionHandler
- Se não é psicólogo → 400 `{"error": "Não é psicólogo"}`
- **Retorna a entidade completa** (inclui campos sensíveis — divergência de segurança)

**GET `/api/psicologos/verificar-crp?crp=XX/XXXXXX`** (público)
- Formato inválido → 400 `{"valido": false, "mensagem": "Formato de CRP inválido. Use: XX/XXXXXX"}`
- Já cadastrado → 409 `{"valido": false, "mensagem": "Este CRP já está cadastrado na plataforma."}`
- Disponível → 200 `{"valido": true, "mensagem": "CRP disponível para cadastro"}`

**POST `/api/psicologos`** (Admin apenas)
- **Body**: Usuario (entidade completa)
- Força `tipoUsuario=psicologo`, `ativo=true`
- Email duplicado → 400 `{"error": "Email já existe"}`
- **Resposta 201**: entidade salva

**PUT `/api/psicologos/{id}`** (Admin ou o próprio psicólogo)
- **Body**: Usuario (entidade)
- Não admin e id diferente → 403
- Não é psicólogo → 400
- Atualiza campos não-nulos: nome, email, telefone, especialidade, tipoPsicologo, precoSessao, bio, fotoUrl
- **Resposta 200**: entidade atualizada

**DELETE `/api/psicologos/{id}`** (Admin apenas)
- Não é psicólogo → 400
- **Desativa** (soft delete — `ativo=false`), não deleta físico
- **Resposta 200**: `{"message": "Desativado"}`

**GET `/api/psicologos/financeiro?periodo=mes|trimestre|ano`** (JWT obrigatório)
- `periodo` default: `mes` (início do mês corrente)
- `trimestre`: últimos 3 meses
- `ano`: início do ano
- Busca sessões do psicólogo no período
- Calcula: `faturamentoMes` (soma valores de sessões `realizada`), `consultasRealizadas` (count status `realizada`), `ticketMedio` (faturamento/consultas, 2 casas, HALF_UP), `transacoes` (últimas 20 não-canceladas, com nome do paciente)
- Status transação: `"realizada"` → `"Pago"`, senão `"Pendente"`

**GET `/api/psicologos/estatisticas`** (JWT obrigatório)
- Retorna: `consultasHoje`, `consultasSemana` (desde segunda-feira), `pacientesAtivos` (count DISTINCT pacientes com sessão não cancelada), `faturamentoMes` (soma de sessões `realizada`)
- Usa `SessaoRepository.sumValorByPsicologoIdAndPeriodo`

**GET `/api/psicologos/consultas/proximas`** (JWT obrigatório)
- Lista sessões futuras do psicólogo ordenadas por data asc, limit 10
- Item: `{id, pacienteId, data, horario (HH:mm), status, tipo ("Terapia Individual"), pacienteNome}`

### 4.5 Sessões — `/api/sessoes*`

**GET `/api/sessoes`** (Admin apenas)
- Retorna todas as sessões
- Não admin → 403

**GET `/api/sessoes/{id}`** (Paciente/Psicólogo dono ou Admin)
- Se não admin, paciente ou psicólogo relacionado → 403
- Não encontrada → RuntimeException `"Não encontrada"` → 400

**GET `/api/sessoes/minhas`** (JWT obrigatório)
- Retorna sessões onde `pacienteId = userId` do token

**GET `/api/sessoes/paciente/{pacienteId}`** (Admin ou o próprio paciente)
- Não admin e id diferente → 403 (retorno vazio sem body)
- Retorna lista

**GET `/api/sessoes/psicologo/{psicologoId}`** (Admin ou o próprio psicólogo)
- Não admin e id diferente → 403
- Retorna lista com nomes incluídos: `{id, pacienteId, psicologoId, dataSessao, duracao, valor, statusSessao, observacoes, dataCriacao, linkReuniao, googleEventId, pacienteNome, psicologoNome}`

**GET `/api/sessoes/disponibilidade/{psicologoId}?data=YYYY-MM-DD`** (público)
- Service: `SessaoService.consultarDisponibilidade`
- Horários base: `08:00, 09:00, 10:00, 11:00, 14:00, 15:00, 16:00, 17:00, 18:00`
- Ocupados: sessões não-canceladas do psicólogo nesse dia
- **Resposta 200**: `{data, horariosDisponiveis, horariosOcupados}`

**POST `/api/sessoes`** (JWT obrigatório)
- **Controller**: `SessaoController.criar` — força `request.setPacienteId(userId)` (ignora pacienteId do body)
- **Service**: `SessaoService.criar`
- **Body**: `{psicologoId (obrigatório), dataSessao (obrigatório), duracao, observacoes, statusSessao, valor (ignorado — backend usa preço do psicólogo)}`
- **Regras de negócio**:
  1. Psicólogo deve existir → `"Psicólogo não encontrado"`
  2. `validarLimiteSessoesGratuitas`: se `!assinaturaService.isPremium(pacienteId)`:
     - Conta sessões do mês corrente (baseado em `dataCriacao` entre início do mês e início do próximo, com status != `cancelada`) usando `ZONA_SAO_PAULO`
     - Se >= 4 → **403 FORBIDDEN** com `"Voce atingiu o limite de 4 sessoes agendadas neste mes no plano gratuito."`
  3. Horário ocupado: `existsByPsicologoIdAndDataSessaoAndStatusSessaoNot(psicologoId, dataSessao, "cancelada")` → `"Horario indisponivel"`
- **Resposta 201**: Sessao criada (entidade completa)
- Preço definido a partir do `precoSessao` do psicólogo

**PUT `/api/sessoes/{id}`** (Admin apenas)
- Se não admin → 403
- Atualiza: `dataSessao`, `duracao`, `valor`, `statusSessao`, `observacoes`
- Se status = `"cancelada"` E `googleEventId != null` → cancela reunião no Google Calendar
- **Resposta 200**: Sessao atualizada

**POST `/api/sessoes/{id}/confirmar-pagamento`** (JWT obrigatório)
- Deve ser o próprio paciente da sessão (`sessao.getPacienteId().equals(pacienteId)`)
- Se não for → 403 `{"error": "Acesso negado. Paciente não corresponde à sessão."}`
- Define status como `"agendada"`
- Chama `GoogleMeetService.criarReuniao(sessao, nomePaciente, nomePsicologo)` para criar evento no Google Calendar
- Se resultado tiver link ou eventId → salva na sessão
- **Resposta 200**: `{"message": "Sessão confirmada com sucesso", "sessao": <Sessao>}`

**GET `/api/sessoes/{id}/link-reuniao`** (JWT obrigatório)
- Deve ser admin, paciente ou psicólogo da sessão → senão 403
- Calcula `janelaLiberacao = dataSessao - meetReleaseMinutesBefore` (default 15 min)
- Usa `ZONA_SAO_PAULO` para `now`
- Se `now < janelaLiberacao` → 200 `{"liberado": false, "disponivelEm": "<ISO datetime>"}`
- Se liberado e link existe → 200 `{"liberado": true, "link": "<link>"}`
- Se liberado e link null → 200 `{"liberado": true, "link": null, "erro": "Link ainda não gerado, contate o suporte"}`

**POST `/api/sessoes/{id}/gerar-reuniao`** (Admin apenas)
- Se não admin → 403
- Busca sessão, paciente, psicólogo
- Chama `GoogleMeetService.criarReuniao` manualmente
- Salva link/eventId na sessão
- **Resposta 200**: `{"message": "Tentativa de geração executada", "link": "<link>", "eventId": "<eventId>"}`

**DELETE `/api/sessoes/{id}`** (Paciente dono ou Admin)
- Se não admin e não é o paciente da sessão → 403
- **NOTA**: TODO no código indica que psicólogo ainda não pode deletar
- Se `googleEventId != null` → cancela reunião no Google Calendar
- Deleta sessão
- **Resposta 200**: `{"message": "Deletada"}`

### 4.6 Mensagens — `/api/mensagens*` (JWT obrigatório)

**POST `/api/mensagens`**
- **Controller**: `MensagemController.enviarMensagem`
- **Service**: `MensagemService.enviarMensagem(remetenteId, MensagemRequest)`
- **Body**: `{"destinatarioId": int (obrigatório), "mensagem": string (obrigatório, max 2000)}`
- **Resposta 200**: Mensagem criada (entidade completa)

**GET `/api/mensagens/conversa/{userId}`**
- Retorna conversa entre usuário autenticado e `userId` (ambas direções), ordenada por `dataCriacao ASC`
- **Resposta 200**: List<Mensagem>

**GET `/api/mensagens/nao-lidas`**
- Retorna mensagens não lidas do usuário autenticado, ordenadas por `dataCriacao DESC`
- **Resposta 200**: List<Mensagem>

**GET `/api/mensagens/nao-lidas/count`**
- **Resposta 200**: `{"count": long}`

**PUT `/api/mensagens/{id}/lida`**
- Deve ser o destinatário da mensagem → senão 403
- Marca como lida
- **Resposta 200**: `{"message": "ok"}`

**PUT `/api/mensagens/marcar-lidas/{remetenteId}`**
- Marca todas as mensagens da conversa entre usuário autenticado e `remetenteId` como lidas (apenas as que têm `destinatarioId == usuarioId`)
- **Resposta 200**: `{"message": "ok"}`

**GET `/api/mensagens/conversas`**
- **Service**: `MensagemService.listarConversas(usuarioId)` — usa SQL nativo via JdbcTemplate
- Agrupa mensagens por outro usuário, retorna última mensagem, contagem de não lidas, se foi enviada
- **Resposta 200**: List<ConversaResumo> `{userId, nome, fotoUrl, ultimaMensagem, dataUltimaMensagem, naoLidas, mensagemEnviada}`

### 4.7 Notificações — `/api/notificacoes*` (JWT obrigatório)

**POST `/api/notificacoes/token`**
- **Body**: `{"token": string}`
- **Service**: `NotificacaoService.registrarToken` — insere em `push_tokens` se não existir (verifica duplicidade)
- **Resposta 200**: `{"message": "Token registrado"}`

**POST `/api/notificacoes/token/remover`**
- **Body**: `{"token": string}`
- **Service**: `NotificacaoService.removerToken` — deleta de `push_tokens`
- **Resposta 200**: `{"message": "Token removido"}`

### 4.8 Assinatura — `/api/assinatura*`

**POST `/api/assinatura/webhook`** (público — ignorado pelo JwtAuthenticationFilter)
- **Controller**: `AssinaturaController.webhookRevenueCat`
- **Autorização**: header `Authorization` deve ser igual a `REVENUECAT_WEBHOOK_SECRET` ou `"Bearer " + secret`
- Se não autorizado → 401 `{"error": "Webhook nao autorizado"}`
- **Body**: `{"event": {"type": string, "app_user_id": string, "expiration_at_ms": long, "product_id": string, "transaction_id": string}}`
- Se `type` ou `app_user_id` null → 400 `{"error": "Payload RevenueCat invalido"}`
- **Tipos de evento**:
  - `INITIAL_PURCHASE`, `RENEWAL`, `UNCANCELLATION` → `ativarAssinatura`
  - `CANCELLATION`: se `expirationAtMs > now` → ativa (mantém até expirar); senão → `cancelarAssinatura`
  - `EXPIRATION` → `expirarAssinatura`
- **Resposta 200**: `{"message": "Webhook processado"}`

**GET `/api/assinatura/status`** (JWT obrigatório)
- Verifica se usuário é premium (`AssinaturaService.isPremium` — consulta tabela `assinaturas` com status `ativa` e `data_fim > GETDATE()`)
- Conta sessões agendadas não-canceladas no mês corrente (baseado em `dataCriacao`)
- `limiteMensal = isPremium ? Integer.MAX_VALUE : 4`
- **Resposta 200**: `{"isPremium": boolean, "chamadasRealizadas": long, "limiteMensal": int}`

### 4.9 WebSocket STOMP — `/ws-chat`

**Endpoint de conexão**: `ws://<host>/ws-chat?token=<JWT>`
- **Config**: `WebSocketConfig.java`
- **Handshake**: `StompHandshakeInterceptor` valida token na query string; se inválido/expirado → recusa conexão
- **Principal**: `StompPrincipalHandshakeHandler` define `Principal.getName()` = userId (string)
- **Broker**: simple broker em `/topic` e `/queue`; prefixo de app `/app`; prefixo de usuário `/user`

**Mensagens STOMP**:
- **Enviar**: `client.publish({destination: "/app/chat.send", body: JSON.stringify({destinatarioId, mensagem})})`
- **Receber**: `client.subscribe("/user/queue/mensagens", callback)` — payload `{type: "chat:message", mensagem: <Mensagem>}`
- **Presença**: `@MessageMapping("/presence.ready")` — apenas loga (sem resposta)

---

## ETAPA 5 — FRONTEND (TODAS AS TELAS)

### 5.1 Rotas Web (definidas em `frontend/src/App.jsx`)

| Rota | Componente | Proteção | Descrição |
|---|---|---|---|
| `/` | Home | Pública | Landing page |
| `/chat-emergencia` | ChatEmergencia | Pública | Chat de emergência (CVV) |
| `/contato` | Contato | Pública | Formulário de contato |
| `/atendimento-online` | AtendimentoOnline | Pública | Informações/agendamento online (mock) |
| `/perfil` | Perfil | Autenticado | Perfil do usuário |
| `/login` | Login | Pública | Login/cadastro paciente |
| `/psicologos` | ListaPsicologos | Pública | Lista de psicólogos |
| `/cadastro-psicologo` | CadastroPsicologo | Pública | Cadastro de psicólogo |
| `/login-psicologo` | LoginPsicologo | Pública | Login psicólogo |
| `/psicologo/dashboard` | DashboardPsicologo | Psicólogo | Dashboard |
| `/psicologo/agenda` | AgendaPsicologo | Psicólogo | Agenda FullCalendar |
| `/psicologo/pacientes` | PacientesPsicologo | Psicólogo | Pacientes |
| `/psicologo/consultas` | ConsultasPsicologo | Psicólogo | Consultas |
| `/psicologo/financeiro` | FinanceiroPsicologo | Psicólogo | Financeiro |
| `/psicologo/perfil` | PerfilPsicologo | Psicólogo | Perfil profissional |
| `/psicologo/configuracoes` | ConfiguracoesPsicologo | Psicólogo | Configurações |
| `/psicologo/estatisticas` | EstatisticasPsicologo | Psicólogo | Estatísticas |
| `/psicologo/chats` | ChatsPsicologo | Psicólogo | Chats |
| `/termos-uso` | TermosUso | Pública | Termos |
| `/politica-privacidade` | PoliticaPrivacidade | Pública | Privacidade |
| `/autoavaliacoes` | Autoavaliacoes | Pública | Autoavaliações |
| `/admin/login` | LoginAdmin | Pública | Login admin |
| `/admin/dashboard` | DashboardAdmin | Admin | Dashboard admin |
| `/admin/usuarios` | AdminUsuarios | Admin | Gestão de usuários |
| `/admin/sessoes` | AdminSessoes | Admin | Gestão de sessões |
| `/minhas-sessoes` | MinhasSessoes | Autenticado | Sessões do paciente |
| `/agendar-sessao/:psicologoId` | AgendarSessao | Autenticado | Agendar sessão |
| `/chat/:userId` | Chat | Autenticado | Chat com usuário |
| `/minhas-conversas` | MinhasConversas | Autenticado | Lista de conversas |
| `/premium` | Premium | Pública | Página Premium |
| `/pagamento/sessao/:sessaoId` | PagamentoSessao | Autenticado | Pagamento de sessão |
| `/relaxar` | JogosRelaxamento | Pública | Jogos de relaxamento |
| `/saude-mental` | SaudeMental | Pública | Guia de saúde mental |
| `/redefinir-senha` | RedefinirSenha | Pública | Redefinir senha (query param `token`) |
| `*` | NotFound | Pública | 404 |

### 5.2 Detalhes das Telas Principais

**Login.jsx** (`frontend/src/pages/Login.jsx`)
- **Objetivo**: Login e cadastro de paciente
- **Estados**: `formData` (email, senha, nome, dataNascimento, genero, telefone), `isLogin`, `loading`, `errorMsg`, `successMsg`, `senhaValidacao`, `showRecuperarSenha`, `emailRecuperacao`
- **Validações frontend**:
  - Senha: min 6, 1 número, 1 caractere especial (regex `/[!@#$%^&*(),.?":{}|<>]/`)
  - Campos obrigatórios no cadastro: nome, dataNascimento, genero, telefone, email, senha
- **Chamadas API**:
  - `POST /api/auth/login` (login)
  - `POST /api/auth/register` (cadastro — envia `tipoUsuario: 'paciente'`)
  - `POST /api/auth/google` (login Google — envia `credential`)
  - `POST /api/auth/recuperar-senha` (recuperação)
- **Google**: carrega script `https://accounts.google.com/gsi/client`, usa `VITE_GOOGLE_CLIENT_ID`
- **Navegação**: após login → `/`; após cadastro → mostra mensagem e alterna para login
- **Mensagens**: `"Conta criada com sucesso! Faça login para continuar."`, `"Se o e-mail estiver cadastrado, você receberá as instruções em breve."`

**LoginPsicologo.jsx**
- **Objetivo**: Login de psicólogo
- **Chamada**: `POST /api/auth/login`
- **Regra**: se `tipoUsuario !== 'psicologo'` → erro `"Esta conta não é de psicólogo. Use o login de paciente."`
- **Navegação**: sucesso → `/psicologo/dashboard`

**LoginAdmin.jsx**
- **Objetivo**: Login de admin
- **Chamada**: `POST /api/auth/login` (via fetch direto, não axios)
- **Regra**: se `tipoUsuario !== 'admin'` → erro `"Acesso negado. Apenas administradores."`
- **Navegação**: sucesso → `/admin/dashboard`

**CadastroPsicologo.jsx**
- **Objetivo**: Cadastro de psicólogo
- **Estados**: `formData` (nome, email, crp, senha, confirmarSenha, telefone, dataNascimento, genero, especialidade, preco_sessao), `crpStatus` (idle/checking/valid/invalid/format_error), `crpMessage`, `senhaValidacao`
- **Validações**:
  - Senha: min 6, 1 número, 1 especial
  - Senhas devem coincidir
  - CRP formato `^\d{2}\/\d{5,6}$`
  - CRP verificado via `GET /api/psicologos/verificar-crp?crp=...`
- **Chamada**: `POST /api/auth/register` com `tipoUsuario: 'psicologo'`, `tipoPsicologo: especialidade`
- **Navegação**: sucesso → `/login-psicologo`

**ListaPsicologos.jsx**
- **Objetivo**: Listar psicólogos
- **Chamada**: `GET /api/psicologos` via `psicologoService.listar()`
- **Estados**: `psicologos`, `loading`, `loadingMsg` (muda após 5s para "O servidor está iniciando..."), `error`
- **Ações**: botão "Agendar Sessão" (verifica login via localStorage, navega para `/agendar-sessao/{id}`), botão "Conversar" (navega para `/chat/{id}`)

**AgendarSessao.jsx**
- **Objetivo**: Formulário de agendamento
- **Estados**: `formData` (data, hora, duracao, observacoes), `loading`
- **Validações**: data mínima = hoje, hora obrigatória, duração (30/60/90)
- **Chamada**: `POST /api/sessoes` com `{psicologoId, dataSessao: "YYYY-MM-DDTHH:mm:00", duracao, observacoes}`
- **Navegação**: sucesso → `/pagamento/sessao/{sessaoId}`

**PagamentoSessao.jsx**
- **Objetivo**: Página de pagamento da sessão
- **Chamadas**: `GET /api/sessoes/{id}` + `GET /api/psicologos` (paralelo)
- **Ação**: botão "Pagar já" abre `PagamentoModal`
- **Sucesso**: `POST /api/sessoes/{id}/confirmar-pagamento` → alert → `/minhas-sessoes`

**PagamentoModal.jsx**
- **Objetivo**: Modal de pagamento (cartão/PIX)
- **Estados**: `metodoPagamento` (cartao/pix), `etapa` (escolha/formulario/processando/sucesso), `dadosCartao`, `pixCode`, `loading`
- **Validações cartão**: número >= 13 dígitos, nome > 2 chars, validade = 5 chars (MM/AA), CVV >= 3
- **Chamadas**: `POST /api/pagamentos/confirmar` (PIX) ou `POST /api/pagamentos/processar` (cartão) — **NOTA: estes endpoints NÃO existem no backend Java analisado** (erros são ignorados com try/catch vazio)
- **PIX**: gera código fake localmente (não é um PIX real)
- **Sucesso**: se plano é "Sessão de Terapia" → chama `onPaymentSuccess`; senão → `updateUser({plano: 'premium'})`

**MinhasSessoes.jsx**
- **Objetivo**: Listar sessões do paciente
- **Chamadas**: `GET /api/sessoes/minhas`, `DELETE /api/sessoes/{id}` (cancelar)
- **Ações**: botão "Entrar na sessão" abre `ReuniaoModal`; botão "Cancelar Sessão" com `window.confirm`
- **Badges**: agendada=primary, realizada=success, cancelada=danger

**ReuniaoModal.jsx**
- **Objetivo**: Modal de reunião Google Meet
- **Chamada**: `GET /api/sessoes/{id}/link-reuniao` com polling a cada 15s
- **Estados**: `loading`, `liberado`, `link`, `erro`, `disponivelEm`, `now`
- **Comportamento**: mostra contagem regressiva até `disponivelEm`; quando liberado, mostra botão "Entrar na reunião" (abre em nova aba)

**Chat.jsx**
- **Objetivo**: Chat em tempo real
- **Chamadas**: `GET /api/mensagens/conversa/{userId}`, `PUT /api/mensagens/marcar-lidas/{userId}`, `GET /api/usuarios/{userId}`, `POST /api/mensagens` (fallback)
- **WebSocket**: STOMP via `@stomp/stompjs`, conecta em `ws://<host>/ws-chat?token=<jwt>`, subscribe `/user/queue/mensagens`, publish `/app/chat.send`
- **Estados**: `mensagens`, `novaMensagem`, `loading`, `sending`, `destinatario`, `realtimeStatus` (connecting/online/offline)
- **Comportamento**: envia via STOMP se conectado; fallback para REST se não

**Perfil.jsx**
- **Objetivo**: Perfil do usuário
- **Chamadas**: `PUT /api/auth/perfil`, `PUT /api/auth/alterar-senha`, `DELETE /api/auth/conta`, `PUT /api/auth/foto-perfil`
- **Validações**: senha (min 6, 1 número, 1 especial), senhas coincidem, foto <= 5MB (frontend)
- **Ações**: editar perfil, alterar senha, excluir conta (com confirmação), upload de foto (base64)

**DashboardPsicologo.jsx**
- **Objetivo**: Dashboard do psicólogo
- **Chamadas**: `GET /api/psicologos/estatisticas`, `GET /api/psicologos/consultas/proximas` (Promise.all)
- **Estados**: `stats` (consultasHoje, consultasSemana, pacientesAtivos, faturamentoMes), `proximasConsultas`, `loading`, `erro`
- **NOTA**: seção "Atividades Recentes" contém dados mockados fixos (Maria Silva, Carlos Oliveira) — não vem da API

**AdminUsuarios.jsx**
- **Objetivo**: Gestão de usuários (admin)
- **Chamadas**: `GET /api/usuarios`, `GET /api/psicologos`, `GET /api/usuarios` (filtrado), `PUT /api/usuarios/{id}/ativar`, `DELETE /api/usuarios/{id}`, `POST /api/auth/register` (via services), `PUT /api/psicologos/{id}`, `DELETE /api/psicologos/{id}`
- **Tabs**: Usuários, Psicólogos, Pacientes

**AdminSessoes.jsx**
- **Objetivo**: Gestão de sessões (admin)
- **Chamadas**: `GET /api/sessoes`, `POST /api/sessoes`, `PUT /api/sessoes/{id}`, `DELETE /api/sessoes/{id}`
- **Form**: pacienteId, psicologoId, dataSessao, duracao, valor, statusSessao, observacoes

**RedefinirSenha.jsx**
- **Objetivo**: Redefinir senha via token
- **Query param**: `token`
- **Chamada**: `POST /api/auth/redefinir-senha`
- **Validações**: token presente, senhas coincidem, senha >= 6
- **Navegação**: sucesso → `/login` com `state.successMsg`

### 5.3 Fluxo entre Telas (Web)
1. Home → `/psicologos` → `/agendar-sessao/{id}` → `/pagamento/sessao/{id}` → `/minhas-sessoes`
2. Home → `/login` → `/perfil` → `/minhas-sessoes` / `/minhas-conversas`
3. `/psicologos` → `/chat/{userId}` (chat direto)
4. `/login-psicologo` → `/psicologo/dashboard` → `/psicologo/agenda` / `/psicologo/financeiro` / etc.
5. `/admin/login` → `/admin/dashboard` → `/admin/usuarios` / `/admin/sessoes`

---

## ETAPA 6 — REGRAS DE NEGÓCIO

### 6.1 Regras de Autenticação
1. **Login**: email normalizado (trim+lowercase), usuário deve estar ativo, senha validada (bcrypt ou texto puro legado)
2. **Registro**: email único (case-insensitive), senha com requisitos (min 6, 1 número, 1 especial), admin não pode ser criado via API pública
3. **Registro psicólogo**: CRP obrigatório (formato `XX/XXXXXX`), CRP único, especialidade obrigatória, tipo de psicólogo obrigatório, preço > 0
4. **Google Login**: valida token server-side (issuer, expiração, email verificado)

### 6.2 Regras de Sessão
1. **Limite gratuito**: 4 sessões/mês para não-premium (baseado em `dataCriacao`, status != cancelada, fuso São Paulo)
2. **Horário ocupado**: não pode agendar se já existe sessão não-cancelada no mesmo horário do mesmo psicólogo
3. **Preço**: sempre do psicólogo (ignora valor enviado pelo cliente)
4. **PacienteId**: sempre do token (ignora valor do body)
5. **Confirmação de pagamento**: apenas o paciente da sessão pode confirmar
6. **Link de reunião**: liberado apenas 15 minutos antes (configurável via `GOOGLE_MEET_RELEASE_MINUTES_BEFORE`)
7. **Cancelamento**: se sessão tem `googleEventId`, cancela evento no Google Calendar

### 6.3 Regras de Usuário
1. **Admin**: pode ver/editar/deletar todos os usuários
2. **Usuário comum**: só pode ver/editar a si mesmo
3. **Email não editável** via `PUT /api/usuarios/{id}`
4. **Exclusão de conta**: deleta sessões e mensagens relacionadas (transacional)

### 6.4 Regras de Psicólogo
1. **Lista pública**: retorna apenas dados públicos (sem email, telefone, senha)
2. **Filtro por interesse**: se paciente autenticado tem `areaInteresse`, filtra psicólogos por correspondência com `tipoPsicologo`
3. **Desativação**: soft delete (ativo=false)
4. **Financeiro**: faturamento = soma de sessões `realizada`; ticket médio = faturamento/consultas

### 6.5 Regras de Assinatura
1. **Premium**: usuário com assinatura `ativa` e `data_fim > GETDATE()`
2. **Limite**: premium = ilimitado; free = 4 sessões/mês
3. **Webhook RevenueCat**: autorizado por header `Authorization` igual ao secret

### 6.6 Regras de Mensagens
1. **Mensagem**: max 2000 caracteres
2. **Marcar como lida**: apenas o destinatário pode marcar
3. **Conversa**: retorna mensagens em ambas direções

---

## ETAPA 7 — BANCO DE DADOS

### 7.1 Tabelas (definidas em `SQL Cedro/schema_simples.sql` + migrações)

**usuarios**
| Coluna | Tipo | Constraints |
|---|---|---|
| id | INT | PK, IDENTITY |
| nome | VARCHAR(100) | NOT NULL |
| email | VARCHAR(100) | UNIQUE, NOT NULL |
| senha_hash | VARCHAR(255) | NOT NULL |
| telefone | VARCHAR(20) | NULL |
| data_nascimento | DATE | NULL |
| genero | VARCHAR(20) | NULL |
| endereco | VARCHAR(200) | NULL |
| bio | TEXT | NULL |
| tipo_usuario | VARCHAR(20) | NOT NULL, DEFAULT 'paciente' |
| especialidade | VARCHAR(100) | NULL |
| crp | VARCHAR(20) | NULL (adicionado por atualizacao_banco.sql) |
| preco_sessao | DECIMAL(10,2) | NULL |
| avaliacao | DECIMAL(3,2) | DEFAULT 5.0 |
| foto_url | VARCHAR(255) | NULL (alterado para VARCHAR(MAX) pelo DatabaseSchemaFixer desativado) |
| ativo | BIT | DEFAULT 1 |
| data_criacao | DATETIME | DEFAULT GETDATE() |
| tipo_psicologo | VARCHAR(200) | NULL (adicionado em migração não documentada — presente na entidade) |
| area_interesse | VARCHAR(200) | NULL (adicionado em migração não documentada — presente na entidade) |

**sessoes**
| Coluna | Tipo | Constraints |
|---|---|---|
| id | INT | PK, IDENTITY |
| paciente_id | INT | NOT NULL |
| psicologo_id | INT | NOT NULL |
| data_sessao | DATETIME | NOT NULL |
| duracao | INT | DEFAULT 60 |
| valor | DECIMAL(10,2) | NOT NULL |
| status_sessao | VARCHAR(20) | DEFAULT 'agendada' |
| observacoes | TEXT | NULL |
| data_criacao | DATETIME | DEFAULT GETDATE() |
| link_reuniao | VARCHAR(255) | NULL (google_meet_columns.sql) |
| google_event_id | VARCHAR(255) | NULL (google_meet_columns.sql) |

**mensagens**
| Coluna | Tipo | Constraints |
|---|---|---|
| id | INT | PK, IDENTITY |
| remetente_id | INT | NOT NULL |
| destinatario_id | INT | NOT NULL |
| mensagem | TEXT | NOT NULL |
| lida | BIT | DEFAULT 0 |
| data_criacao | DATETIME | DEFAULT GETDATE() |

**password_reset_tokens** (password_reset_tokens.sql)
| Coluna | Tipo | Constraints |
|---|---|---|
| id | INT | PK, IDENTITY |
| usuario_id | INT | NOT NULL, FK → usuarios(id) ON DELETE CASCADE |
| token | VARCHAR(255) | UNIQUE, NOT NULL |
| expira_em | DATETIME | NOT NULL |
| usado | BIT | NOT NULL, DEFAULT 0 |
| data_criacao | DATETIME | NOT NULL, DEFAULT GETDATE() |

**assinaturas** (mobile_tables.sql)
| Coluna | Tipo | Constraints |
|---|---|---|
| id | INT | PK, IDENTITY |
| usuario_id | INT | NOT NULL, FK → usuarios(id) ON DELETE CASCADE |
| status | VARCHAR(20) | NOT NULL, CHECK IN ('ativa','cancelada','expirada') |
| plano | VARCHAR(50) | NOT NULL, CHECK IN ('premium_mensal') |
| revenuecat_app_user_id | VARCHAR(100) | NULL |
| revenuecat_product_id | VARCHAR(100) | NULL |
| revenuecat_transaction_id | VARCHAR(150) | NULL |
| data_inicio | DATETIME | NOT NULL, DEFAULT GETDATE() |
| data_fim | DATETIME | NULL |
| data_criacao | DATETIME | NOT NULL, DEFAULT GETDATE() |
| data_atualizacao | DATETIME | NULL |
| Índice único | | UX_assinaturas_usuario_ativa (usuario_id) WHERE status='ativa' |

**push_tokens** (mobile_tables.sql)
| Coluna | Tipo | Constraints |
|---|---|---|
| id | INT | PK, IDENTITY |
| usuario_id | INT | NOT NULL, FK → usuarios(id) ON DELETE CASCADE |
| token | VARCHAR(500) | NOT NULL |
| plataforma | VARCHAR(20) | NULL |
| device_id | VARCHAR(120) | NULL |
| data_registro | DATETIME | NOT NULL, DEFAULT GETDATE() |
| data_atualizacao | DATETIME | NULL |
| Índice único | | UX_push_tokens_usuario_token (usuario_id, token) |

**chamadas_historico** (mobile_tables.sql — legada)
| Coluna | Tipo | Constraints |
|---|---|---|
| id | INT | PK, IDENTITY |
| usuario_id | INT | NOT NULL, FK → usuarios(id) ON DELETE CASCADE |
| outro_usuario_id | INT | NULL |
| channel_name | VARCHAR(160) | NULL |
| tipo | VARCHAR(20) | NOT NULL, CHECK IN ('voz','video') |
| duracao_segundos | INT | NULL, CHECK >= 0 |
| data_chamada | DATETIME | NOT NULL, DEFAULT GETDATE() |

**Tabelas adicionais no schema_simples.sql** (não usadas pelo backend Java atual — legadas):
- `pagamentos` (sessao_id, valor, status_pagamento, metodo_pagamento, data_pagamento)
- `avaliacoes` (sessao_id, paciente_id, psicologo_id, nota 1-5, comentario)
- `autoavaliacoes` (usuario_id, pontuacao, nivel, respostas JSON)
- `ebooks`, `meditacoes`, `webinars`, `inscricoes_webinars`
- `grupos_terapia`, `participantes_grupos`, `sessoes_grupo`, `presenca_grupo`
- `contatos`, `emergencias`, `mensagens_emergencia`
- `downloads`, `reproducoes`

### 7.2 Índices (schema_simples.sql)
- `idx_usuarios_email`, `idx_usuarios_tipo`, `idx_usuarios_ativo`
- `idx_sessoes_paciente`, `idx_sessoes_psicologo`, `idx_sessoes_data`, `idx_sessoes_status`
- `idx_mensagens_remetente`, `idx_mensagens_destinatario`
- `idx_autoavaliacoes_usuario`, `idx_grupos_psicologo`, `idx_webinars_data`, `idx_emergencias_status`, `idx_pagamentos_status`

### 7.3 Seeds
- **DemoPsychologistSeeder** (Java, roda na inicialização): `psicologo.demo@cedro.app` / `Cedro@123` (Dra. Marina Almeida, CRP 06/123456, R$180) e `paciente.demo@cedro.app` / `Cedro@123` (Lucas Ferreira)
- **dados_demo_apresentacao.sql**: 3 psicólogos demo, 2 pacientes demo, sessões demo, mensagens demo
- **dados_exemplo.sql**: 18 psicólogos, 3 pacientes, 1 admin (`admin@cedro.com` / hash bcrypt de `Cedro@123`), sessões, pagamentos, avaliações, ebooks, meditações, webinars, grupos, autoavaliações

---

## ETAPA 8 — AUTENTICAÇÃO

### 8.1 Login
- `POST /api/auth/login` → retorna `{token, usuario}`
- Token JWT assinado com HMAC-SHA (secret de `jwt.secret`)
- Claims: `sub` (email), `id` (userId), `tipo` (tipoUsuario), `iat`, `exp`

### 8.2 Logout
- **Web**: `AuthContext.logout()` → `localStorage.clear()` (remove token e usuário)
- **Mobile**: `authStore.logout()` → remove token do SecureStore/AsyncStorage + remove usuário do AsyncStorage
- **Backend**: não há endpoint de logout (stateless)

### 8.3 JWT
- **Geração**: `JwtUtil.generateToken(userId, email, tipoUsuario)`
- **Validação**: `JwtUtil.validateToken(token, email)` — verifica email e expiração
- **Expiração**: `jwt.expiration=86400000` (24 horas)
- **Secret**: `jwt.secret` (mínimo 32 chars recomendado)

### 8.4 Refresh Token
- **NÃO implementado** — não há endpoint de refresh token

### 8.5 Cookies
- **NÃO usado** — autenticação via header `Authorization: Bearer <token>`

### 8.6 Sessão
- **Stateless** — `SessionCreationPolicy.STATELESS`

### 8.7 Middleware (Filtro)
- `JwtAuthenticationFilter` (OncePerRequestFilter):
  - Ignora `/api/assinatura/webhook`
  - Lê header `Authorization`
  - Se token válido → seta `UsernamePasswordAuthenticationToken` no SecurityContext
  - Se token inválido → responde 401 e retorna (não continua o chain)

### 8.8 Autorização (por endpoint)
| Endpoint | Permissão |
|---|---|
| `/api/auth/**` | Público |
| `/api/assinatura/webhook` | Público (mas valida header secret) |
| `/ws-chat` | Público (mas valida token na query string) |
| `/api/psicologos` | Público |
| `/api/psicologos/{id}` | Público |
| `/uploads/**` | Público |
| `/`, `/api/auth/health` | Público |
| Qualquer outro | Autenticado |

### 8.9 Perfis
- `paciente`, `psicologo`, `admin` (enum `TipoUsuario`)

### 8.10 Proteção de Rotas (Frontend)
- `ProtectedRoute` (web): verifica `isAuthenticated`; se `requiredUserType` definido, verifica `tipoUsuario`
- `RootNavigator` (mobile): se `isAuthenticated` → MainTabs; senão → AuthStack

---

## ETAPA 9 — VALIDAÇÕES

### 9.1 Backend (Java)

| Arquivo | Campo | Regra | Mensagem |
|---|---|---|---|
| LoginRequest.java | email | @NotBlank, @Email | (padrão) |
| LoginRequest.java | senha | @NotBlank | (padrão) |
| RegisterRequest.java | nome | @NotBlank, @Size(max=100) | (padrão) |
| RegisterRequest.java | email | @NotBlank, @Email, @Size(max=100) | (padrão) |
| RegisterRequest.java | senha | @NotBlank, @Size(min=6) | (padrão) |
| AuthService.register | senha | min 6 | "Senha muito curta (min. 6 caracteres)" |
| AuthService.register | senha | 1 número | "Precisa ter pelo menos 1 numero" |
| AuthService.register | senha | 1 especial | "Precisa ter pelo menos 1 caractere especial" |
| AuthService.register | email | duplicado | "Esse email ja ta em uso" |
| AuthService.register | tipoUsuario | admin bloqueado | (força paciente) |
| AuthService.register | crp (psicólogo) | obrigatório | "CRP obrigatorio para psicologo" |
| AuthService.register | crp | formato `\d{2}/\d{5,6}` | "CRP invalido. Use o formato 06/123456" |
| AuthService.register | crp | duplicado | "Este CRP ja esta cadastrado" |
| AuthService.register | especialidade | obrigatória | "Especialidade obrigatoria para psicologo" |
| AuthService.register | tipoPsicologo | obrigatório | "Tipo de psicologo obrigatorio para psicologo" |
| AuthService.register | precoSessao | > 0 | "Valor da consulta obrigatorio para psicologo" |
| AlterarSenhaRequest.java | senhaAtual | @NotBlank | "Senha atual é obrigatória" |
| AlterarSenhaRequest.java | novaSenha | @NotBlank, @Size(min=6) | "Nova senha deve ter no mínimo 6 caracteres" |
| AuthService.alterarSenha | novaSenha | 1 número | "Precisa ter pelo menos 1 numero" |
| AuthService.alterarSenha | novaSenha | 1 especial | "Precisa ter pelo menos 1 caractere especial" |
| MensagemRequest.java | destinatarioId | @NotNull | (padrão) |
| MensagemRequest.java | mensagem | @NotBlank, @Size(max=2000) | "Mensagem muito longa (máx. 2000 caracteres)" |
| SessaoRequest.java | psicologoId | @NotNull | "psicologoId é obrigatório" |
| SessaoRequest.java | dataSessao | @NotNull | "dataSessao é obrigatória" |
| AuthController.foto-perfil-upload | file | não vazio | "Arquivo de imagem obrigatorio" |
| AuthController.foto-perfil-upload | file | <= 2MB | "Imagem muito grande (max. 2MB)" |
| AuthController.foto-perfil-upload | file | JPG/PNG/WebP | "Formato invalido. Use JPG, PNG ou WebP" |
| PsicologoController.verificar-crp | crp | formato | "Formato de CRP inválido. Use: XX/XXXXXX" |
| PsicologoController.verificar-crp | crp | duplicado | "Este CRP já está cadastrado na plataforma." |
| AssinaturaController.webhook | Authorization | secret | "Webhook nao autorizado" |
| AssinaturaController.webhook | payload | type/app_user_id | "Payload RevenueCat invalido" |

### 9.2 Frontend (Web)

| Arquivo | Campo | Regra | Mensagem |
|---|---|---|---|
| Login.jsx | senha (cadastro) | min 6 | "Mínimo 6 caracteres" |
| Login.jsx | senha (cadastro) | 1 número | "Pelo menos 1 número" |
| Login.jsx | senha (cadastro) | 1 especial | "Pelo menos 1 caractere especial (!@#$%^&*)" |
| Login.jsx | senha (cadastro) | requisitos | "A senha não atende aos requisitos mínimos de segurança." |
| CadastroPsicologo.jsx | senha | min 6, 1 número, 1 especial | "A senha não atende aos requisitos mínimos de segurança." |
| CadastroPsicologo.jsx | confirmarSenha | igual a senha | "As senhas não coincidem" |
| CadastroPsicologo.jsx | crp | formato | "O CRP informado não tem um formato válido. Use: XX/XXXXXX (ex: 06/123456)" |
| CadastroPsicologo.jsx | crp | status invalid | "O CRP informado não foi validado. Verifique o número e tente novamente." |
| Perfil.jsx | novaSenha | min 6, 1 número, 1 especial | "A nova senha não atende aos requisitos mínimos de segurança." |
| Perfil.jsx | confirmarSenha | igual | "As senhas não coincidem!" |
| Perfil.jsx | foto | <= 5MB | "A imagem deve ter no máximo 5MB" |
| PagamentoModal.jsx | cartão | número >= 13, nome > 2, validade 5, cvv >= 3 | (botão desabilitado) |
| RedefinirSenha.jsx | novaSenha | >= 6 | "A senha deve ter pelo menos 6 caracteres." |
| RedefinirSenha.jsx | confirmar | igual | "As senhas não coincidem." |
| RedefinirSenha.jsx | token | presente | "Token inválido ou ausente. Solicite um novo link de recuperação." |

### 9.3 Frontend (Mobile)
- `useAuth.ts`: login/register/google/recuperarSenha com toasts de erro
- `useSessoes.ts`: agendar/cancelar com toasts
- `ScheduleSessionScreen.tsx`: seleção de data/horário obrigatória
- `RegisterScreen.tsx`: (não lido em detalhe, mas segue padrão do useAuth)

---

## ETAPA 10 — FLUXOS FUNCIONAIS

### 10.1 Cadastro de Paciente
1. Tela: `Login.jsx` (modo cadastro)
2. Validação frontend: nome, dataNascimento, genero, telefone, email, senha (min 6, 1 número, 1 especial)
3. API: `POST /api/auth/register` com `tipoUsuario: 'paciente'`
4. Controller: `AuthController.register`
5. Service: `AuthService.register` — valida email duplicado, senha, cria usuário
6. Repository: `UsuarioRepository.save`
7. Banco: INSERT em `usuarios`
8. Resposta: 201 `{"message": "Conta criada!"}`
9. UI: mostra mensagem de sucesso, alterna para login

### 10.2 Login de Paciente
1. Tela: `Login.jsx`
2. API: `POST /api/auth/login`
3. Service: `AuthService.login` — valida email/senha, gera JWT
4. Resposta: `{token, usuario}`
5. UI: `AuthContext.login()` → salva token e usuário no localStorage → navega para `/`

### 10.3 Login com Google
1. Tela: `Login.jsx` — botão Google (script GSI)
2. Google retorna `credential` (ID token)
3. API: `POST /api/auth/google` com `{credential}`
4. Service: `AuthService.googleLoginWithToken` — valida token, faz login ou cria conta
5. Resposta: `{token, usuario}`
6. UI: salva e navega para `/`

### 10.4 Cadastro de Psicólogo
1. Tela: `CadastroPsicologo.jsx`
2. Validações: senha, CRP (formato + verificação via `GET /api/psicologos/verificar-crp`)
3. API: `POST /api/auth/register` com `tipoUsuario: 'psicologo'`
4. Service: `AuthService.register` — valida CRP, especialidade, tipo, preço
5. Resposta: 201
6. UI: alert + navega para `/login-psicologo`

### 10.5 Agendamento de Sessão
1. Tela: `ListaPsicologos.jsx` → botão "Agendar Sessão"
2. Tela: `AgendarSessao.jsx` — preenche data, hora, duração, observações
3. API: `POST /api/sessoes` com `{psicologoId, dataSessao, duracao, observacoes}`
4. Controller: `SessaoController.criar` — força `pacienteId` do token
5. Service: `SessaoService.criar` — valida psicólogo, limite gratuito, horário ocupado
6. Repository: `SessaoRepository.save`
7. Resposta: 201 Sessao
8. UI: navega para `/pagamento/sessao/{id}`

### 10.6 Pagamento e Confirmação
1. Tela: `PagamentoSessao.jsx` — mostra detalhes
2. Modal: `PagamentoModal.jsx` — cartão ou PIX (fake)
3. Sucesso: `POST /api/sessoes/{id}/confirmar-pagamento`
4. Service: `SessaoService.confirmarPagamento` — valida paciente, seta status `agendada`, cria Google Meet
5. GoogleMeetService: cria evento no Google Calendar, retorna link
6. Resposta: `{"message": "Sessão confirmada com sucesso", "sessao": ...}`
7. UI: alert + navega para `/minhas-sessoes`

### 10.7 Entrar na Reunião
1. Tela: `MinhasSessoes.jsx` → botão "Entrar na sessão"
2. Modal: `ReuniaoModal.jsx` — polling `GET /api/sessoes/{id}/link-reuniao` a cada 15s
3. Backend: verifica janela de liberação (15 min antes)
4. UI: contagem regressiva → botão "Entrar na reunião" (abre link do Meet)

### 10.8 Chat em Tempo Real
1. Tela: `Chat.jsx` (web) ou `ChatScreen.tsx` (mobile)
2. Conexão STOMP: `ws://<host>/ws-chat?token=<jwt>`
3. Subscribe: `/user/queue/mensagens`
4. Envio: publish `/app/chat.send` com `{destinatarioId, mensagem}`
5. Backend: `ChatStompController.sendChat` — salva mensagem, envia para destinatário e remetente
6. UI: atualiza lista de mensagens em tempo real

### 10.9 Recuperação de Senha
1. Tela: `Login.jsx` → modal "Esqueci minha senha"
2. API: `POST /api/auth/recuperar-senha` com `{email}`
3. Service: `AuthService.recuperarSenha` — gera token (30 min), salva, envia email (ou loga se MAIL_ENABLED=false)
4. Email: link `{FRONTEND_URL}/redefinir-senha?token={token}`
5. Tela: `RedefinirSenha.jsx` — nova senha
6. API: `POST /api/auth/redefinir-senha` com `{token, novaSenha}`
7. UI: navega para `/login` com mensagem de sucesso

### 10.10 Dashboard Psicólogo
1. Tela: `DashboardPsicologo.jsx`
2. API: `GET /api/psicologos/estatisticas` + `GET /api/psicologos/consultas/proximas`
3. UI: cards de estatísticas + lista de próximas consultas

### 10.11 Financeiro Psicólogo
1. Tela: `FinanceiroPsicologo.jsx`
2. API: `GET /api/psicologos/financeiro?periodo=mes|trimestre|ano`
3. UI: faturamento, consultas, ticket médio, transações

### 10.12 Assinatura Premium (Mobile)
1. Tela: `PaywallScreen.tsx`
2. Service: `subscriptionService` — RevenueCat (compras nativas)
3. Backend: webhook RevenueCat atualiza tabela `assinaturas`
4. Verificação: `GET /api/assinatura/status` — fonte da verdade

---

## ETAPA 11 — PONTOS DE TESTE

### 11.1 Autenticação
**Casos positivos**:
- Login com credenciais válidas → 200 com token
- Registro de paciente válido → 201
- Registro de psicólogo válido (com CRP válido) → 201
- Login Google com token válido → 200
- Recuperação de senha → 200 (sempre mesma mensagem)
- Redefinição de senha com token válido → 200

**Casos negativos**:
- Login com email inexistente → 400 "Email ou senha incorretos"
- Login com senha errada → 400 "Email ou senha incorretos"
- Login com usuário inativo → 400 "Email ou senha incorretos"
- Registro com email duplicado → 400 "Esse email ja ta em uso"
- Registro com senha < 6 → 400
- Registro com senha sem número → 400
- Registro com senha sem especial → 400
- Registro com tipoUsuario admin → força paciente (201)
- Registro psicólogo sem CRP → 400
- Registro psicólogo com CRP inválido → 400
- Registro psicólogo com CRP duplicado → 400
- Registro psicólogo sem especialidade → 400
- Registro psicólogo sem tipo → 400
- Registro psicólogo sem preço → 400
- Google com token inválido → 400
- Google com token expirado → 400
- Google com email não verificado → 400
- Redefinição com token inválido → 400
- Redefinição com token usado → 400
- Redefinição com token expirado → 400

**Campos obrigatórios**: email, senha (login); nome, email, senha (registro); CRP, especialidade, tipoPsicologo, precoSessao (psicólogo)

**Valores limite**: senha min 6; mensagem max 2000; foto max 2MB (backend) / 5MB (frontend)

**Duplicidade**: email, CRP

**Permissões**: admin não criável via API pública

### 11.2 Sessões
**Casos positivos**:
- Criar sessão com psicólogo válido → 201
- Criar sessão com horário livre → 201
- Confirmar pagamento como paciente dono → 200
- Obter link de reunião após janela → 200 liberado
- Obter link antes da janela → 200 não liberado com disponivelEm
- Listar minhas sessões → 200
- Cancelar sessão como paciente → 200

**Casos negativos**:
- Criar sessão com psicólogo inexistente → 400 "Psicólogo não encontrado"
- Criar sessão com horário ocupado → 400 "Horario indisponivel"
- Criar sessão sem limite gratuito (4/mês) → 403
- Confirmar pagamento de outro paciente → 403
- Acessar sessão de outro usuário → 403
- Cancelar sessão de outro usuário → 403
- Acessar link de reunião de outro usuário → 403

**Valores limite**: 4 sessões/mês para free; janela de 15 min

**Duplicidade**: horário do psicólogo

### 11.3 Mensagens
**Casos positivos**:
- Enviar mensagem → 200
- Listar conversa → 200
- Contar não lidas → 200
- Marcar como lida (destinatário) → 200
- Listar conversas → 200

**Casos negativos**:
- Mensagem > 2000 chars → 400
- Marcar como lida (não destinatário) → 403
- Sem destinatarioId → 400

### 11.4 Usuários
**Casos positivos**:
- Admin lista todos → 200
- Usuário vê a si mesmo → 200
- Admin ativa/desativa → 200
- Admin deleta → 200

**Casos negativos**:
- Não-admin lista todos → 403
- Usuário vê outro → 403
- Não-admin ativa/desativa → 403
- Não-admin deleta → 403

### 11.5 Psicólogos
**Casos positivos**:
- Lista pública → 200 (sem dados sensíveis)
- Detalhe → 200
- Verificar CRP disponível → 200 valido
- Financeiro → 200
- Estatísticas → 200
- Próximas consultas → 200

**Casos negativos**:
- CRP formato inválido → 400
- CRP duplicado → 409
- Detalhe de não-psicólogo → 400
- Não-admin cria psicólogo → 403
- Não-admin deleta psicólogo → 403

### 11.6 Assinatura
**Casos positivos**:
- Webhook autorizado → 200
- Status premium → 200
- Status free → 200

**Casos negativos**:
- Webhook não autorizado → 401
- Payload inválido → 400

### 11.7 WebSocket STOMP
**Casos positivos**:
- Conexão com token válido → conecta
- Enviar mensagem → destinatário recebe
- Reconexão automática

**Casos negativos**:
- Conexão com token inválido → recusada
- Conexão com token expirado → recusada

---

## ETAPA 12 — DEPENDÊNCIAS EXTERNAS

### 12.1 Google Calendar / Meet
- **Bibliotecas**: google-api-client 2.9.0, google-api-services-calendar v3-rev20260225-2.0.0, google-auth-library-oauth2-http 1.36.0
- **Config**: `GOOGLE_MEET_CLIENT_ID`, `GOOGLE_MEET_CLIENT_SECRET`, `GOOGLE_MEET_REFRESH_TOKEN`
- **Funcionamento**: `GoogleMeetService` cria credencial OAuth2 com refresh token, constrói Calendar client, cria evento com ConferenceData (hangoutsMeet), retorna link e eventId
- **Falha**: se falhar, loga erro e retorna null (sessão continua sem link)

### 12.2 RevenueCat (Assinaturas)
- **Biblioteca mobile**: react-native-purchases ^10.1.2
- **Config**: `EXPO_PUBLIC_RC_APPLE`, `EXPO_PUBLIC_RC_GOOGLE` (mobile); `REVENUECAT_WEBHOOK_SECRET` (backend)
- **Funcionamento**: mobile compra via loja; RevenueCat envia webhook para `POST /api/assinatura/webhook`; backend atualiza tabela `assinaturas`

### 12.3 Email (SMTP)
- **Biblioteca**: spring-boot-starter-mail
- **Config**: `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_ENABLED`, `FRONTEND_URL`
- **Funcionamento**: `EmailService.enviarResetSenha` — se `MAIL_ENABLED=false`, loga link no console

### 12.4 Google OAuth (Login)
- **Web**: Google Identity Services (script `https://accounts.google.com/gsi/client`), `VITE_GOOGLE_CLIENT_ID`
- **Mobile**: expo-auth-session, `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`
- **Backend**: valida ID token manualmente (sem biblioteca)

### 12.5 WebSocket STOMP
- **Bibliotecas**: spring-boot-starter-websocket (backend), @stomp/stompjs (web + mobile)
- **Endpoint**: `/ws-chat?token=<jwt>`
- **Broker**: simple broker (in-memory)

### 12.6 Upload de Arquivos
- **Backend**: salva em `{CEDRO_UPLOAD_DIR}` (default `${java.io.tmpdir}/cedro/uploads`)
- **Servido em**: `/uploads/**` (StaticResourceConfig)
- **Mobile**: expo-image-picker (foto de perfil)

### 12.7 Notificações Push
- **Mobile**: expo-notifications, expo-device
- **Backend**: tabela `push_tokens` (registro/remoção)
- **NOTA**: não há envio real de push no backend analisado — apenas registro de tokens

### 12.8 Telegram
- **Mobile**: link externo `https://t.me/cedroapoio` (HomeScreen)

### 12.9 WhatsApp
- **Web**: link externo `https://wa.me/5511951193385` (Home)

### 12.10 backend-node (TIAGO)
- **Arquivo**: `backend-node/.env`
- **Conteúdo**: credenciais de um sistema separado ("SalaosecretoStaging") com GROQ API, TiDB, JWT — **NÃO relacionado ao Cedro Plus principal** (provavelmente outro projeto)

---

## ETAPA 13 — AMBIENTE

### 13.1 Variáveis de Ambiente (Backend)
| Variável | Descrição | Default |
|---|---|---|
| `DATABASE_URL` | JDBC URL SQL Server | obrigatório |
| `DATABASE_USERNAME` | Usuário banco | obrigatório |
| `DATABASE_PASSWORD` | Senha banco | obrigatório |
| `JWT_SECRET` | Secret JWT | obrigatório |
| `JWT_EXPIRATION` | Expiração JWT (ms) | 86400000 |
| `PORT` | Porta servidor | 8080 |
| `CEDRO_UPLOAD_DIR` | Diretório uploads | `${java.io.tmpdir}/cedro/uploads` |
| `GOOGLE_MEET_CLIENT_ID` | Client ID Google | obrigatório |
| `GOOGLE_MEET_CLIENT_SECRET` | Client Secret Google | obrigatório |
| `GOOGLE_MEET_REFRESH_TOKEN` | Refresh token Google | obrigatório |
| `GOOGLE_MEET_RELEASE_MINUTES_BEFORE` | Minutos antes para liberar link | 15 |
| `REVENUECAT_WEBHOOK_SECRET` | Secret webhook | vazio |
| `MAIL_HOST` | SMTP host | smtp.gmail.com |
| `MAIL_PORT` | SMTP port | 587 |
| `MAIL_USERNAME` | SMTP user | vazio |
| `MAIL_PASSWORD` | SMTP senha | vazio |
| `MAIL_ENABLED` | Enviar email real | false |
| `FRONTEND_URL` | URL frontend | http://localhost:5173 |
| `TURN_URLS` | TURN URLs | vazio |
| `TURN_SHARED_SECRET` | TURN secret | vazio |
| `TURN_USERNAME` | TURN user | vazio |
| `TURN_CREDENTIAL` | TURN credencial | vazio |
| `TURN_METERED_DOMAIN` | Metered domain | vazio |
| `TURN_METERED_SECRET_KEY` | Metered secret | vazio |

### 13.2 Variáveis de Ambiente (Frontend Web)
| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL base do backend |
| `VITE_GOOGLE_CLIENT_ID` | Client ID Google |

### 13.3 Variáveis de Ambiente (Mobile)
| Variável | Descrição |
|---|---|
| `EXPO_PUBLIC_API_URL` | URL base do backend |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | Client ID Google |
| `EXPO_PUBLIC_RC_APPLE` | RevenueCat Apple key |
| `EXPO_PUBLIC_RC_GOOGLE` | RevenueCat Google key |

### 13.4 Como Executar

**Backend**:
```bash
cd backend/cedro-backend
# Windows:
run.bat
# Linux/Mac:
./start.sh
# Ou manualmente:
mvnw spring-boot:run
```

**Frontend Web**:
```bash
cd frontend
npm install
npm run dev  # porta 5174 (vite.config.js)
```

**Mobile**:
```bash
cd mobile
npm install
npx expo start
```

**Docker** (raiz):
```bash
docker build -t cedro .
docker run -p 80:80 cedro
```
- Dockerfile: build frontend (node:18-alpine) + backend (maven:3.9-eclipse-temurin-17), runtime eclipse-temurin:17-jre + nginx
- Nginx serve frontend e proxy `/api/` para localhost:8080

**Banco de dados**:
- Executar scripts SQL em ordem: `schema_simples.sql` (destrutivo), `atualizacao_banco.sql`, `google_meet_columns.sql`, `mobile_tables.sql`, `password_reset_tokens.sql`
- Seeds: `dados_demo_apresentacao.sql` ou `dados_exemplo.sql`

### 13.5 Produção
- Backend: `https://cedro-vc32.onrender.com` (config.js e environment.ts)
- Frontend: `https://cedro-eight.vercel.app` e `https://cedro-blush.vercel.app` (CORS config)

---

## ETAPA 14 — TESTES EXISTENTES

### 14.1 Estrutura de Testes
- **NÃO há testes automatizados** no projeto (nenhum diretório `src/test`, nenhum arquivo de teste encontrado)
- **NÃO há CI/CD** configurado (sem GitHub Actions, sem Jenkinsfile, sem .gitlab-ci.yml)
- **NÃO há fixtures, mocks, helpers ou coverage**

### 14.2 Testes Manuais Documentados
- `o.md` — scripts de teste STOMP manuais (chat-test.js, invalid-token-test.js, reconnect-test.js) — **não implementados** (diretórios `scripts/teste-stomp/` e `path/to/scripts/teste-stomp/` estão vazios)
- `backend/cedro-backend/test-api.bat` — script de teste de API (não lido em detalhe)
- `mobile/test-build.bat` — script de teste de build mobile

---

## ETAPA 15 — ANÁLISE PARA AUTOMAÇÃO

### 15.1 Testes Unitários (candidatos)
| Funcionalidade | Motivo |
|---|---|
| `AuthService` | Lógica complexa: validação de senha, bcrypt, normalização de email, validação de CRP |
| `SessaoService` | Regras de negócio: limite gratuito, horário ocupado, preço do psicólogo |
| `JwtUtil` | Geração/validação de tokens, extração de claims |
| `MensagemService` | Envio, listagem, marcação de lida |
| `AssinaturaService` | Verificação de premium, ativação/cancelamento/expiração |
| `GoogleMeetService` | Criação/cancelamento de reuniões (com mock) |
| `PsicologoController` | Filtro por interesse, normalização de tags |

### 15.2 Testes de Integração (candidatos)
| Funcionalidade | Motivo |
|---|---|
| `AuthService` + `UsuarioRepository` | Fluxo completo de registro/login com banco real |
| `SessaoService` + `SessaoRepository` | Criação de sessão com validações |
| `MensagemService` + `MensagemRepository` | Conversa entre dois usuários |
| `AssinaturaService` + `JdbcTemplate` | Consultas SQL de assinatura |

### 15.3 Testes de API (candidatos)
| Endpoint | Motivo |
|---|---|
| Todos os `/api/auth/*` | Fluxo de autenticação completo |
| Todos os `/api/sessoes/*` | Regras de negócio críticas |
| Todos os `/api/psicologos/*` | Permissões e filtros |
| Todos os `/api/mensagens/*` | Chat REST |
| `/api/assinatura/webhook` | Integração RevenueCat |
| `/api/assinatura/status` | Limites de uso |

### 15.4 Testes E2E (candidatos)
| Fluxo | Motivo |
|---|---|
| Cadastro → Login → Agendar → Pagar → Ver sessão | Fluxo principal do paciente |
| Login psicólogo → Dashboard → Agenda → Financeiro | Fluxo do psicólogo |
| Login admin → Gestão de usuários/sessões | Fluxo do admin |
| Chat em tempo real (2 usuários) | WebSocket STOMP |
| Recuperação de senha completa | Fluxo de email + token |

### 15.5 Testes de Banco (candidatos)
| Tabela | Motivo |
|---|---|
| `usuarios` | Constraints de unicidade (email, CRP) |
| `sessoes` | Relacionamentos, status |
| `assinaturas` | Índice único de assinatura ativa |
| `password_reset_tokens` | Expiração, uso único |

### 15.6 Testes de Regressão (candidatos)
- Todos os fluxos de autenticação
- Agendamento de sessão (limite, horário)
- Chat (REST + STOMP)
- Assinatura (webhook + status)

### 15.7 Testes de Segurança (candidatos)
| Teste | Motivo |
|---|---|
| Injeção SQL | JdbcTemplate com SQL nativo (MensagemService, AssinaturaService) |
| Exposição de dados sensíveis | `GET /api/usuarios` retorna senhaHash; `GET /api/psicologos/{id}` retorna entidade completa |
| Autorização | Verificar 403 em endpoints protegidos |
| JWT | Token expirado, token inválido, token com claims alterados |
| Upload | Validação de tipo/tamanho de arquivo |
| WebSocket | Token inválido no handshake |

### 15.8 Testes de Performance (candidatos)
| Teste | Motivo |
|---|---|
| `GET /api/psicologos` | Consulta com filtro de interesse |
| `GET /api/mensagens/conversas` | SQL complexo com CTE |
| `GET /api/psicologos/financeiro` | Agregações |
| WebSocket | Muitas conexões simultâneas |

---

## ETAPA 16 — PONTOS CRÍTICOS PARA AUTOMAÇÃO

### 16.1 Autenticação
- JWT obrigatório na maioria dos endpoints (header `Authorization: Bearer <token>`)
- Token expira em 24h — testes precisam gerar token fresco
- Login Google requer token real do Google (difícil de automatizar — pode precisar de mock)

### 16.2 WebSocket STOMP
- Conexão requer token na query string (`?token=<jwt>`)
- Handshake rejeita token inválido/expirado
- Reconexão automática (reconnectDelay)
- Testes precisam de cliente STOMP (ex: @stomp/stompjs)

### 16.3 Upload de Arquivos
- `POST /api/auth/foto-perfil-upload` requer multipart/form-data
- Validações de tipo (JPG/PNG/WebP) e tamanho (2MB)

### 16.4 Pagamento
- `PagamentoModal` gera PIX fake localmente (não é real)
- Endpoints `/api/pagamentos/*` **NÃO existem no backend** — erros são ignorados
- Confirmação real é via `POST /api/sessoes/{id}/confirmar-pagamento`

### 16.5 Google Meet
- Depende de credenciais Google reais (`GOOGLE_MEET_CLIENT_ID`, etc.)
- Se credenciais ausentes, `GoogleMeetService` retorna null (sessão sem link)
- Testes precisam mockar ou usar credenciais de teste

### 16.6 Email
- `MAIL_ENABLED=false` → link logado no console (útil para testes)
- `MAIL_ENABLED=true` → envia email real (SMTP)

### 16.7 RevenueCat
- Webhook requer secret no header `Authorization`
- Compras reais requerem loja Apple/Google (difícil de automatizar)
- Testes podem simular payload do webhook

### 16.8 SPA (React)
- Renderização client-side (CSR) — testes E2E precisam esperar carregamento
- Lazy loading de páginas (Suspense)
- Animações de transição de página

### 16.9 Polling
- `ReuniaoModal` e `ReuniaoScreen` fazem polling a cada 15s
- Testes precisam lidar com temporização

### 16.10 Dados Sensíveis Expostos
- `GET /api/usuarios` (admin) retorna `senhaHash` — **vulnerabilidade conhecida**
- `GET /api/psicologos/{id}` retorna entidade completa (email, telefone, senhaHash)

### 16.11 Banco de Dados
- SQL Server remoto (Somee) — testes precisam de banco de teste
- `ddl-auto=none` — schema deve ser criado manualmente via scripts SQL

### 16.12 CORS
- Origens permitidas: localhost:3000, 5173, 5174, 8081, cedro-eight.vercel.app, cedro-blush.vercel.app
- Testes de API fora dessas origens podem falhar

### 16.13 Rate Limit
- **NÃO há rate limiting** implementado

### 16.14 CAPTCHA
- **NÃO há CAPTCHA** implementado

### 16.15 Cookies
- **NÃO usa cookies** — apenas header Authorization

### 16.16 Iframes
- **NÃO há iframes** no frontend

### 16.17 Download
- **NÃO há downloads** no frontend

### 16.18 Renderização Dinâmica
- SPA com CSR — conteúdo carregado via JS
- Lazy loading com Suspense

### 16.19 Requisições Assíncronas
- Axios com interceptors (injeção de token, retry em falha de rede)
- Promise.all em várias páginas

### 16.20 Dados Demo
- `DemoPsychologistSeeder` cria usuários demo na inicialização (se não existirem)
- `dados_demo_apresentacao.sql` e `dados_exemplo.sql` para seeds manuais

---

## ETAPA 17 — RESUMO FINAL DE CONHECIMENTO

### 17.1 Credenciais Demo Conhecidas
| Tipo | Email | Senha |
|---|---|---|
| Psicólogo (seeder Java) | `psicologo.demo@cedro.app` | `Cedro@123` |
| Paciente (seeder Java) | `paciente.demo@cedro.app` | `Cedro@123` |
| Admin (dados_exemplo.sql) | `admin@cedro.com` | `Cedro@123` (hash bcrypt) |
| Psicólogos demo (SQL) | `ana.demo@cedroplus.demo`, `carlos.demo@cedroplus.demo`, `julia.demo@cedroplus.demo` | `Cedro@123` |
| Pacientes demo (SQL) | `paciente1.demo@cedroplus.demo`, `paciente2.demo@cedroplus.demo` | `Cedro@123` |

### 17.2 URLs de Produção
- Backend: `https://cedro-vc32.onrender.com`
- Frontend: `https://cedro-eight.vercel.app`, `https://cedro-blush.vercel.app`

### 17.3 Endpoints Públicos (sem JWT)
- `GET /`
- `GET /api/auth/health`
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/google`
- `POST /api/auth/recuperar-senha`
- `POST /api/auth/redefinir-senha`
- `GET /api/psicologos`
- `GET /api/psicologos/{id}`
- `GET /api/psicologos/verificar-crp`
- `GET /api/sessoes/disponibilidade/{psicologoId}`
- `POST /api/assinatura/webhook` (requer header secret)
- `GET /uploads/**`
- WebSocket `/ws-chat` (requer token na query string)

### 17.4 Endpoints que Requerem JWT
- Todos os demais endpoints de `/api/usuarios`, `/api/psicologos` (exceto listados acima), `/api/sessoes`, `/api/mensagens`, `/api/notificacoes`, `/api/assinatura/status`, `/api/auth/perfil`, `/api/auth/alterar-senha`, `/api/auth/conta`, `/api/auth/foto-perfil`, `/api/auth/foto-perfil-upload`

### 17.5 Informações Não Determináveis pelo Código
1. **Credenciais reais do banco de produção** — não estão no código (apenas variáveis de ambiente)
2. **Credenciais Google Meet reais** — não estão no código
3. **Credenciais RevenueCat reais** — não estão no código (placeholders no mobile)
4. **Conteúdo de `backend/cedro-backend/.env`** — não existe no repositório (apenas `.env.example`)
5. **Conteúdo de `backend/cedro-backend/start.ps1`** — não lido (arquivo existe mas não foi analisado)
6. **Conteúdo de `backend/cedro-backend/test-api.bat`** — não lido
7. **Conteúdo de `backend/cedro-backend/run_output.txt`** — não lido
8. **Conteúdo de `frontend/src/components/games/`** — diretório existe mas não foi explorado
9. **Conteúdo de `frontend/src/pages/Autoavaliacao.jsx`, `Autoavaliacoes.jsx`, `ChatEmergencia.jsx`, `ChatsPsicologo.jsx`, `ConfiguracoesPsicologo.jsx`, `ConsultasPsicologo.jsx`, `Contato.jsx`, `DashboardAdmin.jsx`, `EstatisticasPsicologo.jsx`, `FinanceiroPsicologo.jsx`, `JogosRelaxamento.jsx`, `MinhasConversas.jsx`, `PacientesPsicologo.jsx`, `PerfilPsicologo.jsx`, `Premium.jsx`, `SaudeMental.jsx`, `TermosUso.jsx`, `PoliticaPrivacidade.jsx`, `AgendaPsicologo.jsx`, `NotFound.jsx`** — não lidos em detalhe (mas rotas mapeadas)
10. **Conteúdo de `mobile/src/screens/auth/RegisterScreen.tsx`, `ForgotPasswordScreen.tsx`, `chat/ChatScreen.tsx`, `chat/ConversasScreen.tsx`, `home/PsicologoDetailScreen.tsx`, `home/PsicologoListScreen.tsx`, `home/SessionSuccessScreen.tsx`, `profile/EditProfileScreen.tsx`, `profile/ChangePasswordScreen.tsx`, `profile/PsychologistSettingsScreen.tsx`, `sessions/SessionsScreen.tsx`, `subscription/PaywallScreen.tsx`** — não lidos em detalhe
11. **Conteúdo de `mobile/src/services/demoCommunicationService.ts`, `subscriptionService.web.ts`, `usuarioService.ts`, `mobile/src/hooks/useConversas.ts`, `usePerfil.ts`, `usePsychologistDashboard.ts`, `mobile/src/store/uiStore.ts`, `mobile/src/utils/queryClient.ts`, `mobile/src/theme/*`** — não lidos em detalhe
12. **Conteúdo de `frontend/src/components/games/`** — não explorado
13. **Conteúdo de `frontend/src/styles/*.css`** — não lidos (apenas nomes)
14. **Conteúdo de `frontend/public/`** — não explorado
15. **Conteúdo de `mobile/assets/`** — não explorado
16. **Conteúdo de `backend/cedro-backend/Dockerfile`** — não lido (existe mas não foi analisado)
17. **Conteúdo de `frontend/vercel.json`** — não lido
18. **Conteúdo de `mobile/eas.json`, `mobile/metro.config.js`, `mobile/babel.config.js`, `mobile/tsconfig.json`, `mobile/index.ts`, `mobile/BUILD_FIXES_REPORT.md`** — não lidos
19. **Conteúdo de `package-lock.json` (raiz)** — não lido
20. **Conteúdo de `frontend/index.html`, `frontend/README.md`, `frontend/.gitignore`** — não lidos
21. **Conteúdo de `backend/cedro-backend/README.md`** — não lido
22. **Conteúdo de `backend/cedro-backend/start.ps1`** — não lido
23. **Conteúdo de `backend/cedro-backend/test-api.bat`** — não lido
24. **Conteúdo de `backend/cedro-backend/run_output.txt`** — não lido
25. **Conteúdo de `backend/cedro-backend/Dockerfile`** — não lido
26. **Conteúdo de `backend/cedro-backend/target/`** — build output, ignorado
27. **Conteúdo de `frontend/src/components/games/`** — não explorado
28. **Conteúdo de `frontend/src/pages/AgendaPsicologo.jsx`** — não lido (mas usa FullCalendar conforme promptgpt/1.md)
29. **Conteúdo de `frontend/src/pages/FinanceiroPsicologo.jsx`** — não lido (mas usa `GET /api/psicologos/financeiro`)
30. **Conteúdo de `frontend/src/pages/EstatisticasPsicologo.jsx`** — não lido
31. **Conteúdo de `frontend/src/pages/ConsultasPsicologo.jsx`** — não lido
32. **Conteúdo de `frontend/src/pages/PacientesPsicologo.jsx`** — não lido
33. **Conteúdo de `frontend/src/pages/PerfilPsicologo.jsx`** — não lido
34. **Conteúdo de `frontend/src/pages/ConfiguracoesPsicologo.jsx`** — não lido
35. **Conteúdo de `frontend/src/pages/ChatsPsicologo.jsx`** — não lido
36. **Conteúdo de `frontend/src/pages/MinhasConversas.jsx`** — não lido
37. **Conteúdo de `frontend/src/pages/DashboardAdmin.jsx`** — não lido
38. **Conteúdo de `frontend/src/pages/Premium.jsx`** — não lido
39. **Conteúdo de `frontend/src/pages/SaudeMental.jsx`** — não lido
40. **Conteúdo de `frontend/src/pages/JogosRelaxamento.jsx`** — não lido
41. **Conteúdo de `frontend/src/pages/Autoavaliacoes.jsx`** — não lido
42. **Conteúdo de `frontend/src/pages/Autoavaliacao.jsx`** — não lido
43. **Conteúdo de `frontend/src/pages/ChatEmergencia.jsx`** — não lido
44. **Conteúdo de `frontend/src/pages/Contato.jsx`** — não lido
45. **Conteúdo de `frontend/src/pages/TermosUso.jsx`** — não lido
46. **Conteúdo de `frontend/src/pages/PoliticaPrivacidade.jsx`** — não lido
47. **Conteúdo de `frontend/src/pages/NotFound.jsx`** — não lido
48. **Conteúdo de `frontend/src/components/AdBanner.jsx`, `BackToTop.jsx`, `CursorGlow.jsx`, `CustomModal.jsx`, `EmergencyButton.jsx`, `Footer.jsx`, `LoadingSpinner.jsx`, `NavbarPsicologo.jsx`, `NotificationSystem.jsx`, `PageTransition.jsx`, `PersonalizacaoMenu.jsx`, `SidebarPsicologo.jsx`, `ThemeSelector.jsx`** — não lidos em detalhe
49. **Conteúdo de `frontend/src/hooks/useModal.jsx`** — não lido
50. **Conteúdo de `frontend/src/main.jsx`** — não lido

### 17.6 Observações Finais
- O sistema é uma plataforma funcional de saúde mental com backend Spring Boot, frontend React e mobile React Native
- A autenticação é JWT stateless
- O chat usa WebSocket STOMP
- As reuniões usam Google Meet via Google Calendar API
- A assinatura usa RevenueCat
- **Não há testes automatizados** — tudo precisa ser criado do zero
- **Não há CI/CD** — pipelines precisam ser configurados
- **Vulnerabilidades conhecidas**: exposição de senhaHash em `GET /api/usuarios` e `GET /api/psicologos/{id}`; endpoints de pagamento `/api/pagamentos/*` não existem no backend (frontend ignora erros)
- **Dados demo**: usuários criados automaticamente na inicialização (seeder Java) e via scripts SQL

---

*Fim do documento técnico. Produzido por engenharia reversa completa do código-fonte do projeto Cedro Plus.*
