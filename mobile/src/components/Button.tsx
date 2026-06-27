import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, borderRadius } from '../theme';

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
          colors={isButtonDisabled ? ['#657268', '#657268'] : ['#24745B', '#2F8E70']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientButton}
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
        return styles.secondary;
      case 'outline':
        return styles.outline;
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
    shadowColor: colors.forest,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  secondary: {
    backgroundColor: colors.mint,
    paddingHorizontal: spacing.base,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  outline: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.forest,
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
