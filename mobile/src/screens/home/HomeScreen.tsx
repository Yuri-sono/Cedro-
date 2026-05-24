import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../types/navigation.types';
import { useAuthStore } from '../../store/authStore';
import { usePsicologos } from '../../hooks/usePsicologos';
import { useSessoes } from '../../hooks/useSessoes';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { Avatar } from '../../components/Avatar';
import { PsicologoCard } from '../../components/PsicologoCard';
import { SessionCard } from '../../components/SessionCard';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const user = useAuthStore((state) => state.user);
  
  const { psicologos, isLoading: loadingPsicos } = usePsicologos();
  const { sessoes, isLoading: loadingSessoes } = useSessoes();

  // Pegar apenas os 3 primeiros psicólogos para a home
  const destaquePsicologos = psicologos.slice(0, 3);
  
  // Pegar a próxima sessão agendada (simplificado para demo)
  const proximaSessao = sessoes.find(s => s.statusSessao.toLowerCase() === 'agendada');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.brandText}>CEDRO APOIO PSICOLOGICO E SAUDE</Text>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {user?.nome?.split(' ')[0]} 👋</Text>
          <Text style={styles.subtitle}>Como você está se sentindo hoje?</Text>
        </View>
        <Avatar url={user?.fotoUrl} size={48} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sua Próxima Sessão</Text>
        {loadingSessoes ? (
          <ActivityIndicator color={colors.primary} />
        ) : proximaSessao ? (
          <SessionCard sessao={proximaSessao} />
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Você não tem consultas agendadas.</Text>
            <TouchableOpacity onPress={() => navigation.navigate('PsicologoList')}>
              <Text style={styles.linkText}>Encontrar um Psicólogo</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Psicólogos em Destaque</Text>
          <TouchableOpacity onPress={() => navigation.navigate('PsicologoList')}>
            <Text style={styles.seeAllText}>Ver todos</Text>
          </TouchableOpacity>
        </View>
        
        {loadingPsicos ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          destaquePsicologos.map((psi) => (
            <PsicologoCard
              key={psi.id}
              psicologo={psi}
              onPress={() => navigation.navigate('PsicologoDetail', { psicologoId: psi.id })}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.base,
    paddingTop: spacing.xl,
  },
  brandText: {
    fontSize: typography.size.xs,
    color: colors.primaryDark,
    fontWeight: typography.weight.bold,
    letterSpacing: 0.4,
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  greeting: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.size.base,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing['2xl'],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  sectionTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.base,
  },
  seeAllText: {
    color: colors.primary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  emptyText: {
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  linkText: {
    color: colors.primary,
    fontWeight: typography.weight.semibold,
  },
});
