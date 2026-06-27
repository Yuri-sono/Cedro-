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
      outputRange: ['#E6DDC8', colors.forest],
    });

    const backgroundColor = focusAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.surfaceWarm, colors.surface],
    });

    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        
        <Animated.View
          style={[
            styles.inputContainer,
            {
              borderColor: error ? colors.error : borderColor,
              backgroundColor,
            },
          ]}
        >
          <TextInput
            ref={ref}
            style={[styles.input, style]}
            placeholderTextColor="#8C968D"
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
              <Text style={styles.eyeText}>
                {isPasswordVisible ? '👁️' : '👁️‍🗨️'}
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>

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
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
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
    shadowColor: colors.forest,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.base,
    fontSize: typography.size.base,
    color: colors.textPrimary,
    minHeight: 56,
    fontWeight: typography.weight.medium,
  },
  eyeIcon: {
    padding: spacing.md,
    marginRight: spacing.xs,
  },
  eyeText: {
    fontSize: typography.size.lg,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.size.xs,
    marginTop: spacing.sm,
    marginLeft: spacing.xs,
    fontWeight: typography.weight.medium,
  },
});
