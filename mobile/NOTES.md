# 📋 Notas de Progresso — Cedro Mobile

> **Última atualização:** 01/09/2026  
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

### Sprint 7 — Dark Mode (REVISÃO 08/2026) ✅
- **`ThemeContext.tsx`** → lógica dinâmica **REATIVADA** (light/dark/system via `useColorScheme` + uiStore/AsyncStorage)
- **`AppearanceScreen.tsx`** (novo) → UI de Aparência: Claro/Escuro/Sistema com check no selecionado, persistência automática
- **`ProfileStack.tsx`** → rota `Appearance` registrada
- **`ProfileScreen.tsx`** → item de menu "Aparência" (visível para todos, antes de Alterar Senha)
- **Hexes hardcoded corrigidos** → `#E6DDC8`/`#E7DCC6` → `colors.border` (Register, Profile, PsychologistSettings), gradientes `#FFFFFF` → `colors.surface` (Home), dourados Paywall → `colors.accentTint`/`colors.textPrimary`
- **Intencionais mantidos**: `STAR_GOLD` (#C6952F/#FFC107), ReuniaoScreen (`#0F1412`/`#17211D` — sala de reunião sempre escura)

> **Nota:** A migração das 30 telas para `useTheme()` + `createStyles(colors)` já estava commitada (commit `058b073`). Este sprint destravou a lógica dinâmica e criou a UI de alternância.

### Sprint 8 — Filtros de Daltonismo (REVISÃO 08/2026) ✅
- **`colors.ts`** → tipo `ColorMode` (`padrao|protanopia|deuteranopia|tritanopia`), paletas `PROTANOPIA`/`DEUTERANOPIA`/`TRITANOPIA` (espelho do theme.css do web) e função `applyColorMode(base, mode)`
  - Protanopia: primário/sucesso → azul `#0066cc`, erro → laranja `#ff8800`
  - Deuteranopia: primário/sucesso → azul `#0073e6`, erro → amarelo `#ffaa00`
  - Tritanopia: primário/erro → magenta `#cc0066`, sucesso → ciano `#00cccc`
- **`uiStore.ts`** → `colorMode` + `setColorMode` persistidos no AsyncStorage (`cedro_color_mode`); `loadPreferences` carrega ambos
- **`ThemeContext.tsx`** → `activeColors = applyColorMode(isDark ? darkColors : lightColors, colorMode)`; Context expõe `colorMode`/`setColorMode`
- **`AppearanceScreen.tsx`** → seção "Modo de cor (daltonismo)" com 4 opções + swatches de cores (como o PersonalizacaoMenu do web)
- **`theme/index.ts`** → exporta `ColorMode` e `applyColorMode`
- Composição: **tema (light/dark) × modo de cor** funcionam juntos — o filtro é aplicado sobre a paleta dark ou light

### Sprint 9 — Correções de Consistência do NOTES.md + Integrações Pendentes ✅
- **`App.tsx`** → `<AdBanner />` montado globalmente (entre `<RootNavigator />` e `<EmergencyButton />`); o componente já existia mas não estava sendo renderizado
- **`useChat.ts`** → WebSocket STOMP conectado via `chatService.connect()` no primeiro mount autenticado; listener `addMessageListener` injeta mensagens em tempo real; polling 2.5s mantido como fallback
- **`NOTES.md`** → sincronizado com a realidade: pendentes 1–2 (Dark Mode/Daltonismo) movidos para concluídos, AdBanner e STOMP marcados como feitos, "Próximo Passo" atualizado para Sprint 9 (fonte dislexia)

### Sprint 10 — Fonte Dislexia (Lexend) ✅
- **`package.json`** → `@expo-google-fonts/lexend` instalado (`Lexend_400Regular`, `Lexend_600SemiBold`, `Lexend_700Bold`)
- **`App.tsx`** → `useFonts` carrega as 3 variações da Lexend; splash mantido até `fontsLoaded && isReady`
- **`uiStore.ts`** → `dislexia: boolean` + `setDislexia(enabled)` persistidos no AsyncStorage (`cedro_dislexia`); `loadPreferences` usa `Promise.all` para carregar os 3 valores em paralelo
- **`ThemeContext.tsx`** → lê `dislexia` do uiStore; expõe `dislexia`, `setDislexia` e `fontFamily` (`'Lexend_400Regular'` quando ativo, `undefined` caso contrário); exporta constante `FONT_DISLEXIA`
- **`theme/index.ts`** → exporta `FONT_DISLEXIA`
- **`AppearanceScreen.tsx`** → seção "Fonte para dislexia" com `Switch` (antes dos filtros de daltonismo); usa `trackColor`/`thumbColor` do tema
- **`AdBanner.tsx`** → corrigidos 3 bugs de tipo pré-existentes: ícone `heart-pulse` → `fitness`, `as never` duplo → `as any`, array `ADS` tipado com `as const`; type-check: ✅ EXIT 0

### Sprint 11 — Login Google em runtime ✅
- **`LoginScreen.tsx`** → fluxo OAuth corrigido:
  - Removidos `androidClientId`/`iosClientId` duplicados (causavam conflito com o Web Client ID)
  - Removido `useProxy` (API removida no `expo-auth-session` 7.x)
  - `redirectUri` via `makeRedirectUri()` resolvido automaticamente — no web gera `http://localhost:8081`, no nativo usa o scheme do app
  - Botão "Entrar com Google" ocultado quando `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` não está configurado
  - Handler de `response` simplificado com `??` (cobre `authentication.idToken` e `params.id_token`)
- **`.env.development`** → `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` já configurado com o Client ID real
- **Pré-requisito no Google Cloud Console** (verificar antes de testar em dispositivo):
  - Adicionar `http://localhost:8081` como **Authorized JavaScript origin**
  - Adicionar `http://localhost:8081` como **Authorized redirect URI**


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
- ✅ Chat em tempo real (polling 2.5s + **WebSocket STOMP conectado**)
- ✅ Reunião via Google Meet
- ✅ Minhas sessões + Perfil com edição
- ✅ Guia de Saúde Mental (5 transtornos) + Autoavaliações (3 testes)
- ✅ 3 jogos de relaxamento + Chat de emergência (chatbot) + Botão SOS global
- ✅ Portal do Psicólogo (pacientes, consultas, financeiro, estatísticas)
- ✅ Paywall de assinatura
- ✅ **Dark Mode / Tema dinâmico** (light/dark/system + persistência AsyncStorage)
- ✅ **Filtros de daltonismo** (protanopia, deuteranopia, tritanopia) + UI em AppearanceScreen
- ✅ **AdBanner** (flutuante a cada 30s, oculto para premium, montado globalmente no App.tsx)
- ✅ **Fonte Lexend para dislexia** (toggle em AppearanceScreen, persistido, `fontFamily` exposto pelo ThemeContext)
- ✅ **Login Google** (fluxo OAuth corrigido, `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` configurado)

### Type-check
- ✅ **EXIT 0** — zero erros de compilação

---

## 🔴 O que Falta (Próximos Sprints)

### Prioridade Alta
_(sem pendências)_

### Prioridade Baixa
1. **Testes em dispositivo físico** — Login Google requer dispositivo real ou emulador com Play Services; verificar URIs no Google Cloud Console

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
- **Chat:** polling 2.5s + WebSocket STOMP conectado (fallback automático)
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

**Sem sprints pendentes.** Todas as funcionalidades planejadas estão implementadas.
Próximos passos são operações de infraestrutura:
1. Verificar URIs autorizados no Google Cloud Console (ver Sprint 11)
2. Testar login Google em dispositivo físico com `npx expo start`
3. Configurar variáveis no EAS Console para build de produção

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

