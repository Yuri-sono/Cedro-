import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { usePerfil } from '../../hooks/usePerfil';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { colors, spacing } from '../../theme';
import { useNavigation } from '@react-navigation/native';

export const EditProfileScreen = () => {
  const user = useAuthStore((state) => state.user);
  const { atualizarPerfil, isAtualizando } = usePerfil();
  const navigation = useNavigation();

  const [nome, setNome] = useState(user?.nome || '');
  const [telefone, setTelefone] = useState(user?.telefone || '');
  const [bio, setBio] = useState(user?.bio || '');

  const handleSave = async () => {
    const success = await atualizarPerfil({ nome, telefone, bio });
    // if success, the mutation already triggers a toast. We can go back.
    if (success !== undefined) {
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Input
          label="Nome Completo"
          value={nome}
          onChangeText={setNome}
          placeholder="Seu nome"
        />
        
        <Input
          label="Telefone"
          value={telefone}
          onChangeText={setTelefone}
          placeholder="(11) 99999-9999"
          keyboardType="phone-pad"
        />
        
        <Input
          label="Biografia"
          value={bio}
          onChangeText={setBio}
          placeholder="Fale um pouco sobre você"
          multiline
          numberOfLines={4}
          style={styles.textArea}
        />

        <Button
          title="Salvar Alterações"
          onPress={handleSave}
          isLoading={isAtualizando}
          style={styles.saveButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: spacing.sm,
  },
  saveButton: {
    marginTop: spacing.xl,
  },
});
