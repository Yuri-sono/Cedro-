import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Cedro Saúde Mental',
  slug: 'cedro-mobile',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#198754', // cedro-primary
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.cedro.app',
    infoPlist: {
      NSCameraUsageDescription: 'O Cedro precisa da câmera para chamadas de vídeo e atualização de perfil.',
      NSMicrophoneUsageDescription: 'O Cedro precisa do microfone para chamadas de voz e vídeo com seu psicólogo.',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.cedro.app',
    permissions: [
      'android.permission.CAMERA',
      'android.permission.RECORD_AUDIO',
      'android.permission.INTERNET',
    ],
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    [
      'expo-secure-store',
      {
        faceIDPermission: 'Permita o uso de biometria para login seguro.',
      },
    ],
    // 'expo-av', // Adicionar na Sprint 6
    // 'expo-camera', // Adicionar na Sprint 8
  ],
  extra: {
    eas: {
      projectId: '', // Preencher na Sprint 9
    },
  },
});
