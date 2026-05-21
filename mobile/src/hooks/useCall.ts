import { useState } from 'react';
import { callService, AgoraTokenResponse } from '../services/callService';
import { showToast } from '../components/Toast';

export const useCall = () => {
  const [isInitializing, setIsInitializing] = useState(false);

  const iniciarChamada = async (channelName: string, isVideo: boolean): Promise<AgoraTokenResponse | null> => {
    try {
      setIsInitializing(true);
      // Pede o token ao Spring Boot (Fonte da Verdade)
      const tokenData = await callService.obterToken(channelName, isVideo);
      return tokenData;
    } catch (error: any) {
      // Se o backend retornar 403 Forbidden, significa que o limite estourou
      if (error.response?.status === 403) {
        showToast.error('Limite Atingido', 'Você atingiu o limite de chamadas do seu plano.');
      } else {
        showToast.error('Erro na chamada', 'Não foi possível conectar ao servidor de voz/vídeo.');
      }
      return null;
    } finally {
      setIsInitializing(false);
    }
  };

  const encerrarChamada = async (channelName: string, duracaoSegundos: number) => {
    try {
      // Informa o backend da duração para métricas e limite
      await callService.finalizarChamada(channelName, duracaoSegundos);
    } catch (error) {
      console.error('Erro ao finalizar chamada no backend', error);
    }
  };

  return {
    isInitializing,
    iniciarChamada,
    encerrarChamada,
  };
};
