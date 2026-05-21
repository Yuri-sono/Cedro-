import { create } from 'zustand';
import { UsuarioResponse } from '../types/api.types';
import { tokenStorage } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Chave para salvar os dados do usuário (exceto token, que vai pro SecureStore)
const USER_STORAGE_KEY = 'cedro_user_data';

interface AuthState {
  user: UsuarioResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Ações
  login: (user: UsuarioResponse, token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<UsuarioResponse>) => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Começa carregando até verificar o storage

  login: async (user, token) => {
    try {
      await tokenStorage.set(token);
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      set({ user, isAuthenticated: true });
    } catch (error) {
      console.error('Erro ao salvar auth state:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await tokenStorage.remove();
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  },

  updateUser: async (updatedFields) => {
    try {
      const currentUser = get().user;
      if (!currentUser) return;

      const newUser = { ...currentUser, ...updatedFields };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      set({ user: newUser });
    } catch (error) {
      console.error('Erro ao atualizar user state:', error);
    }
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const token = await tokenStorage.get();
      const userDataStr = await AsyncStorage.getItem(USER_STORAGE_KEY);

      if (token && userDataStr) {
        // Futuro: validar expiração do JWT (decode payload)
        const user = JSON.parse(userDataStr);
        set({ user, isAuthenticated: true });
      } else {
        set({ user: null, isAuthenticated: false });
        // Se houver sujeira, limpa
        if (token) await tokenStorage.remove();
        if (userDataStr) await AsyncStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Erro ao restaurar auth state:', error);
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));
