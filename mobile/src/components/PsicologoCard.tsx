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
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Avatar url={psicologo.fotoUrl} size={60} />
        <View style={styles.info}>
          <Text style={styles.nome} numberOfLines={1}>
            {psicologo.nome}
          </Text>
          <Text style={styles.especialidade} numberOfLines={1}>
            {psicologo.especialidade || 'Psicologia Clínica'}
          </Text>
          <View style={styles.statsRow}>
            {psicologo.avaliacao ? (
              <Text style={styles.avaliacao}>⭐ {psicologo.avaliacao.toFixed(1)}</Text>
            ) : (
              <Text style={styles.avaliacao}>⭐ Novo</Text>
            )}
            <Text style={styles.preco}>
              {psicologo.precoSessao ? `R$ ${psicologo.precoSessao.toFixed(2)}` : 'A combinar'}
            </Text>
          </View>
        </View>
      </View>
      {psicologo.bio && (
        <Text style={styles.bio} numberOfLines={2}>
          {psicologo.bio}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  info: {
    flex: 1,
    marginLeft: spacing.base,
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  avaliacao: {
    fontSize: typography.size.sm,
    color: colors.warning,
    fontWeight: typography.weight.medium,
  },
  preco: {
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
