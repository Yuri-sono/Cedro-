/**
 * Mecanismo de dark mode dinâmico — Cedro Mobile
 *
 * O ThemeProvider resolve a paleta ativa a partir da preferência salva no
 * uiStore ('light' | 'dark' | 'system'). Com 'system', acompanha o esquema
 * de cores do sistema operacional via useColorScheme().
 */

import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useUIStore } from '../store/uiStore';
import { darkColors, lightColors, ThemeColors } from './colors';

export type ThemePreference = 'light' | 'dark' | 'system';

export interface ThemeContextValue {
  colors: ThemeColors;
  isDark: boolean;
  themePreference: ThemePreference;
  setThemePreference: (theme: ThemePreference) => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Preferência persistida no uiStore (AsyncStorage)
  const themePreference = useUIStore((state) => state.theme);
  const setTheme = useUIStore((state) => state.setTheme);

  // Esquema do sistema operacional (só relevante quando theme === 'system')
  const systemColorScheme = useColorScheme();

  const isDark =
    themePreference === 'system'
      ? systemColorScheme === 'dark'
      : themePreference === 'dark';

  const setThemePreference = useCallback(
    (theme: ThemePreference) => {
      void setTheme(theme);
    },
    [setTheme],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: isDark ? darkColors : lightColors,
      isDark,
      themePreference,
      setThemePreference,
    }),
    [isDark, themePreference, setThemePreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * Hook para consumir o tema ativo. Lança erro claro se usado fora do
 * <ThemeProvider>, ajudando a pegar erros de composição cedo.
 */
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error(
      'useTheme deve ser usado dentro de um <ThemeProvider>. ' +
        'Verifique se o ThemeProvider está no nível mais alto da árvore (App.tsx).',
    );
  }
  return context;
};
