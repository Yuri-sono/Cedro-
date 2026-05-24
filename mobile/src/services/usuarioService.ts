import api from './api';
import { API_ENDPOINTS } from '../constants/api';
import { UsuarioResponse, UpdatePerfilRequest, AlterarSenhaRequest, ApiMessage } from '../types/api.types';

export const usuarioService = {
  buscarPorId: async (id: number): Promise<UsuarioResponse> => {
    const response = await api.get<UsuarioResponse>(API_ENDPOINTS.USUARIOS.POR_ID(id));
    return response.data;
  },

  atualizarPerfil: async (data: UpdatePerfilRequest): Promise<ApiMessage> => {
    const response = await api.put<ApiMessage>(API_ENDPOINTS.AUTH.PERFIL, data);
    return response.data;
  },

  alterarSenha: async (data: AlterarSenhaRequest): Promise<ApiMessage> => {
    const response = await api.put<ApiMessage>(API_ENDPOINTS.AUTH.ALTERAR_SENHA, data);
    return response.data;
  },

  atualizarFoto: async (fotoUrl: string): Promise<ApiMessage> => {
    const response = await api.put<ApiMessage>(API_ENDPOINTS.AUTH.FOTO_PERFIL, { fotoUrl });
    return response.data;
  },

  deletarConta: async (): Promise<ApiMessage> => {
    const response = await api.delete<ApiMessage>(API_ENDPOINTS.AUTH.CONTA);
    return response.data;
  },
};
