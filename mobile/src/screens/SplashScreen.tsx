import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { colors } from '../theme';

export const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../imagemcerta.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cream,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
