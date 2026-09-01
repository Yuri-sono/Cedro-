import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, typography, spacing , useTheme, ThemeColors } from '../../theme';
import { PlasticoBolha } from './games/PlasticoBolha';
import { TesteReflexo } from './games/TesteReflexo';
import { ParticulasFugitivas } from './games/ParticulasFugitivas';

type Jogo = 'bolhas' | 'reflexo' | 'particulas';

const ABAS: { id: Jogo; emoji: string; label: string }[] = [
  { id: 'bolhas', emoji: '🫧', label: 'Plástico Bolha' },
  { id: 'reflexo', emoji: '⚡', label: 'Teste de Reflexo' },
  { id: 'particulas', emoji: '✨', label: 'Partículas Fugitivas' },
];

export const PassatemposScreen = () => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const [ativo, setAtivo] = useState<Jogo>('bolhas');

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        <Text style={styles.titulo}>Passatempos para Relaxar</Text>
        <Text style={styles.subtitulo}>
          Tire um momento só para você. Escolha uma atividade interativa para se distrair, aliviar a
          ansiedade ou apenas passar o tempo.
        </Text>

        {/* Seletor de jogo */}
        <View style={styles.abas}>
          {ABAS.map((aba) => (
            <View key={aba.id} style={styles.abaItem}>
              <Text
                style={[styles.abaTexto, ativo === aba.id && styles.abaTextoAtivo]}
                onPress={() => setAtivo(aba.id)}
              >
                {aba.emoji} {aba.label}
              </Text>
              {ativo === aba.id && <View style={styles.abaIndicador} />}
            </View>
          ))}
        </View>

        <View style={styles.cardJogo}>
          {ativo === 'bolhas' && <PlasticoBolha />}
          {ativo === 'reflexo' && <TesteReflexo />}
          {ativo === 'particulas' && <ParticulasFugitivas />}
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  conteudo: {
    padding: spacing.base,
    paddingBottom: spacing['2xl'],
  },
  titulo: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
    lineHeight: typography.size.sm * 1.5,
  },
  abas: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
    marginBottom: spacing.lg,
  },
  abaItem: {
    flex: 1,
    alignItems: 'center',
  },
  abaTexto: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingBottom: spacing.sm,
    minHeight: 44,
  },
  abaTextoAtivo: {
    color: colors.primary,
  },
  abaIndicador: {
    height: 3,
    width: '80%',
    backgroundColor: colors.primary,
    borderRadius: 2,
    marginBottom: -2,
  },
  cardJogo: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.lg,
    alignItems: 'center',
  },
});
