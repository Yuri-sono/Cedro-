import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { PsicologoListItem } from '../types/api.types';
import { typography, spacing, borderRadius } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { Avatar } from './Avatar';

// Dourado fixo para a estrela de avaliação (sem equivalente na paleta do tema)
const STAR_GOLD = '#FFC107';

interface Props {
  psicologo: PsicologoListItem;
  onPress: () => void;
}

export const PsicologoCard = ({ psicologo, onPress }: Props) => {
  const { colors } = useTheme();

  // Estilos dependentes de cor (recomputados por render para acompanhar o tema)
  const colorStyles = StyleSheet.create({
    card: {
      borderColor: colors.border,
      shadowColor: colors.forest,
    },
    avatarBadge: {
      backgroundColor: colors.success,
      borderColor: colors.white,
    },
    nome: {
      color: colors.textPrimary,
    },
    especialidade: {
      color: colors.textSecondary,
    },
    badge: {
      backgroundColor: colors.mint,
    },
    badgeText: {
      color: colors.primaryDark,
    },
    divider: {
      backgroundColor: colors.border,
    },
    statText: {
      color: colors.textPrimary,
    },
    statDivider: {
      backgroundColor: colors.border,
    },
    preco: {
      color: colors.primary,
    },
    bio: {
      color: colors.textSecondary,
    },
    bioContainer: {
      borderTopColor: colors.border,
    },
  });

  return (
    <TouchableOpacity style={styles.cardWrapper} onPress={onPress} activeOpacity={0.85}>
      <LinearGradient
        colors={colors.gradientCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.card, colorStyles.card]}
      >
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            <Avatar url={psicologo.fotoUrl} size={64} />
            <View style={[styles.avatarBadge, colorStyles.avatarBadge]} />
          </View>
          <View style={styles.info}>
            <Text style={[styles.nome, colorStyles.nome]} numberOfLines={1}>{psicologo.nome}</Text>
            <Text style={[styles.especialidade, colorStyles.especialidade]} numberOfLines={1}>
              {psicologo.especialidade || 'Psicologia Clínica'}
            </Text>
            {!!psicologo.tipoPsicologo && (
              <View style={[styles.badge, colorStyles.badge]}>
                <Text style={[styles.badgeText, colorStyles.badgeText]} numberOfLines={1}>
                  {psicologo.tipoPsicologo}
                </Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={[styles.divider, colorStyles.divider]} />
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="star" size={typography.size.base} color={STAR_GOLD} />
            <Text style={[styles.statText, colorStyles.statText]}>
              {psicologo.avaliacao ? `${psicologo.avaliacao.toFixed(1)}` : 'Novo'}
            </Text>
          </View>
          <View style={[styles.statDivider, colorStyles.statDivider]} />
          <View style={styles.statItem}>
            <Ionicons name="cash-outline" size={typography.size.base} color={colors.primary} />
            <Text style={[styles.preco, colorStyles.preco]}>
              {psicologo.precoSessao ? `R$ ${psicologo.precoSessao.toFixed(2)}` : 'A combinar'}
            </Text>
          </View>
        </View>
        
        {!!psicologo.bio && (
          <View style={[styles.bioContainer, colorStyles.bioContainer]}>
            <Text style={[styles.bio, colorStyles.bio]} numberOfLines={2}>{psicologo.bio}</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

// Estilos estáticos (layout) — independentes de cor
const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: spacing.base,
  },
  card: {
    borderRadius: borderRadius['2xl'],
    padding: spacing.lg,
    borderWidth: 1,
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
    borderWidth: 2,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  nome: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    letterSpacing: 0.2,
  },
  especialidade: {
    fontSize: typography.size.sm,
    marginTop: spacing.xs,
    fontWeight: typography.weight.medium,
  },
  badge: {
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
  },
  badgeText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
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
  statText: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
  },
  statDivider: {
    width: 1,
    height: 24,
    opacity: 0.5,
  },
  preco: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
  },
  bioContainer: {
    marginTop: spacing.base,
    paddingTop: spacing.base,
    borderTopWidth: 1,
    opacity: 0.9,
  },
  bio: {
    fontSize: typography.size.sm,
    lineHeight: typography.size.sm * typography.lineHeight.relaxed,
  },
});
