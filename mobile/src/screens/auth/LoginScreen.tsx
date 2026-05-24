import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation.types';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { colors, spacing, typography } from '../../theme';
import { useAuth } from '../../hooks/useAuth';
import { AuthScreenLayout } from '../../components/AuthScreenLayout';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = () => {
    if (!email || !senha) return;
    login({ email: email.trim(), senha });
  };

  return (
    <AuthScreenLayout
      title="Entrar"
      subtitle="Acesse sua conta para continuar o atendimento"
      footer={
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Ainda nao tem uma conta?</Text>
          <Button
            title="Criar conta"
            variant="text"
            onPress={() => navigation.navigate('Register')}
            textStyle={styles.footerActionText}
          />
        </View>
      }
    >
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
    </AuthScreenLayout>
  );
};

const styles = StyleSheet.create({
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    width: 'auto',
    marginBottom: spacing.base,
  },
  forgotPasswordText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.primaryDark,
  },
  loginButton: {
    marginTop: spacing.xs,
  },
  footerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    marginRight: spacing.xs,
  },
  footerActionText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
});
