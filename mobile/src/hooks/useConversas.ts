import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { ConversaResumo } from '../types/api.types';
import { useAuthStore } from '../store/authStore';
import { API_ENDPOINTS } from '../constants/api';

export const useConversas = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const query = useQuery({
    queryKey: ['conversas', user?.id],
    queryFn: async () => {
      const response = await api.get<ConversaResumo[]>(API_ENDPOINTS.MENSAGENS.CONVERSAS);
      return response.data || [];
    },
    enabled: isAuthenticated,
    staleTime: 2000,
    refetchInterval: 4000,
  });

  return {
    conversas: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
};
