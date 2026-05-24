import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ChatStackParamList } from '../../types/navigation.types';
import { useConversas } from '../../hooks/useConversas';
import { ConversaResumo } from '../../types/api.types';
import { Avatar } from '../../components/Avatar';
import { borderRadius, colors, spacing, typography } from '../../theme';

type NavigationProp = NativeStackNavigationProp<ChatStackParamList, 'Conversas'>;

const formatarHorario = (iso?: string) => {
  if (!iso) return '';
  const data = new Date(iso);
  const hoje = new Date();
  const ontem = new Date();
  ontem.setDate(hoje.getDate() - 1);

  const isMesmoDia = data.toDateString() === hoje.toDateString();
  const isOntem = data.toDateString() === ontem.toDateString();

  if (isMesmoDia) {
    return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
  if (isOntem) return 'Ontem';
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
};

export const ConversasScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { conversas, isLoading, isFetching, refetch } = useConversas();

  const renderItem = ({ item }: { item: ConversaResumo }) => {
    return (
      <TouchableOpacity
        style={styles.conversaCard}
        onPress={() =>
          navigation.navigate('Chat', {
            userId: item.userId,
            userName: item.nome,
            avatarUrl: item.fotoUrl || undefined,
          })
        }
      >
        <Avatar url={item.fotoUrl} size={50} />
        <View style={styles.conversaInfo}>
          <View style={styles.conversaHeader}>
            <Text style={styles.nome} numberOfLines={1}>
              {item.nome}
            </Text>
            <Text style={styles.hora}>{formatarHorario(item.dataUltimaMensagem)}</Text>
          </View>
          <View style={styles.conversaFooter}>
            <Text style={[styles.mensagem, item.naoLidas > 0 && styles.mensagemNaoLida]} numberOfLines={1}>
              {item.ultimaMensagem}
            </Text>
            {item.naoLidas > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.naoLidas > 99 ? '99+' : item.naoLidas}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.brandText}>CEDRO APOIO PSICOLOGICO E SAUDE</Text>
      <FlatList
        data={conversas}
        keyExtractor={(item) => item.userId.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onRefresh={refetch}
        refreshing={isFetching}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={34} color={colors.textSecondary} />
            <Text style={styles.emptyText}>Voce ainda nao possui conversas.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  brandText: {
    fontSize: typography.size.xs,
    color: colors.primaryDark,
    fontWeight: typography.weight.bold,
    letterSpacing: 0.4,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    paddingBottom: spacing.sm,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  listContent: {
    flexGrow: 1,
  },
  conversaCard: {
    flexDirection: 'row',
    padding: spacing.base,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  conversaInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  conversaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nome: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    flex: 1,
  },
  hora: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  conversaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mensagem: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    flex: 1,
    marginRight: spacing.sm,
  },
  mensagemNaoLida: {
    color: colors.textPrimary,
    fontWeight: typography.weight.medium,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.white,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['2xl'],
    marginTop: 100,
    gap: spacing.sm,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: typography.size.base,
  },
});
