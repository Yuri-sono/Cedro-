import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

// Utils e Stores
import { queryClient, asyncStoragePersister } from './src/utils/queryClient';
import { useAuthStore } from './src/store/authStore';
import { useUIStore } from './src/store/uiStore';

// Componentes Globais
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { Toast } from './src/components/Toast';
import { OfflineBanner } from './src/components/OfflineBanner';

// Navegação
import { RootNavigator } from './src/navigation/RootNavigator';
import { SplashScreen } from './src/screens/SplashScreen';

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
    <ErrorBoundary>
      <SafeAreaProvider>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister: asyncStoragePersister }}
        >
          <RootNavigator />
          
          <OfflineBanner />
          <Toast />
          <StatusBar style="auto" />
        </PersistQueryClientProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

