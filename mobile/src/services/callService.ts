import api from './api';
import { API_ENDPOINTS } from '../constants/api';
import { LinkReuniaoResponse } from '../types/api.types';

export const callService = {
  obterLinkReuniao: async (sessaoId: number): Promise<LinkReuniaoResponse> => {
    const response = await api.get<LinkReuniaoResponse>(API_ENDPOINTS.SESSOES.LINK_REUNIAO(sessaoId));
    return response.data;
  },
};
