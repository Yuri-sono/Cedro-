import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation.types';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { colors, typography, spacing } from '../../theme';
import { useAuth } from '../../hooks/useAuth';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = () => {
    if (!email || !senha) return;
    login({ email, senha });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          {/* Substituir pelo logo real depois */}
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>CEDRO</Text>
          </View>
          <Text style={styles.title}>Bem-vindo de volta!</Text>
          <Text style={styles.subtitle}>Faça login para continuar</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="E-mail"
            placeholder="Digite seu e-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            label="Senha"
            placeholder="Digite sua senha"
            isPassword
            value={senha}
            onChangeText={setSenha}
          />

          <Button
            title="Esqueci minha senha"
            variant="text"
            style={styles.forgotPasswordButton}
            textStyle={styles.forgotPasswordText}
            onPress={() => navigation.navigate('ForgotPassword')}
          />

          <Button
            title="Entrar"
            onPress={handleLogin}
            isLoading={isLoading}
            disabled={!email || !senha}
            style={styles.loginButton}
          />

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Ainda não tem uma conta? </Text>
            <Button
              title="Cadastre-se"
              variant="text"
              onPress={() => navigation.navigate('Register')}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.xl,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: colors.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
  title: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.size.base,
    color: colors.textSecondary,
  },
  form: {
    width: '100%',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: spacing.xl,
  },
  forgotPasswordText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  loginButton: {
    marginBottom: spacing.xl,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: colors.textSecondary,
  },
});
