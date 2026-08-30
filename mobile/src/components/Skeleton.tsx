import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { borderRadius as borderRadiusTokens } from '../theme';
import { useTheme } from '../theme/ThemeContext';

type BorderRadiusToken = keyof typeof borderRadiusTokens;

interface SkeletonProps {
  /** Largura do bloco (número em px ou percentual, ex: '80%') */
  width?: number | `${number}%`;
  /** Altura do bloco em px */
  height?: number;
  /** Raio dos cantos usando os tokens de borderRadius (sm | md | lg | xl | 2xl | full) */
  borderRadius?: BorderRadiusToken;
  style?: StyleProp<ViewStyle>;
}

/**
 * Skeleton — placeholder animado para estados de carregamento.
 *
 * Bloco retangular com animação de pulso (opacity), usando apenas a API
 * Animated do React Native (sem libs externas). A cor de fundo é um tom
 * entre `background` e `border` do tema ativo, acompanhando light/dark.
 *
 * Fase 0: componente disponível mas ainda NÃO integrado às telas —
 * a integração acontece nas fases seguintes da reforma visual.
 */
export const Skeleton = ({
  width = '100%',
  height = 16,
  borderRadius: radiusToken = 'md',
  style,
}: SkeletonProps) => {
  const { colors } = useTheme();
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  // Base: um tom entre background e border do tema atual (fixo)
  const baseColor = colors.backgroundTertiary;
  // Overlay: cor de destaque do shimmer (border do tema), com pulso de opacity
  const highlightColor = colors.border;

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
          backgroundColor: baseColor,
          borderRadius: borderRadiusTokens[radiusToken],
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: highlightColor,
            borderRadius: borderRadiusTokens[radiusToken],
            opacity: pulse.interpolate({
              inputRange: [0, 1],
              outputRange: [0.15, 0.55],
            }),
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
