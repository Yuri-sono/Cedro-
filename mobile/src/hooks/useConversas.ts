import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { ConversaResumo } from '../types/api.types';
import { useAuthStore } from '../store/authStore';
import { API_ENDPOINTS } from '../constants/api';

export const useConversas = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const query = useQuery({
    queryKey: ['conversas'],
    queryFn: async () => {
      const response = await api.get<ConversaResumo[]>(API_ENDPOINTS.MENSAGENS.CONVERSAS);
      return response.data;
    },
    enabled: isAuthenticated,
    refetchInterval: 3000, // Polling a cada 3 segundos
  });

  return {
    conversas: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
};
