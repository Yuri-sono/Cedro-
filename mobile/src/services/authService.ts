import api from './api';
import { API_ENDPOINTS } from '../constants/api';
import { LoginRequest, LoginResponse, RegisterRequest, ApiMessage } from '../types/api.types';

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<ApiMessage> => {
    const response = await api.post<ApiMessage>(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },

  recuperarSenha: async (email: string): Promise<ApiMessage> => {
    const response = await api.post<ApiMessage>(API_ENDPOINTS.AUTH.RECUPERAR_SENHA, { email });
    return response.data;
  },
};
