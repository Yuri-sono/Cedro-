import { useCallback, useEffect, useRef, useState } from 'react';
import { Mensagem } from '../types/api.types';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { API_ENDPOINTS } from '../constants/api';
import { showToast } from '../components/Toast';
import { chatService } from '../services/chatService';

export const useChat = (destinatarioId: number) => {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentUserId = useAuthStore((state) => state.user?.id);
  const stompConnected = useRef(false);

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
  }, [destinatarioId, mensagens.length, mergeMensagens, ordenarMensagens]);

  const marcarComoLidas = useCallback(async () => {
    try {
      await api.put(API_ENDPOINTS.MENSAGENS.MARCAR_TODAS_LIDAS(destinatarioId), {});
    } catch (error) {
      console.error('Erro ao marcar mensagens como lidas', error);
    }
  }, [destinatarioId]);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Conecta STOMP uma vez por sessão autenticada
    if (!stompConnected.current) {
      chatService.connect().then(() => {
        stompConnected.current = true;
      });
    }

    // Listener STOMP: injeta mensagens recebidas em tempo real
    const unsubscribe = chatService.addMessageListener((msg) => {
      const isRelevant =
        msg.remetenteId === destinatarioId || msg.destinatarioId === destinatarioId;
      if (isRelevant) {
        setMensagens((prev) => mergeMensagens(prev, [msg]));
      }
    });

    carregarHistorico();
    marcarComoLidas();

    const interval = setInterval(carregarHistorico, 2500);

    return () => {
      clearInterval(interval);
      unsubscribe();
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
