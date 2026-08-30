import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useUIStore } from '../store/uiStore';
import { typography, spacing } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const OfflineBanner = () => {
  const isOffline = useUIStore((state) => state.isOffline);
  const setOffline = useUIStore((state) => state.setOffline);
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  // Estilos dependentes de cor (recomputados por render para acompanhar o tema)
  const colorStyles = StyleSheet.create({
    container: {
      backgroundColor: colors.error,
    },
    text: {
      color: colors.textInverse,
    },
  });

  // Controla se o banner está montado (para não bloquear cliques quando oculto)
  const [visible, setVisible] = useState(false);

  // Animação para o banner subir/descer suavemente
  const translateY = React.useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const offline = state.isConnected === false;
      setOffline(offline);
    });

    return () => unsubscribe();
  }, [setOffline]);

  useEffect(() => {
    if (isOffline) {
      setVisible(true);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      // Toca a animação de saída e só então desmonta o banner.
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) setVisible(false);
      });
    }
  }, [isOffline, translateY]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        colorStyles.container,
        {
          paddingTop: Math.max(insets.top, spacing.xs), // Respeitar notch
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={[styles.text, colorStyles.text]}>Você está sem conexão com a internet.</Text>
    </Animated.View>
  );
};

// Estilos estáticos (layout) — independentes de cor
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.base,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  text: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    textAlign: 'center',
  },
});
