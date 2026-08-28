/**
 * notificationService — versão WEB.
 * Expo Notifications / push tokens não existem no navegador.
 * O registro de token é um no-op para não quebrar o bundle web.
 */
import type { ApiMessage } from '../types/api.types';

export const notificationService = {
  registrarToken: async (): Promise<ApiMessage> => ({ message: 'ok' }),
  removerToken: async (): Promise<ApiMessage> => ({ message: 'ok' }),
  configurarCanalAndroid: async () => {},
};