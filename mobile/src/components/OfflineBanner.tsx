import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useUIStore } from '../store/uiStore';
import { colors, typography, spacing } from '../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const OfflineBanner = () => {
  const isOffline = useUIStore((state) => state.isOffline);
  const setOffline = useUIStore((state) => state.setOffline);
  const insets = useSafeAreaInsets();
  
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
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isOffline, translateY]);

  if (!isOffline && translateY.interpolate({ inputRange: [-100, 0], outputRange: [0, 1] }) as unknown as number === 0) {
      // Pequena otimização: não renderizar se não estiver offline E já estiver escondido.
      // O animated value dificulta isso um pouco, mas ajuda no layout.
      return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, spacing.xs), // Respeitar notch
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={styles.text}>Você está sem conexão com a internet.</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.error,
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
    color: colors.textInverse,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    textAlign: 'center',
  },
});
