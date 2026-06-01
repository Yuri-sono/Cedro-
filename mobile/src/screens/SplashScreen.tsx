import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { colors, spacing, typography } from '../theme';

export const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.cornerLeafTop} />
      <View style={styles.cornerLeafBottom} />
      <View style={styles.logoShell}>
        <Image source={require('../../assets/cedro-logo.png')} style={styles.logo} resizeMode="contain" />
      </View>
      <Text style={styles.brand}>CEDRO</Text>
      <Text style={styles.subtitle}>conecta • cuida • preserva</Text>
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
    width: 186,
    height: 186,
  },
  logoShell: {
    width: 214,
    height: 214,
    borderRadius: 107,
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
    letterSpacing: 2,
    marginTop: spacing.lg,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    marginTop: spacing.xs,
    textAlign: 'center',
    opacity: 0.9,
    letterSpacing: 0.6,
  },
  cornerLeafTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 110,
    height: 110,
    borderBottomRightRadius: 110,
    backgroundColor: 'rgba(168, 214, 197, 0.22)',
  },
  cornerLeafBottom: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 96,
    height: 96,
    borderTopLeftRadius: 96,
    backgroundColor: 'rgba(168, 214, 197, 0.22)',
  },
});
