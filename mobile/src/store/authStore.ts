import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { agendaConfigService } from '../services/agendaConfigService';
import { tokenStorage } from '../services/api';
import { TipoUsuario, UsuarioResponse } from '../types/api.types';
import { mergeAgendaConfig } from '../utils/psychologistAgenda';

const USER_STORAGE_KEY = 'cedro_user_data';

interface AuthState {
  user: UsuarioResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: UsuarioResponse, token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<UsuarioResponse>) => Promise<void>;
  checkAuth: () => Promise<void>;
}

async function hydrateAgenda(user: UsuarioResponse): Promise<UsuarioResponse> {
  if (user.tipoUsuario !== TipoUsuario.psicologo) {
    return user;
  }

  return mergeAgendaConfig(user, await agendaConfigService.get(user.id));
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (user, token) => {
    try {
      const hydratedUser = await hydrateAgenda(user);
      await tokenStorage.set(token);
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(hydratedUser));
      set({ user: hydratedUser, isAuthenticated: true });
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
        const restoredUser = await hydrateAgenda(JSON.parse(userDataStr) as UsuarioResponse);
        set({ user: restoredUser, isAuthenticated: true });
      } else {
        set({ user: null, isAuthenticated: false });
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
