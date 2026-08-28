import { API_ENDPOINTS } from '../constants/api';
import { LoginRequest, LoginResponse, RegisterRequest, ApiMessage } from '../types/api.types';
import { API_BASE_URL } from '../config/environment';

const AUTH_TIMEOUT_MS = 60000;
const HEALTH_ENDPOINT = API_ENDPOINTS.AUTH.HEALTH;

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

function errorName(error: unknown): string | undefined {
  return error instanceof Error ? error.name : undefined;
}

function errorMessage(error: unknown): string | undefined {
  return error instanceof Error ? error.message : undefined;
}

async function readResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return undefined;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function authRequest<T>(
  label: string,
  endpoint: string,
  body: unknown,
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AUTH_TIMEOUT_MS);

  try {
    await assertApiReachable();

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const data = await readResponseBody(response);

    if (!response.ok) {
      const rawMessage = extractApiMessage(data);

      // Backend retorna 400 genérico para credenciais inválidas no login.
      // Traduz para uma mensagem clara para o usuário.
      if (
        response.status === 400 &&
        endpoint === API_ENDPOINTS.AUTH.LOGIN &&
        (!rawMessage || rawMessage === 'Erro ao processar sua solicitação' || rawMessage === 'Email ou senha incorretos')
      ) {
        throw new Error('E-mail ou senha inválidos.');
      }

      throw new Error(
        rawMessage ||
          `${label}: erro ${response.status} ao processar solicitacao.`,
      );
    }

    return data as T;
  } catch (error) {
    if (errorName(error) === 'AbortError') {
      throw new Error(`${label}: tempo de conexao esgotado. API: ${API_BASE_URL}`);
    }

    const message = errorMessage(error);
    if (error instanceof TypeError || message === 'Network request failed') {
      throw new Error(
        `${label}: sem conexao com o servidor (${message || 'erro de rede'}). API: ${API_BASE_URL}`,
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function assertApiReachable(): Promise<void> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AUTH_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${HEALTH_ENDPOINT}`, {
      method: 'GET',
      headers: {
        Accept: 'text/plain, application/json',
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`health: resposta ${response.status}. API: ${API_BASE_URL}`);
    }
  } catch (error) {
    if (errorName(error) === 'AbortError') {
      throw new Error(`health: tempo de conexao esgotado. API: ${API_BASE_URL}`);
    }

    const message = errorMessage(error);
    if (error instanceof TypeError || message === 'Network request failed') {
      throw new Error(
        `health: sem conexao com o servidor (${message || 'erro de rede'}). API: ${API_BASE_URL}`,
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return authRequest<LoginResponse>('login', API_ENDPOINTS.AUTH.LOGIN, data);
  },

  register: async (data: RegisterRequest): Promise<ApiMessage> => {
    return authRequest<ApiMessage>('cadastro', API_ENDPOINTS.AUTH.REGISTER, data);
  },

  googleLogin: async (credential: string): Promise<LoginResponse> => {
    return authRequest<LoginResponse>('login com Google', API_ENDPOINTS.AUTH.GOOGLE, {
      credential,
    });
  },

  recuperarSenha: async (email: string): Promise<ApiMessage> => {
    return authRequest<ApiMessage>('recuperar senha', API_ENDPOINTS.AUTH.RECUPERAR_SENHA, { email });
  },
};
