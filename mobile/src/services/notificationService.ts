import api from './api';
import { API_ENDPOINTS } from '../constants/api';
import { ApiMessage } from '../types/api.types';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export const notificationService = {
  // Envia o token para o backend central (Spring Boot)
  registrarToken: async (token: string): Promise<ApiMessage> => {
    const response = await api.post<ApiMessage>(API_ENDPOINTS.NOTIFICACOES.REGISTRAR_TOKEN, { token });
    return response.data;
  },

  removerToken: async (token: string): Promise<ApiMessage> => {
    const response = await api.post<ApiMessage>(API_ENDPOINTS.NOTIFICACOES.REMOVER_TOKEN, { token });
    return response.data;
  },

  configurarCanalAndroid: async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#53A85B',
      });
    }
  },
};
