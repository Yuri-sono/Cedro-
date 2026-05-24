import { useCallback, useEffect, useState } from 'react';
import { Mensagem } from '../types/api.types';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { API_ENDPOINTS } from '../constants/api';
import { chatService } from '../services/chatService';
import { showToast } from '../components/Toast';

export const useChat = (destinatarioId: number) => {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentUserId = useAuthStore((state) => state.user?.id);

  const ordenarMensagens = useCallback((lista: Mensagem[]) => {
    return [...lista].sort((a, b) => {
      const dataA = new Date(a.dataCriacao).getTime();
      const dataB = new Date(b.dataCriacao).getTime();
      if (dataA !== dataB) return dataA - dataB;
      return a.id - b.id;
    });
  }, []);

  const mergeMensagens = useCallback(
    (base: Mensagem[], incoming: Mensagem[]) => {
      const map = new Map<number, Mensagem>();
      base.forEach((msg) => map.set(msg.id, msg));
      incoming.forEach((msg) => map.set(msg.id, msg));
      return ordenarMensagens(Array.from(map.values()));
    },
    [ordenarMensagens],
  );

  const carregarHistorico = useCallback(async () => {
    try {
      if (mensagens.length === 0) {
        setIsLoading(true);
      }
      const response = await api.get<Mensagem[]>(API_ENDPOINTS.MENSAGENS.CONVERSA(destinatarioId));
      const historico = response.data || [];
      setMensagens((prev) => mergeMensagens(prev, historico));
    } catch (error) {
      console.error('Erro ao buscar historico de mensagens', error);
    } finally {
      setIsLoading(false);
    }
  }, [destinatarioId, mensagens.length, mergeMensagens]);

  const marcarComoLidas = useCallback(async () => {
    try {
      await api.put(API_ENDPOINTS.MENSAGENS.MARCAR_TODAS_LIDAS(destinatarioId), {});
    } catch (error) {
      console.error('Erro ao marcar mensagens como lidas', error);
    }
  }, [destinatarioId]);

  useEffect(() => {
    if (!isAuthenticated) return;

    carregarHistorico();
    marcarComoLidas();

    const unsubscribe = chatService.addMessageListener((novaMensagem) => {
      const pertenceConversa =
        (novaMensagem.remetenteId === destinatarioId && novaMensagem.destinatarioId === currentUserId) ||
        (novaMensagem.destinatarioId === destinatarioId && novaMensagem.remetenteId === currentUserId);

      if (!pertenceConversa) return;

      setMensagens((prev) => mergeMensagens(prev, [novaMensagem]));
      if (novaMensagem.remetenteId === destinatarioId) {
        marcarComoLidas();
      }
    });

    chatService.connect();

    // Fallback para manter sincronia mesmo sem WebSocket.
    const interval = setInterval(carregarHistorico, 4000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [
    destinatarioId,
    isAuthenticated,
    carregarHistorico,
    currentUserId,
    marcarComoLidas,
    mergeMensagens,
  ]);

  const enviarMensagem = async (conteudo: string) => {
    if (!conteudo.trim()) return;
    const conteudoNormalizado = conteudo.trim();

    const tempId = -Date.now();
    const tempMensagem: Mensagem = {
      id: tempId,
      remetenteId: currentUserId || 0,
      destinatarioId,
      mensagem: conteudoNormalizado,
      lida: false,
      dataCriacao: new Date().toISOString(),
    };

    setMensagens((prev) => mergeMensagens(prev, [tempMensagem]));

    try {
      const response = await api.post<Mensagem>(API_ENDPOINTS.MENSAGENS.ENVIAR, {
        destinatarioId,
        mensagem: conteudoNormalizado,
      });

      setMensagens((prev) => {
        const semTemp = prev.filter((msg) => msg.id !== tempId);
        return mergeMensagens(semTemp, [response.data]);
      });

      chatService.sendMessage(destinatarioId, conteudoNormalizado);
    } catch (error) {
      console.error('Erro ao enviar mensagem', error);
      setMensagens((prev) => prev.filter((msg) => msg.id !== tempId));
      showToast.error('Erro ao enviar', 'Nao foi possivel enviar sua mensagem.');
    }
  };

  return {
    mensagens,
    isLoading,
    enviarMensagem,
    recarregar: carregarHistorico,
  };
};
