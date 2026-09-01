import React, { memo, useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, typography, spacing, borderRadius , useTheme, ThemeColors } from '../../../theme';

const BUBBLE_COUNT = 70;

const Bubble = memo(({ onPop }: { onPop: () => void }) => {
  const [estourada, setEstourada] = useState(false);

  const pop = useCallback(() => {
    if (estourada) return;
    setEstourada(true);
    // A bolha "enche" novamente após 4-7 segundos (igual ao web)
    setTimeout(() => setEstourada(false), 4000 + Math.random() * 3000);
  }, [estourada]);

  return (
    <Pressable
      onPress={() => {
        pop();
        onPop();
      }}
      style={[s.bolha, estourada && s.bolhaEstourada]}
      hitSlop={2}
    >
      {!estourada && <View style={s.brilho} />}
    </Pressable>
  );
});

// Estilos internos do Bubble (não dependem do tema)
const s = StyleSheet.create({
  bolha: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,1)',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  bolhaEstourada: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  brilho: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,1)',
    marginTop: 7,
    marginLeft: 7,
  },
});

export const PlasticoBolha = () => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const [estouradas, setEstouradas] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Plástico Bolha Infinito</Text>
      <Text style={styles.mensagem}>
        Estoure as bolhas para relaxar. Elas vão "encher" novamente depois de alguns segundos!
      </Text>
      <Text style={styles.contador}>{estouradas} bolhas estouradas</Text>

      <View style={styles.grade}>
        {Array.from({ length: BUBBLE_COUNT }).map((_, index) => (
          <Bubble key={index} onPop={() => setEstouradas((n) => n + 1)} />
        ))}
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  titulo: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  mensagem: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xs,
    lineHeight: typography.size.sm * 1.4,
  },
  contador: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.accent,
    marginBottom: spacing.base,
  },
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    padding: spacing.base,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.mint,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
