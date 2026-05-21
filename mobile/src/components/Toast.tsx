import React from 'react';
import ToastMessage, { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';
import { StyleSheet } from 'react-native';
import { colors, typography, borderRadius } from '../theme';

/**
 * Configuração visual padronizada para os Toasts.
 * Sobrescreve o design padrão do react-native-toast-message para adequar ao Cedro.
 */
export const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={styles.successToast}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={styles.errorToast}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      style={styles.infoToast}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),
};

/**
 * Componente principal do Toast. Deve ser renderizado na raiz do app (App.tsx).
 */
export const Toast = () => {
  return <ToastMessage config={toastConfig} position="bottom" bottomOffset={80} />;
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

const styles = StyleSheet.create({
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
