import api from './api';
import { API_ENDPOINTS } from '../constants/api';
import { DisponibilidadeResponse, Sessao, SessaoRequest } from '../types/api.types';

export const sessaoService = {
  listarTodas: async (): Promise<Sessao[]> => {
    const response = await api.get<Sessao[]>(API_ENDPOINTS.SESSOES.LISTAR);
    return response.data;
  },

  minhasSessoes: async (): Promise<Sessao[]> => {
    const response = await api.get<Sessao[]>(API_ENDPOINTS.SESSOES.MINHAS);
    return response.data;
  },

  sessoesDoPsicologo: async (psicologoId: number): Promise<Sessao[]> => {
    const response = await api.get<Sessao[]>(API_ENDPOINTS.SESSOES.POR_PSICOLOGO(psicologoId));
    return response.data;
  },

  buscarPorId: async (id: number): Promise<Sessao> => {
    const response = await api.get<Sessao>(API_ENDPOINTS.SESSOES.POR_ID(id));
    return response.data;
  },

  criar: async (data: SessaoRequest): Promise<Sessao> => {
    const response = await api.post<Sessao>(API_ENDPOINTS.SESSOES.CRIAR, data);
    return response.data;
  },

  disponibilidade: async (psicologoId: number, data: string): Promise<DisponibilidadeResponse> => {
    const response = await api.get<DisponibilidadeResponse>(
      API_ENDPOINTS.SESSOES.DISPONIBILIDADE(psicologoId, data),
    );
    return response.data;
  },

  deletar: async (id: number): Promise<void> => {
    await api.delete(API_ENDPOINTS.SESSOES.DELETAR(id));
  },

  atualizarStatus: async (id: number, status: 'realizada' | 'cancelada'): Promise<Sessao> => {
    const response = await api.put<Sessao>(API_ENDPOINTS.SESSOES.STATUS(id), { status });
    return response.data;
  },

  confirmarPagamento: async (id: number): Promise<Sessao> => {
    // O backend envelopa a resposta: { message: string, sessao: Sessao }
    const response = await api.post<{ message: string; sessao: Sessao }>(
      API_ENDPOINTS.SESSOES.CONFIRMAR_PAGAMENTO(id),
      {},
    );
    return response.data.sessao;
  },
};
