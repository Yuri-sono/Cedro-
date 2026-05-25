import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { usePerfil } from '../../hooks/usePerfil';
import { useAuthStore } from '../../store/authStore';
import { colors, spacing, typography } from '../../theme';
import { TipoUsuario, UpdatePerfilRequest } from '../../types/api.types';
import { ProfileStackParamList } from '../../types/navigation.types';

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'EditProfile'>;

function formatDateForDisplay(dateStr?: string | null): string {
  if (!dateStr) return '';
  if (dateStr.includes('-')) {
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  }
  return dateStr;
}

function formatDateForApi(dateStr?: string): string | undefined {
  if (!dateStr) return undefined;
  const clean = dateStr.trim();
  if (clean.includes('/')) {
    const parts = clean.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  }
  return clean || undefined;
}

function formatDateMask(text: string): string {
  const cleaned = text.replace(/\D/g, '');
  let formatted = cleaned;
  if (formatted.length > 2) {
    formatted = `${formatted.slice(0, 2)}/${formatted.slice(2)}`;
  }
  if (formatted.length > 5) {
    formatted = `${formatted.slice(0, 5)}/${formatted.slice(5, 9)}`;
  }
  return formatted;
}

function formatPhoneMask(text: string): string {
  const cleaned = text.replace(/\D/g, '');
  let formatted = cleaned;
  if (formatted.length > 0) {
    formatted = `(${formatted.slice(0, 2)}`;
  }
  if (cleaned.length > 2) {
    formatted = `${formatted}) ${cleaned.slice(2, 7)}`;
  }
  if (cleaned.length > 7) {
    formatted = `${formatted}-${cleaned.slice(7, 11)}`;
  }
  return formatted;
}

export const EditProfileScreen = () => {
  const user = useAuthStore((state) => state.user);
  const { atualizarPerfil, atualizarFoto, isAtualizando, isAtualizandoFoto } = usePerfil();
  const navigation = useNavigation<NavigationProp>();

  const [nome, setNome] = useState(user?.nome || '');
  const [telefone, setTelefone] = useState(formatPhoneMask(user?.telefone || ''));
  const [dataNascimento, setDataNascimento] = useState(
    formatDateMask(formatDateForDisplay(user?.dataNascimento)),
  );
  const [genero, setGenero] = useState(user?.genero || '');
  const [endereco, setEndereco] = useState(user?.endereco || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [fotoUrl, setFotoUrl] = useState<string | undefined>(user?.fotoUrl ?? undefined);

  const isPsicologo = user?.tipoUsuario === TipoUsuario.psicologo;

  const handleChangePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissao necessaria', 'Autorize o acesso as fotos para alterar sua imagem.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.2,
      base64: true,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    let dataUri = asset.base64
      ? `data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}`
      : undefined;

    if (!dataUri && Platform.OS === 'web' && asset.uri) {
      try {
        const response = await fetch(asset.uri);
        const blob = await response.blob();
        dataUri = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error('Falha ao ler imagem'));
          reader.readAsDataURL(blob);
        });
      } catch {
        dataUri = undefined;
      }
    }

    if (!dataUri) {
      Alert.alert('Imagem invalida', 'Nao foi possivel processar essa imagem.');
      return;
    }
    if (dataUri.length > 2_000_000) {
      Alert.alert('Imagem muito grande', 'Selecione uma imagem menor para a demo.');
      return;
    }

    await atualizarFoto(dataUri);
    setFotoUrl(dataUri);
  };

  const handleSave = async () => {
    const data: UpdatePerfilRequest = {
      nome: nome.trim(),
      telefone: telefone.trim(),
      dataNascimento: formatDateForApi(dataNascimento),
      genero: genero.trim() || undefined,
      endereco: endereco.trim() || undefined,
      bio: bio.trim() || undefined,
    };

    try {
      await atualizarPerfil(data);
      navigation.goBack();
    } catch {
      // O hook ja exibe o erro.
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarContainer}>
          <Avatar url={fotoUrl} size={104} />
          <TouchableOpacity style={styles.changePhotoButton} onPress={handleChangePhoto}>
            <Text style={styles.changePhotoText}>
              {isAtualizandoFoto ? 'Salvando foto...' : 'Alterar foto'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Dados pessoais</Text>

        <Input
          label="Nome completo"
          value={nome}
          onChangeText={setNome}
          placeholder="Seu nome"
          autoCapitalize="words"
        />

        <Input
          label="E-mail"
          value={user?.email}
          editable={false}
          placeholder="Seu e-mail"
          style={styles.disabledInput}
        />

        <Input
          label="Telefone"
          value={telefone}
          onChangeText={(text) => setTelefone(formatPhoneMask(text))}
          placeholder="(11) 99999-9999"
          keyboardType="phone-pad"
          maxLength={15}
        />

        <Input
          label="Data de nascimento"
          value={dataNascimento}
          onChangeText={(text) => setDataNascimento(formatDateMask(text))}
          placeholder="DD/MM/AAAA"
          keyboardType="numeric"
          maxLength={10}
        />

        <Input
          label="Genero"
          value={genero}
          onChangeText={setGenero}
          placeholder="Ex: Feminino, Masculino, Outro"
        />

        <Input
          label="Endereco"
          value={endereco}
          onChangeText={setEndereco}
          placeholder="Cidade, Estado"
        />

        <Input
          label="Biografia"
          value={bio}
          onChangeText={setBio}
          placeholder="Fale um pouco sobre voce"
          multiline
          numberOfLines={4}
          style={styles.textArea}
        />

        {isPsicologo && (
          <TouchableOpacity
            style={styles.psychologistCta}
            onPress={() => navigation.navigate('PsychologistSettings')}
          >
            <Text style={styles.psychologistCtaTitle}>Configurar atendimento</Text>
            <Text style={styles.psychologistCtaText}>
              Ajuste valor da consulta, disponibilidade e dados profissionais em uma tela dedicada.
            </Text>
          </TouchableOpacity>
        )}

        <Button
          title="Salvar alteracoes"
          onPress={handleSave}
          isLoading={isAtualizando}
          disabled={!nome.trim() || isAtualizandoFoto}
          style={styles.saveButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing['3xl'],
    maxWidth: 520,
    width: '100%',
    alignSelf: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
    backgroundColor: colors.surfaceWarm,
    borderRadius: 24,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: '#E7DCC6',
  },
  changePhotoButton: {
    marginTop: spacing.sm,
  },
  changePhotoText: {
    color: colors.primary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.base,
  },
  disabledInput: {
    opacity: 0.6,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: spacing.sm,
  },
  psychologistCta: {
    backgroundColor: colors.surfaceWarm,
    borderRadius: 20,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: '#E7DCC6',
    marginTop: spacing.sm,
  },
  psychologistCtaTitle: {
    color: colors.textPrimary,
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
  },
  psychologistCtaText: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    marginTop: spacing.xs,
  },
  saveButton: {
    marginTop: spacing.xl,
    marginBottom: spacing['2xl'],
  },
});
