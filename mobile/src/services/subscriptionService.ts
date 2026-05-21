import Purchases, { PurchasesPackage, CustomerInfo } from 'react-native-purchases';
import { Platform } from 'react-native';
import api from './api';
import { API_ENDPOINTS } from '../constants/api';

// As chaves reais deverão ser colocadas no .env
const API_KEY_APPLE = process.env.EXPO_PUBLIC_RC_APPLE || 'apple_key_aqui';
const API_KEY_GOOGLE = process.env.EXPO_PUBLIC_RC_GOOGLE || 'google_key_aqui';

export const subscriptionService = {
  // Inicializa o SDK do RevenueCat
  init: () => {
    if (Platform.OS === 'ios') {
      Purchases.configure({ apiKey: API_KEY_APPLE });
    } else if (Platform.OS === 'android') {
      Purchases.configure({ apiKey: API_KEY_GOOGLE });
    }
  },

  // Identifica o usuário logado no RevenueCat usando o ID numérico do Spring Boot
  identificarUsuario: async (userId: number) => {
    try {
      await Purchases.logIn(userId.toString());
    } catch (e) {
      console.error('Erro ao identificar no RevenueCat', e);
    }
  },

  logout: async () => {
    try {
      await Purchases.logOut();
    } catch (e) {
      console.error('Erro no logout do RevenueCat', e);
    }
  },

  // Busca as ofertas/pacotes disponíveis configuradas na loja
  buscarOfertas: async (): Promise<PurchasesPackage[]> => {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
        return offerings.current.availablePackages;
      }
      return [];
    } catch (e) {
      console.error('Erro ao buscar ofertas', e);
      return [];
    }
  },

  // Realiza a compra via loja da Apple/Google
  comprarPacote: async (pacote: PurchasesPackage): Promise<CustomerInfo | null> => {
    try {
      const { customerInfo } = await Purchases.purchasePackage(pacote);
      return customerInfo;
    } catch (e: any) {
      if (!e.userCancelled) {
        console.error('Erro na compra', e);
      }
      return null;
    }
  },

  // ---------------------------------------------------------
  // FONTE DA VERDADE: O Spring Boot dita as regras
  // ---------------------------------------------------------

  // Verifica o status de assinatura e os limites no Spring Boot
  verificarLimite: async (): Promise<{ isPremium: boolean; chamadasRealizadas: number; limiteMensal: number }> => {
    // Endpoint que será criado no Spring Boot
    const response = await api.get(API_ENDPOINTS.CHAMADAS.LIMITE);
    return response.data;
  },
};
