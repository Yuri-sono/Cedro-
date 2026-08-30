import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { typography, spacing, borderRadius } from '../theme';
import { useTheme } from '../theme/ThemeContext';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  isLoading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button = ({
  title,
  variant = 'primary',
  isLoading = false,
  disabled,
  style,
  textStyle,
  ...props
}: ButtonProps) => {
  const { colors } = useTheme();

  // Estilos dependentes de cor: computados a cada render para acompanhar o tema
  const colorStyles = StyleSheet.create({
    gradientButton: {
      shadowColor: colors.forest,
    },
    secondary: {
      backgroundColor: colors.mint,
      shadowColor: colors.primary,
    },
    outline: {
      backgroundColor: colors.surface,
      borderColor: colors.forest,
    },
  });

  const getTextColor = () => {
    if (disabled && variant !== 'text') return colors.textSecondary;
    if (variant === 'outline' || variant === 'text') return colors.primary;
    return colors.textInverse;
  };

  const isButtonDisabled = disabled || isLoading;

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={isButtonDisabled}
        style={[styles.base, isButtonDisabled && styles.disabled, style]}
        {...props}
      >
        <LinearGradient
          colors={
            isButtonDisabled
              ? ([colors.textSecondary, colors.textSecondary] as const)
              : colors.gradientPrimary
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradientButton, colorStyles.gradientButton]}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={[styles.text, { color: colors.white }, textStyle]}>{title}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return [styles.secondary, colorStyles.secondary];
      case 'outline':
        return [styles.outline, colorStyles.outline];
      case 'text':
        return styles.textVariant;
      default:
        return {};
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={isButtonDisabled}
      style={[
        styles.base,
        getVariantStyles(),
        isButtonDisabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text
          style={[
            styles.text,
            { color: getTextColor() },
            variant === 'text' && styles.textUnderline,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

// Estilos estáticos (layout, espaçamento, raios) — independentes de cor
const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    overflow: 'hidden',
  },
  gradientButton: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    minHeight: 54,
    borderRadius: borderRadius.xl,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  secondary: {
    paddingHorizontal: spacing.base,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  outline: {
    borderWidth: 2,
    paddingHorizontal: spacing.base,
  },
  textVariant: {
    backgroundColor: 'transparent',
    height: 'auto',
    minHeight: 'auto',
    paddingHorizontal: 0,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  textUnderline: {
    textDecorationLine: 'none',
  },
});

