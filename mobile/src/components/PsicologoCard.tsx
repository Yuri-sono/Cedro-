import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PsicologoListItem } from '../types/api.types';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Avatar } from './Avatar';

interface Props {
  psicologo: PsicologoListItem;
  onPress: () => void;
}

export const PsicologoCard = ({ psicologo, onPress }: Props) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.header}>
        <Avatar url={psicologo.fotoUrl} size={58} />
        <View style={styles.info}>
          <Text style={styles.nome} numberOfLines={1}>{psicologo.nome}</Text>
          <Text style={styles.especialidade} numberOfLines={1}>
            {psicologo.especialidade || 'Psicologia clinica'}
          </Text>
          {psicologo.tipoPsicologo ? (
            <Text style={styles.tipoPsicologo} numberOfLines={1}>
              {psicologo.tipoPsicologo}
            </Text>
          ) : null}
          <View style={styles.statsRow}>
            <Text style={styles.avaliacao} numberOfLines={1}>
              {psicologo.avaliacao ? `${psicologo.avaliacao.toFixed(1)} avaliacao` : 'Novo'}
            </Text>
            <Text style={styles.preco} numberOfLines={1}>
              {psicologo.precoSessao ? `R$ ${psicologo.precoSessao.toFixed(2)}` : 'A combinar'}
            </Text>
          </View>
        </View>
      </View>
      {psicologo.bio ? (
        <Text style={styles.bio} numberOfLines={2}>{psicologo.bio}</Text>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceWarm,
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    marginBottom: spacing.base,
    borderWidth: 1,
    borderColor: '#E7DCC6',
    shadowColor: colors.forest,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  nome: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  especialidade: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  tipoPsicologo: {
    fontSize: typography.size.xs,
    color: colors.primaryDark,
    fontWeight: typography.weight.medium,
    marginTop: spacing.xs,
    textTransform: 'uppercase',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  avaliacao: {
    flex: 1,
    fontSize: typography.size.sm,
    color: colors.warning,
    fontWeight: typography.weight.medium,
  },
  preco: {
    flexShrink: 0,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    color: colors.primary,
  },
  bio: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    lineHeight: typography.size.sm * typography.lineHeight.normal,
  },
});
