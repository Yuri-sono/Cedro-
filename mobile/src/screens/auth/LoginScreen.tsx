import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { AuthStackParamList } from '../../types/navigation.types';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { spacing, typography, useTheme, ThemeColors } from '../../theme';
import { useAuth } from '../../hooks/useAuth';
import { AuthScreenLayout } from '../../components/AuthScreenLayout';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

WebBrowser.maybeCompleteAuthSession();

export const LoginScreen = () => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<NavigationProp>();
  const { login, loginComGoogle, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const googleClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  const googleEnabled = Platform.OS !== 'web' || !!googleClientId;

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    webClientId: googleClientId ?? 'PLACEHOLDER',
    androidClientId: googleClientId,
    iosClientId: googleClientId,
  });

  useEffect(() => {
    const authResult = response as
      | { type?: string; authentication?: { idToken?: string }; params?: { id_token?: string } }
      | null;
    const idToken = authResult?.authentication?.idToken || authResult?.params?.id_token;
    if (authResult?.type === 'success' && idToken) {
      loginComGoogle(idToken);
    }
  }, [response, loginComGoogle]);

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
        title="Entrar com Google"
        variant="outline"
        onPress={() => promptAsync()}
        disabled={!request || isLoading || !googleEnabled}
        style={styles.googleButton}
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

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
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
    googleButton: {
      marginBottom: spacing.sm,
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
