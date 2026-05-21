import api from './api';
import { API_ENDPOINTS } from '../constants/api';

export interface AgoraTokenResponse {
  token: string;
  appId: string;
  channelName: string;
  uid: number;
}

export const callService = {
  /**
   * Solicita ao Spring Boot um token do Agora.io para um determinado canal.
   * O Spring Boot verificará se o usuário tem permissão para entrar neste canal,
   * checará os limites mensais do banco de dados (SQL Server) e, se autorizado,
   * gerará o token usando as credenciais do servidor.
   */
  obterToken: async (channelName: string, isVideo: boolean): Promise<AgoraTokenResponse> => {
    // A API Spring Boot deve garantir que o usuário não ultrapassou o limite.
    // Opcionalmente podemos enviar se é vídeo ou voz se os limites forem diferentes
    const response = await api.post<AgoraTokenResponse>(API_ENDPOINTS.CHAMADAS.TOKEN_AGORA, {
      channelName,
      isVideo,
    });
    return response.data;
  },

  /**
   * Finaliza uma chamada, sinalizando para o Spring Boot computar a duração
   * e debitar dos limites do mês (se necessário).
   */
  finalizarChamada: async (channelName: string, duracaoSegundos: number): Promise<void> => {
    await api.post(`/api/chamadas/${channelName}/finalizar`, { duracaoSegundos });
  },
};
