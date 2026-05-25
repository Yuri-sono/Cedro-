import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { showToast } from '../../components/Toast';
import { usePerfil } from '../../hooks/usePerfil';
import { agendaConfigService } from '../../services/agendaConfigService';
import { useAuthStore } from '../../store/authStore';
import { borderRadius, colors, spacing, typography } from '../../theme';
import { PsicologoAgendaConfig } from '../../types/api.types';
import {
  DEFAULT_TIME_SLOTS,
  formatAgendaSummary,
  normalizeTimeSlots,
  normalizeWeekdays,
  WEEKDAY_OPTIONS,
} from '../../utils/psychologistAgenda';

function formatCurrencyInput(value: string): string {
  return value.replace(/[^0-9,.-]/g, '');
}

export const PsychologistSettingsScreen = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const { atualizarPerfil, isAtualizando } = usePerfil();

  const [especialidade, setEspecialidade] = useState(user?.especialidade || '');
  const [crp, setCrp] = useState(user?.crp || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [precoSessao, setPrecoSessao] = useState(
    user?.precoSessao != null ? String(user.precoSessao).replace('.', ',') : '',
  );
  const [diasAtendimento, setDiasAtendimento] = useState<number[]>(
    normalizeWeekdays(user?.diasAtendimento),
  );
  const [horariosAtendimento, setHorariosAtendimento] = useState<string[]>(
    normalizeTimeSlots(user?.horariosAtendimento),
  );

  const agendaResumo = useMemo(
    () => formatAgendaSummary(diasAtendimento, horariosAtendimento),
    [diasAtendimento, horariosAtendimento],
  );

  if (!user) {
    return null;
  }

  const toggleDay = (day: number) => {
    setDiasAtendimento((current) =>
      current.includes(day)
        ? current.filter((value) => value !== day)
        : normalizeWeekdays([...current, day]),
    );
  };

  const toggleTimeSlot = (slot: string) => {
    setHorariosAtendimento((current) =>
      current.includes(slot)
        ? current.filter((value) => value !== slot)
        : normalizeTimeSlots([...current, slot]),
    );
  };

  const handleSave = async () => {
    const parsedPrice = precoSessao
      ? Number(precoSessao.replace(/\./g, '').replace(',', '.'))
      : undefined;
    const hasValidPrice = Number.isFinite(parsedPrice);
    const resolvedPrice = hasValidPrice ? parsedPrice : user.precoSessao;

    if (!especialidade.trim()) {
      showToast.error('Especialidade obrigatoria', 'Informe a especialidade principal.');
      return;
    }

    if (!crp.trim()) {
      showToast.error('CRP obrigatorio', 'Informe um CRP valido para a apresentacao.');
      return;
    }

    if (!diasAtendimento.length || !horariosAtendimento.length) {
      showToast.error('Agenda incompleta', 'Selecione ao menos um dia e um horario.');
      return;
    }

    try {
      await atualizarPerfil({
        bio: bio.trim() || undefined,
        especialidade: especialidade.trim(),
        crp: crp.trim(),
        precoSessao: hasValidPrice ? parsedPrice : undefined,
      });

      const savedConfig: PsicologoAgendaConfig = await agendaConfigService.save({
        psicologoId: user.id,
        diasAtendimento,
        horariosAtendimento,
        precoSessao: resolvedPrice,
      });

      await updateUser({
        bio: bio.trim() || null,
        especialidade: especialidade.trim(),
        crp: crp.trim(),
        precoSessao: resolvedPrice,
        diasAtendimento: savedConfig.diasAtendimento,
        horariosAtendimento: savedConfig.horariosAtendimento,
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['psicologos'] }),
        queryClient.invalidateQueries({ queryKey: ['psicologo', user.id] }),
      ]);

      showToast.success('Atendimento atualizado', 'Agenda e dados profissionais salvos.');
      navigation.goBack();
    } catch {
      // O hook ja exibe feedback de erro.
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Resumo atual</Text>
          <Text style={styles.panelText}>{agendaResumo}</Text>
          <Text style={styles.panelPrice}>
            {precoSessao ? `Consulta: R$ ${precoSessao}` : 'Valor da consulta ainda nao definido'}
          </Text>
        </View>

        <Input
          label="Especialidade"
          value={especialidade}
          onChangeText={setEspecialidade}
          placeholder="Ex: Terapia Cognitivo-Comportamental"
        />

        <Input
          label="CRP"
          value={crp}
          onChangeText={setCrp}
          placeholder="Ex: 06/123456"
          autoCapitalize="characters"
        />

        <Input
          label="Valor da consulta (R$)"
          value={precoSessao}
          onChangeText={(value) => setPrecoSessao(formatCurrencyInput(value))}
          placeholder="150,00"
          keyboardType="decimal-pad"
        />

        <Input
          label="Descricao profissional"
          value={bio}
          onChangeText={setBio}
          placeholder="Experiencia, abordagem e publico atendido"
          multiline
          numberOfLines={4}
          style={styles.textArea}
        />

        <Text style={styles.sectionTitle}>Dias de atendimento</Text>
        <View style={styles.chipGrid}>
          {WEEKDAY_OPTIONS.map((option) => {
            const selected = diasAtendimento.includes(option.value);

            return (
              <TouchableOpacity
                key={option.value}
                style={[styles.chip, selected && styles.chipSelected]}
                onPress={() => toggleDay(option.value)}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Horarios disponiveis</Text>
        <View style={styles.chipGrid}>
          {DEFAULT_TIME_SLOTS.map((slot) => {
            const selected = horariosAtendimento.includes(slot);

            return (
              <TouchableOpacity
                key={slot}
                style={[styles.chip, selected && styles.chipSelected]}
                onPress={() => toggleTimeSlot(slot)}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                  {slot}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Button
          title="Salvar atendimento"
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
    backgroundColor: colors.cream,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing['3xl'],
    maxWidth: 520,
    width: '100%',
    alignSelf: 'center',
  },
  panel: {
    backgroundColor: colors.surfaceWarm,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#E7DCC6',
    marginBottom: spacing.lg,
  },
  panelTitle: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  panelText: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  panelPrice: {
    fontSize: typography.size.base,
    color: colors.primary,
    fontWeight: typography.weight.bold,
    marginTop: spacing.sm,
  },
  textArea: {
    height: 110,
    textAlignVertical: 'top',
    paddingTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    minWidth: 72,
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.textPrimary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  chipTextSelected: {
    color: colors.white,
  },
  saveButton: {
    marginTop: spacing.xl,
  },
});
