import api from './api';
import { API_ENDPOINTS } from '../constants/api';

export const subscriptionService = {
  init: () => {},
  identificarUsuario: async (userId: number) => {},
  logout: async () => {},
  buscarOfertas: async (): Promise<any[]> => [],
  comprarPacote: async (pacote: any): Promise<any | null> => null,
  verificarLimite: async (): Promise<{ isPremium: boolean; chamadasRealizadas: number; limiteMensal: number }> => {
    try {
      const response = await api.get(API_ENDPOINTS.ASSINATURA.STATUS);
      return response.data;
    } catch {
      return { isPremium: false, chamadasRealizadas: 0, limiteMensal: 0 };
    }
  },
};
