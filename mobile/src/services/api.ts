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
import { useAuthStore } from '../store/authStore';
import { API_BASE_URL } from '../config/environment';

const SECURE_STORE_TOKEN_KEY = 'cedro_jwt_token';
const RETRYABLE_METHODS = new Set(['get', 'head', 'options']);

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
      return { type: ApiErrorType.TIMEOUT, message: `Tempo de conexão esgotado. API: ${API_BASE_URL}` };
    }
    return { type: ApiErrorType.NETWORK, message: `Sem conexão com o servidor. API: ${API_BASE_URL}` };
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
    return { type: ApiErrorType.SERVER, message: 'Erro interno do servidor.', status };
  }

  return { type: ApiErrorType.UNKNOWN, message: 'Erro inesperado.', status };
}

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
      const isPublicAuthEndpoint = config.url?.startsWith('/api/auth/');
      if (isPublicAuthEndpoint) {
        return config;
      }

      const token = await SecureStore.getItemAsync(SECURE_STORE_TOKEN_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // SecureStore pode falhar silenciosamente
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
      await SecureStore.deleteItemAsync(SECURE_STORE_TOKEN_KEY);
      // Desloga o usuário do Zustand para redirecionar para a AuthStack
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

// ── Helpers para SecureStore ──
export const tokenStorage = {
  get: () => SecureStore.getItemAsync(SECURE_STORE_TOKEN_KEY),
  set: (token: string) => SecureStore.setItemAsync(SECURE_STORE_TOKEN_KEY, token),
  remove: () => SecureStore.deleteItemAsync(SECURE_STORE_TOKEN_KEY),
};

export default api;
