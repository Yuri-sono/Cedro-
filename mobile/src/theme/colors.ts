/**
 * Design tokens de cores — Cedro Mobile
 * Baseado na paleta do frontend web (cedro-colors.css + theme.css)
 */

export const colors = {
  // ── Verde Cedro (identidade visual) ──
  primary: '#198754',
  primaryAccent: '#20c997',
  primaryHover: '#20c997',
  primaryDark: '#146c43',
  primaryLight: '#75b798',

  // ── Fundos ──
  background: '#FFFFFF',
  backgroundSecondary: '#F8F9FA',
  backgroundTertiary: '#EEF3F0',
  surface: '#FFFFFF',

  // ── Textos ──
  textPrimary: '#212529',
  textSecondary: '#6C757D',
  textInverse: '#FFFFFF',

  // ── Bordas & Sombras ──
  border: '#DEE2E6',
  shadow: 'rgba(0, 0, 0, 0.1)',

  // ── Status ──
  success: '#198754',
  warning: '#FFC107',
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
