/**
 * Mecanismo de dark mode dinâmico — Cedro Mobile
 *
 * O ThemeProvider resolve a paleta ativa a partir da preferência salva no
 * uiStore ('light' | 'dark' | 'system'). Com 'system', acompanha o esquema
 * de cores do sistema operacional via useColorScheme().
 */

import React, { createContext, useCallback, useContext, useMemo } from 'react';
// TEMPORÁRIO: `useColorScheme` (react-native) volta quando a lógica dinâmica
// for reativada após a migração das telas.
import { useUIStore } from '../store/uiStore';
// TEMPORÁRIO: `darkColors` volta quando a lógica dinâmica for reativada.
import { lightColors, ThemeColors } from './colors';

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
  // ================================================================
  // TEMPORÁRIO: forçado modo claro até a migração de todas as telas
  // terminar (Fases 1-4). Reativar a lógica dinâmica original depois.
  // ================================================================

  // Preferência persistida no uiStore (AsyncStorage) — mantida para que a
  // escolha do usuário continue sendo salva enquanto o tema claro é forçado.
  const themePreference = useUIStore((state) => state.theme);
  const setTheme = useUIStore((state) => state.setTheme);

  // ----------------------------------------------------------------
  // LÓGICA ORIGINAL DESATIVADA TEMPORARIAMENTE — reativar após a
  // migração completa das telas (Fases 1-4):
  //
  // // Esquema do sistema operacional (só relevante quando theme === 'system')
  // const systemColorScheme = useColorScheme();
  //
  // const isDark =
  //   themePreference === 'system'
  //     ? systemColorScheme === 'dark'
  //     : themePreference === 'dark';
  //
  // const activeColors = isDark ? darkColors : lightColors;
  // ----------------------------------------------------------------

  // TEMPORÁRIO: sempre claro, independente da preferência salva ou do sistema
  const isDark = false;
  const activeColors = lightColors;

  const setThemePreference = useCallback(
    (theme: ThemePreference) => {
      void setTheme(theme);
    },
    [setTheme],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: activeColors,
      isDark,
      themePreference,
      setThemePreference,
    }),
    [activeColors, isDark, themePreference, setThemePreference],
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
