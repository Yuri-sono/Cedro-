import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Cliente global do TanStack Query.
 * Configurado com tempos de cache adequados e retry logic.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 horas de cache
      staleTime: 1000 * 60 * 5, // Dados ficam fresh por 5 minutos
      retry: 2, // Tenta mais 2 vezes em caso de falha (útil em mobile)
      refetchOnWindowFocus: true, // Recarrega quando app volta a foco (útil para realtime-ish)
    },
  },
});

/**
 * Persister para salvar o cache do QueryClient no AsyncStorage.
 * Isso permite offline-first básico (mostra dados da última vez se estiver sem rede).
 */
export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'cedro_query_cache',
  throttleTime: 2000, // Salva no máximo a cada 2 segundos para não travar a UI
});
