/**
 * Theme centralizado — Cedro Mobile
 * Exporta todos os design tokens em um único ponto de acesso.
 */

export { colors, lightColors, darkColors } from './colors';
export { typography } from './typography';
export { spacing, borderRadius } from './spacing';

export type { Colors, ThemeColors } from './colors';
export type { Typography } from './typography';
export type { Spacing, BorderRadius } from './spacing';
export { ThemeProvider, useTheme, ThemeContext } from './ThemeContext';
export type { ThemePreference, ThemeContextValue } from './ThemeContext';

