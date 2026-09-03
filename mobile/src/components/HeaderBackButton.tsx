import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../theme';

interface HeaderBackButtonProps {
  /** Indica se existe tela anterior na pilha. Renderiza null quando falso. */
  canGoBack: boolean;
  onPress?: () => void;
  color?: string;
}

/**
 * Botão de voltar para o header das stacks nativas.
 * Garante que o usuário sempre tenha a "setinha" de retorno visível,
 * mesmo em plataformas onde o botão nativo do header não aparece (ex.: web),
 * evitando que o usuário fique preso em telas como Assinatura.
 */
export const HeaderBackButton = ({ canGoBack, onPress, color }: HeaderBackButtonProps) => {
  const { colors } = useTheme();

  if (!canGoBack) return null;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.hit}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      activeOpacity={0.6}
      accessibilityRole="button"
      accessibilityLabel="Voltar para a tela anterior"
    >
      <Ionicons name="chevron-back" size={26} color={color ?? colors.textPrimary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  hit: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginLeft: 4,
  },
});
