import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, typography, spacing, borderRadius , useTheme, ThemeColors } from '../../../theme';

interface Particula {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  raio: number;
  cor: string;
}

const QUANTIDADE = 20;
const VELOCIDADE_FUGA = 4;

const criarParticula = (id: number, largura: number, altura: number): Particula => ({
  id,
  x: Math.random() * (largura - 60) + 30,
  y: Math.random() * (altura - 60) + 30,
  vx: (Math.random() - 0.5) * 2.5,
  vy: (Math.random() - 0.5) * 2.5,
  raio: 10 + Math.random() * 12,
  cor: `hsl(${Math.floor(Math.random() * 360)}, 80%, 45%)`,
});

export const ParticulasFugitivas = () => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const [dimensoes, setDimensoes] = useState({ largura: 0, altura: 0 });
  const [particulas, setParticulas] = useState<Particula[]>([]);
  const [score, setScore] = useState(0);
  const [jogoAtivo, setJogoAtivo] = useState(false);
  const toqueRef = useRef<{ x: number; y: number } | null>(null);
  const proximoId = useRef(0);

  // Loop de animação: move as partículas a ~30fps
  useEffect(() => {
    if (!jogoAtivo || dimensoes.largura === 0) return;
    const intervalo = setInterval(() => {
      setParticulas((prev) =>
        prev.map((p) => {
          let { x, y, vx, vy } = p;
          // Fuga do toque: se o dedo está próximo, acelera na direção oposta
          const toque = toqueRef.current;
          if (toque) {
            const dx = p.x - toque.x;
            const dy = p.y - toque.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120 && dist > 0.01) {
              const forca = (1 - dist / 120) * VELOCIDADE_FUGA;
              vx += (dx / dist) * forca;
              vy += (dy / dist) * forca;
            }
          }
          // Limita a velocidade máxima
          const vel = Math.sqrt(vx * vx + vy * vy);
          if (vel > 6) {
            vx = (vx / vel) * 6;
            vy = (vy / vel) * 6;
          }
          x += vx;
          y += vy;
          // Quica nas bordas
          if (x < p.raio || x > dimensoes.largura - p.raio) {
            vx = -vx;
            x = Math.max(p.raio, Math.min(dimensoes.largura - p.raio, x));
          }
          if (y < p.raio || y > dimensoes.altura - p.raio) {
            vy = -vy;
            y = Math.max(p.raio, Math.min(dimensoes.altura - p.raio, y));
          }
          return { ...p, x, y, vx, vy };
        }),
      );
    }, 33);
    return () => clearInterval(intervalo);
  }, [jogoAtivo, dimensoes]);

  const iniciar = () => {
    setParticulas(
      Array.from({ length: QUANTIDADE }, () =>
        criarParticula(proximoId.current++, dimensoes.largura, dimensoes.altura),
      ),
    );
    setScore(0);
    setJogoAtivo(true);
  };

  const capturar = (id: number) => {
    if (!jogoAtivo) return;
    setParticulas((prev) => prev.filter((p) => p.id !== id));
    setScore((s) => s + 1);
    // Nova partícula surge após 1s (igual ao web)
    setTimeout(() => {
      if (jogoAtivo) {
        setParticulas((prev) => [
          ...prev,
          criarParticula(proximoId.current++, dimensoes.largura, dimensoes.altura),
        ]);
      }
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Partículas Fugitivas</Text>
      <Text style={styles.mensagem}>
        Toque nas partículas coloridas — elas fogem do seu dedo! Quantas você consegue capturar?
      </Text>
      {jogoAtivo && <Text style={styles.score}>Capturadas: {score}</Text>}

      <View
        style={styles.campo}
        onLayout={(e) =>
          setDimensoes({ largura: e.nativeEvent.layout.width, altura: e.nativeEvent.layout.height })
        }
        onStartShouldSetResponder={() => true}
        onResponderMove={(e) => {
          toqueRef.current = { x: e.nativeEvent.locationX, y: e.nativeEvent.locationY };
        }}
        onResponderRelease={() => {
          toqueRef.current = null;
        }}
      >
        {particulas.map((p) => (
          <Pressable
            key={p.id}
            onPress={() => capturar(p.id)}
            hitSlop={6}
            style={[
              styles.particula,
              {
                left: p.x - p.raio,
                top: p.y - p.raio,
                width: p.raio * 2,
                height: p.raio * 2,
                borderRadius: p.raio,
                backgroundColor: p.cor,
              },
            ]}
          />
        ))}

        {!jogoAtivo && (
          <View style={styles.iniciarContainer}>
            <Pressable style={styles.botaoIniciar} onPress={iniciar}>
              <Text style={styles.botaoIniciarTexto}>▶ Começar</Text>
            </Pressable>
          </View>
        )}
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
  score: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  campo: {
    width: '100%',
    height: 340,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.mint,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  particula: {
    position: 'absolute',
  },
  iniciarContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  botaoIniciar: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
    borderRadius: borderRadius.lg,
    minHeight: 48,
    justifyContent: 'center',
  },
  botaoIniciarTexto: {
    color: colors.white,
    fontWeight: typography.weight.bold,
    fontSize: typography.size.md,
  },
});
