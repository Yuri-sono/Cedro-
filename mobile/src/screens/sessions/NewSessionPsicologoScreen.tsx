import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { usePacientes } from '../../hooks/usePacientes';
import { useDisponibilidade, useSessoes } from '../../hooks/useSessoes';
import { useAuthStore } from '../../store/authStore';
import { borderRadius, colors, spacing, typography } from '../../theme';
import { ProfileStackParamList } from '../../types/navigation.types';
import { TipoUsuario } from '../../types/api.types';
import { getNextAvailableDates } from '../../utils/psychologistAgenda';

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'NewSessionPsicologo'>;

const formatarDataApi = (data: Date) => {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
};

// Monta "YYYY-MM-DDTHH:mm:ss" sem fuso horario — mesmo formato enviado pelo web.
const formatarDataHoraApi = (data: Date, horario: string) => {
  const [hora, minuto] = horario.split(':');
  const dataHora = new Date(data);
  dataHora.setHours(parseInt(hora, 10), parseInt(minuto, 10), 0, 0);
  const ano = dataHora.getFullYear();
  const mes = String(dataHora.getMonth() + 1).padStart(2, '0');
  const dia = String(dataHora.getDate()).padStart(2, '0');
  const hh = String(dataHora.getHours()).padStart(2, '0');
  const mm = String(dataHora.getMinutes()).padStart(2, '0');
  return `${ano}-${mes}-${dia}T${hh}:${mm}:00`;
};

export const NewSessionPsicologoScreen = () => {
  const user = useAuthStore((state) => state.user);
  const navigation = useNavigation<NavigationProp>();
  const isPsicologo = user?.tipoUsuario === TipoUsuario.psicologo;

  const { pacientes, isLoadingPacientes } = usePacientes(user?.id);
  const { agendarSessao } = useSessoes();

  const [pacienteId, setPacienteId] = useState<number | null>(null);
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null);
  const [observacoes, setObservacoes] = useState('');
  const [salvando, setSalvando] = useState(false);

  const dataApi = dataSelecionada ? formatarDataApi(dataSelecionada) : undefined;
  const { disponibilidade, isLoadingDisponibilidade } = useDisponibilidade(user?.id ?? 0, dataApi);

  const atendeNesteDia = disponibilidade?.atendeNesteDia !== false;
  const horariosDisponiveis = disponibilidade?.horariosDisponiveis ?? [];
  const proximosDias = getNextAvailableDates(user?.diasAtendimento);

  const formatarData = (data: Date) => {
    const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return {
      diaSemana: dias[data.getDay()],
      dia: data.getDate(),
      mes: meses[data.getMonth()],
    };
  };

  const handleConfirmar = async () => {
    if (!pacienteId || !dataSelecionada || !horarioSelecionado) {
      Alert.alert('Atencao', 'Selecione paciente, data e horario para continuar.');
      return;
    }
    setSalvando(true);
    try {
      await agendarSessao({
        pacienteId,
        dataSessao: formatarDataHoraApi(dataSelecionada, horarioSelecionado),
        duracao: 50,
        observacoes: observacoes.trim() || undefined,
      });
      navigation.goBack();
    } catch {
      // Toast de erro ja tratado pelo hook.
    } finally {
      setSalvando(false);
    }
  };

  if (!isPsicologo) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Apenas psicologos podem criar consultas.</Text>
      </View>
    );
  }

  const pacienteSelecionado = pacientes.find((p) => p.id === pacienteId);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Paciente</Text>
        {isLoadingPacientes ? (
          <ActivityIndicator color={colors.primary} />
        ) : pacientes.length === 0 ? (
          <Text style={styles.emptyText}>
            Voce ainda nao possui pacientes com sessoes registradas.
          </Text>
        ) : (
          <View style={styles.pacientesList}>
            {pacientes.map((p) => {
              const selected = pacienteId === p.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.pacienteCard, selected && styles.pacienteCardSelected]}
                  onPress={() => setPacienteId(p.id)}
                >
                  <Text style={[styles.pacienteNome, selected && styles.textSelected]}>{p.nome}</Text>
                  <Text style={[styles.pacienteEmail, selected && styles.textSelected]}>{p.email}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Escolha o dia</Text>
        {proximosDias.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datesScroll}>
            {proximosDias.map((dia, index) => {
              const { diaSemana, dia: diaNum, mes } = formatarData(dia);
              const isSelected = dataSelecionada?.toDateString() === dia.toDateString();
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.dateCard, isSelected && styles.dateCardSelected]}
                  onPress={() => {
                    setDataSelecionada(dia);
                    setHorarioSelecionado(null);
                  }}
                >
                  <Text style={[styles.diaSemana, isSelected && styles.textSelected]}>{diaSemana}</Text>
                  <Text style={[styles.diaNum, isSelected && styles.textSelected]}>{diaNum}</Text>
                  <Text style={[styles.mes, isSelected && styles.textSelected]}>{mes}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        ) : (
          <Text style={styles.emptyText}>Voce ainda nao configurou dias de atendimento.</Text>
        )}
      </View>

      {dataSelecionada && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Escolha o horario</Text>
          <View style={styles.horariosGrid}>
            {horariosDisponiveis.map((horario) => {
              const isSelected = horarioSelecionado === horario;
              return (
                <TouchableOpacity
                  key={horario}
                  style={[styles.horarioCard, isSelected && styles.horarioCardSelected]}
                  onPress={() => setHorarioSelecionado(horario)}
                >
                  <Text style={[styles.horarioText, isSelected && styles.textSelected]}>{horario}</Text>
                </TouchableOpacity>
              );
            })}
            {!isLoadingDisponibilidade && horariosDisponiveis.length === 0 && (
              <Text style={styles.emptyText}>
                {atendeNesteDia
                  ? 'Nenhum horario disponivel neste dia.'
                  : 'Voce nao atende neste dia da semana.'}
              </Text>
            )}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Input
          label="Observacoes (opcional)"
          value={observacoes}
          onChangeText={setObservacoes}
          placeholder="Alguma informacao adicional..."
          multiline
        />
      </View>

      {dataSelecionada && horarioSelecionado && pacienteSelecionado && (
        <View style={styles.resumo}>
          <Text style={styles.resumoTitle}>Resumo da consulta</Text>
          <View style={styles.resumoRow}>
            <Text style={styles.resumoLabel}>Paciente:</Text>
            <Text style={styles.resumoValue}>{pacienteSelecionado.nome}</Text>
          </View>
          <View style={styles.resumoRow}>
            <Text style={styles.resumoLabel}>Data:</Text>
            <Text style={styles.resumoValue}>{dataSelecionada.toLocaleDateString('pt-BR')}</Text>
          </View>
          <View style={styles.resumoRow}>
            <Text style={styles.resumoLabel}>Horario:</Text>
            <Text style={styles.resumoValue}>{horarioSelecionado}</Text>
          </View>
          <View style={styles.resumoRow}>
            <Text style={styles.resumoLabel}>Duracao:</Text>
            <Text style={styles.resumoValue}>50 minutos</Text>
          </View>
        </View>
      )}

      <Button
        title="Confirmar consulta"
        onPress={handleConfirmar}
        isLoading={salvando}
        disabled={!pacienteId || !dataSelecionada || !horarioSelecionado}
        style={styles.confirmButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.base,
    maxWidth: 520,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: spacing['3xl'],
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['2xl'],
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.base,
  },
  pacientesList: {
    gap: spacing.sm,
  },
  pacienteCard: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.base,
  },
  pacienteCardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pacienteNome: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  pacienteEmail: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  textSelected: {
    color: colors.white,
  },
  datesScroll: {
    marginHorizontal: -spacing.base,
    paddingHorizontal: spacing.base,
  },
  dateCard: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    marginRight: spacing.sm,
    alignItems: 'center',
    minWidth: 70,
  },
  dateCardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  diaSemana: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    fontWeight: typography.weight.medium,
  },
  diaNum: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    marginVertical: spacing.xs,
  },
  mes: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
  },
  horariosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  horarioCard: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    minWidth: 80,
    alignItems: 'center',
  },
  horarioCardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  horarioText: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
  emptyText: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    paddingVertical: spacing.sm,
  },
  resumo: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resumoTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.base,
  },
  resumoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  resumoLabel: {
    fontSize: typography.size.base,
    color: colors.textSecondary,
  },
  resumoValue: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
  confirmButton: {
    marginBottom: spacing.xl,
  },
});