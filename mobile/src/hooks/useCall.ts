import { useCallback, useState } from 'react';
import { callService, AgoraTokenResponse, CallType } from '../services/callService';
import { showToast } from '../components/Toast';
import { ClassifiedError } from '../services/api';

export const useCall = () => {
  const [isInitializing, setIsInitializing] = useState(false);

  const iniciarChamada = useCallback(async (
    channelName: string,
    isVideo: boolean,
  ): Promise<AgoraTokenResponse | null> => {
    try {
      setIsInitializing(true);
      return await callService.obterToken(channelName, isVideo);
    } catch (error) {
      const err = error as ClassifiedError;
      if (err.status === 403) {
        showToast.error('Limite atingido', 'Voce atingiu o limite de chamadas do seu plano.');
      } else {
        showToast.error('Erro na chamada', err.message || 'Nao foi possivel conectar ao servidor de voz/video.');
      }
      return null;
    } finally {
      setIsInitializing(false);
    }
  }, []);

  const encerrarChamada = useCallback(async (
    channelName: string,
    duracaoSegundos: number,
    tipo: CallType,
  ) => {
    try {
      await callService.finalizarChamada(channelName, duracaoSegundos, tipo);
    } catch (error) {
      console.error('Erro ao finalizar chamada no backend', error);
    }
  }, []);

  return {
    isInitializing,
    iniciarChamada,
    encerrarChamada,
  };
};
