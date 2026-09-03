import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation.types';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { spacing, typography, borderRadius, useTheme, ThemeColors } from '../../theme';
import { useAuth } from '../../hooks/useAuth';
import { TipoUsuario } from '../../types/api.types';
import { showToast } from '../../components/Toast';
import { AuthScreenLayout } from '../../components/AuthScreenLayout';
import api from '../../services/api';
import { API_ENDPOINTS } from '../../constants/api';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Máscara automática de CRP: digita só números, formata como XX/XXXXXX
const formatarCrp = (valor: string) => {
  const digitos = valor.replace(/\D/g, '').slice(0, 7);
  if (digitos.length <= 2) return digitos;
  return `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
};

const validarFormatoCrp = (valor: string) => /^\d{2}\/\d{5,6}$/.test(valor);

// Normaliza "1.234,56" / "1234,5" / "1234.56" para número
const parsePreco = (valor: string) => {
  if (!valor.trim()) return NaN;
  return Number(valor.replace(/\./g, '').replace(',', '.'));
};

export const RegisterScreen = () => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<NavigationProp>();
  const { register, isLoading } = useAuth();

  const [step, setStep] = useState(1);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
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

  const isPsicologo = tipoUsuario === TipoUsuario.psicologo;
  const totalSteps = isPsicologo ? 3 : 2;

  const emailRef = useRef<any>(null);
  const senhaRef = useRef<any>(null);
  const confirmarSenhaRef = useRef<any>(null);

  const emailValido = EMAIL_RE.test(email.trim());
  const emailErro = email.length > 0 && !emailValido ? 'Informe um e-mail válido.' : undefined;

  const senhaValidacao = {
    minLength: senha.length >= 6,
    hasNumber: /\d/.test(senha),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(senha),
  };
  const senhaValida =
    senhaValidacao.minLength && senhaValidacao.hasNumber && senhaValidacao.hasSpecial;
  const senhasCoincidem = senha === confirmarSenha;

  const crpFormatoOk = validarFormatoCrp(crp.trim());
  const crpOk =
    crpFormatoOk && crpStatus !== 'checking' && crpStatus !== 'invalid' && crpStatus !== 'format_error';
  const precoValido = (() => {
    const n = parsePreco(precoSessao);
    return Number.isFinite(n) && n > 0;
  })();

  // Etapa 2 pronta quando os dados pessoais estão válidos
  const etapa2Pronta =
    nome.trim().length >= 3 && emailValido && senhaValida && senhasCoincidem;
  // Etapa 3 (psicólogo) pronta quando os dados profissionais estão válidos
  const etapa3Pronta =
    tipoPsicologo.trim().length > 0 && crpOk && especialidade.trim().length > 0 && precoValido;

  
  // Verificação automática do CRP: quando a máscara completa, valida sozinho (debounce)
  useEffect(() => {
    if (!isPsicologo || !crpFormatoOk) return;
    const timer = setTimeout(() => verificarCrp(crp.trim()), 600);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crp, isPsicologo]);

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

  const avancarEtapa = () => {
    if (step === 2 && !etapa2Pronta) {
      showToast.error(
        'Dados incompletos',
        'Preencha nome, e-mail válido e uma senha que atenda às regras.',
      );
      return;
    }
    setStep((s) => s + 1);
  };

  const voltarEtapa = () => {
    if (step === 1) {
      navigation.goBack();
      return;
    }
    setStep((s) => s - 1);
  };

  const handleRegister = async () => {
    if (!nome || !email || !senha) return;

    if (!emailValido) {
      showToast.error('E-mail inválido', 'Informe um e-mail válido para continuar.');
      return;
    }

    if (!senhaValida) {
      showToast.error(
        'Senha inválida',
        'Use 6+ caracteres, 1 número e 1 caractere especial.',
      );
      return;
    }

    if (!senhasCoincidem) {
      showToast.error('Erro de validação', 'As senhas não coincidem.');
      return;
    }

    const parsedPrice = parsePreco(precoSessao);

    if (isPsicologo) {
      if (!crp.trim() || !especialidade.trim()) {
        showToast.error('Dados profissionais', 'Informe CRP e especialidade para o cadastro.');
        return;
      }

      if (!crpFormatoOk) {
        showToast.error('CRP inválido', 'Use o formato XX/XXXXXX (ex: 06/123456).');
        return;
      }

      if (crpStatus === 'checking') {
        showToast.error('CRP', 'Aguarde a verificação do CRP.');
        return;
      }

      if (crpStatus === 'invalid') {
        showToast.error(
          'CRP inválido',
          'O CRP informado não foi validado. Verifique e tente novamente.',
        );
        return;
      }

      if (!tipoPsicologo.trim()) {
        showToast.error('Tipo de psicólogo', 'Informe o tipo de atendimento que você oferece.');
        return;
      }

      if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
        showToast.error('Valor da consulta', 'Informe um valor válido para atendimento.');
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
      // Praticidade: já abre o login com o e-mail preenchido
      navigation.navigate('Login', { email: email.trim() });
    }
  };

  
  return (
    <AuthScreenLayout
      title={step === 1 ? 'Criar Conta' : step === 2 ? 'Seus dados' : 'Dados profissionais'}
      subtitle={
        step === 1
          ? 'Como você vai usar o Cedro?'
          : step === 2
            ? isPsicologo
              ? 'Passo 2 de 3 — suas informações de acesso'
              : 'Último passo — suas informações de acesso'
            : 'Passo 3 de 3 — informações do seu atendimento'
      }
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
      {/* Indicador de progresso */}
      <View style={styles.progressRow}>
        {Array.from({ length: totalSteps }, (_, i) => (
          <View
            key={i}
            style={[styles.progressStep, i + 1 <= step && styles.progressStepAtivo]}
          />
        ))}
      </View>

      {/* ── Etapa 1: tipo de conta ── */}
      {step === 1 && (
        <View style={styles.stepContent}>
          <TouchableOpacity
            style={[
              tipoUsuario === TipoUsuario.paciente ? styles.tipoCardSelecionado : styles.tipoCard,
            ]}
            onPress={() => setTipoUsuario(TipoUsuario.paciente)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.tipoIcone,
                tipoUsuario === TipoUsuario.paciente && styles.tipoIconeSelecionado,
              ]}
            >
              <Ionicons
                name="person"
                size={22}
                color={tipoUsuario === TipoUsuario.paciente ? colors.white : colors.primary}
              />
            </View>
            <View style={styles.tipoInfo}>
              <Text
                style={[
                  styles.tipoTitulo,
                  tipoUsuario === TipoUsuario.paciente && styles.tipoTituloSelecionado,
                ]}
              >
                Sou paciente
              </Text>
              <Text
                style={[
                  styles.tipoDescricao,
                  tipoUsuario === TipoUsuario.paciente && styles.tipoDescricaoSelecionada,
                ]}
              >
                Quero agendar sessões e conversar com um psicólogo
              </Text>
            </View>
            <Ionicons
              name={tipoUsuario === TipoUsuario.paciente ? 'checkmark-circle' : 'ellipse-outline'}
              size={22}
              color={tipoUsuario === TipoUsuario.paciente ? colors.white : colors.textFaint}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              tipoUsuario === TipoUsuario.psicologo ? styles.tipoCardSelecionado : styles.tipoCard,
            ]}
            onPress={() => setTipoUsuario(TipoUsuario.psicologo)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.tipoIcone,
                tipoUsuario === TipoUsuario.psicologo && styles.tipoIconeSelecionado,
              ]}
            >
              <Ionicons
                name="medkit"
                size={22}
                color={tipoUsuario === TipoUsuario.psicologo ? colors.white : colors.primary}
              />
            </View>
            <View style={styles.tipoInfo}>
              <Text
                style={[
                  styles.tipoTitulo,
                  tipoUsuario === TipoUsuario.psicologo && styles.tipoTituloSelecionado,
                ]}
              >
                Sou psicólogo
              </Text>
              <Text
                style={[
                  styles.tipoDescricao,
                  tipoUsuario === TipoUsuario.psicologo && styles.tipoDescricaoSelecionada,
                ]}
              >
                Quero atender pacientes pela plataforma (CRP obrigatório)
              </Text>
            </View>
            <Ionicons
              name={tipoUsuario === TipoUsuario.psicologo ? 'checkmark-circle' : 'ellipse-outline'}
              size={22}
              color={tipoUsuario === TipoUsuario.psicologo ? colors.white : colors.textFaint}
            />
          </TouchableOpacity>

          <Button title="Continuar" onPress={avancarEtapa} style={styles.botaoAvancar} />
        </View>
      )}

      
      {/* ── Etapa 2: dados pessoais ── */}
      {step === 2 && (
        <View style={styles.stepContent}>
          <Input
            label="Nome completo"
            placeholder="Digite seu nome"
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
            value={nome}
            onChangeText={setNome}
          />
          <Input
            ref={emailRef}
            label="E-mail"
            placeholder="Digite seu e-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            onSubmitEditing={() => senhaRef.current?.focus()}
            value={email}
            onChangeText={setEmail}
            error={emailErro}
          />
          <Input
            ref={senhaRef}
            label="Senha"
            placeholder="Crie uma senha"
            isPassword
            textContentType="newPassword"
            autoComplete="new-password"
            passwordRules="minlength: 6; required: lower; required: upper; required: digit;"
            returnKeyType="next"
            onSubmitEditing={() => confirmarSenhaRef.current?.focus()}
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
                1 número
              </Text>
              <Text
                style={[
                  styles.passwordRule,
                  senhaValidacao.hasSpecial ? styles.passwordRuleValid : styles.passwordRuleInvalid,
                ]}
              >
                1 especial
              </Text>
            </View>
          ) : null}

          <Input
            ref={confirmarSenhaRef}
            label="Confirmar senha"
            placeholder="Repita sua senha"
            isPassword
            textContentType="newPassword"
            autoComplete="new-password"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            error={
              confirmarSenha && !senhasCoincidem ? 'As senhas não coincidem.' : undefined
            }
          />

          {!isPsicologo && (
            <Input
              label="Área de interesse (opcional)"
              placeholder="Ex: TCC, ansiedade, infantil"
              autoCapitalize="words"
              value={areaInteresse}
              onChangeText={setAreaInteresse}
            />
          )}

          <View style={styles.botoesRow}>
            <Button
              title="Voltar"
              variant="outline"
              onPress={voltarEtapa}
              style={styles.botaoVoltar}
            />
            <View style={styles.botaoContinuarWrap}>
              <Button
                title="Continuar"
                onPress={avancarEtapa}
                disabled={!etapa2Pronta}
              />
            </View>
          </View>
        </View>
      )}

      
      {/* ── Etapa 3: dados profissionais (apenas psicólogo) ── */}
      {step === 3 && isPsicologo && (
        <View style={styles.stepContent}>
          <Input
            label="Tipo de atendimento"
            placeholder="Ex: TCC, infantil, casal"
            autoCapitalize="words"
            value={tipoPsicologo}
            onChangeText={setTipoPsicologo}
          />
          <Input
            label="CRP"
            placeholder="06/123456"
            keyboardType="number-pad"
            value={crp}
            onChangeText={(v) => {
              setCrp(formatarCrp(v));
              setCrpStatus('idle');
              setCrpMessage('');
            }}
          />
          {crp.length > 0 && crpStatus !== 'valid' && (
            <View style={styles.crpFeedback}>
              {crpStatus === 'checking' && (
                <ActivityIndicator size="small" color={colors.primary} />
              )}
              {(crpStatus === 'invalid' || crpStatus === 'format_error') && (
                <Ionicons name="close-circle" size={16} color={colors.error} />
              )}
              <Text
                style={[
                  styles.crpMessage,
                  crpStatus === 'checking' ? { color: colors.primary } : { color: colors.error },
                ]}
              >
                {crpStatus === 'format_error' || !crpFormatoOk
                  ? 'Formato: XX/XXXXXX (ex: 06/123456)'
                  : crpMessage || 'Verificando CRP...'}
              </Text>
            </View>
          )}
          {crpStatus === 'valid' && (
            <View style={styles.crpFeedback}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              <Text style={[styles.crpMessage, { color: colors.success }]}>{crpMessage}</Text>
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

          <View style={styles.botoesRow}>
            <Button
              title="Voltar"
              variant="outline"
              onPress={voltarEtapa}
              style={styles.botaoVoltar}
            />
            <View style={styles.botaoContinuarWrap}>
              <Button
                title="Criar conta"
                onPress={handleRegister}
                isLoading={isLoading}
                disabled={!etapa3Pronta}
              />
            </View>
          </View>
        </View>
      )}
    </AuthScreenLayout>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    progressRow: {
      flexDirection: 'row',
      gap: spacing.xs,
      marginBottom: spacing.base,
      paddingHorizontal: spacing.xs,
    },
    progressStep: {
      flex: 1,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
    },
    progressStepAtivo: {
      backgroundColor: colors.primary,
    },
    stepContent: {
      width: '100%',
    },
    tipoCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      borderWidth: 1.5,
      borderColor: colors.border,
      backgroundColor: colors.surfaceWarm,
      borderRadius: borderRadius.lg,
      padding: spacing.base,
      marginBottom: spacing.sm,
    },
    tipoCardSelecionado: {
      borderColor: colors.primary,
      backgroundColor: colors.forest,
      borderWidth: 2,
    },
    tipoIcone: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.primaryTint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tipoIconeSelecionado: {
      backgroundColor: 'rgba(255,255,255,0.18)',
    },
    tipoInfo: {
      flex: 1,
    },
    tipoTitulo: {
      fontSize: typography.size.md,
      fontWeight: typography.weight.bold,
      color: colors.textPrimary,
    },
    tipoTituloSelecionado: {
      color: colors.white,
    },
    tipoDescricao: {
      fontSize: typography.size.xs,
      color: colors.textSecondary,
      marginTop: 2,
      lineHeight: typography.size.xs * 1.4,
    },
    tipoDescricaoSelecionada: {
      color: colors.white,
      opacity: 0.85,
    },
    botaoAvancar: {
      marginTop: spacing.md,
    },
    botoesRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.sm,
    },
    botaoVoltar: {
      flex: 1,
    },
    botaoContinuarWrap: {
      flex: 2,
    },
    passwordRules: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginTop: -spacing.sm,
      marginBottom: spacing.base,
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




