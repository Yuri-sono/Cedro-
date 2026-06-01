import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../types/navigation.types';
import { usePsicologoDetail } from '../../hooks/usePsicologos';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';

type PsicologoDetailRouteProp = RouteProp<HomeStackParamList, 'PsicologoDetail'>;
type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'PsicologoDetail'>;

export const PsicologoDetailScreen = () => {
  const route = useRoute<PsicologoDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const psicologoId = route.params.psicologoId;

  const { psicologo, isLoading } = usePsicologoDetail(psicologoId);

  const handleAgendar = () => {
    navigation.navigate('ScheduleSession', { psicologoId });
  };

  if (isLoading || !psicologo) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Avatar url={psicologo.fotoUrl} size={100} style={styles.avatar} />
        <Text style={styles.nome}>{psicologo.nome}</Text>
        <Text style={styles.especialidade}>{psicologo.especialidade || 'Psicologia Clínica'}</Text>
        {psicologo.tipoPsicologo ? (
          <Text style={styles.tipoPsicologo}>{psicologo.tipoPsicologo}</Text>
        ) : null}
        
        <View style={styles.badgesRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>⭐ {psicologo.avaliacao?.toFixed(1) || 'Novo'}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>CRP Ativo</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre</Text>
        <Text style={styles.bio}>{psicologo.bio || 'Este profissional ainda não adicionou uma biografia.'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Valor da Sessão</Text>
        <Text style={styles.preco}>
          {psicologo.precoSessao ? `R$ ${psicologo.precoSessao.toFixed(2)}` : 'A combinar'}
        </Text>
        <Text style={styles.duracao}>Duração média: 50 minutos</Text>
      </View>

      <View style={styles.footer}>
        <Button
          title="Agendar Consulta"
          onPress={handleAgendar}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.base,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
    marginTop: spacing.xl,
  },
  avatar: {
    marginBottom: spacing.base,
  },
  nome: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  especialidade: {
    fontSize: typography.size.base,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  tipoPsicologo: {
    fontSize: typography.size.sm,
    color: colors.primaryDark,
    fontWeight: typography.weight.semibold,
    marginTop: spacing.xs,
  },
  badgesRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  badge: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeText: {
    fontSize: typography.size.sm,
    color: colors.textPrimary,
    fontWeight: typography.weight.medium,
  },
  section: {
    marginBottom: spacing['2xl'],
    backgroundColor: colors.surface,
    padding: spacing.base,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  bio: {
    fontSize: typography.size.base,
    color: colors.textSecondary,
    lineHeight: typography.size.base * typography.lineHeight.relaxed,
  },
  preco: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.primary,
  },
  duracao: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  footer: {
    marginTop: spacing.xl,
    marginBottom: spacing['3xl'],
  },
});
