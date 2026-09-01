import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

// Utils e Stores
import { queryClient, asyncStoragePersister } from './src/utils/queryClient';
import { useAuthStore } from './src/store/authStore';
import { useUIStore } from './src/store/uiStore';
import { ThemeProvider, useTheme } from './src/theme';

// Componentes Globais
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { Toast } from './src/components/Toast';
import { OfflineBanner } from './src/components/OfflineBanner';
import { EmergencyButton } from './src/components/EmergencyButton';

// Navegação
import { RootNavigator } from './src/navigation/RootNavigator';
import { SplashScreen } from './src/screens/SplashScreen';

/**
 * Árvore interna do app. Precisa ficar DENTRO do ThemeProvider para
 * consumir o tema ativo (ex.: StatusBar acompanha o dark mode).
 */
const AppRoot = () => {
  const { isDark } = useTheme();

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister: asyncStoragePersister }}
        >
          <RootNavigator />
          <EmergencyButton />

          <OfflineBanner />
          <Toast />
          <StatusBar style={isDark ? 'light' : 'dark'} />
        </PersistQueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
};

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const loadPreferences = useUIStore((state) => state.loadPreferences);

  useEffect(() => {
    async function initApp() {
      try {
        await loadPreferences();
        await checkAuth();
      } catch (error) {
        console.error('Erro ao iniciar app:', error);
      } finally {
        setIsReady(true);
      }
    }
    initApp();
  }, [checkAuth, loadPreferences]);

  if (!isReady) {
    return <SplashScreen />;
  }

  return (
    // Nível mais alto possível: resolve light/dark/system para toda a árvore
    <ThemeProvider>
      <AppRoot />
    </ThemeProvider>
  );
}

