# Prompt de implementação — Redesign do app mobile Cedro Plus

> Cole este arquivo inteiro como prompt para a IA do seu editor (Claude Code / Copilot / Cursor).
> Contexto do projeto: app mobile em **React Native (Expo SDK)**, com **Zustand + TanStack Query**,
> `expo-secure-store` para tokens, e telas de paciente (Home, Chat, Perfil, Editar Perfil, Assinatura
> Premium, Alterar Senha).

---

## Como usar este documento

Os trechos de código abaixo estão em **HTML/CSS puro**, não em JSX. Eles servem só como
**referência visual do resultado esperado** (cores exatas, espaçamento, hierarquia, estrutura),
porque eu não tenho como te mostrar prints — só código. Sua tarefa é:

1. Abrir o componente React Native correspondente a cada tela (provavelmente em
   `mobile/src/screens/` ou `mobile/app/(tabs)/`).
2. Aplicar a mudança usando os padrões já existentes no projeto (StyleSheet.create,
   styled-components, NativeWind/Tailwind — use o que já estiver em uso, não introduza uma
   biblioteca de estilo nova).
3. Usar `@expo/vector-icons` (Feather ou Ionicons, o que já estiver instalado) para os ícones —
   **não usar emoji como ícone de UI** em nenhuma tela. Emoji só é aceitável dentro de texto de
   conteúdo (ex: mensagem do usuário), nunca em botão, nav bar ou label.
4. Um arquivo `cedro-redesign.html` foi anexado/está na pasta do projeto com as 6 telas completas
   renderizadas — abra ele no navegador para ver o resultado visual antes de implementar.

Design tokens (usar em todo o app, criar um `theme.js`/`theme.ts` centralizado se ainda não existir):

```js
export const theme = {
  colors: {
    bg: '#F5F2E9',
    surface: '#FFFFFF',
    surfaceAlt: '#EFEBDD',
    primary: '#1F4D3A',
    primaryLight: '#2F6B4F',
    primaryTint: '#E7EFE9',
    accent: '#C6952F',
    accentTint: '#FBF1DC',
    text: '#22261F',
    textMuted: '#74705F',
    textFaint: '#A6A192',
    border: '#E5E0D0',
    danger: '#A6432B',
    dangerTint: '#F5E7E2',
  },
  radius: { lg: 20, md: 14, sm: 10 },
};
```

Se o projeto já tiver um sistema de cores diferente, **não crie um segundo sistema em paralelo** —
migre os valores existentes para bater com esses, ou ajuste os tokens acima para reaproveitar o
que já existe (ex: se `--primary` já é outro verde, mantenha o valor atual do projeto).

---

## 1. [BUG] Lógica invertida na tela de Assinatura Premium — prioridade alta

**Problema:** o card mostra "Sua cota mensal atingiu o limite: **0/4**", o que é contraditório —
0/4 dá a entender que zero foi usado. Provavelmente a variável de contagem está invertida, ou o
texto foi escrito errado.

**O que fazer:**
- Encontre o componente/tela de Assinatura (provavelmente `PremiumScreen.js` ou similar) e a
  variável que guarda a contagem de reuniões usadas (algo como `reunioesGratuitasUsadas` ou
  `freeMeetingsRemaining`).
- Confirme qual é a semântica real vinda do backend: é "usadas" ou "restantes"? Ajuste o texto
  para bater com o valor, e troque a fração ambígua por uma barra de progresso + frase explícita.
- Adicione a data de renovação da cota, se o backend já expuser essa informação (ou pelo menos um
  texto genérico como "renova todo mês").

Referência visual (o que a fração deveria comunicar quando a cota está esgotada):

```html
<div class="quota-card">
  <div class="top">
    <span class="t1">Reuniões gratuitas este mês</span>
    <span class="t2">4 de 4 usadas</span>
  </div>
  <div class="quota-bar"><div class="fill" style="width:100%"></div></div>
  <div class="quota-note">Sua cota renova em 12 dias · assine para reuniões ilimitadas</div>
</div>

<style>
.quota-card{ background:#FBF1DC; border:1px solid #EAD8A6; border-radius:20px; padding:16px; }
.quota-card .top{ display:flex; justify-content:space-between; margin-bottom:10px; }
.quota-card .top .t1{ font-size:13px; font-weight:700; color:#8A6A1F; }
.quota-card .top .t2{ font-size:12px; color:#8A6A1F; opacity:.85; }
.quota-bar{ height:8px; border-radius:999px; background:#EFE0BB; overflow:hidden; margin-bottom:8px; }
.quota-bar .fill{ height:100%; background:#C6952F; border-radius:999px; }
.quota-note{ font-size:11.5px; color:#8A6A1F; opacity:.8; }
</style>
```

---

## 2. [BUG] Tela Premium trava em "Carregando ofertas..." — prioridade alta

**Problema:** a lista de planos nunca renderiza; ou a chamada de API não resolve, ou não existe
tratamento de erro/timeout, deixando o spinner infinito.

**O que fazer:**
- Localize a chamada (TanStack Query `useQuery`) que busca os planos/ofertas.
- Adicione tratamento explícito para os três estados: `isLoading`, `isError`, `data`. Hoje parece
  que só existe o estado de loading.
- Se a integração de pagamento ainda não estiver pronta no backend, mostre planos com preços fixos
  (mock) até a API existir, em vez de deixar o spinner girando pra sempre — isso é pior para o
  usuário do que um preço estático.

Referência visual dos cards de plano (estado final, sem loading):

```html
<div class="plan-card featured">
  <span class="plan-tag">Mais popular</span>
  <div>
    <div class="name">Plano Anual</div>
    <div class="price">R$ 20,80/mês · cobrado anualmente</div>
  </div>
  <button class="btn-primary">Assinar</button>
</div>
<div class="plan-card">
  <div>
    <div class="name">Plano Mensal</div>
    <div class="price">R$ 29,90/mês</div>
  </div>
  <button class="btn-outline">Assinar</button>
</div>

<style>
.plan-card{ border:1.5px solid #E5E0D0; border-radius:20px; padding:16px; margin-bottom:12px;
  display:flex; align-items:center; justify-content:space-between; position:relative; }
.plan-card.featured{ border-color:#1F4D3A; background:#E7EFE9; }
.plan-card .name{ font-size:14px; font-weight:700; }
.plan-card .price{ font-size:12.5px; color:#74705F; margin-top:2px; }
.plan-tag{ position:absolute; top:-10px; left:16px; background:#1F4D3A; color:#fff;
  font-size:10px; font-weight:700; padding:3px 10px; border-radius:999px; }
.btn-primary{ background:#1F4D3A; color:#fff; font-weight:600; font-size:13.5px;
  padding:11px 20px; border-radius:999px; border:none; }
.btn-outline{ background:transparent; color:#1F4D3A; font-weight:600; font-size:13.5px;
  padding:11px 20px; border-radius:999px; border:1.5px solid #1F4D3A; }
</style>
```

---

## 3. [ACESSIBILIDADE] Contraste de texto preenchido vs. placeholder nos formulários

**Telas afetadas:** Editar Perfil, Alterar Senha.

**Problema:** o texto já digitado (ex: "marcos" no campo Nome) usa a mesma cor clara do
placeholder dos campos vazios (Telefone, Data de nascimento). O usuário não distingue o que já
preencheu do que falta.

**O que fazer:**
- No `TextInput`, garanta que `color` (texto digitado) use a cor de texto forte
  (`theme.colors.text`, `#22261F`) com `fontWeight: '600'`.
- `placeholderTextColor` deve ser bem mais claro (`theme.colors.textFaint`, `#A6A192`) e sem peso
  extra — a diferença visual entre os dois estados precisa ser óbvia à distância.

Referência visual (campo preenchido vs. campo vazio lado a lado):

```html
<div class="field-group">
  <label class="field-label">Nome completo</label>
  <div class="field-input">Marcos</div>
</div>
<div class="field-group">
  <label class="field-label">Telefone</label>
  <div class="field-input empty">(11) 99999-9999</div>
</div>

<style>
.field-label{ font-size:12px; font-weight:700; color:#74705F; margin-bottom:6px; display:block; }
.field-input{ width:100%; padding:13px 14px; border-radius:10px; border:1.5px solid #E5E0D0;
  background:#fff; font-size:14px; color:#22261F; font-weight:600; }
.field-input.empty{ color:#A6A192; font-weight:400; } /* placeholder */
</style>
```

Equivalente em RN:

```jsx
<TextInput
  style={styles.input}
  value={nomeCompleto}
  placeholder="Nome completo"
  placeholderTextColor={theme.colors.textFaint}
/>

const styles = StyleSheet.create({
  input: {
    padding: 13,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text, // cor do texto digitado, não do placeholder
  },
});
```

---

## 4. [CORREÇÃO DE TEXTO] Acentuação faltando no chat/dados de demo

**Problema:** "CEDRO APOIO PSICOLOGICO E SAUDE" e "Conversa de demonstracao pronta para a
apresentacao" aparecem sem acento, enquanto o resto do app usa acentuação correta.

**O que fazer:**
- Se esse texto vem de um seed SQL (`dados_demo_apresentacao.sql`, mencionado no README), corrija
  a string lá, com os acentos: "CEDRO APOIO PSICOLÓGICO E SAÚDE" e "Conversa de demonstração
  pronta para a apresentação."
- Se o texto está hardcoded em algum componente do mobile, corrija ali também.
- Rode uma busca no repositório (`grep -rn "psicologico\|demonstracao\|apresentacao" .`) para
  achar outras ocorrências sem acento e revisar se é um problema de encoding maior (verifique se
  os arquivos SQL/JS estão salvos como UTF-8).

---

## 5. Header duplicado na Home

**Problema:** a logo da árvore aparece dos dois lados do header. Trocar o lado direito por um
ícone de notificações (ou avatar do usuário).

```html
<div class="app-header">
  <div class="brand">
    <div class="brand-logo"><!-- ícone tree, Feather/Ionicons --></div>
    <div>
      <div class="brand-name">Cedro</div>
      <div class="brand-tag">Apoio psicológico</div>
    </div>
  </div>
  <div class="icon-btn"><!-- ícone bell --><span class="dot"></span></div>
</div>

<style>
.app-header{ display:flex; align-items:center; justify-content:space-between; padding:8px 18px 14px; }
.brand{ display:flex; align-items:center; gap:10px; }
.brand-logo{ width:36px; height:36px; border-radius:50%; background:#E7EFE9;
  display:flex; align-items:center; justify-content:center; }
.brand-name{ font-size:15px; font-weight:700; color:#1F4D3A; }
.brand-tag{ font-size:11px; color:#74705F; }
.icon-btn{ width:36px; height:36px; border-radius:50%; background:#fff; border:1px solid #E5E0D0;
  display:flex; align-items:center; justify-content:center; color:#1F4D3A; position:relative; }
.icon-btn .dot{ position:absolute; top:7px; right:7px; width:7px; height:7px; border-radius:50%;
  background:#C6952F; border:1.5px solid #fff; }
</style>
```

Use o `<Feather name="bell" size={17} />` (ou equivalente) no lugar do ícone; o `dot` (badge de
notificação) só aparece condicionalmente, quando existir notificação não lida.

---

## 6. Sistema de ícones consistente

**Problema:** ícones de seção usam emoji (📅⭐🌿📱) enquanto a bottom nav usa ícones de linha. Isso
quebra a consistência visual.

**O que fazer:**
- Escolha **uma** biblioteca de ícones já disponível no Expo (`@expo/vector-icons`, geralmente
  `Feather` ou `Ionicons`) e use só ela em toda a UI de sistema (headers de seção, cards, nav,
  botões). Não misture emoji com ícones de linha.
- Emoji pode continuar existindo dentro de **conteúdo textual** (ex: uma mensagem de chat
  digitada pelo usuário), mas nunca como elemento de interface.
- Sugestão de mapeamento:
  - 📅 → `calendar`
  - ⭐ → `star`
  - 🌿 → `leaf` (usado só no eyebrow "Bem-estar hoje")
  - 📱 → `smartphone` ou `users` (para "Grupo da instituição")

---

## 7. Nome do usuário sem capitalização

**Problema:** "marcos" aparece em minúsculo na Home, Perfil e Editar Perfil.

**O que fazer:** normalize a exibição (não o dado salvo) com uma função utilitária, por exemplo:

```js
export function capitalizeName(name) {
  return name
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
```

Aplique essa função em todo lugar onde o nome é exibido (`Olá, {capitalizeName(user.nome)}`,
tela de Perfil, etc.), sem alterar o valor armazenado no banco.

---

## 8. Botão "Sair da conta" com borda vermelha

**Problema:** vermelho sinaliza ação destrutiva/perigosa, mas logout não apaga nada — é uma ação
neutra. Reserve vermelho para ações realmente destrutivas (ex: excluir conta, se existir).

```html
<button class="logout-btn"><!-- ícone log-out --> Sair da conta</button>

<style>
.logout-btn{ width:100%; background:transparent; border:1.5px solid #E5E0D0; color:#22261F;
  font-weight:600; font-size:13.5px; padding:13px; border-radius:999px;
  display:flex; align-items:center; justify-content:center; gap:8px; }
</style>
```

---

## 9. Estados vazios mais úteis

**Chat:** depois da única conversa, sobra bastante espaço em branco. Adicione uma sugestão
para encontrar mais psicólogos:

```html
<div class="chat-empty-suggest">
  <div class="ic"><!-- ícone search --></div>
  <p>Suas conversas com outros psicólogos vão aparecer aqui.<br>Que tal encontrar mais um especialista?</p>
  <button class="btn-outline">Encontrar um psicólogo</button>
</div>

<style>
.chat-empty-suggest{ margin:24px 18px 0; text-align:center; padding:28px 20px;
  border:1.5px dashed #E5E0D0; border-radius:20px; }
.chat-empty-suggest .ic{ color:#A6A192; margin-bottom:10px; }
.chat-empty-suggest p{ font-size:13px; color:#74705F; margin-bottom:14px; line-height:1.5; }
</style>
```

**Próxima sessão:** já existe um bom texto ("Você não tem consultas agendadas"), só adicione um
ícone circular acima do texto (ver mockup, seção Home) em vez de deixar só texto + link.

---

## 10. Botão "Alterar Senha" com estado desabilitado ambíguo

**Problema:** o botão aparece sempre cinza-esmaecido, mesmo quando os campos podem estar
preenchidos — não fica claro se é um estado ativo ou desabilitado.

**O que fazer:** diferencie visualmente os dois estados com base na validação real do form
(todos os campos preenchidos + senha nova == confirmação):

```jsx
<TouchableOpacity
  style={[styles.btnPrimary, !isFormValid && styles.btnDisabled]}
  disabled={!isFormValid}
>
  <Text style={!isFormValid ? styles.btnDisabledText : styles.btnPrimaryText}>
    Alterar senha
  </Text>
</TouchableOpacity>
```

```css
.btn-primary{ background:#1F4D3A; color:#fff; } /* habilitado */
.btn-disabled{ background:#EFEBDD; color:#A6A192; border:1px solid #E5E0D0; } /* desabilitado */
```

Opcional: adicione um indicador simples de força de senha (3-4 barras que preenchem conforme a
senha digitada atende critérios de tamanho/variedade), como no mockup anexado.

---

## Ordem de implementação sugerida

1. Itens 1 e 2 (bugs da tela Premium) — afetam confiança e funcionalidade real.
2. Item 3 (contraste dos formulários) — acessibilidade.
3. Item 4 (acentuação) — rápido, baixo risco.
4. Itens 5, 6, 7, 8, 9, 10 — polimento visual, podem ser feitos em qualquer ordem.

Ao final, comparar cada tela com `cedro-redesign.html` (abrir no navegador, alternar pelas abas no
topo) para conferir se o resultado bate com a referência.
