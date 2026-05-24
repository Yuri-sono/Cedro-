import { ExpoConfig, ConfigContext } from 'expo/config';

const DEFAULT_API_URL = 'https://cedro-vc32.onrender.com';
const API_URL = process.env.EXPO_PUBLIC_API_URL?.trim() || DEFAULT_API_URL;

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Cedro Saúde Mental',
  slug: 'cedro-mobile',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#F7F1E3',
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
      backgroundColor: '#F7F1E3',
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
    'expo-font',
    [
      'expo-image-picker',
      {
        photosPermission: 'Permita escolher uma imagem para atualizar sua foto de perfil.',
      },
    ],
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
    ...config.extra,
    apiUrl: API_URL,
    eas: {
      ...(config.extra?.eas as Record<string, unknown> | undefined),
      projectId: '7778b28a-a4ba-4fe5-9435-d38050a80a3e',
    },
  },
});
