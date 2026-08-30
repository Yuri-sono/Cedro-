import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { spacing, borderRadius, typography } from '../theme';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled }: Props) => {
  const { colors } = useTheme();
  const [text, setText] = useState('');

  // Estilos dependentes de cor (recomputados por render para acompanhar o tema)
  const colorStyles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderTopColor: colors.border,
    },
    input: {
      backgroundColor: colors.backgroundSecondary,
      color: colors.textPrimary,
    },
    sendButton: {
      backgroundColor: colors.primary,
    },
    sendButtonDisabled: {
      backgroundColor: colors.border,
    },
  });

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText('');
    }
  };

  const canSend = Boolean(text.trim()) && !disabled;

  return (
    <View style={[styles.container, colorStyles.container]}>
      <TextInput
        style={[styles.input, colorStyles.input]}
        value={text}
        onChangeText={setText}
        placeholder="Digite uma mensagem..."
        placeholderTextColor={colors.textSecondary}
        multiline
        maxLength={1000}
        editable={!disabled}
      />
      <TouchableOpacity
        style={[
          styles.sendButton,
          colorStyles.sendButton,
          !canSend && colorStyles.sendButtonDisabled,
        ]}
        onPress={handleSend}
        disabled={!canSend}
      >
        <Ionicons name="send" size={18} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
};

// Estilos estáticos (layout) — independentes de cor
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    minHeight: 40,
    maxHeight: 120,
    fontSize: typography.size.base,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
    marginBottom: 2,
  },
});
