/**
 * Design tokens de cores — Cedro Mobile
 * Baseado na paleta do frontend web (cedro-colors.css + theme.css)
 */

export const colors = {
  // ── Verde Cedro (identidade visual) ──
  primary: '#24745B',
  primaryAccent: '#5FB89A',
  primaryHover: '#2F8E70',
  primaryDark: '#173B2F',
  primaryLight: '#A8D6C5',
  forest: '#173B2F',
  leaf: '#A6B96F',
  mint: '#E7F2EC',
  cream: '#F5F7F1',
  sand: '#E8E2D2',

  // ── Fundos ──
  background: '#FAFBF7',
  backgroundSecondary: '#EEF3EB',
  backgroundTertiary: '#E2EFE8',
  surface: '#FFFFFF',
  surfaceWarm: '#FFFDF8',

  // ── Textos ──
  textPrimary: '#18241F',
  textSecondary: '#657268',
  textInverse: '#FFFFFF',

  // ── Bordas & Sombras ──
  border: '#DDE5DD',
  shadow: 'rgba(23, 59, 47, 0.12)',

  // ── Status ──
  success: '#198754',
  warning: '#B9852B',
  error: '#DC3545',
  info: '#0DCAF0',

  // ── Dark Mode ──
  dark: {
    background: '#0A0A0A',
    backgroundSecondary: '#111111',
    surface: '#141414',
    textPrimary: '#FFFFFF',
    textSecondary: '#CCCCCC',
    border: '#2A2A2A',
    shadow: 'rgba(0, 0, 0, 0.8)',
    navbarBg: '#0A3D1F',
    inputBg: '#1A1A1A',
    inputBorder: '#333333',
  },

  // ── Utilitários ──
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type Colors = typeof colors;
