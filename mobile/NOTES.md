# 📋 Notas de Progresso — Cedro Mobile

> **Última atualização:** 31/08/2026  
> **Type-check:** ✅ EXIT 0 (limpo)  
> **Branch:** main

---

## 🎯 Resumo do Projeto

O **Cedro** é uma plataforma de saúde mental com dois perfis (paciente e psicólogo). Este repositório (`mobile/`) é o app React Native (Expo) que espelha as funcionalidades já existentes no `frontend/` (web).

---

## ✅ Sprints Concluídos

### Sprint 1 — Pagamento de Sessão (Parte A)
- **`sessaoService.ts`** → método `confirmarPagamento(id)` (extrai `response.data.sessao` do envelope do backend)
- **`navigation.types.ts`** → rota `Payment: { sessaoId; psicologoNome; valor }`
- **`HomeStack.tsx`** → rota `Payment` registrada
- **`PaymentScreen.tsx`** (novo, ~450 linhas) → seletor Cartão/PIX, máscaras (`XXXX XXXX XXXX XXXX`, `MM/AA`, CVV), PIX fake, delay 3s, etapas `escolha → processando → sucesso`, rodapé "100% seguro", `expo-clipboard`
- **`ScheduleSessionScreen.tsx`** → navega para `Payment` em vez de `SessionSuccess`
- **`SessionSuccessScreen.tsx`** → texto de "pagamento direto" removido; mensagem atualizada
- **`constants/api.ts`** → `SESSOES.CONFIRMAR_PAGAMENTO(id)` e `PSICOLOGOS.VERIFICAR_CRP`

### Sprint 2 — Validação de CRP (Parte B)
- **`RegisterScreen.tsx`** → estados `crpStatus` (`idle|checking|valid|invalid|format_error`), regex `/^\d{2}\/\d{5,6}$/`, `verificarCrp` no `onBlur` via `GET /api/psicologos/verificar-crp`, feedback visual (spinner/check/X), bloqueio de submit com toast

### Sprint 3 — Recursos de Bem-Estar (100% local, sem backend)
- **Nova aba "Recursos"** no `MainTabs` (ícone coração)
- **`RecursosStack.tsx`** (novo) → 5 telas
- **`RecursosHubScreen.tsx`** → hub com 4 cards + aviso CVV 188
- **`ChatEmergenciaScreen.tsx` + `chatEmergenciaData.ts`** → chatbot com 8 opções idênticas ao web
- **`AutoavaliacoesScreen.tsx` + `autoavaliacoesData.ts`** → 3 testes × 5 perguntas, escala Nunca→Sempre, resultado por nível
- **`SaudeMentalScreen.tsx` + `saudeMentalData.ts`** → 5 transtornos expansíveis (Ansiedade, Depressão, TDAH, Burnout, Pânico)
- **`PassatemposScreen.tsx` + `games/`** → 3 jogos React Native puro:
  - `PlasticoBolha.tsx` — grade 70 bolhas, respawn 4–7s
  - `TesteReflexo.tsx` — idle→aguardando→pronto→resultado, anti-cheat <50ms, recorde pessoal
  - `ParticulasFugitivas.tsx` — 20 partículas que fogem do toque, score infinito
- **`EmergencyButton.tsx`** (novo) → botão flutuante "SOS" global com `Linking.openURL('tel:...')` para CVV 188, SAMU 192, Polícia 190, Bombeiros 193

### Sprint 4 — Portal do Psicólogo
- **`PacientesPsicologoScreen.tsx`** → lista pacientes + botão chat
- **`ConsultasPsicologoScreen.tsx`** → próximas 10 consultas + botão reunião
- **`FinanceiroPsicologoScreen.tsx`** → seletor Mês/Trimestre/Ano, cards + transações
- **`EstatisticasPsicologoScreen.tsx`** → cards consultas hoje/semana, pacientes ativos, faturamento
- **`psicologoService.ts`** → `financeiro(periodo)`
- **`ProfileScreen.tsx`** → menu do psicólogo com 4 novos itens
- **`ProfileStack.tsx`** → 4 rotas novas registradas

### Sprint 5 — Limpeza e Correções
- **`useNotifications.ts`** → correção `.status` (risco runtime push), tipagem local robusta
- **`constants/api.ts`** → removidas constantes mortas (`PUSH.*`, `ASSINATURA.LIMITE_CHAMADAS`)
- **`SessionSuccessScreen.tsx`** → **deletado** (órfã após fluxo de pagamento)
- **`ParticulasFugitivas.tsx`** → removido branch morto "Jogar de novo"
- **`app.config.ts`** → splash migrado para plugin `expo-splash-screen` (Expo 54+)
- **`PaymentScreen.tsx`** → comentário residual removido

### Sprint 6 — Migração de Tipos e Correção de Bugs
- **`navigation.types.ts`** → adicionados `RecursosStackParamList`, `Payment` em `HomeStackParamList`, 4 rotas do psicólogo em `ProfileStackParamList`, `RecursosStack` em `MainTabParamList`
- **`PlasticoBolha.tsx`** → corrigido bug de escopo: `Bubble` usava `styles` do pai (componente separado); criado estilos internos `s`
- **`SaudeMentalScreen.tsx`** → corrigido bug de escopo: `TranstornoDetalhes` usava `styles` do pai; migrado para `useTheme()` + estilos internos
- **`PsicologoDetailScreen.tsx`** → adicionado `import React` (faltava para `React.useMemo`)

---

## 📊 Estado Atual do Mobile

### Telas existentes (35+)
| Stack | Telas |
|---|---|
| **Auth** | Login, Register, ForgotPassword |
| **Home** | Home, PsicologoList, PsicologoDetail, ScheduleSession, Payment |
| **Recursos** | RecursosHub, SaudeMental, Autoavaliacoes, Passatempos, ChatEmergencia |
| **Chat** | Conversas, Chat |
| **Profile** | Profile, EditProfile, PsychologistSettings, ChangePassword, MySessions, NewSessionPsicologo, Subscription, PacientesPsicologo, ConsultasPsicologo, FinanceiroPsicologo, EstatisticasPsicologo |
| **Root (modais)** | Splash, Reuniao, Paywall |

### Funcionalidades implementadas
- ✅ Login/Cadastro com validação de CRP
- ✅ Lista/Detalhe de psicólogos
- ✅ Agendamento de sessão
- ✅ **Pagamento (Cartão/PIX)** com confirmação no backend
- ✅ Chat em tempo real (polling 2.5s)
- ✅ Reunião via Google Meet
- ✅ Minhas sessões + Perfil com edição
- ✅ Guia de Saúde Mental (5 transtornos) + Autoavaliações (3 testes)
- ✅ 3 jogos de relaxamento + Chat de emergência (chatbot) + Botão SOS global
- ✅ Portal do Psicólogo (pacientes, consultas, financeiro, estatísticas)
- ✅ Paywall de assinatura

### Type-check
- ✅ **EXIT 0** — zero erros de compilação

---

## 🔴 O que Falta (Próximos Sprints)

### Prioridade Alta
1. **Dark Mode / Tema dinâmico** — infra existe mas está forçada ao claro; migrar telas para `useTheme()`
2. **Filtros de daltonismo + fonte dislexia** — paletas alternativas no ThemeContext + AsyncStorage

### Prioridade Média
3. **AdBanner / Premium** — banner flutuante a cada 30s, oculto para premium, limite 4 sessões/mês free
4. **Login Google em runtime** — fluxo OAuth não testado no dispositivo
5. **WebSocket STOMP para chat** — preparado mas não conectado (usa polling 2.5s)

### Prioridade Baixa
6. **Área Admin** — dashboard, usuários, sessões, configurações (normalmente só web)

---

## 📁 Estrutura de Arquivos Importantes

```
mobile/
├── src/
│   ├── theme/
│   │   ├── index.ts          → exporta colors, spacing, typography, borderRadius
│   │   ├── ThemeContext.tsx   → useTheme(), isDark, toggleTheme (FORÇADO CLARO)
│   │   ├── colors.ts          → lightColors + darkColors
│   │   ├── spacing.ts         → escala de espaçamento
│   │   └── typography.ts      → tamanhos e pesos de fonte
│   ├── navigation/
│   │   ├── RootNavigator.tsx  → alterna Auth/Main + modais globais
│   │   ├── MainTabs.tsx       → 4 abas (Home, Recursos, Chat, Perfil)
│   │   ├── HomeStack.tsx      → fluxo do paciente
│   │   ├── RecursosStack.tsx  → saúde, jogos, emergência
│   │   ├── ChatStack.tsx      → conversas + chat
│   │   └── ProfileStack.tsx   → perfil + portal psicólogo
│   ├── screens/

---

## 🧪 Como Testar

### Pagamento
1. Login como paciente → Lista de psicólogos → Detalhe → Agendar
2. Tela de Pagamento abre → preencher cartão válido → Confirmar
3. Etapa processando → sucesso → "Ver minhas sessões"
4. PIX: gerar código → copiar → confirmar (3s delay)
5. Checar log do backend: `POST /api/sessoes/{id}/confirmar-pagamento` → 200

### CRP
1. Cadastro como psicólogo → digitar CRP "123456" no blur → vermelho "Formato inválido"
2. Digitar "06/123456" → spinner → verde (ou 409 se duplicado)
3. Submit bloqueado em `invalid`/`checking`

### Recursos
1. Aba "Recursos" → 4 cards navegáveis
2. Saúde Mental → expandir cards → sintomas + tratamentos
3. Autoavaliações → responder 5 perguntas → ver resultado
4. Passatempos → 3 jogos jogáveis
5. Chat Emergência → 8 opções de apoio
6. Botão SOS (canto inferior) → popover com tel:188/192/190/193

### Portal Psicólogo
1. Login como psicólogo → Perfil → novos itens no menu
2. Pacientes → lista + chat | Consultas → próximas + reunião
3. Financeiro → seletor período + cards | Estatísticas → cards + pull-to-refresh

---

## ⚠️ Notas Técnicas

- **Backend:** rodando em `localhost:8080` (alterar em `config/environment.ts` para produção)
- **Expo SDK:** 54+
- **React Navigation:** 7.x
- **State Management:** Zustand (authStore, uiStore)
- **HTTP Client:** axios com interceptor JWT (SecureStore)
- **Notificações:** expo-notifications (permissões corrigidas no sprint 5)
- **Chat:** polling 2.5s (WebSocket STOMP preparado mas não conectado)
- **Assinatura:** RevenueCat (subscriptionService)

---

## 📝 Convenções do Projeto

- **Idioma:** português (código, comentários, UI)
- **Estilos:** `StyleSheet.create` + `React.useMemo` para temas
- **Navegação:** type-safe com `NativeStackNavigationProp`
- **API:** endpoints centralizados em `constants/api.ts` (anti-hardcode)
- **Cores:** `colors.*` do tema (nunca hardcode `#hex` exceto casos específicos como `STAR_GOLD`)
- **Espaçamento:** `spacing.*` escala (`xs`, `sm`, `md`, `base`, `lg`, `xl`, `2xl`)

---

## 🔄 Próximo Passo Imediato

**Iniciar Sprint 7 — Dark Mode:**
1. Abrir `ThemeContext.tsx` e remover o `TEMPORÁRIO` que força modo claro
2. Migrar `LoginScreen.tsx` para `useTheme()` (primeiro caso de teste)
3. Seguir para as demais telas de `auth/`, `home/`, `chat/`, etc.
4. Testar toggle em runtime

---

_Fim das notas. Retomamos daqui._ 🚀

│   │   ├── auth/              → Login, Register, ForgotPassword
│   │   ├── home/              → Home, PsicologoList, PsicologoDetail, ScheduleSession, Payment
│   │   ├── recursos/          → RecursosHub, SaudeMental, Autoavaliacoes, Passatempos, ChatEmergencia, games/
│   │   ├── psicologo/         → Pacientes, Consultas, Financeiro, Estatisticas
│   │   ├── chat/              → Conversas, Chat
│   │   ├── calls/             → Reuniao
│   │   ├── profile/           → Profile, EditProfile, ChangePassword, PsychologistSettings
│   │   ├── sessions/          → MySessions, NewSessionPsicologo
│   │   └── subscription/      → Paywall
│   ├── services/              → api.ts, authService, psicologoService, sessaoService, chatService, etc.
│   ├── hooks/                 → useAuth, useChat, useSessoes, useNotifications, usePsicologos
│   ├── components/            → EmergencyButton, Toast, Avatar, Button, Input, etc.
│   ├── store/                 → authStore, uiStore (Zustand)
│   ├── types/                 → navigation.types.ts, api.types.ts
│   └── constants/             → api.ts (endpoints)
├── app.config.ts              → config Expo (splash via plugin)
├── App.tsx                    → providers + EmergencyButton global
└── package.json
```

