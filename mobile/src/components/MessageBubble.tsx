import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing, typography, borderRadius } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { Mensagem } from '../types/api.types';
import { useAuthStore } from '../store/authStore';

interface Props {
  mensagem: Mensagem;
}

export const MessageBubble = ({ mensagem }: Props) => {
  const { colors } = useTheme();
  const currentUserId = useAuthStore((state) => state.user?.id);
  const isMine = mensagem.remetenteId === currentUserId;

  // Estilos dependentes de cor (recomputados por render para acompanhar o tema)
  const colorStyles = StyleSheet.create({
    mineBubble: {
      backgroundColor: colors.primary,
    },
    theirsBubble: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    mineText: {
      color: colors.white,
    },
    theirsText: {
      color: colors.textPrimary,
    },
    theirsTime: {
      color: colors.textSecondary,
    },
  });

  const dataObj = new Date(mensagem.dataCriacao);
  const timeString = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={[styles.container, isMine ? styles.mineContainer : styles.theirsContainer]}>
      <View style={[styles.bubble, isMine ? [styles.mineBubble, colorStyles.mineBubble] : [styles.theirsBubble, colorStyles.theirsBubble]]}>
        <Text style={[styles.text, isMine ? colorStyles.mineText : colorStyles.theirsText]}>
          {mensagem.mensagem}
        </Text>
        <Text style={[styles.time, isMine ? styles.mineTime : colorStyles.theirsTime]}>
          {timeString}
        </Text>
      </View>
    </View>
  );
};

// Estilos estáticos (layout) — independentes de cor
const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: spacing.base,
    marginBottom: spacing.sm,
    flexDirection: 'row',
  },
  mineContainer: {
    justifyContent: 'flex-end',
  },
  theirsContainer: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  mineBubble: {
    borderBottomRightRadius: 2,
  },
  theirsBubble: {
    borderBottomLeftRadius: 2,
    borderWidth: 1,
  },
  text: {
    fontSize: typography.size.base,
    lineHeight: typography.size.base * typography.lineHeight.normal,
  },
  time: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  mineTime: {
    // Bolha própria é sempre verde de marca em ambos os temas → alpha fixo de branco
    color: 'rgba(255,255,255,0.7)',
  },
});
