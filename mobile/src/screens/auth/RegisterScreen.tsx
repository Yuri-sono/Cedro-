import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation.types';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { spacing, typography, useTheme, ThemeColors } from '../../theme';
import { useAuth } from '../../hooks/useAuth';
import { TipoUsuario } from '../../types/api.types';
import { showToast } from '../../components/Toast';
import { AuthScreenLayout } from '../../components/AuthScreenLayout';
import api from '../../services/api';
import { API_ENDPOINTS } from '../../constants/api';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export const RegisterScreen = () => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<NavigationProp>();
  const { register, isLoading } = useAuth();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [confirmarEmail, setConfirmarEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>(TipoUsuario.paciente);
  const [tipoPsicologo, setTipoPsicologo] = useState('');
  const [crp, setCrp] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [areaInteresse, setAreaInteresse] = useState('');
  const [precoSessao, setPrecoSessao] = useState('');
  const [crpStatus, setCrpStatus] = useState<
    'idle' | 'checking' | 'valid' | 'invalid' | 'format_error'
  >('idle');
  const [crpMessage, setCrpMessage] = useState('');

  const validarFormatoCrp = (valor: string) => /^\d{2}\/\d{5,6}$/.test(valor);

  const verificarCrp = async (valor: string) => {
    if (!validarFormatoCrp(valor)) {
      setCrpStatus('format_error');
      setCrpMessage('Formato inválido. Use: XX/XXXXXX (ex: 06/123456)');
      return;
    }
    setCrpStatus('checking');
    setCrpMessage('Verificando CRP...');
    try {
      const response = await api.get<{ valido: boolean; mensagem?: string }>(
        API_ENDPOINTS.PSICOLOGOS.VERIFICAR_CRP,
        { params: { crp: valor } },
      );
      if (response.data.valido) {
        setCrpStatus('valid');
        setCrpMessage('CRP verificado com sucesso!');
      } else {
        setCrpStatus('invalid');
        setCrpMessage(response.data.mensagem || 'CRP não encontrado no sistema.');
      }
    } catch (error: any) {
      const mensagemBackend = error.response?.data?.mensagem || error.response?.data?.error;
      if (error.response?.status === 409) {
        setCrpStatus('invalid');
        setCrpMessage('Este CRP já está cadastrado na plataforma.');
      } else if (error.response?.status === 400 && mensagemBackend) {
        setCrpStatus('format_error');
        setCrpMessage(mensagemBackend);
      } else {
        setCrpStatus('valid');
        setCrpMessage('Formato de CRP válido');
      }
    }
  };

  const senhaValidacao = {
    minLength: senha.length >= 6,
    hasNumber: /\d/.test(senha),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(senha),
  };

  const senhaValida =
    senhaValidacao.minLength &&
    senhaValidacao.hasNumber &&
    senhaValidacao.hasSpecial;

  const handleRegister = async () => {
    if (!nome || !email || !senha) return;

    if (email !== confirmarEmail) {
      showToast.error('Erro de validacao', 'Os emails nao coincidem.');
      return;
    }

    if (senha !== confirmarSenha) {
      showToast.error('Erro de validacao', 'As senhas nao coincidem.');
      return;
    }

    if (!senhaValida) {
      showToast.error(
        'Senha invalida',
        'Use 6+ caracteres, 1 numero e 1 caractere especial.',
      );
      return;
    }

    const isPsicologo = tipoUsuario === TipoUsuario.psicologo;
    const parsedPrice = precoSessao
      ? Number(precoSessao.replace(/\./g, '').replace(',', '.'))
      : undefined;

    if (isPsicologo) {
      if (!crp.trim() || !especialidade.trim()) {
        showToast.error('Dados profissionais', 'Informe CRP e especialidade para o cadastro.');
        return;
      }

      if (crpStatus === 'invalid') {
        showToast.error(
          'CRP inválido',
          'O CRP informado não foi validado. Verifique e tente novamente.',
        );
        return;
      }

      if (!validarFormatoCrp(crp.trim())) {
        showToast.error('CRP inválido', 'Use o formato XX/XXXXXX (ex: 06/123456).');
        return;
      }

      if (!tipoPsicologo.trim()) {
        showToast.error('Tipo de psicologo', 'Informe o tipo de atendimento que voce oferece.');
        return;
      }

      if (!parsedPrice || !Number.isFinite(parsedPrice) || parsedPrice <= 0) {
        showToast.error('Valor da consulta', 'Informe um valor valido para atendimento.');
        return;
      }
    }

    const success = await register({
      nome: nome.trim(),
      email: email.trim(),
      senha,
      tipoUsuario,
      tipoPsicologo: isPsicologo ? tipoPsicologo.trim() : undefined,
      crp: isPsicologo ? crp.trim() : undefined,
      especialidade: isPsicologo ? especialidade.trim() : undefined,
      areaInteresse: !isPsicologo ? areaInteresse.trim() || undefined : undefined,
      precoSessao: isPsicologo ? parsedPrice : undefined,
    });

    if (success) {
      navigation.navigate('Login');
    }
  };

  return (
    <AuthScreenLayout
      title="Criar Conta"
      subtitle="Cadastre-se para agendar sessoes e conversar com seu psicologo"
      footer={
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Ja possui conta?</Text>
          <Button
            title="Entrar"
            variant="text"
            onPress={() => navigation.goBack()}
            textStyle={styles.footerActionText}
          />
        </View>
      }
    >
      <Input
        label="Nome completo"
        placeholder="Digite seu nome"
        autoCapitalize="words"
        value={nome}
        onChangeText={setNome}
      />
      <Input
        label="E-mail"
        placeholder="Digite seu e-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <Input
        label="Confirmar email"
        placeholder="Repita seu e-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        value={confirmarEmail}
        onChangeText={setConfirmarEmail}
        error={
          confirmarEmail && email !== confirmarEmail
            ? 'Os emails nao coincidem.'
            : undefined
        }
      />

      <View style={styles.roleSection}>
        <Text style={styles.roleLabel}>Perfil da conta</Text>
        <View style={styles.roleOptions}>
          <TouchableOpacity
            style={[styles.roleChip, tipoUsuario === TipoUsuario.paciente && styles.roleChipSelected]}
            onPress={() => setTipoUsuario(TipoUsuario.paciente)}
          >
            <Text
              style={[styles.roleChipText, tipoUsuario === TipoUsuario.paciente && styles.roleChipTextSelected]}
            >
              Paciente
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleChip, tipoUsuario === TipoUsuario.psicologo && styles.roleChipSelected]}
            onPress={() => setTipoUsuario(TipoUsuario.psicologo)}
          >
            <Text
              style={[styles.roleChipText, tipoUsuario === TipoUsuario.psicologo && styles.roleChipTextSelected]}
            >
              Psicologo
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {tipoUsuario === TipoUsuario.psicologo && (
        <View style={styles.professionalBlock}>
          <Text style={styles.professionalTitle}>Dados profissionais</Text>
          <Input
            label="Tipo de psicologo"
            placeholder="Ex: TCC, infantil, casal"
            autoCapitalize="words"
            value={tipoPsicologo}
            onChangeText={setTipoPsicologo}
          />
          <Input
            label="CRP"
            placeholder="Ex: 06/123456"
            autoCapitalize="characters"
            value={crp}
            onChangeText={(v) => {
              setCrp(v);
              setCrpStatus('idle');
              setCrpMessage('');
            }}
            onBlur={() => {
              if (crp.trim()) verificarCrp(crp.trim());
            }}
          />
          {crpStatus !== 'idle' && (
            <View style={styles.crpFeedback}>
              {crpStatus === 'checking' && (
                <ActivityIndicator size="small" color={colors.primary} />
              )}
              {crpStatus === 'valid' && (
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              )}
              {(crpStatus === 'invalid' || crpStatus === 'format_error') && (
                <Ionicons name="close-circle" size={16} color={colors.error} />
              )}
              <Text
                style={[
                  styles.crpMessage,
                  crpStatus === 'valid'
                    ? { color: colors.success }
                    : crpStatus === 'checking'
                      ? { color: colors.primary }
                      : { color: colors.error },
                ]}
              >
                {crpMessage}
              </Text>
            </View>
          )}
          <Input
            label="Especialidade"
            placeholder="Ex: Terapia Cognitivo-Comportamental"
            autoCapitalize="words"
            value={especialidade}
            onChangeText={setEspecialidade}
          />
          <Input
            label="Valor da consulta (R$)"
            placeholder="180,00"
            keyboardType="decimal-pad"
            value={precoSessao}
            onChangeText={(value) => setPrecoSessao(value.replace(/[^0-9,.-]/g, ''))}
          />
        </View>
      )}

      {tipoUsuario === TipoUsuario.paciente && (
        <View style={styles.professionalBlock}>
          <Text style={styles.professionalTitle}>Preferencias de atendimento</Text>
          <Input
            label="Area de interesse"
            placeholder="Ex: TCC, ansiedade, infantil"
            autoCapitalize="words"
            value={areaInteresse}
            onChangeText={setAreaInteresse}
          />
        </View>
      )}

      <Input
        label="Senha"
        placeholder="Crie uma senha"
        isPassword
        value={senha}
        onChangeText={setSenha}
      />

      {senha ? (
        <View style={styles.passwordRules}>
          <Text
            style={[
              styles.passwordRule,
              senhaValidacao.minLength ? styles.passwordRuleValid : styles.passwordRuleInvalid,
            ]}
          >
            6+ caracteres
          </Text>
          <Text
            style={[
              styles.passwordRule,
              senhaValidacao.hasNumber ? styles.passwordRuleValid : styles.passwordRuleInvalid,
            ]}
          >
            1 numero
          </Text>
          <Text
            style={[
              styles.passwordRule,
              senhaValidacao.hasSpecial ? styles.passwordRuleValid : styles.passwordRuleInvalid,
            ]}
          >
            1 caractere especial
          </Text>
        </View>
      ) : null}

      <Input
        label="Confirmar senha"
        placeholder="Repita sua senha"
        isPassword
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        error={confirmarSenha && senha !== confirmarSenha ? 'As senhas nao coincidem.' : undefined}
      />

      <Button
        title="Cadastrar"
        onPress={handleRegister}
        isLoading={isLoading}
        disabled={
          !nome ||
          !email ||
          !confirmarEmail ||
          !senha ||
          !confirmarSenha ||
          !senhaValida ||
          email !== confirmarEmail ||
          senha !== confirmarSenha ||
          (tipoUsuario === TipoUsuario.psicologo &&
            (!tipoPsicologo.trim() ||
              !crp.trim() ||
              !especialidade.trim() ||
              !precoSessao.trim() ||
              crpStatus === 'checking'))
        }
        style={styles.registerButton}
      />
    </AuthScreenLayout>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    passwordRules: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginTop: -spacing.sm,
      marginBottom: spacing.base,
    },
    crpFeedback: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginTop: -spacing.sm,
      marginBottom: spacing.base,
    },
    crpMessage: {
      fontSize: typography.size.xs,
      fontWeight: typography.weight.medium,
      flex: 1,
    },
    passwordRule: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
  },
  passwordRuleValid: {
    color: colors.success,
  },
  passwordRuleInvalid: {
    color: colors.error,
  },
  registerButton: {
    marginTop: spacing.md,
  },
  roleSection: {
    marginBottom: spacing.base,
  },
  roleLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  roleOptions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  roleChip: {
    flex: 1,
    minHeight: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6DDC8',
    backgroundColor: colors.surfaceWarm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.base,
  },
  roleChipSelected: {
    backgroundColor: colors.forest,
    borderColor: colors.primaryDark,
  },
  roleChipText: {
    color: colors.textPrimary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
  roleChipTextSelected: {
    color: colors.white,
  },
  professionalBlock: {
    backgroundColor: colors.surfaceWarm,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E7DCC6',
    padding: spacing.base,
    marginBottom: spacing.base,
  },
  professionalTitle: {
    color: colors.textPrimary,
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    marginRight: spacing.xs,
  },
  footerActionText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
});
