import React from 'react';
import { View, StyleSheet, ActivityIndicator, Image, Text } from 'react-native';
import { colors, spacing, typography } from '../theme';

export const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoShell}>
        <Image source={require('../../assets/splash-icon.png')} style={styles.logo} resizeMode="contain" />
      </View>
      <Text style={styles.brand}>CEDRO</Text>
      <Text style={styles.subtitle}>Apoio psicologico e saude</Text>
      <ActivityIndicator size="small" color={colors.forest} style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cream,
    padding: spacing.xl,
  },
  logo: {
    width: 172,
    height: 172,
  },
  logoShell: {
    width: 196,
    height: 196,
    borderRadius: 98,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceWarm,
    borderWidth: 1,
    borderColor: '#E7DCC6',
    shadowColor: colors.forest,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 22,
    elevation: 5,
    marginBottom: spacing.base,
  },
  brand: {
    color: colors.forest,
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.bold,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.size.md,
    marginTop: spacing.xs,
    textAlign: 'center',
    opacity: 0.9,
  },
  loader: {
    marginTop: spacing.xl,
  },
});
