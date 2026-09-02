import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useSubscription } from '../../hooks/useSubscription';
import { Button } from '../../components/Button';
import { colors, spacing, typography, borderRadius } from '../../theme';

export const PaywallScreen = () => {
  const navigation = useNavigation();
  const { isPremium, limiteInfo, planos, isLoading, isLoadingOfertas, assinar } = useSubscription();

  // Semântica real do backend: chamadasRealizadas = sessões agendadas no mês corrente
  // (limiteMensal = 4 para gratuitos). A fração ambígua "0/4" foi substituída por
  // barra de progresso + frase explícita.
  const total = limiteInfo.limiteMensal;
  const usadas = total > 0 ? Math.min(limiteInfo.chamadasRealizadas, total) : limiteInfo.chamadasRealizadas;
  const percentual = total > 0 ? Math.min(100, (usadas / total) * 100) : 0;

  if (isPremium) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.successTitleRow}>
          <Ionicons name="sparkles" size={typography.size['2xl']} color={colors.primary} />
          <Text style={styles.successTitle}>Você já é Premium!</Text>
        </View>
        <Text style={styles.successSubtitle}>Aproveite reuniões ilimitadas via Google Meet.</Text>
        <Button 
          title="Voltar" 
          onPress={() => navigation.goBack()} 
          style={{ marginTop: spacing.xl, width: 200 }} 
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Desbloqueie o Cedro Premium</Text>

      {/* Cota mensal — card dourado com barra de progresso */}
      <View style={styles.quotaCard}>
        <View style={styles.quotaTop}>
          <Text style={styles.quotaLabel}>Reuniões gratuitas este mês</Text>
          <Text style={styles.quotaCount}>
            {total > 0 ? `${usadas} de ${total} usadas` : `${usadas} usadas`}
          </Text>
        </View>
        <View style={styles.quotaBar}>
          <View style={[styles.quotaFill, { width: `${percentual}%` }]} />
        </View>
        <Text style={styles.quotaNote}>Sua cota renova todo mês · assine para reuniões ilimitadas</Text>
      </View>

      <Text style={styles.benefitsTitle}>Vantagens do Premium:</Text>
      <View style={styles.benefitItem}>
        <Ionicons name="checkmark-circle" size={typography.size.lg} color={colors.success} />
        <Text style={styles.benefitText}>Reuniões via Google Meet ilimitadas</Text>
      </View>
      <View style={styles.benefitItem}>
        <Ionicons name="checkmark-circle" size={typography.size.lg} color={colors.success} />
        <Text style={styles.benefitText}>Agendamento prioritário de sessões</Text>
      </View>
      <View style={styles.benefitItem}>
        <Ionicons name="checkmark-circle" size={typography.size.lg} color={colors.success} />
        <Text style={styles.benefitText}>Suporte prioritário</Text>
      </View>

      <View style={styles.packagesContainer}>
        {isLoadingOfertas ? (
          <View style={styles.loadingPackages}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Carregando ofertas...</Text>
          </View>
        ) : (
          planos.map((plano) => (
            <View key={plano.id} style={[styles.planCard, plano.featured && styles.planCardFeatured]}>
              {plano.featured && (
                <View style={styles.planTag}>
                  <Text style={styles.planTagText}>Mais popular</Text>
                </View>
              )}
              <View style={styles.planInfo}>
                <Text style={styles.planName}>{plano.nome}</Text>
                <Text style={styles.planPrice}>
                  {plano.preco}
                  {plano.detalhe ? ` · ${plano.detalhe}` : ''}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.btnAssinar, !plano.featured && styles.btnAssinarOutline]}
                onPress={() => assinar(plano)}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={plano.featured ? colors.white : colors.primary} />
                ) : (
                  <Text style={[styles.btnAssinarText, !plano.featured && styles.btnAssinarTextOutline]}>
                    Assinar
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      <Button
        title="Cancelar"
        variant="text"
        onPress={() => navigation.goBack()}
        style={styles.cancelButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  successTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  successTitle: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.primary,
  },
  successSubtitle: {
    fontSize: typography.size.base,
    color: colors.textSecondary,
  },
  title: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  quotaCard: {
    backgroundColor: colors.accentTint, // accent-tint do redesign
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius['2xl'],
    padding: spacing.base,
    marginBottom: spacing.xl,
  },
  quotaTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm + 2,
  },
  quotaLabel: {
    color: colors.textPrimary,
    fontSize: typography.size.sm + 1,
    fontWeight: typography.weight.bold,
    flex: 1,
    marginRight: spacing.sm,
  },
  quotaCount: {
    color: colors.textPrimary,
    fontSize: typography.size.sm,
    opacity: 0.85,
  },
  quotaBar: {
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accentTint,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  quotaFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: borderRadius.full,
  },
  quotaNote: {
    color: colors.textPrimary,
    fontSize: typography.size.sm - 0.5,
    opacity: 0.8,
  },
  benefitsTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  benefitText: {
    fontSize: typography.size.base,
    color: colors.textSecondary,
  },
  packagesContainer: {
    marginTop: spacing['2xl'],
    gap: spacing.base,
  },
  loadingPackages: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
  },
  planCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.base,
    borderRadius: borderRadius['2xl'],
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  planCardFeatured: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryTint,
  },
  planTag: {
    position: 'absolute',
    top: -10,
    left: spacing.base,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  planTagText: {
    color: colors.white,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
  },
  planInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  planName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  planPrice: {
    fontSize: typography.size.sm + 0.5,
    color: colors.textSecondary,
    marginTop: 2,
  },
  btnAssinar: {
    backgroundColor: colors.primary,
    paddingVertical: 11,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  btnAssinarOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  btnAssinarText: {
    color: colors.white,
    fontWeight: typography.weight.semibold,
    fontSize: typography.size.md - 0.5,
  },
  btnAssinarTextOutline: {
    color: colors.primary,
  },
  cancelButton: {
    marginTop: spacing.xl,
  },
});
