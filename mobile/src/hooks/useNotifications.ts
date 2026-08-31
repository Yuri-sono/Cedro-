import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { notificationService } from '../services/notificationService';
import { useAuthStore } from '../store/authStore';
import { navigationRef } from '../navigation/navigationRef';

// Configuração global de como as notificações aparecem quando o app está em foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const useNotifications = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    // Só tenta registrar o token se o usuário estiver logado no Spring Boot
    if (!isAuthenticated) return;

    const registerForPushNotificationsAsync = async () => {
      if (!Device.isDevice) {
        console.log('Push Notifications precisam de um dispositivo físico.');
        return;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Permissão de notificação negada.');
        return;
      }

      // Configura canal no Android
      await notificationService.configurarCanalAndroid();

      try {
        const tokenData = await Notifications.getExpoPushTokenAsync();
        const token = tokenData.data;
        // Envia o token para o backend Spring Boot que vai armazená-lo no SQL Server
        await notificationService.registrarToken(token);
        console.log('Token registrado no Spring Boot:', token);
      } catch (error) {
        console.error('Erro ao obter/registrar push token:', error);
      }
    };

    registerForPushNotificationsAsync();

    // Listener para quando o usuário toca na notificação
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data as any;
      if (data?.tipo === 'sessao' && data?.sessaoId && navigationRef.isReady()) {
        // "Reuniao" é uma tela global registrada no RootStack (RootStackParamList),
        // por isso navegamos direto na raiz em vez de 'HomeStack'.
        (navigationRef as any).navigate('Reuniao', { sessaoId: data.sessaoId });
      }
    });

    return () => {
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [isAuthenticated]);
};
