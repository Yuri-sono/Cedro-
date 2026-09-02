import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = 'cedro_theme_preference';
const COLOR_MODE_STORAGE_KEY = 'cedro_color_mode';
const DISLEXIA_STORAGE_KEY = 'cedro_dislexia';

type ThemeMode = 'light' | 'dark' | 'system';
export type ColorMode = 'padrao' | 'protanopia' | 'deuteranopia' | 'tritanopia';

interface UIState {
  theme: ThemeMode;
  colorMode: ColorMode;
  dislexia: boolean;
  isOffline: boolean;

  setTheme: (theme: ThemeMode) => Promise<void>;
  setColorMode: (mode: ColorMode) => Promise<void>;
  setDislexia: (enabled: boolean) => Promise<void>;
  setOffline: (isOffline: boolean) => void;
  loadPreferences: () => Promise<void>;
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'system',
  colorMode: 'padrao',
  dislexia: false,
  isOffline: false,

  setTheme: async (theme) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
      set({ theme });
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  },

  setColorMode: async (mode) => {
    try {
      await AsyncStorage.setItem(COLOR_MODE_STORAGE_KEY, mode);
      set({ colorMode: mode });
    } catch (error) {
      console.error('Erro ao salvar modo de cor:', error);
    }
  },

  setDislexia: async (enabled) => {
    try {
      await AsyncStorage.setItem(DISLEXIA_STORAGE_KEY, enabled ? '1' : '0');
      set({ dislexia: enabled });
    } catch (error) {
      console.error('Erro ao salvar preferência de dislexia:', error);
    }
  },

  setOffline: (isOffline) => {
    set({ isOffline });
  },

  loadPreferences: async () => {
    try {
      const [savedTheme, savedColorMode, savedDislexia] = await Promise.all([
        AsyncStorage.getItem(THEME_STORAGE_KEY),
        AsyncStorage.getItem(COLOR_MODE_STORAGE_KEY),
        AsyncStorage.getItem(DISLEXIA_STORAGE_KEY),
      ]);
      set({
        ...(savedTheme ? { theme: savedTheme as ThemeMode } : {}),
        ...(savedColorMode ? { colorMode: savedColorMode as ColorMode } : {}),
        ...(savedDislexia !== null ? { dislexia: savedDislexia === '1' } : {}),
      });
    } catch (error) {
      console.error('Erro ao carregar preferências de UI:', error);
    }
  },
}));
