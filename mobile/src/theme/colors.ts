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
  // Paleta migrada para o redesign (referência: cedro-redesign.html)
  primary: '#1F4D3A', // --primary do redesign
  primaryAccent: '#2F6B4F', // --primary-light do redesign
  primaryHover: '#2F6B4F', // --primary-light do redesign
  primaryDark: '#16382A', // VALOR DERIVADO: escurecimento do --primary
  primaryLight: '#2F6B4F', // --primary-light do redesign
  forest: '#16382A', // VALOR DERIVADO: mesma família do --primary
  leaf: '#2F6B4F', // Alinhado ao --primary-light do redesign
  mint: '#E7EFE9', // --primary-tint do redesign
  cream: '#F5F2E9', // --bg do redesign
  sand: '#EFEBDD', // --surface-2 do redesign

  // ── Tons de apoio do redesign ──
  primaryTint: '#E7EFE9', // --primary-tint
  accent: '#C6952F', // --accent (dourado)
  accentTint: '#FBF1DC', // --accent-tint
  textFaint: '#A6A192', // --text-faint (placeholders)
  danger: '#A6432B', // --danger
  dangerTint: '#F5E7E2', // --danger-tint

  // ── Gradientes ──
  gradientPrimary: ['#1F4D3A', '#2F6B4F'] as Gradient, // Mesma direção do redesign
  gradientHero: ['#F5F2E9', '#F0EDE2'] as Gradient, // Fundo quente do redesign
  gradientCard: ['#FFFFFF', '#FFFFFF'] as Gradient, // Superfícies planas no redesign
  gradientDark: ['#16382A', '#1F4D3A'] as Gradient, // Derivado: versão profunda do verde de marca

  // ── Fundos ──
  background: '#F5F2E9', // --bg do redesign
  backgroundSecondary: '#EFEBDD', // --surface-2 do redesign
  backgroundTertiary: '#E7EFE9', // --primary-tint do redesign
  surface: '#FFFFFF', // --surface do redesign
  surfaceWarm: '#FFFFFF', // Superfícies planas no redesign

  // ── Textos ──
  textPrimary: '#22261F', // --text do redesign
  textSecondary: '#74705F', // --text-muted do redesign
  textInverse: '#ffffff',

  // ── Bordas & Sombras ──
  border: '#E5E0D0', // --border do redesign
  shadow: 'rgba(31, 77, 58, 0.07)', // --shadow do redesign

  // ── Status ──
  success: '#2F6B4F', // Derivado do --primary-light
  warning: '#C6952F', // --accent do redesign
  error: '#A6432B', // --danger do redesign
  info: '#2F6B4F', // Derivado do --primary-light

  // ── Utilitários ──
  transparent: 'transparent',
  overlay: 'rgba(34, 38, 31, 0.5)',
  white: '#ffffff',
  black: '#000000',
};

export const darkColors: ThemeColors = {
  // ── Verde Cedro (identidade visual) ──
  primary: '#2F6B4F', // --primary-light: verde mais claro para contraste no dark
  primaryAccent: '#3E8A68', // VALOR DERIVADO: clareamento do --primary-light
  primaryHover: '#3E8A68',
  primaryDark: '#2F6B4F',
  primaryLight: '#5FA184', // VALOR DERIVADO: clareamento do --primary-light
  forest: '#3E8A68', // VALOR DERIVADO: clareamento do --primary-light
  // VALOR DERIVADO: clareamento do leaf light para contraste sobre fundos escuros.
  leaf: '#7FAF95',
  // VALOR DERIVADO: translúcido do primary-tint light para superfícies escuras.
  mint: 'rgba(31, 77, 58, 0.35)',
  // VALOR DERIVADO: cream light mapeado para o backgroundSecondary do dark
  // (#111111), mantendo o papel de "fundo quente neutro".
  cream: '#111111',
  // VALOR DERIVADO: areia light (#E8E2D2) convertida em neutro quente escuro.
  sand: '#2A2A2A',

  // ── Tons de apoio do redesign (derivados para o dark) ──
  primaryTint: 'rgba(31, 77, 58, 0.35)', // VALOR DERIVADO
  accent: '#D9AC55', // VALOR DERIVADO: clareamento do --accent
  accentTint: 'rgba(198, 149, 47, 0.18)', // VALOR DERIVADO
  textFaint: '#8A8578', // VALOR DERIVADO: clareamento do --text-faint
  danger: '#C4614A', // VALOR DERIVADO: clareamento do --danger
  dangerTint: 'rgba(166, 67, 43, 0.20)', // VALOR DERIVADO

  // ── Gradientes ──
  gradientPrimary: ['#16382A', '#2F6B4F'], // Derivado: mesma direção, mais profunda no dark
  // VALOR DERIVADO: hero dark como variação sutil de cinzas neutros.
  gradientHero: ['#111111', '#161616'],
  gradientCard: ['#141414', '#111111'],
  gradientDark: ['#0a0a0a', '#16382A'],
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
  success: '#5FA184', // VALOR DERIVADO: verde claro para contraste no dark
  // VALOR DERIVADO: warning/error clareados levemente para contraste em fundo escuro.
  warning: '#E0A83E',
  error: '#D4725B', // VALOR DERIVADO: clareamento do --danger
  info: '#5FA184', // VALOR DERIVADO: verde claro para contraste no dark

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

