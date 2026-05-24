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
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondary;
      case 'outline':
        return styles.outline;
      case 'text':
        return styles.textVariant;
      case 'primary':
      default:
        return styles.primary;
    }
  };

  const getTextColor = () => {
    if (disabled && variant !== 'text') return colors.textSecondary;
    if (variant === 'outline' || variant === 'text') return colors.primary;
    return colors.textInverse;
  };

  const isButtonDisabled = disabled || isLoading;

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
    minHeight: 52,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    width: '100%',
  },
  primary: {
    backgroundColor: colors.forest,
    borderWidth: 1,
    borderColor: colors.primaryDark,
    shadowColor: colors.forest,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  secondary: {
    backgroundColor: colors.mint,
  },
  outline: {
    backgroundColor: colors.surfaceWarm,
    borderWidth: 1,
    borderColor: colors.forest,
  },
  textVariant: {
    backgroundColor: 'transparent',
    height: 'auto',
    paddingHorizontal: 0,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    textAlign: 'center',
  },
  textUnderline: {
    textDecorationLine: 'none',
  },
});
