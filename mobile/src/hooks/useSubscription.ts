import { useEffect, useState, useCallback } from 'react';
import { subscriptionService } from '../services/subscriptionService';
import { useAuthStore } from '../store/authStore';
import { PurchasesPackage } from 'react-native-purchases';
import { showToast } from '../components/Toast';

export const useSubscription = () => {
  const user = useAuthStore((state) => state.user);
  
  const [isPremium, setIsPremium] = useState(false);
  const [limiteInfo, setLimiteInfo] = useState({ chamadasRealizadas: 0, limiteMensal: 0 });
  const [pacotes, setPacotes] = useState<PurchasesPackage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Consulta o Spring Boot para saber o status real (Fonte da Verdade)
  const checarLimitesBackEnd = useCallback(async () => {
    if (!user) return;
    try {
      const status = await subscriptionService.verificarLimite();
      setIsPremium(status.isPremium);
      setLimiteInfo({
        chamadasRealizadas: status.chamadasRealizadas,
        limiteMensal: status.limiteMensal,
      });
    } catch (error) {
      console.error('Erro ao checar limites no backend', error);
    }
  }, [user]);

  // Carrega pacotes do RevenueCat
  const carregarOfertas = useCallback(async () => {
    try {
      const ofertas = await subscriptionService.buscarOfertas();
      setPacotes(ofertas);
    } catch (error) {
      console.error('Erro ao carregar ofertas', error);
    }
  }, []);

  useEffect(() => {
    if (user) {
      subscriptionService.identificarUsuario(user.id);
      checarLimitesBackEnd();
      carregarOfertas();
    }
  }, [user, checarLimitesBackEnd, carregarOfertas]);

  const assinar = async (pacote: PurchasesPackage) => {
    try {
      setIsLoading(true);
      const customerInfo = await subscriptionService.comprarPacote(pacote);
      
      if (customerInfo) {
        // Se a compra nativa der certo, avisamos o backend indiretamente ou
        // esperamos o Webhook do RevenueCat bater no Spring Boot.
        // O ideal é consultar o backend novamente após alguns segundos
        showToast.success('Processando...', 'Sua compra está sendo processada no servidor.');
        
        setTimeout(() => {
          checarLimitesBackEnd();
        }, 3000);
      }
    } catch (error) {
      showToast.error('Erro na compra', 'Não foi possível concluir a assinatura.');
    } finally {
      setIsLoading(false);
    }
  };

  const podeFazerChamada = () => {
    if (isPremium) return true;
    return limiteInfo.chamadasRealizadas < limiteInfo.limiteMensal;
  };

  return {
    isPremium,
    limiteInfo,
    pacotes,
    isLoading,
    assinar,
    podeFazerChamada,
    checarLimitesBackEnd,
  };
};
