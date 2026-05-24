import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography } from '../../theme';
import { RootStackParamList } from '../../types/navigation.types';

type VideoCallRouteProp = RouteProp<RootStackParamList, 'VideoCall'>;
type VideoCallNavigationProp = NativeStackNavigationProp<RootStackParamList, 'VideoCall'>;

export const VideoCallScreen = () => {
  const route = useRoute<VideoCallRouteProp>();
  const navigation = useNavigation<VideoCallNavigationProp>();
  const { userName } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Video chamadas não suportadas na versão Web.</Text>
      <Text style={styles.text}>Você tentou ligar para {userName}.</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  text: {
    color: colors.white,
    fontSize: typography.size.md,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 8,
    marginTop: spacing.xl,
  },
  buttonText: {
    color: colors.white,
    fontWeight: typography.weight.bold,
  }
});
