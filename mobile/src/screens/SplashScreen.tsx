import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { colors , useTheme, ThemeColors } from '../theme';

export const SplashScreen = () => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
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

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
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
