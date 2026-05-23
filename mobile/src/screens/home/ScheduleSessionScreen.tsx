import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../types/navigation.types';
import { usePsicologoDetail } from '../../hooks/usePsicologos';
import { useDisponibilidade, useSessoes } from '../../hooks/useSessoes';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';

type ScheduleSessionRouteProp = RouteProp<HomeStackParamList, 'ScheduleSession'>;
type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'ScheduleSession'>;

// Horários disponíveis (em produção, viriam do backend)
const HORARIOS_DISPONIVEIS = [
  '08:00', '09:00', '10:00', '11:00',
  '14:00', '15:00', '16:00', '17:00', '18:00',
];

const formatarDataApi = (data: Date) => {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
};

export const ScheduleSessionScreen = () => {
  const route = useRoute<ScheduleSessionRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const psicologoId = route.params.psicologoId;

  const { psicologo } = usePsicologoDetail(psicologoId);
  const { agendarSessao, isAgendando } = useSessoes();

  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null);
  const dataApi = dataSelecionada ? formatarDataApi(dataSelecionada) : undefined;
  const { disponibilidade, isLoadingDisponibilidade } = useDisponibilidade(psicologoId, dataApi);
  const horariosDisponiveis = disponibilidade?.horariosDisponiveis || HORARIOS_DISPONIVEIS;

  // Gera próximos 7 dias úteis
  const getProximosDias = () => {
    const dias: Date[] = [];
    const hoje = new Date();
    
    for (let i = 1; i <= 10; i++) {
      const dia = new Date(hoje);
      dia.setDate(hoje.getDate() + i);
      
      // Pula finais de semana (0 = domingo, 6 = sábado)
      if (dia.getDay() !== 0 && dia.getDay() !== 6) {
        dias.push(dia);
      }
      
      if (dias.length === 7) break;
    }
    
    return dias;
  };

  const proximosDias = getProximosDias();

  const formatarData = (data: Date) => {
    const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    return {
      diaSemana: dias[data.getDay()],
      dia: data.getDate(),
      mes: meses[data.getMonth()],
    };
  };

  const handleAgendar = async () => {
    if (!dataSelecionada || !horarioSelecionado) {
      Alert.alert('Atenção', 'Selecione uma data e horário para continuar.');
      return;
    }

    // Combina data e horário
    const [hora, minuto] = horarioSelecionado.split(':');
    const dataHora = new Date(dataSelecionada);
    dataHora.setHours(parseInt(hora), parseInt(minuto), 0, 0);

    try {
      await agendarSessao({
        psicologoId,
        dataSessao: dataHora.toISOString(),
        duracao: 50,
        valor: psicologo?.precoSessao || 0,
      });
      
      navigation.navigate('SessionSuccess');
    } catch (error) {
      // Erro já tratado pelo hook
    }
  };

  if (!psicologo) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header com info do psicólogo */}
      <View style={styles.header}>
        <Avatar url={psicologo.fotoUrl} size={60} />
        <View style={styles.headerInfo}>
          <Text style={styles.nome}>{psicologo.nome}</Text>
          <Text style={styles.especialidade}>{psicologo.especialidade}</Text>
          <Text style={styles.preco}>
            {psicologo.precoSessao ? `R$ ${psicologo.precoSessao.toFixed(2)}` : 'A combinar'}
          </Text>
        </View>
      </View>

      {/* Seleção de Data */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Escolha o dia</Text>
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
                <Text style={[styles.diaSemana, isSelected && styles.textSelected]}>
                  {diaSemana}
                </Text>
                <Text style={[styles.diaNum, isSelected && styles.textSelected]}>
                  {diaNum}
                </Text>
                <Text style={[styles.mes, isSelected && styles.textSelected]}>
                  {mes}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Seleção de Horário */}
      {dataSelecionada && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Escolha o horário</Text>
          <View style={styles.horariosGrid}>
            {horariosDisponiveis.map((horario) => {
              const isSelected = horarioSelecionado === horario;
              
              return (
                <TouchableOpacity
                  key={horario}
                  style={[styles.horarioCard, isSelected && styles.horarioCardSelected]}
                  onPress={() => setHorarioSelecionado(horario)}
                >
                  <Text style={[styles.horarioText, isSelected && styles.textSelected]}>
                    {horario}
                  </Text>
                </TouchableOpacity>
              );
            })}
            {!isLoadingDisponibilidade && horariosDisponiveis.length === 0 && (
              <Text style={styles.emptyText}>Nenhum horÃ¡rio disponÃ­vel neste dia.</Text>
            )}
          </View>
        </View>
      )}

      {/* Resumo e Confirmação */}
      {dataSelecionada && horarioSelecionado && (
        <View style={styles.resumo}>
          <Text style={styles.resumoTitle}>Resumo da Consulta</Text>
          <View style={styles.resumoRow}>
            <Text style={styles.resumoLabel}>Data:</Text>
            <Text style={styles.resumoValue}>
              {dataSelecionada.toLocaleDateString('pt-BR')}
            </Text>
          </View>
          <View style={styles.resumoRow}>
            <Text style={styles.resumoLabel}>Horário:</Text>
            <Text style={styles.resumoValue}>{horarioSelecionado}</Text>
          </View>
          <View style={styles.resumoRow}>
            <Text style={styles.resumoLabel}>Duração:</Text>
            <Text style={styles.resumoValue}>50 minutos</Text>
          </View>
          <View style={styles.resumoRow}>
            <Text style={styles.resumoLabel}>Valor:</Text>
            <Text style={styles.resumoValue}>
              {psicologo.precoSessao ? `R$ ${psicologo.precoSessao.toFixed(2)}` : 'A combinar'}
            </Text>
          </View>
        </View>
      )}

      {/* Botão de Confirmação */}
      <Button
        title="Confirmar Agendamento"
        onPress={handleAgendar}
        isLoading={isAgendando}
        disabled={!dataSelecionada || !horarioSelecionado}
        style={styles.confirmButton}
      />

      <Text style={styles.disclaimer}>
        * O pagamento será realizado diretamente com o psicólogo no dia da consulta.
      </Text>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.base,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.base,
  },
  nome: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  especialidade: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  preco: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    color: colors.primary,
    marginTop: spacing.xs,
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
  textSelected: {
    color: colors.white,
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
    marginBottom: spacing.base,
  },
  disclaimer: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
});
