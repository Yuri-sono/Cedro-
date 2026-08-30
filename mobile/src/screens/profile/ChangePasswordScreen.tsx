import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { colors, typography, spacing } from '../../theme';
import { usePerfil } from '../../hooks/usePerfil';
import { showToast } from '../../components/Toast';

export const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const { alterarSenha, isAlterandoSenha } = usePerfil();

  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const senhaValidacao = {
    minLength: novaSenha.length >= 6,
    hasNumber: /\d/.test(novaSenha),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(novaSenha),
  };

  const senhaValida =
    senhaValidacao.minLength &&
    senhaValidacao.hasNumber &&
    senhaValidacao.hasSpecial;

  const handleChangePassword = async () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) return;

    if (novaSenha !== confirmarSenha) {
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

    try {
      await alterarSenha({ senhaAtual, novaSenha });
      navigation.goBack();
    } catch (error) {
      // Erro já tratado pelo hook
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Alterar Senha</Text>
          <Text style={styles.subtitle}>
            Digite sua senha atual e escolha uma nova senha segura.
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Senha Atual"
            placeholder="Digite sua senha atual"
            isPassword
            value={senhaAtual}
            onChangeText={setSenhaAtual}
          />

          <Input
            label="Nova Senha"
            placeholder="Digite sua nova senha"
            isPassword
            value={novaSenha}
            onChangeText={setNovaSenha}
          />

          {novaSenha ? (
            <View style={styles.passwordRules}>
              <View style={styles.passwordRuleRow}>
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color={senhaValidacao.minLength ? colors.success : colors.error}
                />
                <Text
                  style={[
                    styles.passwordRule,
                    senhaValidacao.minLength
                      ? styles.passwordRuleValid
                      : styles.passwordRuleInvalid,
                  ]}
                >
                  6+ caracteres
                </Text>
              </View>
              <View style={styles.passwordRuleRow}>
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color={senhaValidacao.hasNumber ? colors.success : colors.error}
                />
                <Text
                  style={[
                    styles.passwordRule,
                    senhaValidacao.hasNumber
                      ? styles.passwordRuleValid
                      : styles.passwordRuleInvalid,
                  ]}
                >
                  1 número
                </Text>
              </View>
              <View style={styles.passwordRuleRow}>
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color={senhaValidacao.hasSpecial ? colors.success : colors.error}
                />
                <Text
                  style={[
                    styles.passwordRule,
                    senhaValidacao.hasSpecial
                      ? styles.passwordRuleValid
                      : styles.passwordRuleInvalid,
                  ]}
                >
                  1 caractere especial
                </Text>
              </View>
            </View>
          ) : null}

          <Input
            label="Confirmar Nova Senha"
            placeholder="Repita sua nova senha"
            isPassword
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            error={
              confirmarSenha && novaSenha !== confirmarSenha
                ? 'As senhas não coincidem.'
                : undefined
            }
          />

          <Button
            title="Alterar Senha"
            onPress={handleChangePassword}
            isLoading={isAlterandoSenha}
            disabled={
              !senhaAtual ||
              !novaSenha ||
              !confirmarSenha ||
              !senhaValida ||
              novaSenha !== confirmarSenha
            }
            style={styles.changeButton}
          />
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
  content: {
    flexGrow: 1,
    padding: spacing.xl,
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
    lineHeight: typography.size.base * 1.5,
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
  passwordRuleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
  changeButton: {
    marginTop: spacing.md,
  },
});
