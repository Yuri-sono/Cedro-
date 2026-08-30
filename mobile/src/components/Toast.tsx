import React from 'react';
import ToastMessage, { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { typography, borderRadius } from '../theme';
import { ThemeColors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';

/**
 * Cria a configuração visual padronizada dos Toasts a partir do tema ativo.
 * Sobrescreve o design padrão do react-native-toast-message para adequar ao Cedro.
 */
export const createToastConfig = (colors: ThemeColors): ToastConfig => ({
  success: (props) => (
    <BaseToast
      {...props}
      style={getToastStyles(colors).successToast}
      contentContainerStyle={getToastStyles(colors).contentContainer}
      text1Style={getToastStyles(colors).text1}
      text2Style={getToastStyles(colors).text2}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={getToastStyles(colors).errorToast}
      contentContainerStyle={getToastStyles(colors).contentContainer}
      text1Style={getToastStyles(colors).text1}
      text2Style={getToastStyles(colors).text2}
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      style={getToastStyles(colors).infoToast}
      contentContainerStyle={getToastStyles(colors).contentContainer}
      text1Style={getToastStyles(colors).text1}
      text2Style={getToastStyles(colors).text2}
    />
  ),
});

/**
 * Estilos dependentes de cor: computados a partir do tema ativo a cada
 * chamada, para os toasts acompanharem light/dark sem reiniciar o app.
 */
const getToastStyles = (colors: ThemeColors): { [key: string]: ViewStyle | TextStyle } =>
  StyleSheet.create({
    successToast: {
      borderLeftColor: colors.success,
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
    },
    errorToast: {
      borderLeftColor: colors.error,
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
    },
    infoToast: {
      borderLeftColor: colors.info,
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
    },
    contentContainer: {
      paddingHorizontal: 15,
    },
    text1: {
      fontSize: typography.size.md,
      fontWeight: typography.weight.bold,
      color: colors.textPrimary,
    },
    text2: {
      fontSize: typography.size.sm,
      color: colors.textSecondary,
    },
  });

/**
 * Componente principal do Toast. Deve ser renderizado na raiz do app (App.tsx).
 */
export const Toast = () => {
  const { colors } = useTheme();
  return <ToastMessage config={createToastConfig(colors)} position="bottom" bottomOffset={80} />;
};

/**
 * Helper para chamar toasts facilmente em qualquer lugar do app.
 */
export const showToast = {
  success: (title: string, message?: string) => {
    ToastMessage.show({
      type: 'success',
      text1: title,
      text2: message,
    });
  },
  error: (title: string, message?: string) => {
    ToastMessage.show({
      type: 'error',
      text1: title,
      text2: message,
    });
  },
  info: (title: string, message?: string) => {
    ToastMessage.show({
      type: 'info',
      text1: title,
      text2: message,
    });
  },
};
