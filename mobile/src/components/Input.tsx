import React, { forwardRef, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { typography, spacing, borderRadius } from '../theme';
import { useTheme } from '../theme/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, isPassword, style, ...props }, ref) => {
    const { colors } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [focusAnim] = useState(new Animated.Value(0));

    const handleFocus = (e: any) => {
      setIsFocused(true);
      Animated.spring(focusAnim, {
        toValue: 1,
        useNativeDriver: false,
        tension: 40,
        friction: 7,
      }).start();
      props.onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      Animated.spring(focusAnim, {
        toValue: 0,
        useNativeDriver: false,
        tension: 40,
        friction: 7,
      }).start();
      props.onBlur?.(e);
    };

    const borderColor = focusAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.border, colors.forest],
    });

    const backgroundColor = focusAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.surfaceWarm, colors.surface],
    });

    // Estilos dependentes de cor (recomputados por render para acompanhar o tema)
    const colorStyles = StyleSheet.create({
      inputContainer: {
        shadowColor: colors.forest,
      },
      input: {
        color: colors.textPrimary,
      },
      label: {
        color: colors.textPrimary,
      },
      errorText: {
        color: colors.error,
      },
    });

    return (
      <View style={styles.container}>
        {label && <Text style={[styles.label, colorStyles.label]}>{label}</Text>}
        
        <Animated.View
          style={[
            styles.inputContainer,
            colorStyles.inputContainer,
            {
              borderColor: error ? colors.error : borderColor,
              backgroundColor,
            },
          ]}
        >
          <TextInput
            ref={ref}
            style={[styles.input, colorStyles.input, style]}
            placeholderTextColor={colors.textSecondary}
            secureTextEntry={isPassword && !isPasswordVisible}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          
          {isPassword && (
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isPasswordVisible ? 'eye-off' : 'eye'}
                size={typography.size.lg}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </Animated.View>

        {error && <Text style={[styles.errorText, colorStyles.errorText]}>{error}</Text>}
      </View>
    );
  }
);

// Estilos estáticos (layout/espaçamento) — independentes de cor
const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
    width: '100%',
  },
  label: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
    letterSpacing: 0.2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: borderRadius.xl,
    minHeight: 56,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.base,
    fontSize: typography.size.base,
    minHeight: 56,
    fontWeight: typography.weight.medium,
  },
  eyeIcon: {
    padding: spacing.md,
    marginRight: spacing.xs,
  },
  errorText: {
    fontSize: typography.size.xs,
    marginTop: spacing.sm,
    marginLeft: spacing.xs,
    fontWeight: typography.weight.medium,
  },
});
