import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation.types';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { colors, spacing, typography } from '../../theme';
import { useAuth } from '../../hooks/useAuth';
import { TipoUsuario } from '../../types/api.types';
import { showToast } from '../../components/Toast';
import { AuthScreenLayout } from '../../components/AuthScreenLayout';

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
      showToast.error('Erro de validacao', 'As senhas nao coincidem.');
      return;
    }

    if (!senhaValida) {
      showToast.error(
        'Senha invalida',
        'Use 6+ caracteres, 1 numero e 1 caractere especial.',
      );
      return;
    }

    const success = await register({
      nome: nome.trim(),
      email: email.trim(),
      senha,
      tipoUsuario: TipoUsuario.paciente,
    });

    if (success) {
      navigation.navigate('Login');
    }
  };

  return (
    <AuthScreenLayout
      title="Criar Conta"
      subtitle="Cadastre-se para agendar sessoes e conversar com seu psicologo"
      footer={
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Ja possui conta?</Text>
          <Button
            title="Entrar"
            variant="text"
            onPress={() => navigation.goBack()}
            textStyle={styles.footerActionText}
          />
        </View>
      }
    >
      <Input
        label="Nome completo"
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
            1 numero
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
        label="Confirmar senha"
        placeholder="Repita sua senha"
        isPassword
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        error={confirmarSenha && senha !== confirmarSenha ? 'As senhas nao coincidem.' : undefined}
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
    </AuthScreenLayout>
  );
};

const styles = StyleSheet.create({
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
  },
  footerRow: {
    flexDirection: 'row',
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
