import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation.types';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { spacing, typography, useTheme, ThemeColors } from '../../theme';
import { useAuth } from '../../hooks/useAuth';
import { AuthScreenLayout } from '../../components/AuthScreenLayout';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen = () => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
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
          ? 'Se o e-mail estiver cadastrado, você receberá as instruções de redefinição em breve.'
          : 'Informe seu e-mail para receber o link de redefinição de senha.'
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
            title="Enviar link de redefinição"
            onPress={handleRecover}
            isLoading={isLoading}
            disabled={!email}
            style={styles.recoverButton}
          />
        </>
      ) : (
        <View style={styles.successBox}>
          <Text style={styles.successText}>
            Se o e-mail estiver cadastrado, você receberá as instruções em breve.
            Verifique sua caixa de entrada.
          </Text>
        </View>
      )}
    </AuthScreenLayout>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
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
