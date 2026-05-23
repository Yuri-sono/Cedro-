import Constants from 'expo-constants';

const DEFAULT_API_URL = 'https://cedro-vc32.onrender.com';

type ExpoExtra = {
  apiUrl?: string;
};

const extra = Constants.expoConfig?.extra as ExpoExtra | undefined;
const publicApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
const configuredApiUrl = extra?.apiUrl?.trim();

function normalizeUrl(url: string): string {
  return url.trim().replace(/\/+$/, '').replace(/\/api$/i, '');
}

const resolvedApiUrl =
  publicApiUrl || configuredApiUrl || DEFAULT_API_URL;

export const API_BASE_URL = normalizeUrl(resolvedApiUrl);
export const WS_CHAT_URL = `${API_BASE_URL.replace(/^http/, 'ws')}/ws-chat`;

if (__DEV__) {
  console.log('API URL:', API_BASE_URL);
}
