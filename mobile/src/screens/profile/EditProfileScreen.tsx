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
import { useAuthStore } from '../../store/authStore';
import { usePerfil } from '../../hooks/usePerfil';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Avatar } from '../../components/Avatar';
import { colors, spacing, typography } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import { TipoUsuario, UpdatePerfilRequest } from '../../types/api.types';

function formatDateForDisplay(dateStr: string | undefined): string {
  if (!dateStr) return '';
  if (dateStr.includes('-')) {
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  }
  return dateStr;
}

function formatDateForApi(dateStr: string | undefined): string | undefined {
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
  const navigation = useNavigation();

  const [nome, setNome] = useState(user?.nome || '');
  const [telefone, setTelefone] = useState(formatPhoneMask(user?.telefone || ''));
  const [dataNascimento, setDataNascimento] = useState(formatDateMask(formatDateForDisplay(user?.dataNascimento)));
  const [genero, setGenero] = useState(user?.genero || '');
  const [endereco, setEndereco] = useState(user?.endereco || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [fotoUrl, setFotoUrl] = useState(user?.fotoUrl || '');
  
  // Campos específicos para psicólogos
  const [especialidade, setEspecialidade] = useState(user?.especialidade || '');
  const [crp, setCrp] = useState(user?.crp || '');
  const [precoSessao, setPrecoSessao] = useState(
    user?.precoSessao ? String(user.precoSessao) : ''
  );

  const isPsicologo = user?.tipoUsuario === TipoUsuario.psicologo;

  const handleChangePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Autorize o acesso às fotos para alterar sua imagem de perfil.');
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
    if (!asset.base64) {
      Alert.alert('Imagem inválida', 'Não foi possível processar essa imagem.');
      return;
    }

    const dataUri = `data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}`;
    if (dataUri.length > 2_000_000) {
      Alert.alert('Imagem muito grande', 'A imagem selecionada é muito grande, tente outra.');
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

    // Adiciona campos específicos de psicólogo
    if (isPsicologo) {
      data.especialidade = especialidade.trim() || undefined;
      data.crp = crp.trim() || undefined;
      data.precoSessao = precoSessao ? parseFloat(precoSessao.replace(',', '.')) : undefined;
    }

    try {
      await atualizarPerfil(data);
      navigation.goBack();
    } catch (error) {
      // Erro já tratado pelo hook
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        {/* Avatar com botão de edição */}
        <View style={styles.avatarContainer}>
          <Avatar url={fotoUrl} size={104} />
          <TouchableOpacity style={styles.changePhotoButton} onPress={handleChangePhoto}>
            <Text style={styles.changePhotoText}>
              {isAtualizandoFoto ? 'Salvando foto...' : 'Alterar foto'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dados Pessoais */}
        <Text style={styles.sectionTitle}>Dados Pessoais</Text>
        
        <Input
          label="Nome Completo"
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
          label="Data de Nascimento"
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
          placeholder="Ex: Masculino, Feminino, Outro"
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

        {/* Campos específicos para Psicólogos */}
        {isPsicologo && (
          <>
            <Text style={styles.sectionTitle}>Dados Profissionais</Text>
            
            <Input
              label="Especialidade"
              value={especialidade}
              onChangeText={setEspecialidade}
              placeholder="Ex: Terapia Cognitivo-Comportamental"
            />

            <Input
              label="CRP (Conselho Regional de Psicologia)"
              value={crp}
              onChangeText={setCrp}
              placeholder="Ex: CRP 06/123456"
            />

            <Input
              label="Preço da Sessão (R$)"
              value={precoSessao}
              onChangeText={setPrecoSessao}
              placeholder="Ex: 150.00"
              keyboardType="decimal-pad"
            />
          </>
        )}

        <Button
          title="Salvar Alterações"
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
  saveButton: {
    marginTop: spacing.xl,
    marginBottom: spacing['2xl'],
  },
});
