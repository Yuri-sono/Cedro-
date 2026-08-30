CONTEXTO
Cedro Mobile. Fase 0 de uma reforma visual em várias fases. Esta fase NÃO mexe
em telas ainda — só na fundação: paleta de cores, mecanismo de dark mode, e os
componentes reutilizáveis em mobile/src/components/. Telas serão fases
seguintes.

=== PARTE 1: Reestruturar mobile/src/theme/colors.ts ===

1. Reorganize o arquivo em duas paletas paralelas, com EXATAMENTE as mesmas
   chaves nas duas (nenhuma chave só na light ou só na dark):

   export const lightColors = {
     primary: '#198754',        // alinhado ao site (cedro-colors.css)
     primaryAccent: '#20c997',  // mesmo gradiente do site (135deg #198754→#20c997)
     primaryHover: '#20c997',
     primaryDark: '#146c43',    // --cedro-dark do site
     primaryLight: '#75b798',   // --cedro-light do site
     forest: '#146c43',
     leaf: (mantenha o valor atual, não tem equivalente no site),
     mint: (mantenha o valor atual),
     cream: (mantenha o valor atual),
     sand: (mantenha o valor atual),
     gradientPrimary: ['#198754', '#20c997'],
     gradientHero: (mantenha),
     gradientCard: (mantenha),
     gradientDark: ['#146c43', '#198754'],
     background: '#ffffff',           // --bg-primary do site (theme.css)
     backgroundSecondary: '#f8f9fa',  // --bg-secondary do site
     backgroundTertiary: (mantenha o valor atual),
     surface: '#ffffff',              // --card-bg do site
     surfaceWarm: (mantenha),
     textPrimary: '#212529',          // --text-primary do site
     textSecondary: '#6c757d',        // --text-secondary do site
     textInverse: '#ffffff',
     border: '#dee2e6',               // --border-color do site
     shadow: 'rgba(0, 0, 0, 0.1)',    // --shadow do site
     success: (mantenha),
     warning: (mantenha),
     error: (mantenha),
     info: (mantenha),
     transparent: 'transparent',
     overlay: 'rgba(0, 0, 0, 0.5)',
     white: '#ffffff',
     black: '#000000',
   };

   export const darkColors = {
     // Use os valores --dark do site (theme.css) para as chaves que existem lá:
     primary: '#198754',              // mantém a cor de marca, não escurece
     primaryAccent: '#20c997',
     primaryHover: '#20c997',
     primaryDark: '#146c43',
     primaryLight: '#75b798',
     forest: '#20c997',               // mais claro no dark para contraste
     leaf: (deriva um tom compatível, documente a escolha em comentário),
     mint: (versão escura, ex: rgba(25,135,84,0.15) ou similar),
     cream: (mantenha coerente, pode usar backgroundSecondary do dark),
     sand: (versão escura correspondente),
     gradientPrimary: ['#146c43', '#198754'],
     gradientHero: (versão escura),
     gradientCard: ['#141414', '#111111'],
     gradientDark: ['#0a0a0a', '#146c43'],
     background: '#0a0a0a',              // --bg-primary dark do site
     backgroundSecondary: '#111111',     // --bg-secondary dark do site
     backgroundTertiary: (versão escura),
     surface: '#141414',                 // --card-bg dark do site
     surfaceWarm: '#141414',
     textPrimary: '#ffffff',             // --text-primary dark do site
     textSecondary: '#cccccc',           // --text-secondary dark do site
     textInverse: '#0a0a0a',
     border: '#2a2a2a',                  // --border-color dark do site
     shadow: 'rgba(0, 0, 0, 0.8)',       // --shadow dark do site
     success: (mantenha ou ajuste levemente para contraste em fundo escuro),
     warning: (idem),
     error: (idem),
     info: (idem),
     transparent: 'transparent',
     overlay: 'rgba(0, 0, 0, 0.7)',
     white: '#ffffff',
     black: '#000000',
   };

   export type ThemeColors = typeof lightColors;

   Mantenha exportado também um `colors` = lightColors (alias), para não quebrar
   nenhum import antigo que ainda não foi migrado durante a transição desta fase.

2. Documente com comentário, ao lado de cada chave "derivada" (leaf, mint,
   sand, etc. no dark), que o valor foi estimado por você por não ter
   equivalente direto no site.

=== PARTE 2: Mecanismo de dark mode dinâmico ===

1. Crie mobile/src/theme/ThemeContext.tsx:
   - ThemeProvider (componente) que:
     - Lê a preferência salva via useUIStore (theme: 'light' | 'dark' | 'system')
     - Se 'system', usa useColorScheme() do react-native para resolver
       automaticamente entre light/dark
     - Expõe via Context: { colors: ThemeColors, isDark: boolean,
       themePreference: 'light'|'dark'|'system', setThemePreference: (t) => void }
     - setThemePreference deve chamar o setTheme já existente no uiStore
   - useTheme() hook que consome esse Context (lança erro claro se usado fora
     do Provider)

2. Localize mobile/App.tsx (ou o arquivo raiz do app) e envolva a árvore com
   <ThemeProvider>, no nível mais alto possível (antes do RootNavigator).

=== PARTE 3: Migrar componentes base para o tema dinâmico ===

Para CADA componente abaixo, troque o import estático de `colors` de
'../theme' pelo hook `useTheme()`, e mova os estilos que dependem de cor para
dentro do componente (função que retorna StyleSheet.create ou objeto de estilo
computado a cada render, usando theme.colors) — mantendo estilos que NÃO
dependem de cor (padding, tamanho, border-radius) no StyleSheet estático de
fora, para não perder performance à toa:

- Button.tsx
- Input.tsx
- AuthScreenLayout.tsx
- PsicologoCard.tsx
- SessionCard.tsx
- MessageBubble.tsx
- ChatInput.tsx
- Avatar.tsx
- OfflineBanner.tsx
- ErrorBoundary.tsx
- Toast.tsx (o toastConfig pode precisar virar uma função que recebe o tema)

=== PARTE 4: Substituir emojis por ícones consistentes (Ionicons) ===

1. Input.tsx: troque 👁️/👁️‍🗨️ por Ionicons "eye"/"eye-off" (mesmo padrão do
   ChatInput.tsx que já usa Ionicons corretamente).
2. PsicologoCard.tsx: troque ⭐ por Ionicons "star" (cor amarela/dourada) e 💰
   por Ionicons "cash-outline" ou "wallet-outline" (cor do tema).
3. Faça uma busca por outros emojis usados como ícone em qualquer arquivo de
   mobile/src/screens/ e mobile/src/components/ (ex: 🗓️ mencionado na
   HomeScreen) e substitua todos por Ionicons equivalentes semanticamente,
   mantendo o texto ao lado como já está.

=== PARTE 5: Novo componente Skeleton ===

Crie mobile/src/components/Skeleton.tsx:
- Componente simples de bloco retangular com animação de pulso/shimmer
  (Animated.loop + opacity ou translateX, sem lib externa nova)
- Props: width, height, borderRadius (usando os tokens de spacing/borderRadius)
- Deve consumir useTheme() para a cor de fundo do skeleton (um tom entre
  background e border do tema atual)
- Não precisa integrar nas telas ainda — isso é trabalho da próxima fase.

=== VALIDAÇÃO ===
Rode: npx tsc --noEmit
Me mostre o resultado.

Teste manual documentado (não executar): alternar a preferência de tema no
uiStore entre 'light'/'dark'/'system' e confirmar que os componentes migrados
(Button, Input, etc.) mudam de cor corretamente sem precisar reiniciar o app.

Ao final, resumo por arquivo alterado/criado.