import { useEffect, useState, useCallback } from 'react';
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
      const response = await api.get<Mensagem[]>(API_ENDPOINTS.MENSAGENS.CONVERSA(destinatarioId));
      setMensagens(response.data || []);
      await api.put(API_ENDPOINTS.MENSAGENS.MARCAR_TODAS_LIDAS(destinatarioId), {});
    } catch (error) {
      console.error('Erro ao buscar histórico de mensagens', error);
    } finally {
      setIsLoading(false);
    }
  }, [destinatarioId]);

  useEffect(() => {
    if (!isAuthenticated) return;

    carregarHistorico();

    // Polling a cada 3 segundos (igual ao web)
    const interval = setInterval(carregarHistorico, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [destinatarioId, isAuthenticated, carregarHistorico]);

  const enviarMensagem = async (conteudo: string) => {
    if (!conteudo.trim()) return;

    try {
      // Enviar via REST até WebSocket ser implementado
      const response = await api.post<Mensagem>(API_ENDPOINTS.MENSAGENS.ENVIAR, {
        destinatarioId,
        mensagem: conteudo,
      });

      // Adicionar mensagem localmente
      setMensagens((prev) => [...prev, response.data]);
    } catch (error) {
      console.error('Erro ao enviar mensagem', error);
    }
  };

  return {
    mensagens,
    isLoading,
    enviarMensagem,
    recarregar: carregarHistorico,
  };
};
