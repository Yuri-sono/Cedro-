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
import { lightColors, darkColors, applyColorMode, ThemeColors } from './colors';

export type ThemePreference = 'light' | 'dark' | 'system';

// Fonte padrão do sistema por plataforma
const FONT_SYSTEM = undefined; // deixa o RN usar o padrão nativo
export const FONT_DISLEXIA = 'Lexend_400Regular';

export interface ThemeContextValue {
  colors: ThemeColors;
  isDark: boolean;
  themePreference: ThemePreference;
  setThemePreference: (theme: ThemePreference) => void;
  colorMode: ReturnType<typeof useUIStore.getState>['colorMode'];
  setColorMode: ReturnType<typeof useUIStore.getState>['setColorMode'];
  dislexia: boolean;
  setDislexia: (enabled: boolean) => void;
  fontFamily: string | undefined;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const themePreference = useUIStore((state) => state.theme);
  const colorMode = useUIStore((state) => state.colorMode);
  const dislexia = useUIStore((state) => state.dislexia);
  const setTheme = useUIStore((state) => state.setTheme);
  const setColorMode = useUIStore((state) => state.setColorMode);
  const setDislexiaStore = useUIStore((state) => state.setDislexia);

  const systemColorScheme = useColorScheme();

  const isDark =
    themePreference === 'system'
      ? systemColorScheme === 'dark'
      : themePreference === 'dark';

  const activeColors = applyColorMode(isDark ? darkColors : lightColors, colorMode);

  const fontFamily = dislexia ? FONT_DISLEXIA : FONT_SYSTEM;

  const setThemePreference = useCallback(
    (theme: ThemePreference) => { void setTheme(theme); },
    [setTheme],
  );

  const setDislexia = useCallback(
    (enabled: boolean) => { void setDislexiaStore(enabled); },
    [setDislexiaStore],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: activeColors,
      isDark,
      themePreference,
      setThemePreference,
      colorMode,
      setColorMode,
      dislexia,
      setDislexia,
      fontFamily,
    }),
    [activeColors, isDark, themePreference, setThemePreference, colorMode, setColorMode, dislexia, setDislexia, fontFamily],
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
