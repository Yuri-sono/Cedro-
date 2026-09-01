import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery } from '@tanstack/react-query';
import { psicologoService } from '../../services/psicologoService';
import { colors, typography, spacing, borderRadius , useTheme, ThemeColors } from '../../theme';
import { TransacaoFinanceira } from '../../types/api.types';

type Periodo = 'mes' | 'trimestre' | 'ano';

const PERIODOS: { id: Periodo; label: string }[] = [
  { id: 'mes', label: 'Mês' },
  { id: 'trimestre', label: 'Trimestre' },
  { id: 'ano', label: 'Ano' },
];

const formatarBRL = (valor: number | null | undefined) => {
  const n = Number(valor || 0);
  return `R$ ${n.toFixed(2).replace('.', ',')}`;
};

const formatarData = (iso: string) => {
  const partes = iso.split('-');
  if (partes.length !== 3) return iso;
  return `${partes[2]}/${partes[1]}`;
};

const formatarPeriodo = (p: Periodo) => (p === 'mes' ? 'mês' : p);

export const FinanceiroPsicologoScreen = () => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const [periodo, setPeriodo] = useState<Periodo>('mes');

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['psicologo', 'financeiro', periodo],
    queryFn: () => psicologoService.financeiro(periodo),
  });

  return (
    <View style={styles.container}>
      {/* Seletor de período */}
      <View style={styles.periodos}>
        {PERIODOS.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={[styles.periodoBtn, periodo === p.id && styles.periodoBtnAtivo]}
            onPress={() => setPeriodo(p.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.periodoTexto, periodo === p.id && styles.periodoTextoAtivo]}>
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      >
        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <>
            <Text style={styles.tituloPeriodo}>Resumo do {formatarPeriodo(periodo)}</Text>

            {/* Cards de resumo */}
            <View style={styles.resumoGrid}>
              <View style={styles.resumoCard}>
                <Text style={styles.resumoLabel}>Faturamento</Text>
                <Text style={styles.resumoValorDestaque}>
                  {formatarBRL(data?.faturamentoMes)}
                </Text>
              </View>
              <View style={styles.resumoCard}>
                <Text style={styles.resumoLabel}>Consultas</Text>
                <Text style={styles.resumoValor}>{data?.consultasRealizadas ?? 0}</Text>
              </View>
              <View style={styles.resumoCard}>
                <Text style={styles.resumoLabel}>Ticket médio</Text>
                <Text style={styles.resumoValor}>{formatarBRL(data?.ticketMedio)}</Text>
              </View>
            </View>

            {/* Transações */}
            <Text style={styles.tituloTransacoes}>Últimas transações</Text>
            {data?.transacoes && data.transacoes.length > 0 ? (
              data.transacoes.map((t: TransacaoFinanceira) => (
                <View key={t.id} style={styles.transacao}>
                  <View style={styles.transacaoInfo}>
                    <Text style={styles.transacaoPaciente}>{t.paciente || 'Paciente'}</Text>
                    <Text style={styles.transacaoData}>
                      {formatarData(t.data)} · {t.status}
                    </Text>
                  </View>
                  <View style={styles.transacaoDireita}>
                    <Text style={styles.transacaoValor}>{formatarBRL(t.valor)}</Text>
                    <Ionicons
                      name={t.status === 'Pago' ? 'checkmark-circle' : 'time'}
                      size={16}
                      color={t.status === 'Pago' ? colors.success : colors.warning}
                    />
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Nenhuma transação neste período.</Text>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  periodos: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.base,
  },
  periodoBtn: {
    flex: 1,
    minHeight: 44,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodoBtnAtivo: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  periodoTexto: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.textSecondary,
  },
  periodoTextoAtivo: {
    color: colors.white,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing['2xl'],
  },
  center: {
    padding: spacing['2xl'],
    alignItems: 'center',
  },
  tituloPeriodo: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  resumoGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  resumoCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
  },
  resumoLabel: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  resumoValorDestaque: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.primary,
  },
  resumoValor: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  tituloTransacoes: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  transacao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    marginBottom: spacing.sm,
  },
  transacaoInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  transacaoPaciente: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
  transacaoData: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  transacaoDireita: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  transacaoValor: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  emptyText: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: spacing.lg,
  },
});
