import { useEffect, useState, useCallback } from 'react';
import { chatService } from '../services/chatService';
import { Mensagem } from '../types/api.types';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { API_ENDPOINTS } from '../constants/api';

export const useChat = (destinatarioId: number) => {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Carrega histórico via REST inicial
  const carregarHistorico = useCallback(async () => {
    try {
      setIsLoading(true);
      // Assumindo que o Spring Boot tenha esse endpoint mapeado:
      const response = await api.get<Mensagem[]>(`/api/mensagens/historico/${destinatarioId}`);
      setMensagens(response.data || []);
    } catch (error) {
      console.error('Erro ao buscar histórico de mensagens', error);
    } finally {
      setIsLoading(false);
    }
  }, [destinatarioId]);

  useEffect(() => {
    if (!isAuthenticated) return;

    carregarHistorico();
    
    // Conecta ao WebSocket globalmente (ou garante que está ativo)
    chatService.connect();

    // Registra listener para novas mensagens em tempo real
    const unsubscribe = chatService.addMessageListener((novaMensagem: Mensagem) => {
      // Verifica se a mensagem recebida pertence a esta conversa específica
      if (
        novaMensagem.remetenteId === destinatarioId ||
        novaMensagem.destinatarioId === destinatarioId
      ) {
        setMensagens((prev) => [...prev, novaMensagem]);
      }
    });

    return () => {
      unsubscribe();
      // Não desconecta o client inteiro, pois o usuário pode voltar para a lista de conversas
    };
  }, [destinatarioId, isAuthenticated, carregarHistorico]);

  const enviarMensagem = (conteudo: string) => {
    if (!conteudo.trim()) return;

    // Envia via STOMP WebSocket para o Spring Boot
    chatService.sendMessage(destinatarioId, conteudo);
    
    // Opcional: Adicionar a mensagem de forma otimista localmente antes de receber o ACK do servidor
    // Para simplificar, dependemos da volta pelo `/user/queue/messages` ou recarregamos o REST
  };

  return {
    mensagens,
    isLoading,
    enviarMensagem,
    recarregar: carregarHistorico,
  };
};
