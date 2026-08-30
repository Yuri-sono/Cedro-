import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing } from '../../theme';
import { Button } from '../../components/Button';
import { HomeStackParamList, RootStackParamList } from '../../types/navigation.types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type SessionSuccessRouteProp = RouteProp<HomeStackParamList, 'SessionSuccess'>;

export const SessionSuccessScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<SessionSuccessRouteProp>();
  const { psicologoId, psicologoNome, avatarUrl, sessaoId } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark" size={42} color={colors.white} />
        </View>
        <Text style={styles.title}>Consulta agendada</Text>
        <Text style={styles.message}>
          Sua consulta com {psicologoNome} foi confirmada. A conversa e a reunião via Google Meet já estão prontas.
        </Text>
        <Text style={styles.info}>
          O pagamento sera realizado diretamente com o psicologo no dia da consulta.
        </Text>
      </View>

      <View style={styles.actions}>
        <Button
          title="Abrir conversa"
          onPress={() => navigation.navigate('Main', {
            screen: 'ChatStack',
            params: {
              screen: 'Chat',
              params: { userId: psicologoId, userName: psicologoNome, avatarUrl },
            },
          })}
          style={styles.button}
        />
        <Button
          title="Entrar na reunião"
          variant="secondary"
          onPress={() => navigation.navigate('Reuniao', { sessaoId })}
          style={styles.button}
        />
        <Button
          title="Ver minhas sessoes"
          variant="outline"
          onPress={() => navigation.navigate('Main', {
            screen: 'ProfileStack',
            params: { screen: 'MySessions' },
          })}
          style={styles.button}
        />
        <Button
          title="Voltar ao inicio"
          variant="text"
          onPress={() => navigation.navigate('Main', {
            screen: 'HomeStack',
            params: { screen: 'Home' },
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
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.forest,
    alignItems: 'center',
    justifyContent: 'center',
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
    color: colors.primary,
    textAlign: 'center',
    fontWeight: typography.weight.medium,
  },
  actions: {
    gap: spacing.sm,
  },
  button: {
    marginBottom: spacing.sm,
  },
});
