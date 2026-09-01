import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery } from '@tanstack/react-query';
import { psicologoService } from '../../services/psicologoService';
import { colors, typography, spacing, borderRadius , useTheme, ThemeColors } from '../../theme';

const formatarBRL = (valor: number | null | undefined) => {
  const n = Number(valor || 0);
  return `R$ ${n.toFixed(2).replace('.', ',')}`;
};

const CARDS = [
  { chave: 'consultasHoje', label: 'Consultas hoje', icone: 'today', cor: colors.primary },
  { chave: 'consultasSemana', label: 'Consultas na semana', icone: 'calendar', cor: colors.info },
  { chave: 'pacientesAtivos', label: 'Pacientes ativos', icone: 'people', cor: colors.accent },
  { chave: 'faturamentoMes', label: 'Faturamento no mês', icone: 'cash', cor: colors.success },
] as const;

export const EstatisticasPsicologoScreen = () => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['psicologo', 'estatisticas'],
    queryFn: () => psicologoService.estatisticas(),
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const formatarValor = (chave: string, valor: unknown) => {
    if (chave === 'faturamentoMes') return formatarBRL(Number(valor));
    return String(valor ?? 0);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
    >
      <Text style={styles.subtitulo}>
        Visão geral do seu consultório. Atualize a tela (puxe para baixo) para novos dados.
      </Text>

      <View style={styles.grid}>
        {CARDS.map((card) => (
          <View key={card.chave} style={styles.card}>
            <View style={[styles.cardIcone, { backgroundColor: `${card.cor}1A` }]}>
              <Ionicons name={card.icone} size={20} color={card.cor} />
            </View>
            <Text style={[styles.cardValor, { color: card.cor }]}>
              {formatarValor(card.chave, data?.[card.chave])}
            </Text>
            <Text style={styles.cardLabel}>{card.label}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing['2xl'],
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cream,
  },
  subtitulo: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginBottom: spacing.base,
    lineHeight: typography.size.sm * 1.4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  card: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.sm,
  },
  cardIcone: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  cardValor: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
  },
  cardLabel: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
