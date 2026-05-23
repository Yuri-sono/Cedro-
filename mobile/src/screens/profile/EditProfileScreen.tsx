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
import { useAuthStore } from '../../store/authStore';
import { usePerfil } from '../../hooks/usePerfil';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Avatar } from '../../components/Avatar';
import { colors, spacing, typography } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import { TipoUsuario } from '../../types/api.types';

export const EditProfileScreen = () => {
  const user = useAuthStore((state) => state.user);
  const { atualizarPerfil, isAtualizando } = usePerfil();
  const navigation = useNavigation();

  const [nome, setNome] = useState(user?.nome || '');
  const [telefone, setTelefone] = useState(user?.telefone || '');
  const [dataNascimento, setDataNascimento] = useState(user?.dataNascimento || '');
  const [genero, setGenero] = useState(user?.genero || '');
  const [endereco, setEndereco] = useState(user?.endereco || '');
  const [bio, setBio] = useState(user?.bio || '');
  
  // Campos específicos para psicólogos
  const [especialidade, setEspecialidade] = useState(user?.especialidade || '');
  const [crp, setCrp] = useState(user?.crp || '');
  const [precoSessao, setPrecoSessao] = useState(
    user?.precoSessao ? String(user.precoSessao) : ''
  );

  const isPsicologo = user?.tipoUsuario === TipoUsuario.psicologo;

  const handleChangePhoto = () => {
    Alert.alert(
      'Foto de Perfil',
      'Funcionalidade de upload de foto será implementada em breve.',
      [{ text: 'OK' }]
    );
  };

  const handleSave = async () => {
    const data: any = {
      nome: nome.trim(),
      telefone: telefone.trim(),
      dataNascimento: dataNascimento.trim() || undefined,
      genero: genero.trim() || undefined,
      endereco: endereco.trim() || undefined,
      bio: bio.trim() || undefined,
    };

    // Adiciona campos específicos de psicólogo
    if (isPsicologo) {
      data.especialidade = especialidade.trim() || undefined;
      data.crp = crp.trim() || undefined;
      data.precoSessao = precoSessao ? parseFloat(precoSessao) : undefined;
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
          <Avatar url={user?.fotoUrl} size={100} />
          <TouchableOpacity style={styles.changePhotoButton} onPress={handleChangePhoto}>
            <Text style={styles.changePhotoText}>Alterar Foto</Text>
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
          onChangeText={setTelefone}
          placeholder="(11) 99999-9999"
          keyboardType="phone-pad"
        />

        <Input
          label="Data de Nascimento"
          value={dataNascimento}
          onChangeText={setDataNascimento}
          placeholder="DD/MM/AAAA"
          keyboardType="numeric"
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
          disabled={!nome.trim()}
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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
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
