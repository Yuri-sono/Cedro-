import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../theme';
import { Mensagem } from '../types/api.types';
import { useAuthStore } from '../store/authStore';

interface Props {
  mensagem: Mensagem;
}

export const MessageBubble = ({ mensagem }: Props) => {
  const currentUserId = useAuthStore((state: any) => state.user?.id);
  const isMine = mensagem.remetenteId === currentUserId;

  const dataObj = new Date(mensagem.dataCriacao);
  const timeString = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={[styles.container, isMine ? styles.mineContainer : styles.theirsContainer]}>
      <View style={[styles.bubble, isMine ? styles.mineBubble : styles.theirsBubble]}>
        <Text style={[styles.text, isMine ? styles.mineText : styles.theirsText]}>
          {mensagem.mensagem}
        </Text>
        <Text style={[styles.time, isMine ? styles.mineTime : styles.theirsTime]}>
          {timeString}
        </Text>
      </View>
    </View>
  );
};

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
    backgroundColor: colors.primary,
    borderBottomRightRadius: 2,
  },
  theirsBubble: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: {
    fontSize: typography.size.base,
    lineHeight: typography.size.base * typography.lineHeight.normal,
  },
  mineText: {
    color: colors.white,
  },
  theirsText: {
    color: colors.textPrimary,
  },
  time: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  mineTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  theirsTime: {
    color: colors.textSecondary,
  },
});
