import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Sessao } from '../types/api.types';
import { typography, spacing, borderRadius } from '../theme';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  sessao: Sessao;
  onPress?: () => void;
  isPaciente?: boolean;
  onMarcarRealizada?: () => void;
  onCancelar?: () => void;
}

export const SessionCard = ({
  sessao,
  onPress,
  isPaciente = true,
  onMarcarRealizada,
  onCancelar,
}: Props) => {
  const { colors } = useTheme();

  // Parse data
  const data = new Date(sessao.dataSessao);
  const dia = data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  const hora = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  // Estilos dependentes de cor (recomputados por render para acompanhar o tema)
  const colorStyles = StyleSheet.create({
    card: {
      backgroundColor: colors.surfaceWarm,
      borderColor: colors.border,
    },
    dateBlock: {
      backgroundColor: colors.mint,
    },
    dia: {
      color: colors.primary,
    },
    hora: {
      color: colors.textSecondary,
    },
    title: {
      color: colors.textPrimary,
    },
    subtitle: {
      color: colors.textSecondary,
    },
    actionRealizar: {
      backgroundColor: colors.mint,
    },
    actionRealizarText: {
      color: colors.primary,
    },
    actionCancelar: {
      backgroundColor: colors.surface,
      borderColor: colors.error,
    },
    actionCancelarText: {
      color: colors.error,
    },
  });

  // Status color mapper (cores dependem do tema ativo)
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'agendada': return colors.info;
      case 'realizada': return colors.success;
      case 'cancelada': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const statusColor = getStatusColor(sessao.statusSessao);

  return (
    <TouchableOpacity 
      style={[styles.card, colorStyles.card]} 
      onPress={onPress} 
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={[styles.dateBlock, colorStyles.dateBlock]}>
        <Text style={[styles.dia, colorStyles.dia]}>{dia}</Text>
        <Text style={[styles.hora, colorStyles.hora]}>{hora}</Text>
      </View>
      
      <View style={styles.info}>
        {/* Futuro: Exibir nome do psicólogo ou paciente dependendo de quem está logado */}
        <Text style={[styles.title, colorStyles.title]} numberOfLines={1}>Consulta de terapia</Text>
        <Text style={[styles.subtitle, colorStyles.subtitle]}>{sessao.duracao} minutos</Text>

        {!isPaciente && (onMarcarRealizada || onCancelar) && (
          <View style={styles.actionsRow}>
            {onMarcarRealizada && (
              <TouchableOpacity
                style={[styles.actionBtn, styles.actionRealizar, colorStyles.actionRealizar]}
                onPress={onMarcarRealizada}
                activeOpacity={0.7}
              >
                <Text style={[styles.actionRealizarText, colorStyles.actionRealizarText]}>Marcar realizada</Text>
              </TouchableOpacity>
            )}
            {onCancelar && (
              <TouchableOpacity
                style={[styles.actionBtn, styles.actionCancelar, colorStyles.actionCancelar]}
                onPress={onCancelar}
                activeOpacity={0.7}
              >
                <Text style={[styles.actionCancelarText, colorStyles.actionCancelarText]}>Cancelar</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      
      <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
        <Text style={[styles.statusText, { color: statusColor }]} numberOfLines={1}>
          {sessao.statusSessao}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// Estilos estáticos (layout) — independentes de cor
const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    marginBottom: spacing.sm,
    borderWidth: 1,
    alignItems: 'center',
    gap: spacing.md,
  },
  dateBlock: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  dia: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
  },
  hora: {
    fontSize: typography.size.xs,
    marginTop: 2,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
  },
  subtitle: {
    fontSize: typography.size.sm,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    maxWidth: 96,
  },
  statusText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    textTransform: 'uppercase',
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  actionBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
  },
  actionRealizar: {},
  actionRealizarText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
  },
  actionCancelar: {
    borderWidth: 1,
  },
  actionCancelarText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
  },
});
