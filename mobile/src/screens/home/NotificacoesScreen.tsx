import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Notifications from 'expo-notifications';
import { spacing, typography, borderRadius, useTheme, ThemeColors } from '../../theme';

/**
 * Lista das últimas notificações recebidas no dispositivo
 * (Notifications.getPresentedNotificationsAsync()).
 * Na web, expo-notifications não expõe notificações apresentadas —
 * mostramos um estado vazio explicativo.
 */

type NotificacaoItem = {
  id: string;
  titulo: string;
  corpo: string;
  data: Date;
};

export const NotificacoesScreen = () => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const [notificacoes, setNotificacoes] = useState<NotificacaoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const carregar = useCallback(async () => {
    setIsLoading(true);
    try {
      if (Platform.OS === 'web') {
        setNotificacoes([]);
        return;
      }
      const apresentadas = await Notifications.getPresentedNotificationsAsync();
      setNotificacoes(
        apresentadas.map((n) => ({
          id: n.request.identifier,
          titulo: n.request.content.title || 'Notificação',
          corpo: n.request.content.body || '',
          data: n.date ? new Date(n.date) : new Date(),
        })),
      );
    } catch (e) {
      // Dispositivo/emulador sem suporte ou permissão negada
      console.log('Não foi possível carregar notificações:', e);
      setNotificacoes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void carregar();
  }, [carregar]);

  const renderItem = ({ item }: { item: NotificacaoItem }) => (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.icone}>
        <Ionicons name="notifications" size={18} color={colors.primary} />
      </View>
      <View style={styles.textos}>
        <Text style={[styles.titulo, { color: colors.textPrimary }]} numberOfLines={1}>
          {item.titulo}
        </Text>
        <Text style={[styles.corpo, { color: colors.textSecondary }]} numberOfLines={3}>
          {item.corpo}
        </Text>
        <Text style={[styles.data, { color: colors.textFaint }]}>
          {item.data.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      <FlatList
        data={notificacoes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
        refreshing={isLoading}
        onRefresh={carregar}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.vazio}>
              <Ionicons name="notifications-off-outline" size={40} color={colors.textFaint} />
              <Text style={[styles.vazioTexto, { color: colors.textSecondary }]}>
                {Platform.OS === 'web'
                  ? 'As notificações push aparecem apenas no aplicativo mobile.'
                  : 'Nenhuma notificação recebida por aqui.'}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    lista: {
      padding: spacing.base,
      paddingBottom: spacing['3xl'],
    },
    card: {
      flexDirection: 'row',
      gap: spacing.md,
      padding: spacing.base,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      marginBottom: spacing.sm,
    },
    icone: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: colors.primaryTint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textos: {
      flex: 1,
    },
    titulo: {
      fontSize: typography.size.sm,
      fontWeight: typography.weight.bold,
    },
    corpo: {
      fontSize: typography.size.sm,
      marginTop: 2,
    },
    data: {
      fontSize: typography.size.xs,
      marginTop: 4,
    },
    vazio: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing['3xl'],
      gap: spacing.md,
    },
    vazioTexto: {
      fontSize: typography.size.sm,
      textAlign: 'center',
    },
  });
