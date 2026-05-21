import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from './src/theme';

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

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const loadPreferences = useUIStore((state) => state.loadPreferences);

  useEffect(() => {
    async function initApp() {
      // Carregar preferências e auth state antes de exibir a UI
      await loadPreferences();
      await checkAuth();
      setIsReady(true);
    }
    initApp();
  }, [checkAuth, loadPreferences]);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // colors.background não está importado aqui mais, mas podemos usar branco puro ou reimportar colors
  },
});
