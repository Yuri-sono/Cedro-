import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Sessao } from '../types/api.types';
import { colors, typography, spacing, borderRadius } from '../theme';

interface Props {
  sessao: Sessao;
  onPress?: () => void;
  isPaciente?: boolean;
}

export const SessionCard = ({ sessao, onPress, isPaciente = true }: Props) => {
  // Parse data
  const data = new Date(sessao.dataSessao);
  const dia = data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  const hora = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  
  // Status color mapper
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'agendada': return colors.info;
      case 'realizada': return colors.success;
      case 'cancelada': return colors.error;
      default: return colors.textSecondary;
    }
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress} 
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={styles.dateBlock}>
        <Text style={styles.dia}>{dia}</Text>
        <Text style={styles.hora}>{hora}</Text>
      </View>
      
      <View style={styles.info}>
        {/* Futuro: Exibir nome do psicólogo ou paciente dependendo de quem está logado */}
        <Text style={styles.title} numberOfLines={1}>Consulta de terapia</Text>
        <Text style={styles.subtitle}>{sessao.duracao} minutos</Text>
      </View>
      
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(sessao.statusSessao) + '20' }]}>
        <Text style={[styles.statusText, { color: getStatusColor(sessao.statusSessao) }]} numberOfLines={1}>
          {sessao.statusSessao}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceWarm,
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#E7DCC6',
    alignItems: 'center',
    gap: spacing.md,
  },
  dateBlock: {
    backgroundColor: colors.mint,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  dia: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    color: colors.primary,
  },
  hora: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
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
});
