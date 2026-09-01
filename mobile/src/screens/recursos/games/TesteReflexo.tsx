import React, { useEffect, useRef, useState } from 'react';
import { Text, StyleSheet, Pressable, Animated } from 'react-native';
import { colors, typography, spacing, borderRadius , useTheme, ThemeColors } from '../../../theme';

type EstadoJogo = 'idle' | 'aguardando' | 'pronto' | 'resultado' | 'cedo';

export const TesteReflexo = () => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const [estado, setEstado] = useState<EstadoJogo>('idle');
  const [tempoReacao, setTempoReacao] = useState<number | null>(null);
  const [melhorTempo, setMelhorTempo] = useState<number | null>(null);
  const inicioRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const escala = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const pulsar = () => {
    escala.setValue(1);
    Animated.spring(escala, {
      toValue: 1.03,
      useNativeDriver: true,
      friction: 3,
      tension: 80,
    }).start();
  };

  const iniciar = () => {
    setEstado('aguardando');
    // Atraso aleatório entre 1.5 e 4s antes de ficar verde (igual ao web)
    timeoutRef.current = setTimeout(() => {
      inicioRef.current = Date.now();
      setEstado('pronto');
      pulsar();
    }, 1500 + Math.random() * 2500);
  };

  const handlePress = () => {
    if (estado === 'idle' || estado === 'resultado' || estado === 'cedo') {
      iniciar();
      return;
    }
    if (estado === 'aguardando') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setEstado('cedo');
      return;
    }
    if (estado === 'pronto') {
      const tempo = Date.now() - inicioRef.current;
      // Anti-cheat: tempo < 50ms é humanamente impossível (igual ao web)
      if (tempo < 50) {
        setEstado('cedo');
        return;
      }
      setTempoReacao(tempo);
      if (melhorTempo === null || tempo < melhorTempo) setMelhorTempo(tempo);
      setEstado('resultado');
    }
  };

  const { fundo, titulo, mensagem } = getVisual(estado, tempoReacao);

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: escala }] }]}>
      <Pressable
        onPress={handlePress}
        style={[styles.area, { backgroundColor: fundo }]}
        accessibilityLabel={mensagem}
      >
        <Text style={[styles.titulo, { color: titulo }]}>{titulo}</Text>
        <Text style={[styles.mensagem, { color: mensagem === 'CLIQUE JÁ!' ? colors.white : colors.textSecondary }]}>
          {mensagem}
        </Text>

        {estado === 'resultado' && tempoReacao !== null && (
          <Text style={styles.tempo}>{tempoReacao} ms</Text>
        )}
        {melhorTempo !== null && estado === 'resultado' && (
          <Text style={styles.recorde}>Melhor: {melhorTempo} ms</Text>
        )}
        {estado === 'idle' && (
          <Text style={styles.dica}>Toque para começar · aguarde o verde antes de tocar!</Text>
        )}
      </Pressable>
    </Animated.View>
  );
};

const getVisual = (estado: EstadoJogo, tempo: number | null) => {
  switch (estado) {
    case 'aguardando':
      return { fundo: colors.danger, titulo: '', mensagem: 'Aguarde a cor mudar para verde...' };
    case 'pronto':
      return { fundo: colors.success, titulo: '', mensagem: 'TOQUE JÁ!' };
    case 'cedo':
      return { fundo: colors.surface, titulo: 'Cedo demais! 😅', mensagem: 'Toque para tentar de novo.' };
    case 'resultado':
      return {
        fundo: colors.surface,
        titulo: 'Seu tempo de reação:',
        mensagem: tempo !== null && tempo < 250 ? 'Reflexo de falcão! 🦅' : 'Bom reflexo! 👏',
      };
    default:
      return {
        fundo: colors.surface,
        titulo: 'Teste de Reflexo',
        mensagem: 'Toque para começar.',
      };
  }
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  area: {
    minHeight: 320,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  titulo: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
  },
  mensagem: {
    fontSize: typography.size.sm,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  tempo: {
    fontSize: 48,
    fontWeight: typography.weight.bold,
    color: colors.primary,
    marginTop: 12,
  },
  recorde: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    marginTop: 4,
  },
  dica: {
    fontSize: typography.size.xs,
    color: colors.textFaint,
    marginTop: 16,
  },
});
