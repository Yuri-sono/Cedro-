import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = 'cedro_theme_preference';

type ThemeMode = 'light' | 'dark' | 'system';

interface UIState {
  theme: ThemeMode;
  isOffline: boolean;
  
  // Ações
  setTheme: (theme: ThemeMode) => Promise<void>;
  setOffline: (isOffline: boolean) => void;
  loadPreferences: () => Promise<void>;
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'system',
  isOffline: false,

  setTheme: async (theme) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
      set({ theme });
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  },

  setOffline: (isOffline) => {
    set({ isOffline });
  },

  loadPreferences: async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) {
        set({ theme: savedTheme as ThemeMode });
      }
    } catch (error) {
      console.error('Erro ao carregar preferências de UI:', error);
    }
  },
}));
