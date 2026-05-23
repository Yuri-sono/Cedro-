import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation.types';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { colors, typography, spacing } from '../../theme';
import { useAuth } from '../../hooks/useAuth';
import { TipoUsuario } from '../../types/api.types';
import { showToast } from '../../components/Toast';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export const RegisterScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { register, isLoading } = useAuth();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const senhaValidacao = {
    minLength: senha.length >= 6,
    hasNumber: /\d/.test(senha),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(senha),
  };

  const senhaValida =
    senhaValidacao.minLength &&
    senhaValidacao.hasNumber &&
    senhaValidacao.hasSpecial;

  const handleRegister = async () => {
    if (!nome || !email || !senha) return;
    
    if (senha !== confirmarSenha) {
      showToast.error('Erro de validação', 'As senhas não coincidem.');
      return;
    }

    if (!senhaValida) {
      showToast.error(
        'Senha inválida',
        'Use 6+ caracteres, 1 número e 1 caractere especial.',
      );
      return;
    }

    const success = await register({
      nome: nome.trim(),
      email: email.trim(),
      senha,
      tipoUsuario: TipoUsuario.paciente, // Padrão: registro pelo app é sempre paciente
    });

    if (success) {
      navigation.navigate('Login');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Preencha seus dados para começar</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Nome Completo"
            placeholder="Digite seu nome"
            autoCapitalize="words"
            value={nome}
            onChangeText={setNome}
          />
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
            placeholder="Crie uma senha"
            isPassword
            value={senha}
            onChangeText={setSenha}
          />
          {senha ? (
            <View style={styles.passwordRules}>
              <Text
                style={[
                  styles.passwordRule,
                  senhaValidacao.minLength ? styles.passwordRuleValid : styles.passwordRuleInvalid,
                ]}
              >
                6+ caracteres
              </Text>
              <Text
                style={[
                  styles.passwordRule,
                  senhaValidacao.hasNumber ? styles.passwordRuleValid : styles.passwordRuleInvalid,
                ]}
              >
                1 número
              </Text>
              <Text
                style={[
                  styles.passwordRule,
                  senhaValidacao.hasSpecial ? styles.passwordRuleValid : styles.passwordRuleInvalid,
                ]}
              >
                1 caractere especial
              </Text>
            </View>
          ) : null}
          <Input
            label="Confirmar Senha"
            placeholder="Repita sua senha"
            isPassword
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            error={
              confirmarSenha && senha !== confirmarSenha
                ? 'As senhas não coincidem.'
                : undefined
            }
          />

          <Button
            title="Cadastrar"
            onPress={handleRegister}
            isLoading={isLoading}
            disabled={
              !nome ||
              !email ||
              !senha ||
              !confirmarSenha ||
              !senhaValida ||
              senha !== confirmarSenha
            }
            style={styles.registerButton}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Já tem uma conta? </Text>
            <Button
              title="Faça login"
              variant="text"
              onPress={() => navigation.goBack()}
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
  header: {
    marginBottom: spacing['2xl'],
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
  passwordRules: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: -spacing.sm,
    marginBottom: spacing.base,
  },
  passwordRule: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
  },
  passwordRuleValid: {
    color: colors.success,
  },
  passwordRuleInvalid: {
    color: colors.error,
  },
  registerButton: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: colors.textSecondary,
  },
});
