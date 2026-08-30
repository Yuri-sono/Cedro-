import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { typography, spacing, borderRadius, lightColors } from '../theme';
import { ThemeColors } from '../theme/colors';
import { ThemeContext, ThemeContextValue } from '../theme/ThemeContext';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary é um class component e não pode usar o hook useTheme().
 * Ele consome o ThemeContext via `static contextType`, herdando a paleta
 * ativa (light/dark) do ThemeProvider. Se renderizado fora do provider,
 * cai na paleta light como fallback seguro.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  // Consome o tema dinâmico (equivalente a useTheme() para class components)
  static contextType = ThemeContext;
  declare context: ThemeContextValue | undefined;

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Aqui no futuro podemos enviar para Crashlytics ou Sentry
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const colors: ThemeColors = this.context?.colors ?? lightColors;

      // Estilos dependentes de cor (recomputados por render com o tema ativo)
      const colorStyles = StyleSheet.create({
        container: {
          backgroundColor: colors.background,
        },
        title: {
          color: colors.textPrimary,
        },
        subtitle: {
          color: colors.textSecondary,
        },
        errorBox: {
          backgroundColor: colors.backgroundSecondary,
          borderLeftColor: colors.error,
        },
        errorText: {
          color: colors.error,
        },
        button: {
          backgroundColor: colors.primary,
        },
        buttonText: {
          color: colors.textInverse,
        },
      });

      return (
        <SafeAreaView style={[styles.container, colorStyles.container]}>
          <View style={styles.content}>
            <Text style={[styles.title, colorStyles.title]}>Oops! Algo deu errado.</Text>
            <Text style={[styles.subtitle, colorStyles.subtitle]}>
              Ocorreu um erro inesperado. Nossa equipe já foi notificada.
            </Text>
            
            {__DEV__ && this.state.error && (
              <View style={[styles.errorBox, colorStyles.errorBox]}>
                <Text style={[styles.errorText, colorStyles.errorText]}>
                  {this.state.error.message}
                </Text>
              </View>
            )}

            <TouchableOpacity style={[styles.button, colorStyles.button]} onPress={this.handleReset}>
              <Text style={[styles.buttonText, colorStyles.buttonText]}>Tentar Novamente</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

// Estilos estáticos (layout) — independentes de cor
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['2xl'],
  },
  title: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.size.base,
    textAlign: 'center',
    marginBottom: spacing['2xl'],
    lineHeight: typography.size.base * typography.lineHeight.normal,
  },
  errorBox: {
    padding: spacing.base,
    borderRadius: borderRadius.md,
    marginBottom: spacing['2xl'],
    width: '100%',
    borderLeftWidth: 4,
  },
  errorText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: typography.size.sm,
  },
  button: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
  },
});
