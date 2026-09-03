import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import { AuthStackParamList } from '../../types/navigation.types';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { spacing, typography, useTheme, ThemeColors } from '../../theme';
import { useAuth } from '../../hooks/useAuth';
import { AuthScreenLayout } from '../../components/AuthScreenLayout';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CHAVE_EMAIL_LEMBRADO = '@cedro/lembrar_email';

// Obrigatório para fechar o popup OAuth no web após o redirect
WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';

// No web: redirect para a própria origem (http://localhost:8081 em dev)
// No nativo: resolvido automaticamente pelo SDK
// IMPORTANTE: a URL gerada deve estar registrada no Google Cloud Console
// como Authorized redirect URI.
const redirectUri = makeRedirectUri();

export const LoginScreen = () => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<NavigationProp>();
  // E-mail preenchido automaticamente após criar a conta (fluxo Cadastro → Login)
  const route = useRoute<any>();
  const { login, loginComGoogle, isLoading } = useAuth();

  const [email, setEmail] = useState(route.params?.email ?? '');
  const [senha, setSenha] = useState('');
  const [lembrarEmail, setLembrarEmail] = useState(false);
  const senhaRef = useRef<any>(null);

  const emailValido = EMAIL_RE.test(email.trim());
  const emailErro = email.length > 0 && !emailValido ? 'Informe um e-mail válido.' : undefined;

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    webClientId: GOOGLE_CLIENT_ID,
    redirectUri,
  });

  // Recupera o e-mail lembrado ao abrir a tela
  useEffect(() => {
    (async () => {
      try {
        const salvo = await AsyncStorage.getItem(CHAVE_EMAIL_LEMBRADO);
        if (salvo) {
          setLembrarEmail(true);
          setEmail((atual: string) => atual || salvo);
        }
      } catch {
        // AsyncStorage indisponível — segue sem e-mail lembrado
      }
    })();
  }, []);

  useEffect(() => {
    if (response?.type !== 'success') return;
    const r = response as {
      authentication?: { idToken?: string };
      params?: { id_token?: string };
    };
    const idToken = r.authentication?.idToken ?? r.params?.id_token;
    if (idToken) loginComGoogle(idToken);
  }, [response, loginComGoogle]);

  const handleLogin = async () => {
    if (!emailValido || !senha) return;
    const sucesso = await login({ email: email.trim(), senha });
    if (sucesso) {
      // Praticidade: lembra (ou esquece) o e-mail conforme a escolha do usuário
      try {
        if (lembrarEmail) {
          await AsyncStorage.setItem(CHAVE_EMAIL_LEMBRADO, email.trim());
        } else {
          await AsyncStorage.removeItem(CHAVE_EMAIL_LEMBRADO);
        }
      } catch {
        // Falha silenciosa — não bloqueia o login
      }
    }
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
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        onSubmitEditing={() => senhaRef.current?.focus()}
        value={email}
        onChangeText={setEmail}
        error={emailErro}
      />
      <Input
        ref={senhaRef}
        label="Senha"
        placeholder="Digite sua senha"
        isPassword
        textContentType="password"
        autoComplete="password"
        returnKeyType="go"
        onSubmitEditing={handleLogin}
        value={senha}
        onChangeText={setSenha}
      />

      {/* Praticidade: lembrar e-mail + recuperar senha na mesma linha */}
      <View style={styles.acoesLinha}>
        <TouchableOpacity
          style={styles.lembrar}
          onPress={() => setLembrarEmail((v) => !v)}
          activeOpacity={0.7}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: lembrarEmail }}
          accessibilityLabel="Lembrar meu e-mail"
        >
          <Ionicons
            name={lembrarEmail ? 'checkbox' : 'square-outline'}
            size={18}
            color={lembrarEmail ? colors.primary : colors.textFaint}
          />
          <Text style={styles.lembrarTexto}>Lembrar meu e-mail</Text>
        </TouchableOpacity>

        <Button
          title="Esqueci minha senha"
          variant="text"
          onPress={() => navigation.navigate('ForgotPassword')}
          textStyle={styles.forgotPasswordText}
        />
      </View>

      {!!GOOGLE_CLIENT_ID && (
        <Button
          title="Entrar com Google"
          variant="outline"
          onPress={() => promptAsync()}
          disabled={!request || isLoading}
          style={styles.googleButton}
        />
      )}

      <Button
        title="Entrar"
        onPress={handleLogin}
        isLoading={isLoading}
        disabled={!emailValido || !senha}
        style={styles.loginButton}
      />
    </AuthScreenLayout>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    acoesLinha: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.base,
      marginTop: -spacing.xs,
    },
    lembrar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.xs,
    },
    lembrarTexto: {
      fontSize: typography.size.sm,
      color: colors.textSecondary,
      fontWeight: typography.weight.medium,
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

