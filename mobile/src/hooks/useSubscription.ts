import { useEffect, useState, useCallback } from 'react';
import { subscriptionService } from '../services/subscriptionService';
import { useAuthStore } from '../store/authStore';
import type { PurchasesPackage } from 'react-native-purchases';
import { showToast } from '../components/Toast';

/** Plano exibido na tela de assinatura (da loja via RevenueCat ou mock enquanto a integração não existe). */
export interface PlanOption {
  id: string;
  nome: string;
  preco: string;
  detalhe?: string;
  featured?: boolean;
  mock?: boolean;
}

// Planos com preços fixos exibidos enquanto a integração de pagamento (RevenueCat)
// não está disponível — melhor do que deixar o spinner girando para sempre.
const PLANOS_MOCK: PlanOption[] = [
  {
    id: 'mock-anual',
    nome: 'Plano Anual',
    preco: 'R$ 20,80/mês',
    detalhe: 'cobrado anualmente',
    featured: true,
    mock: true,
  },
  {
    id: 'mock-mensal',
    nome: 'Plano Mensal',
    preco: 'R$ 29,90/mês',
    detalhe: 'cancelamento a qualquer momento',
    mock: true,
  },
];

export const useSubscription = () => {
  const user = useAuthStore((state) => state.user);
  
  const [isPremium, setIsPremium] = useState(false);
  const [limiteInfo, setLimiteInfo] = useState({ chamadasRealizadas: 0, limiteMensal: 0 });
  const [pacotes, setPacotes] = useState<PurchasesPackage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOfertas, setIsLoadingOfertas] = useState(true);
  const [isOfertasError, setIsOfertasError] = useState(false);

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

  // Carrega pacotes do RevenueCat (com estados explícitos de loading e erro)
  const carregarOfertas = useCallback(async () => {
    setIsLoadingOfertas(true);
    try {
      const ofertas = await subscriptionService.buscarOfertas();
      setPacotes(ofertas);
      setIsOfertasError(false);
    } catch (error) {
      console.error('Erro ao carregar ofertas', error);
      setIsOfertasError(true);
    } finally {
      setIsLoadingOfertas(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      subscriptionService.identificarUsuario(user.id);
      checarLimitesBackEnd();
      carregarOfertas();
    }
  }, [user, checarLimitesBackEnd, carregarOfertas]);

  const assinar = async (plano: PlanOption) => {
    // Plano mock: a integração de pagamento ainda não está ativa no backend.
    if (plano.mock) {
      showToast.info(
        'Pagamento em breve',
        'A integração de pagamento ainda não está ativa. Estes são os valores oficiais dos planos.',
      );
      return;
    }

    try {
      setIsLoading(true);
      const pacote = pacotes.find((p) => p.identifier === plano.id);
      if (!pacote) {
        showToast.error('Erro na compra', 'Plano indisponível no momento.');
        return;
      }
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

  // Planos exibidos: os da loja quando existirem; senão, os valores fixos (mock)
  const planos: PlanOption[] =
    pacotes.length > 0
      ? pacotes.map((pacote) => ({
          id: pacote.identifier,
          nome: pacote.product.title,
          preco: pacote.product.priceString,
        }))
      : PLANOS_MOCK;

  return {
    isPremium,
    limiteInfo,
    planos,
    isLoading,
    isLoadingOfertas,
    isOfertasError,
    assinar,
    podeFazerChamada,
    checarLimitesBackEnd,
  };
};
