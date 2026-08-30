/**
 * Design tokens de cores — Cedro Mobile
 *
 * Fase 0 da reforma visual: duas paletas paralelas (light/dark) com EXATAMENTE
 * as mesmas chaves, alinhadas ao frontend web (cedro-colors.css + theme.css).
 *
 * Convenção de comentários:
 * - "Alinhado ao site": valor copiado do frontend web.
 * - "VALOR DERIVADO": valor estimado sem equivalente direto no site.
 */

/** Gradientes são tuplas readonly para compatibilidade com expo-linear-gradient. */
export type Gradient = readonly [string, string];

export const lightColors = {
  // ── Verde Cedro (identidade visual) ──
  primary: '#198754', // Alinhado ao site (cedro-colors.css)
  primaryAccent: '#20c997', // Mesmo gradiente do site (135deg #198754 → #20c997)
  primaryHover: '#20c997', // Alinhado ao site
  primaryDark: '#146c43', // --cedro-dark do site
  primaryLight: '#75b798', // --cedro-light do site
  forest: '#146c43', // --cedro-dark do site
  leaf: '#A6B96F', // Mantido do mobile atual (sem equivalente no site)
  mint: '#E7F2EC', // Mantido do mobile atual (sem equivalente no site)
  cream: '#F5F7F1', // Mantido do mobile atual (sem equivalente no site)
  sand: '#E8E2D2', // Mantido do mobile atual (sem equivalente no site)

  // ── Gradientes ──
  gradientPrimary: ['#198754', '#20c997'] as Gradient, // Mesmo gradiente do site (135deg)
  gradientHero: ['#F5F7F1', '#E7F2EC'] as Gradient, // Mantido do mobile atual
  gradientCard: ['#FFFFFF', '#FFFDF8'] as Gradient, // Mantido do mobile atual
  gradientDark: ['#146c43', '#198754'] as Gradient, // Derivado: versão profunda do verde de marca

  // ── Fundos ──
  background: '#ffffff', // --bg-primary do site (theme.css)
  backgroundSecondary: '#f8f9fa', // --bg-secondary do site
  backgroundTertiary: '#E2EFE8', // Mantido do mobile atual (sem equivalente no site)
  surface: '#ffffff', // --card-bg do site
  surfaceWarm: '#FFFDF8', // Mantido do mobile atual (sem equivalente no site)

  // ── Textos ──
  textPrimary: '#212529', // --text-primary do site
  textSecondary: '#6c757d', // --text-secondary do site
  textInverse: '#ffffff',

  // ── Bordas & Sombras ──
  border: '#dee2e6', // --border-color do site
  shadow: 'rgba(0, 0, 0, 0.1)', // --shadow do site

  // ── Status ──
  success: '#198754', // Mantido do mobile atual
  warning: '#B9852B', // Mantido do mobile atual
  error: '#DC3545', // Mantido do mobile atual
  info: '#0DCAF0', // Mantido do mobile atual

  // ── Utilitários ──
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
  white: '#ffffff',
  black: '#000000',
};

export const darkColors: ThemeColors = {
  // ── Verde Cedro (identidade visual) ──
  primary: '#198754', // Mantém a cor de marca, não escurece
  primaryAccent: '#20c997',
  primaryHover: '#20c997',
  primaryDark: '#146c43',
  primaryLight: '#75b798',
  forest: '#20c997', // Mais claro no dark para garantir contraste
  // VALOR DERIVADO: tom do leaf light (#A6B96F) clareado (~+25% luminosidade)
  // para manter contraste sobre fundos escuros. Não existe no site.
  leaf: '#C9DA8F',
  // VALOR DERIVADO: equivalente translúcido do mint light (#E7F2EC),
  // no padrão rgba(25, 135, 84, 0.15) sugerido para superfícies escuras.
  mint: 'rgba(25, 135, 84, 0.15)',
  // VALOR DERIVADO: cream light mapeado para o backgroundSecondary do dark
  // (#111111), mantendo o papel de "fundo quente neutro".
  cream: '#111111',
  // VALOR DERIVADO: areia light (#E8E2D2) convertida em neutro quente escuro.
  sand: '#2A2A2A',

  // ── Gradientes ──
  gradientPrimary: ['#146c43', '#198754'], // Derivado: mesma direção, mais profunda no dark
  // VALOR DERIVADO: hero dark como variação sutil de cinzas neutros.
  gradientHero: ['#111111', '#161616'],
  gradientCard: ['#141414', '#111111'],
  gradientDark: ['#0a0a0a', '#146c43'],
  // ── Fundos ──
  background: '#0a0a0a', // --bg-primary dark do site
  backgroundSecondary: '#111111', // --bg-secondary dark do site
  // VALOR DERIVADO: nível intermediário entre background (#0a0a0a) e surface (#141414).
  backgroundTertiary: '#1A1A1A',
  surface: '#141414', // --card-bg dark do site
  surfaceWarm: '#141414', // VALOR DERIVADO: sem "quente" no dark, segue o surface

  // ── Textos ──
  textPrimary: '#ffffff', // --text-primary dark do site
  textSecondary: '#cccccc', // --text-secondary dark do site
  textInverse: '#0a0a0a',

  // ── Bordas & Sombras ──
  border: '#2a2a2a', // --border-color dark do site
  shadow: 'rgba(0, 0, 0, 0.8)', // --shadow dark do site

  // ── Status ──
  success: '#198754', // Mantido (cor de marca, funciona no dark)
  // VALOR DERIVADO: warning/error clareados levemente para contraste em fundo escuro.
  warning: '#E0A83E',
  error: '#E4545F',
  info: '#0DCAF0', // Mantido (já claro o suficiente)

  // ── Utilitários ──
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.7)',
  white: '#ffffff',
  black: '#000000',
};

/** Tipo canônico das cores do tema (as duas paletas têm as mesmas chaves). */
export type ThemeColors = typeof lightColors;

/**
 * Alias legado: `colors` aponta para a paleta light durante a transição
 * desta fase, para não quebrar imports antigos ainda não migrados para
 * o hook `useTheme()`. Preferir `useTheme().colors` em código novo.
 */
export const colors = lightColors;

/** Alias legado do tipo. */
export type Colors = ThemeColors;

