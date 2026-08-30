import React from 'react';
import { View, Image, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface AvatarProps {
  url?: string | null;
  size?: number;
  style?: ViewStyle;
}

export const Avatar = ({ url, size = 50, style }: AvatarProps) => {
  const { colors } = useTheme();

  // Estilos dependentes de cor (recomputados por render para acompanhar o tema)
  const colorStyles = StyleSheet.create({
    container: {
      backgroundColor: colors.backgroundSecondary,
      borderColor: colors.border,
    },
  });

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  return (
    <View style={[styles.container, colorStyles.container, containerStyle, style]}>
      {url ? (
        <Image
          source={{ uri: url }}
          style={[styles.image, containerStyle]}
          resizeMode="cover"
        />
      ) : (
        <Image
          source={require('../../assets/default-avatar.png')} // Precisa existir na pasta assets
          style={[styles.image, containerStyle]}
          resizeMode="cover"
        />
      )}
    </View>
  );
};

// Estilos estáticos (layout) — independentes de cor
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

