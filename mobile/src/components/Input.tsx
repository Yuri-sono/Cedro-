import React, { forwardRef, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, isPassword, style, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        
        <View style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error ? styles.inputContainerError : null,
        ]}>
          <TextInput
            ref={ref}
            style={[styles.input, style]}
            placeholderTextColor={colors.textSecondary}
            secureTextEntry={isPassword && !isPasswordVisible}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          
          {isPassword && (
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <Text style={styles.eyeText}>
                {isPasswordVisible ? 'Ocultar' : 'Mostrar'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
    width: '100%',
  },
  label: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    minHeight: 48,
  },
  inputContainerFocused: {
    borderColor: colors.primary,
  },
  inputContainerError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.base,
    fontSize: typography.size.base,
    color: colors.textPrimary,
    minHeight: 48,
  },
  eyeIcon: {
    padding: spacing.sm,
    marginRight: spacing.xs,
  },
  eyeText: {
    color: colors.primary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.size.xs,
    marginTop: spacing.xs,
  },
});
