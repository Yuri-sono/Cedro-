/**
 * Axios centralizado — Cedro Mobile
 * JWT via expo-secure-store (nunca AsyncStorage puro).
 * Interceptors: inject token, handle 401, retry rede, classificar erros.
 */
/**
 * Axios centralizado — Cedro Mobile
 * JWT via expo-secure-store (nunca AsyncStorage puro).
 * Interceptors: inject token, handle 401, retry rede, classificar erros.
 */

import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../config/environment';

const SECURE_STORE_TOKEN_KEY = 'cedro_jwt_token';
const RETRYABLE_METHODS = new Set(['get', 'head', 'options']);
const PUBLIC_AUTH_ENDPOINTS = new Set([
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/google',
  '/api/auth/health',
  '/api/auth/recuperar-senha',
]);

// ── Classificação de erros ──
export enum ApiErrorType {
  NETWORK = 'NETWORK',
  TIMEOUT = 'TIMEOUT',
  SERVER = 'SERVER',
  AUTH = 'AUTH',
  VALIDATION = 'VALIDATION',
  UNKNOWN = 'UNKNOWN',
}

export interface ClassifiedError {
  type: ApiErrorType;
  message: string;
  status?: number;
}

function extractApiMessage(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined;

  const responseData = data as Record<string, unknown>;
  const directMessage = responseData.error || responseData.message;

  if (typeof directMessage === 'string') {
    return directMessage;
  }

  const firstFieldError = Object.values(responseData).find(
    (value) => typeof value === 'string',
  );

  return typeof firstFieldError === 'string' ? firstFieldError : undefined;
}

function classifyError(error: AxiosError): ClassifiedError {
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      const url = error.config?.url || '';
      if (url.includes('/api/auth/foto-perfil-upload')) {
        return {
          type: ApiErrorType.TIMEOUT,
          message: 'O envio da foto demorou demais. Tente uma imagem menor ou com conexao mais estavel.',
        };
      }
      return { type: ApiErrorType.TIMEOUT, message: 'O servidor demorou para responder. Tente novamente em instantes.' };
    }
    return { type: ApiErrorType.NETWORK, message: 'Nao foi possivel concluir agora. Verifique sua internet e tente novamente.' };
  }

  const status = error.response.status;

  if (status === 401) {
    return { type: ApiErrorType.AUTH, message: 'Sessão expirada. Faça login novamente.', status };
  }
  if (status === 403) {
    return { type: ApiErrorType.AUTH, message: 'Acesso negado.', status };
  }
  if (status === 400 || status === 422) {
    return {
      type: ApiErrorType.VALIDATION,
      message: extractApiMessage(error.response.data) || 'Dados inválidos.',
      status,
    };
  }
  if (status >= 500) {
    return { type: ApiErrorType.SERVER, message: 'O servidor encontrou um problema. Tente novamente em instantes.', status };
  }

  return { type: ApiErrorType.UNKNOWN, message: extractApiMessage(error.response.data) || 'Nao foi possivel concluir a acao.', status };
}

function normalizePath(url?: string): string {
  if (!url) return '';
  const noQuery = url.split('?')[0];
  const match = noQuery.match(/\/api\/auth\/[^/]+$/);
  return match ? match[0] : noQuery;
}

function isPublicEndpoint(config: InternalAxiosRequestConfig): boolean {
  const method = config.method?.toLowerCase();
  const normalizedPath = normalizePath(config.url);

  if (PUBLIC_AUTH_ENDPOINTS.has(normalizedPath)) {
    return true;
  }

  // Requests sem metodo definido sao tratadas como protegidas por padrao.
  if (!method) return false;
  return false;
}

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Criar instância ──
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor: injetar JWT ──
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      if (isPublicEndpoint(config)) {
        return config;
      }

      const token = await tokenStorage.get();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // SecureStore/AsyncStorage pode falhar silenciosamente
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response Interceptor: tratar erros e retry ──
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401 → limpar token e forçar logout
    if (error.response?.status === 401) {
      await tokenStorage.remove();
      // Desloga o usuário do Zustand para redirecionar para a AuthStack (require dinâmico para evitar cycle)
      const { useAuthStore } = require('../store/authStore');
      useAuthStore.getState().logout();
      return Promise.reject(classifyError(error));
    }

    const method = originalRequest?.method?.toLowerCase();
    const canRetry =
      method &&
      RETRYABLE_METHODS.has(method) &&
      error.code !== 'ECONNABORTED';

    // Retry somente em métodos seguros. Nunca repetir POST de login/cadastro.
    if (!error.response && originalRequest && !originalRequest._retry && canRetry) {
      originalRequest._retry = true;
      return api(originalRequest);
    }

    return Promise.reject(classifyError(error));
  },
);

// ── Helpers para SecureStore / AsyncStorage (WebFallback) ──
export const tokenStorage = {
  get: async () => {
    if (Platform.OS === 'web') {
      return await AsyncStorage.getItem(SECURE_STORE_TOKEN_KEY);
    }
    return await SecureStore.getItemAsync(SECURE_STORE_TOKEN_KEY);
  },
  set: async (token: string) => {
    if (Platform.OS === 'web') {
      return await AsyncStorage.setItem(SECURE_STORE_TOKEN_KEY, token);
    }
    return await SecureStore.setItemAsync(SECURE_STORE_TOKEN_KEY, token);
  },
  remove: async () => {
    if (Platform.OS === 'web') {
      return await AsyncStorage.removeItem(SECURE_STORE_TOKEN_KEY);
    }
    return await SecureStore.deleteItemAsync(SECURE_STORE_TOKEN_KEY);
  },
};

export default api;
