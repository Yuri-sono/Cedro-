import api from './api';
import { API_ENDPOINTS } from '../constants/api';
import { PsicologoListItem, PsicologoResponse, PsicologoEstatisticas, ProximaConsulta } from '../types/api.types';
import { agendaConfigService } from './agendaConfigService';
import { mergeAgendaConfig } from '../utils/psychologistAgenda';

export const psicologoService = {
  listar: async (): Promise<PsicologoListItem[]> => {
    const response = await api.get<PsicologoListItem[]>(API_ENDPOINTS.PSICOLOGOS.LISTAR);
    return Promise.all(
      response.data.map(async (psicologo) =>
        mergeAgendaConfig(psicologo, await agendaConfigService.get(psicologo.id)),
      ),
    );
  },

  buscarPorId: async (id: number): Promise<PsicologoResponse> => {
    const response = await api.get<PsicologoResponse>(API_ENDPOINTS.PSICOLOGOS.POR_ID(id));
    return mergeAgendaConfig(response.data, await agendaConfigService.get(id));
  },

  estatisticas: async (): Promise<PsicologoEstatisticas> => {
    const response = await api.get<PsicologoEstatisticas>(API_ENDPOINTS.PSICOLOGOS.ESTATISTICAS);
    return response.data;
  },

  proximasConsultas: async (): Promise<ProximaConsulta[]> => {
    const response = await api.get<ProximaConsulta[]>(API_ENDPOINTS.PSICOLOGOS.PROXIMAS_CONSULTAS);
    return response.data;
  },
};
