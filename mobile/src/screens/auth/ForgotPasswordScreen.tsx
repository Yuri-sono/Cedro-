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

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { recuperarSenha, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRecover = async () => {
    if (!email) return;
    const success = await recuperarSenha(email.trim());
    if (success) {
      setIsSuccess(true);
    }
  };

  return (
    <AuthScreenLayout
      title="Recuperar Senha"
      subtitle={
        isSuccess
          ? 'Senha temporaria gerada. Use a senha exibida no aviso e depois troque no perfil.'
          : 'Informe seu e-mail para gerar uma senha temporaria.'
      }
      footer={
        <View style={styles.footerRow}>
          <Button
            title={isSuccess ? 'Voltar ao login' : 'Cancelar'}
            variant="text"
            onPress={() => navigation.navigate('Login')}
            textStyle={styles.footerActionText}
          />
        </View>
      }
    >
      {!isSuccess ? (
        <>
          <Input
            label="E-mail"
            placeholder="Digite seu e-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Button
            title="Gerar senha temporaria"
            onPress={handleRecover}
            isLoading={isLoading}
            disabled={!email}
            style={styles.recoverButton}
          />
        </>
      ) : (
        <View style={styles.successBox}>
          <Text style={styles.successText}>
            Pronto. Em seguida faca login com a senha temporaria informada no aviso e altere a senha em
            {' '}Perfil {'>'} Alterar Senha.
          </Text>
        </View>
      )}
    </AuthScreenLayout>
  );
};

const styles = StyleSheet.create({
  recoverButton: {
    marginTop: spacing.sm,
  },
  successBox: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    backgroundColor: colors.backgroundTertiary,
    padding: spacing.base,
  },
  successText: {
    color: colors.textPrimary,
    fontSize: typography.size.sm,
    lineHeight: typography.size.sm * 1.5,
  },
  footerRow: {
    alignItems: 'center',
  },
  footerActionText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
});
