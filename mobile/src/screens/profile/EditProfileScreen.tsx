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
import { colors, spacing, typography, borderRadius } from '../../theme';
import { TipoUsuario, UpdatePerfilRequest } from '../../types/api.types';
import { ProfileStackParamList } from '../../types/navigation.types';

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'EditProfile'>;
const MAX_PROFILE_PHOTO_DATA_URI_LENGTH = 1_500_000;

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

async function fileToDataUri(file: Blob | File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Falha ao converter imagem'));
      }
    };
    reader.onerror = () => reject(new Error('Falha ao converter imagem'));
    reader.readAsDataURL(file);
  });
}

async function compressWebImage(uri: string): Promise<string> {
  return await new Promise((resolve, reject) => {
    const image = new globalThis.Image();
    image.onload = () => {
      const maxSide = 640;
      const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));

      const context = canvas.getContext('2d');
      if (!context) {
        reject(new Error('Falha ao preparar imagem'));
        return;
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      for (const quality of [0.72, 0.58, 0.44, 0.32]) {
        const dataUri = canvas.toDataURL('image/jpeg', quality);
        if (dataUri.length <= MAX_PROFILE_PHOTO_DATA_URI_LENGTH || quality === 0.32) {
          resolve(dataUri);
          return;
        }
      }
    };
    image.onerror = () => reject(new Error('Falha ao carregar imagem'));
    image.src = uri;
  });
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
  const [areaInteresse, setAreaInteresse] = useState(user?.areaInteresse || '');
  const [fotoUrl, setFotoUrl] = useState<string | undefined>(user?.fotoUrl ?? undefined);

  const isPsicologo = user?.tipoUsuario === TipoUsuario.psicologo;

  const handleChangePhoto = async () => {
    const previousFotoUrl = fotoUrl;

    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permissão necessária', 'Autorize o acesso às fotos para alterar sua imagem.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.25,
        base64: true,
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      if (!asset?.uri) {
        Alert.alert('Imagem inválida', 'Não foi possível processar essa imagem.');
        return;
      }

      setFotoUrl(asset.uri);

      const dataUri =
        Platform.OS === 'web'
          ? await compressWebImage(asset.uri)
          : asset.base64
            ? `data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}`
            : undefined;

      if (!dataUri) {
        Alert.alert('Imagem inválida', 'Não foi possível processar essa imagem.');
        return;
      }

      if (dataUri.length > MAX_PROFILE_PHOTO_DATA_URI_LENGTH) {
        Alert.alert('Imagem muito grande', 'Selecione uma imagem menor ou com menos detalhes.');
        return;
      }

      const response = await atualizarFoto({
        uri: asset.uri,
        fileName: asset.fileName || `perfil-${Date.now()}.jpg`,
        dataUri,
      });

      setFotoUrl(response.fotoUrl || asset.uri);
    } catch {
      setFotoUrl(previousFotoUrl);
      Alert.alert('Foto não salva', 'Não foi possível enviar a imagem. Tente outra foto.');
    }
  };

  const handleSave = async () => {
    const data: UpdatePerfilRequest = {
      nome: nome.trim(),
      telefone: telefone.trim(),
      dataNascimento: formatDateForApi(dataNascimento),
      genero: genero.trim() || undefined,
      endereco: endereco.trim() || undefined,
      bio: bio.trim() || undefined,
      areaInteresse: !isPsicologo ? areaInteresse.trim() || undefined : undefined,
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
          label="Gênero"
          value={genero}
          onChangeText={setGenero}
          placeholder="Ex: Feminino, Masculino, Outro"
        />

        <Input
          label="Endereço"
          value={endereco}
          onChangeText={setEndereco}
          placeholder="Cidade, Estado"
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

        {!isPsicologo && (
          <Input
            label="Área de interesse"
            value={areaInteresse}
            onChangeText={setAreaInteresse}
            placeholder="Ex: TCC, ansiedade, infantil"
          />
        )}

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
          title="Salvar alterações"
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
    backgroundColor: colors.surface,
    borderRadius: borderRadius['2xl'],
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
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
    backgroundColor: colors.surface,
    borderRadius: borderRadius['2xl'],
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
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
