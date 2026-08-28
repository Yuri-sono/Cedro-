/**
 * useNotifications — versão WEB.
 * Notificações locais/push do Expo não são suportadas no navegador,
 * então esta variação é um no-op que evita importar expo-notifications/expo-device
 * (que não possuem implementação funcional para web e quebrariam o bundle).
 */
export const useNotifications = () => {
  // No-op no web
};