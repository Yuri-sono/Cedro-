import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { ConversaResumo } from '../types/api.types';
import { useEffect } from 'react';
import { chatService } from '../services/chatService';
import { useAuthStore } from '../store/authStore';

export const useConversas = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const query = useQuery({
    queryKey: ['conversas'],
    queryFn: async () => {
      // Assumindo endpoint: GET /api/mensagens/conversas
      const response = await api.get<ConversaResumo[]>('/api/mensagens/conversas');
      return response.data || [];
    },
    enabled: isAuthenticated,
  });

  // Conectar ao STOMP ao entrar na tela de conversas para receber notificações globais
  useEffect(() => {
    if (!isAuthenticated) return;
    
    chatService.connect();

    // Listener para invalidar o cache da lista de conversas sempre que chegar qualquer mensagem nova
    const unsubscribe = chatService.addMessageListener(() => {
      query.refetch();
    });

    return () => {
      unsubscribe();
    };
  }, [isAuthenticated, query]);

  return {
    conversas: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
};
