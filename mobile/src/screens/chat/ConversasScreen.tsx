import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, NavigationProp as ReactNavProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ChatStackParamList, MainTabParamList } from '../../types/navigation.types';
import { useConversas } from '../../hooks/useConversas';
import { ConversaResumo } from '../../types/api.types';
import { Avatar } from '../../components/Avatar';
import { borderRadius, spacing, typography, useTheme, ThemeColors } from '../../theme';

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
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<NavigationProp>();
  // Navegação para a tab de Home (usada na sugestão do estado vazio)
  const parentNavigation = navigation.getParent() as ReactNavProp<MainTabParamList> | undefined;
  const { conversas, isLoading, isFetching, refetch } = useConversas();

  const abrirPsicologos = () => {
    parentNavigation?.navigate('HomeStack', { screen: 'PsicologoList' });
  };

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
      <View style={styles.header}>
        <Text style={styles.brandEyebrow}>CEDRO APOIO PSICOLÓGICO E SAÚDE</Text>
        <Text style={styles.headerTitle}>Mensagens</Text>
      </View>
      <FlatList
        data={conversas}
        keyExtractor={(item) => item.userId.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onRefresh={refetch}
        refreshing={isFetching}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons name="search" size={20} color={colors.textFaint} />
            </View>
            <Text style={styles.emptyText}>
              Suas conversas com outros psicólogos vão aparecer aqui.{'\n'}
              Que tal encontrar mais um especialista?
            </Text>
            <TouchableOpacity style={styles.emptyButton} onPress={abrirPsicologos} activeOpacity={0.8}>
              <Text style={styles.emptyButtonText}>Encontrar um psicólogo</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  header: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    paddingBottom: spacing.md,
  },
  brandEyebrow: {
    fontSize: typography.size.xs,
    color: colors.accent,
    fontWeight: typography.weight.bold,
    letterSpacing: 1.2,
    marginBottom: spacing.xs,
  },
  headerTitle: {
    fontSize: typography.size['2xl'],
    color: colors.primary,
    fontWeight: typography.weight.bold,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cream,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: spacing.lg,
  },
  conversaCard: {
    flexDirection: 'row',
    padding: spacing.base,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.base,
    marginBottom: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.forest,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
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
  emptyCard: {
    marginHorizontal: spacing.base,
    marginTop: spacing.xl,
    paddingVertical: spacing['2xl'],
    paddingHorizontal: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: borderRadius['2xl'],
    alignItems: 'center',
  },
  emptyIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm + 2,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: typography.size.md,
    textAlign: 'center',
    lineHeight: typography.size.md * 1.5,
    marginBottom: spacing.md + 2,
  },
  emptyButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: 11,
    paddingHorizontal: spacing.lg,
  },
  emptyButtonText: {
    color: colors.primary,
    fontWeight: typography.weight.semibold,
    fontSize: typography.size.md - 0.5,
  },
});
