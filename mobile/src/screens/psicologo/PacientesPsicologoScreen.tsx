import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { psicologoService } from '../../services/psicologoService';
import { colors, typography, spacing, borderRadius , useTheme, ThemeColors } from '../../theme';
import { RootStackParamList } from '../../types/navigation.types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const PacientesPsicologoScreen = () => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<NavigationProp>();
  const user = useAuthStore((state) => state.user);

  const { data: pacientes, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['psicologo', 'pacientes', user?.id],
    queryFn: () => (user?.id ? psicologoService.pacientes(user.id) : []),
    enabled: Boolean(user?.id),
  });

  const inicial = (nome: string) => (nome ? nome.trim().charAt(0).toUpperCase() : '?');

  return (
    <View style={styles.container}>
      <FlatList
        data={pacientes || []}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        onRefresh={refetch}
        refreshing={isRefetching}
        ListHeaderComponent={
          <Text style={styles.headerText}>
            Pacientes que já realizaram pelo menos uma sessão com você.
          </Text>
        }
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Você ainda não possui pacientes.</Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.avatar}>
              <Text style={styles.avatarTexto}>{inicial(item.nome)}</Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardNome}>{item.nome}</Text>
              <Text style={styles.cardEmail}>{item.email}</Text>
            </View>
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() =>
                navigation.navigate('Main', {
                  screen: 'ChatStack',
                  params: { screen: 'Chat', params: { userId: item.id, userName: item.nome } },
                })
              }
              activeOpacity={0.7}
              accessibilityLabel={`Conversar com ${item.nome}`}
            >
              <Ionicons name="chatbubbles" size={18} color={colors.white} />
            </TouchableOpacity>
          </View>
        )}
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
  listContent: {
    padding: spacing.base,
    paddingBottom: spacing['2xl'],
  },
  headerText: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginBottom: spacing.base,
  },
  center: {
    padding: spacing['2xl'],
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: spacing['2xl'],
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: typography.size.base,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTexto: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.primary,
  },
  cardInfo: {
    flex: 1,
  },
  cardNome: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
  cardEmail: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  chatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
