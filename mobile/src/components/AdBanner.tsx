import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuthStore } from '../store/authStore';
import { subscriptionService } from '../services/subscriptionService';
import { useTheme, spacing, typography, borderRadius } from '../theme';
import { navigationRef } from '../navigation/navigationRef';

/**
 * Banner flutuante de anúncios — espelho do AdBanner.jsx do web.
 * - Primeiro aparecimento após 5s, depois a cada 30s
 * - Auto-fecha após 8s (ou pelo botão X)
 * - Oculto para usuários Premium (fonte da verdade: /api/assinatura/status)
 * - Toque no corpo abre a tela de assinatura
 */

const ADS = [
  {
    title: 'Cuide da sua mente',
    description: 'Agende sua primeira sessão com desconto',
    icon: 'fitness' as const,
    color: '#2F6B4F',
  },
  {
    title: 'Meditação guiada',
    description: 'Novos exercícios disponíveis',
    icon: 'headset' as const,
    color: '#2F6B4F',
  },
  {
    title: 'E-books gratuitos',
    description: 'Baixe materiais sobre saúde mental',
    icon: 'book' as const,
    color: '#C6952F',
  },
] as const;

const FIRST_DELAY_MS = 5000;
const INTERVAL_MS = 30000;
const AUTO_CLOSE_MS = 8000;

export const AdBanner = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { colors } = useTheme();
  const [show, setShow] = useState(false);
  const [adIndex, setAdIndex] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const slideTranslate = slideAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] });
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Checa premium no backend (fonte da verdade) — só quando logado,
  // para não disparar o logout automático do interceptor em 401.
  useEffect(() => {
    let active = true;
    if (!isAuthenticated) {
      setIsPremium(false);
      return;
    }
    subscriptionService
      .verificarLimite()
      .then((status) => {
        if (active) setIsPremium(status.isPremium);
      })
      .catch(() => {
        // Em erro de rede, não exibe anúncios (experiência mais limpa)
        if (active) setIsPremium(true);
      });
    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const fechar = () => {
    setShow(false);
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
  };

  const mostrarAnuncio = () => {
    setAdIndex(Math.floor(Math.random() * ADS.length));
    setShow(true);
    slideAnim.setValue(0);
    Animated.spring(slideAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
      tension: 60,
    }).start();
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    closeTimeout.current = setTimeout(() => setShow(false), AUTO_CLOSE_MS);
  };

  // Ciclo de exibição: primeiro após 5s, depois a cada 30s
  useEffect(() => {
    if (isPremium) return;
    const first = setTimeout(mostrarAnuncio, FIRST_DELAY_MS);
    const interval = setInterval(mostrarAnuncio, INTERVAL_MS);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPremium]);

  if (!show || isPremium) return null;

  const ad = ADS[adIndex];
  const animStyle = {
    opacity: slideAnim as unknown as number,
    transform: [{ translateY: slideTranslate as unknown as number }],
  };

  return (
    <Animated.View
      style={[
        styles.banner,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        animStyle,
      ]}
    >
      <TouchableOpacity
        style={styles.body}
        activeOpacity={0.8}
        onPress={() => {
          fechar();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (navigationRef as any).navigate('Main', { screen: 'ProfileStack', params: { screen: 'Subscription' } });
        }}
      >
        <View style={[styles.icone, { backgroundColor: `${ad.color}1A` }]}>
          <Ionicons name={ad.icon} size={20} color={ad.color} />
        </View>
        <View style={styles.conteudo}>
          <Text style={[styles.titulo, { color: colors.textPrimary }]}>{ad.title}</Text>
          <Text style={[styles.descricao, { color: colors.textSecondary }]}>
            {ad.description}
          </Text>
        </View>
        <Ionicons name="sparkles" size={16} color={colors.accent} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.fechar}
        onPress={fechar}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityLabel="Fechar anúncio"
      >
        <Ionicons name="close" size={16} color={colors.textSecondary} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    left: spacing.base,
    right: 96, // espaço para o botão SOS à direita
    bottom: 100,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    zIndex: 997,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.base,
    paddingRight: spacing.xl,
  },
  icone: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  conteudo: {
    flex: 1,
  },
  titulo: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
  },
  descricao: {
    fontSize: typography.size.xs,
    marginTop: 2,
  },
  fechar: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});