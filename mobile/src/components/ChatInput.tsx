import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled }: Props) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Digite uma mensagem..."
        placeholderTextColor={colors.textSecondary}
        multiline
        maxLength={1000}
        editable={!disabled}
      />
      <TouchableOpacity 
        style={[styles.sendButton, (!text.trim() || disabled) && styles.sendButtonDisabled]} 
        onPress={handleSend}
        disabled={!text.trim() || disabled}
      >
        <Text style={styles.sendIcon}>➤</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    minHeight: 40,
    maxHeight: 120,
    fontSize: typography.size.base,
    color: colors.textPrimary,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
    marginBottom: 2, // alinha com a base do input
  },
  sendButtonDisabled: {
    backgroundColor: colors.border,
  },
  sendIcon: {
    color: colors.white,
    fontSize: 18,
    marginLeft: 2, // ajuste visual do ícone
  },
});
