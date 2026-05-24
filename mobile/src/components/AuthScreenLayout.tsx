import React, { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  useWindowDimensions,
} from 'react-native';
import { borderRadius, colors, spacing, typography } from '../theme';

interface AuthScreenLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export const AuthScreenLayout = ({
  title,
  subtitle,
  children,
  footer,
}: AuthScreenLayoutProps) => {
  const { width } = useWindowDimensions();
  const isSmall = width < 380;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.scrollContent, isSmall && styles.scrollContentSmall]}
      >
        <View style={styles.inner}>
          <View style={styles.brandBand}>
            <Image source={require('../../assets/splash-icon.png')} style={styles.logo} resizeMode="contain" />
            <View style={styles.brandTextBlock}>
              <Text style={styles.brandPillText}>CEDRO</Text>
              <Text style={styles.brandTitle}>CEDRO APOIO PSICOLOGICO E SAUDE</Text>
            </View>
          </View>

          <View style={styles.formPanel}>
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
            <View style={styles.formBody}>{children}</View>
            {footer ? <View style={styles.footer}>{footer}</View> : null}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.base,
    justifyContent: 'center',
  },
  scrollContentSmall: {
    padding: spacing.md,
    justifyContent: 'flex-start',
  },
  inner: {
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
  },
  brandBand: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: colors.surfaceWarm,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#E7DCC6',
    shadowColor: colors.forest,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  logo: {
    width: 118,
    height: 118,
    marginBottom: spacing.sm,
  },
  brandTextBlock: {
    alignItems: 'center',
  },
  brandPillText: {
    color: colors.forest,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    textTransform: 'uppercase',
  },
  brandTitle: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    lineHeight: typography.size.sm * 1.35,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  formPanel: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: '#E7DCC6',
    shadowColor: colors.forest,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 18,
    elevation: 4,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.size.base,
    color: colors.textSecondary,
    lineHeight: typography.size.base * 1.4,
  },
  formBody: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E7DCC6',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
    backgroundColor: colors.surfaceWarm,
  },
});
