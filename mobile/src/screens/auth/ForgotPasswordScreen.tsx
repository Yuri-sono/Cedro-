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

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { recuperarSenha, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRecover = async () => {
    if (!email) return;
    const success = await recuperarSenha(email);
    if (success) {
      setIsSuccess(true);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Recuperar Senha</Text>
          <Text style={styles.subtitle}>
            {isSuccess 
              ? 'Enviamos as instruções para o seu e-mail.'
              : 'Digite seu e-mail para receber as instruções de recuperação de senha.'}
          </Text>
        </View>

        {!isSuccess ? (
          <View style={styles.form}>
            <Input
              label="E-mail"
              placeholder="Digite seu e-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Button
              title="Enviar Instruções"
              onPress={handleRecover}
              isLoading={isLoading}
              disabled={!email}
              style={styles.recoverButton}
            />
          </View>
        ) : (
          <Button
            title="Voltar ao Login"
            onPress={() => navigation.navigate('Login')}
            style={styles.recoverButton}
          />
        )}

        {!isSuccess && (
          <Button
            title="Voltar"
            variant="text"
            onPress={() => navigation.goBack()}
          />
        )}
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
    lineHeight: typography.size.base * typography.lineHeight.normal,
  },
  form: {
    width: '100%',
  },
  recoverButton: {
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
});
