import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSubscription } from '../../hooks/useSubscription';
import { Button } from '../../components/Button';
import { colors, spacing, typography, borderRadius } from '../../theme';

export const PaywallScreen = () => {
  const navigation = useNavigation();
  const { pacotes, isLoading, assinar, isPremium, limiteInfo } = useSubscription();

  if (isPremium) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.successTitle}>Você já é Premium! 🎉</Text>
        <Text style={styles.successSubtitle}>Aproveite chamadas ilimitadas.</Text>
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
      
      <View style={styles.limitCard}>
        <Text style={styles.limitText}>
          Sua cota mensal de chamadas gratuitas de voz/vídeo atingiu o limite:
        </Text>
        <Text style={styles.limitNumbers}>
          {limiteInfo.chamadasRealizadas} / {limiteInfo.limiteMensal}
        </Text>
      </View>

      <Text style={styles.benefitsTitle}>Vantagens do Premium:</Text>
      <View style={styles.benefitItem}>
        <Text style={styles.benefitCheck}>✓</Text>
        <Text style={styles.benefitText}>Sessões de vídeo ilimitadas</Text>
      </View>
      <View style={styles.benefitItem}>
        <Text style={styles.benefitCheck}>✓</Text>
        <Text style={styles.benefitText}>Sessões de voz ilimitadas</Text>
      </View>
      <View style={styles.benefitItem}>
        <Text style={styles.benefitCheck}>✓</Text>
        <Text style={styles.benefitText}>Suporte prioritário</Text>
      </View>

      <View style={styles.packagesContainer}>
        {pacotes.length === 0 ? (
          <View style={styles.loadingPackages}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Carregando ofertas...</Text>
          </View>
        ) : (
          pacotes.map((pacote) => (
            <View key={pacote.identifier} style={styles.packageCard}>
              <View>
                <Text style={styles.packageTitle}>{pacote.product.title}</Text>
                <Text style={styles.packagePrice}>{pacote.product.priceString}</Text>
              </View>
              <Button
                title="Assinar"
                onPress={() => assinar(pacote)}
                isLoading={isLoading}
                style={styles.subscribeButton}
              />
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
  successTitle: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.primary,
    marginBottom: spacing.sm,
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
  limitCard: {
    backgroundColor: colors.error + '20', // 20% opacity
    padding: spacing.base,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.error,
  },
  limitText: {
    color: colors.error,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  limitNumbers: {
    color: colors.error,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    textAlign: 'center',
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
  benefitCheck: {
    color: colors.success,
    fontSize: typography.size.lg,
    marginRight: spacing.sm,
    fontWeight: 'bold',
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
  packageCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.base,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  packageTitle: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  packagePrice: {
    fontSize: typography.size.lg,
    color: colors.primary,
    fontWeight: typography.weight.bold,
    marginTop: 4,
  },
  subscribeButton: {
    width: 100,
  },
  cancelButton: {
    marginTop: spacing.xl,
  },
});
