import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

export const SplashScreen = () => (
  <View style={styles.container}>
    <Image
      source={require('../../imagemcerta.png')}
      style={styles.image}
      resizeMode="contain"
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F2E9',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
