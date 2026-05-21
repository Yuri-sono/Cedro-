import React from 'react';
import { View, Image, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme';

interface AvatarProps {
  url?: string | null;
  size?: number;
  style?: ViewStyle;
}

export const Avatar = ({ url, size = 50, style }: AvatarProps) => {
  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  return (
    <View style={[styles.container, containerStyle, style]}>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
