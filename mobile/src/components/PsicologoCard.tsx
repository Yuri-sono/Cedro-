import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PsicologoListItem } from '../types/api.types';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Avatar } from './Avatar';

interface Props {
  psicologo: PsicologoListItem;
  onPress: () => void;
}

export const PsicologoCard = ({ psicologo, onPress }: Props) => {
  return (
    <TouchableOpacity style={styles.cardWrapper} onPress={onPress} activeOpacity={0.85}>
      <LinearGradient
        colors={['#FFFFFF', '#FFFDF8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.card}
      >
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            <Avatar url={psicologo.fotoUrl} size={64} />
            <View style={styles.avatarBadge} />
          </View>
          <View style={styles.info}>
            <Text style={styles.nome} numberOfLines={1}>{psicologo.nome}</Text>
            <Text style={styles.especialidade} numberOfLines={1}>
              {psicologo.especialidade || 'Psicologia Clínica'}
            </Text>
            {psicologo.tipoPsicologo && (
              <View style={styles.badge}>
                <Text style={styles.badgeText} numberOfLines={1}>
                  {psicologo.tipoPsicologo}
                </Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statText}>
              {psicologo.avaliacao ? `${psicologo.avaliacao.toFixed(1)}` : 'Novo'}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>💰</Text>
            <Text style={styles.preco}>
              {psicologo.precoSessao ? `R$ ${psicologo.precoSessao.toFixed(2)}` : 'A combinar'}
            </Text>
          </View>
        </View>
        
        {psicologo.bio && (
          <View style={styles.bioContainer}>
            <Text style={styles.bio} numberOfLines={2}>{psicologo.bio}</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: spacing.base,
  },
  card: {
    borderRadius: borderRadius['2xl'],
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#E7DCC6',
    shadowColor: colors.forest,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.white,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  nome: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    letterSpacing: 0.2,
  },
  especialidade: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontWeight: typography.weight.medium,
  },
  badge: {
    backgroundColor: colors.mint,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
  },
  badgeText: {
    fontSize: typography.size.xs,
    color: colors.primaryDark,
    fontWeight: typography.weight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#E7DCC6',
    marginVertical: spacing.base,
    opacity: 0.6,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
    justifyContent: 'center',
  },
  statIcon: {
    fontSize: typography.size.base,
  },
  statText: {
    fontSize: typography.size.base,
    color: colors.textPrimary,
    fontWeight: typography.weight.semibold,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E7DCC6',
    opacity: 0.5,
  },
  preco: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    color: colors.primary,
  },
  bioContainer: {
    marginTop: spacing.base,
    paddingTop: spacing.base,
    borderTopWidth: 1,
    borderTopColor: '#E7DCC6',
    opacity: 0.9,
  },
  bio: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    lineHeight: typography.size.sm * typography.lineHeight.relaxed,
  },
});
