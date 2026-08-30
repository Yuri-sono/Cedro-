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
import { borderRadius, spacing, typography } from '../theme';
import { useTheme } from '../theme/ThemeContext';

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
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isSmall = width < 380;

  // Estilos dependentes de cor (recomputados por render para acompanhar o tema)
  const colorStyles = StyleSheet.create({
    container: {
      backgroundColor: colors.cream,
    },
    brandBand: {
      backgroundColor: colors.surfaceWarm,
      borderColor: colors.border,
      shadowColor: colors.forest,
    },
    brandPillText: {
      color: colors.forest,
    },
    brandTitle: {
      color: colors.textSecondary,
    },
    formPanel: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      shadowColor: colors.forest,
    },
    title: {
      color: colors.textPrimary,
    },
    subtitle: {
      color: colors.textSecondary,
    },
    footer: {
      borderTopColor: colors.border,
      backgroundColor: colors.surfaceWarm,
    },
  });

  return (
    <KeyboardAvoidingView
      style={[styles.container, colorStyles.container]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.scrollContent, isSmall && styles.scrollContentSmall]}
      >
        <View style={styles.inner}>
          <View style={[styles.brandBand, colorStyles.brandBand]}>
            <Image source={require('../../assets/splash-icon.png')} style={styles.logo} resizeMode="contain" />
            <View style={styles.brandTextBlock}>
              <Text style={[styles.brandPillText, colorStyles.brandPillText]}>CEDRO</Text>
              <Text style={[styles.brandTitle, colorStyles.brandTitle]}>CEDRO APOIO PSICOLOGICO E SAUDE</Text>
            </View>
          </View>

          <View style={[styles.formPanel, colorStyles.formPanel]}>
            <View style={styles.header}>
              <Text style={[styles.title, colorStyles.title]}>{title}</Text>
              <Text style={[styles.subtitle, colorStyles.subtitle]}>{subtitle}</Text>
            </View>
            <View style={styles.formBody}>{children}</View>
            {footer ? <View style={[styles.footer, colorStyles.footer]}>{footer}</View> : null}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Estilos estáticos (layout) — independentes de cor
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    marginBottom: spacing.md,
    borderWidth: 1,
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
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    textTransform: 'uppercase',
  },
  brandTitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    lineHeight: typography.size.sm * 1.35,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  formPanel: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
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
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.size.base,
    lineHeight: typography.size.base * 1.4,
  },
  formBody: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
  },
});

