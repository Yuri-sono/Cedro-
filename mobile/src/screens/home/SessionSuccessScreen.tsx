import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing } from '../../theme';
import { Button } from '../../components/Button';
import { RootStackParamList } from '../../types/navigation.types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SessionSuccessScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>✅</Text>
        <Text style={styles.title}>Consulta Agendada!</Text>
        <Text style={styles.message}>
          Sua consulta foi agendada com sucesso. Você receberá uma notificação antes do horário marcado.
        </Text>
        <Text style={styles.info}>
          O pagamento será realizado diretamente com o psicólogo no dia da consulta.
        </Text>
      </View>

      <View style={styles.actions}>
        <Button
          title="Ver Minhas Sessões"
          onPress={() => navigation.navigate('Main', { 
            screen: 'ProfileStack',
            params: { screen: 'MySessions' }
          })}
          style={styles.button}
        />
        <Button
          title="Voltar ao Início"
          variant="outline"
          onPress={() => navigation.navigate('Main', { 
            screen: 'HomeStack',
            params: { screen: 'Home' }
          })}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 80,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.base,
  },
  message: {
    fontSize: typography.size.base,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.size.base * typography.lineHeight.relaxed,
    marginBottom: spacing.xl,
  },
  info: {
    fontSize: typography.size.sm,
    color: colors.info,
    textAlign: 'center',
    fontWeight: typography.weight.medium,
  },
  actions: {
    gap: spacing.base,
  },
  button: {
    marginBottom: spacing.sm,
  },
});
