import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '../../store/authStore';
import { sessaoService } from '../../services/sessaoService';
import { typography, spacing, borderRadius, useTheme, ThemeColors } from '../../theme';
import { ProfileStackParamList, RootStackParamList } from '../../types/navigation.types';
import { Sessao } from '../../types/api.types';

// As telas do portal vivem na ProfileStack, mas navegam para rotas globais
// (ex.: Reuniao) — por isso a união dos dois ParamLists.
type NavigationProp = NativeStackNavigationProp<ProfileStackParamList & RootStackParamList>;

type FiltroStatus = 'todas' | 'realizada' | 'confirmada' | 'agendada' | 'cancelada';

// Espelho de STATUS_LABEL / STATUS_COLOR de ConsultasPsicologo.jsx (web)
const STATUS_LABEL: Record<string, string> = {
  realizada: 'Realizada',
  agendada: 'Agendada',
  confirmada: 'Confirmada',
  cancelada: 'Cancelada',
};

const FILTROS: { id: FiltroStatus; label: string }[] = [
  { id: 'todas', label: 'Todas' },
  { id: 'realizada', label: 'Concluídas' },
  { id: 'confirmada', label: 'Confirmadas' },
  { id: 'agendada', label: 'Agendadas' },
  { id: 'cancelada', label: 'Canceladas' },
];

const formatarValor = (valor: number | null | undefined) =>
  `R$ ${(Number(valor) || 0).toFixed(2).replace('.', ',')}`;

const formatarHora = (dataStr: string) => {
  if (!dataStr) return '-';
  const parte = String(dataStr).split('T')[1];
  return parte
    ? parte.slice(0, 5)
    : new Date(dataStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

const confirmar = (titulo: string, mensagem: string, onConfirmar: () => void) => {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    if (window.confirm(mensagem)) onConfirmar();
    return;
  }
  Alert.alert(titulo, mensagem, [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Confirmar', style: 'destructive', onPress: onConfirmar },
  ]);
};


export const ConsultasPsicologoScreen = () => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<NavigationProp>();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>('todas');
  const [detalhesSessao, setDetalhesSessao] = useState<Sessao | null>(null);
  const [atualizandoStatus, setAtualizandoStatus] = useState(false);

  const { data: consultas, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['psicologo', 'consultas', user?.id],
    queryFn: () => (user?.id ? sessaoService.sessoesDoPsicologo(user.id) : []),
    enabled: Boolean(user?.id),
  });

  // ── Estatísticas reais (statuses do backend: agendada | confirmada | realizada | cancelada) ──
  const consultasRealizadas = useMemo(
    () => (consultas || []).filter((c) => c.statusSessao === 'realizada').length,
    [consultas],
  );
  const consultasConfirmadas = useMemo(
    () => (consultas || []).filter((c) => c.statusSessao === 'confirmada').length,
    [consultas],
  );
  const consultasAgendadas = useMemo(
    () => (consultas || []).filter((c) => c.statusSessao === 'agendada').length,
    [consultas],
  );
  const valorTotal = useMemo(
    () => (consultas || []).reduce((total, c) => total + (Number(c.valor) || 0), 0),
    [consultas],
  );

  const consultasFiltradas = useMemo(() => {
    const base =
      filtroStatus === 'todas'
        ? consultas || []
        : (consultas || []).filter((c) => c.statusSessao === filtroStatus);
    return [...base].sort(
      (a, b) => new Date(b.dataSessao).getTime() - new Date(a.dataSessao).getTime(),
    );
  }, [consultas, filtroStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'realizada':
        return colors.success;
      case 'confirmada':
        return colors.warning;
      case 'cancelada':
        return colors.danger;
      case 'agendada':
        return colors.primary;
      default:
        return colors.textSecondary;
    }
  };

  const getLabel = (status: string) => STATUS_LABEL[status] || status || '-';

  // Espelho de confirmarStatus() da web: PUT /api/sessoes/{id}/status
  const confirmarStatus = (sessao: Sessao, novoStatus: 'realizada' | 'cancelada') => {
    const acao =
      novoStatus === 'realizada'
        ? 'marcar esta consulta como realizada'
        : 'cancelar esta consulta';
    confirmar('Confirmar ação', `Deseja ${acao}?`, async () => {
      try {
        setAtualizandoStatus(true);
        await sessaoService.atualizarStatus(sessao.id, novoStatus);
        await refetch();
        queryClient.invalidateQueries({ queryKey: ['psicologo'] });
      } catch (error) {
        console.error('Erro ao atualizar status:', error);
        Alert.alert('Erro', 'Não foi possível atualizar a consulta.');
      } finally {
        setAtualizandoStatus(false);
      }
    });
  };

  
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      >
        {/* Cabeçalho com botão Nova Consulta (igual à web) */}
        <View style={styles.topo}>
          <Text style={styles.titulo}>Consultas</Text>
          <TouchableOpacity
            style={styles.novaBtn}
            onPress={() => navigation.navigate('NewSessionPsicologo')}
            activeOpacity={0.7}
            disabled={!user}
          >
            <Ionicons name="add-circle" size={16} color={colors.white} />
            <Text style={styles.novaBtnTexto}>Nova Consulta</Text>
          </TouchableOpacity>
        </View>

        {/* Cards de resumo (Concluídas / Confirmadas / Agendadas / Total) */}
        <View style={styles.resumoGrid}>
          <View style={styles.resumoCard}>
            <Text style={[styles.resumoValor, { color: colors.success }]}>{consultasRealizadas}</Text>
            <Text style={styles.resumoLabel}>Concluídas</Text>
          </View>
          <View style={styles.resumoCard}>
            <Text style={[styles.resumoValor, { color: colors.primary }]}>{consultasConfirmadas}</Text>
            <Text style={styles.resumoLabel}>Confirmadas</Text>
          </View>
          <View style={styles.resumoCard}>
            <Text style={[styles.resumoValor, { color: colors.warning }]}>{consultasAgendadas}</Text>
            <Text style={styles.resumoLabel}>Agendadas</Text>
          </View>
          <View style={styles.resumoCard}>
            <Text style={[styles.resumoValor, { color: colors.success }]}>
              {formatarValor(valorTotal)}
            </Text>
            <Text style={styles.resumoLabel}>Total</Text>
          </View>
        </View>

        {/* Filtro por status (equivalente ao <select> da web) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtros}
        >
          {FILTROS.map((filtro) => (
            <TouchableOpacity
              key={filtro.id}
              style={[styles.filtroChip, filtroStatus === filtro.id && styles.filtroChipAtivo]}
              onPress={() => setFiltroStatus(filtro.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.filtroTexto, filtroStatus === filtro.id && styles.filtroTextoAtivo]}
              >
                {filtro.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>


        {/* Lista de consultas */}
        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : consultasFiltradas.length === 0 ? (
          <View style={styles.vazioBox}>
            <Ionicons name="clipboard" size={40} color={colors.textFaint} />
            <Text style={styles.vazioTexto}>Nenhuma consulta encontrada</Text>
          </View>
        ) : (
          consultasFiltradas.map((consulta) => (
            <View key={consulta.id} style={styles.card}>
              <View style={styles.cardLinhaTopo}>
                <View style={styles.avatarPaciente}>
                  <Ionicons name="person" size={16} color={colors.primary} />
                </View>
                <Text style={styles.pacienteNome} numberOfLines={1}>
                  {consulta.pacienteNome || `Paciente #${consulta.pacienteId}`}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: `${getStatusColor(consulta.statusSessao)}1A` },
                  ]}
                >
                  <Text
                    style={[styles.statusTexto, { color: getStatusColor(consulta.statusSessao) }]}
                  >
                    {getLabel(consulta.statusSessao)}
                  </Text>
                </View>
              </View>
              <View style={styles.cardDetalhes}>
                <View style={styles.detalhe}>
                  <Ionicons name="calendar" size={12} color={colors.textSecondary} />
                  <Text style={styles.detalheTexto}>
                    {new Date(consulta.dataSessao).toLocaleDateString('pt-BR')}
                  </Text>
                </View>
                <View style={styles.detalhe}>
                  <Ionicons name="time" size={12} color={colors.textSecondary} />
                  <Text style={styles.detalheTexto}>{formatarHora(consulta.dataSessao)}</Text>
                </View>
                <View style={styles.detalhe}>
                  <Ionicons name="hourglass" size={12} color={colors.textSecondary} />
                  <Text style={styles.detalheTexto}>{consulta.duracao || 60} min</Text>
                </View>
                <View style={styles.detalhe}>
                  <Ionicons name="cash" size={12} color={colors.textSecondary} />
                  <Text style={styles.detalheTexto}>{formatarValor(consulta.valor)}</Text>
                </View>
              </View>
              {/* Ações (dropdown da web → botões inline no mobile) */}
              <View style={styles.acoes}>
                <TouchableOpacity
                  style={[styles.acaoBtn, { borderColor: colors.border }]}
                  onPress={() => setDetalhesSessao(consulta)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="information-circle" size={14} color={colors.textSecondary} />
                  <Text style={styles.acaoTexto}>Detalhes</Text>
                </TouchableOpacity>
                {consulta.statusSessao === 'agendada' && (
                  <TouchableOpacity
                    style={[styles.acaoBtn, { borderColor: colors.success }]}
                    onPress={() => confirmarStatus(consulta, 'realizada')}
                    disabled={atualizandoStatus}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                    <Text style={[styles.acaoTexto, { color: colors.success }]}>Realizada</Text>
                  </TouchableOpacity>
                )}
                {(consulta.statusSessao === 'agendada' ||
                  consulta.statusSessao === 'confirmada') && (
                  <TouchableOpacity
                    style={[styles.acaoBtn, { borderColor: colors.danger }]}
                    onPress={() => confirmarStatus(consulta, 'cancelada')}
                    disabled={atualizandoStatus}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close-circle" size={14} color={colors.danger} />
                    <Text style={[styles.acaoTexto, { color: colors.danger }]}>Cancelar</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.acaoReuniao}
                  onPress={() => navigation.navigate('Reuniao', { sessaoId: consulta.id })}
                  activeOpacity={0.7}
                  accessibilityLabel="Entrar na sessão"
                >
                  <Ionicons name="videocam" size={16} color={colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>


      {/* ── Modal: Ver Detalhes (espelho do modal da web) ── */}
      <Modal
        visible={Boolean(detalhesSessao)}
        transparent
        animationType="fade"
        onRequestClose={() => setDetalhesSessao(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Detalhes da Consulta</Text>
              <TouchableOpacity
                onPress={() => setDetalhesSessao(null)}
                accessibilityLabel="Fechar"
              >
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.modalLinha}>
                <Text style={styles.modalRotulo}>Paciente: </Text>
                {detalhesSessao?.pacienteNome || `Paciente #${detalhesSessao?.pacienteId}`}
              </Text>
              <Text style={styles.modalLinha}>
                <Text style={styles.modalRotulo}>Psicólogo: </Text>
                {detalhesSessao?.psicologoNome || `Psicólogo #${detalhesSessao?.psicologoId}`}
              </Text>
              <Text style={styles.modalLinha}>
                <Text style={styles.modalRotulo}>Data: </Text>
                {detalhesSessao
                  ? new Date(detalhesSessao.dataSessao).toLocaleString('pt-BR')
                  : '-'}
              </Text>
              <Text style={styles.modalLinha}>
                <Text style={styles.modalRotulo}>Duração: </Text>
                {detalhesSessao?.duracao || 60} minutos
              </Text>
              <Text style={styles.modalLinha}>
                <Text style={styles.modalRotulo}>Status: </Text>
                {getLabel(detalhesSessao?.statusSessao || '')}
              </Text>
              <Text style={styles.modalLinha}>
                <Text style={styles.modalRotulo}>Valor: </Text>
                {formatarValor(detalhesSessao?.valor)}
              </Text>
              <Text style={styles.modalLinha}>
                <Text style={styles.modalRotulo}>Observações: </Text>
                {detalhesSessao?.observacoes || '—'}
              </Text>
              <Text style={styles.modalLinha}>
                <Text style={styles.modalRotulo}>Link da reunião: </Text>
                {detalhesSessao?.linkReuniao || 'Não gerado'}
              </Text>
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalBtnOutline}
                onPress={() => setDetalhesSessao(null)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalBtnOutlineTexto}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};


const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.cream,
    },
    content: {
      padding: spacing.base,
      paddingBottom: spacing['2xl'],
    },
    center: {
      padding: spacing['2xl'],
      alignItems: 'center',
    },
    topo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.base,
    },
    titulo: {
      fontSize: typography.size.xl,
      fontWeight: typography.weight.bold,
      color: colors.textPrimary,
    },
    novaBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      minHeight: 40,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.md,
      backgroundColor: colors.primary,
    },
    novaBtnTexto: {
      fontSize: typography.size.sm,
      fontWeight: typography.weight.bold,
      color: colors.white,
    },
    resumoGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    resumoCard: {
      width: '48.5%',
      flexGrow: 1,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.lg,
      padding: spacing.base,
      alignItems: 'center',
    },
    resumoValor: {
      fontSize: typography.size.lg,
      fontWeight: typography.weight.bold,
    },
    resumoLabel: {
      fontSize: typography.size.xs,
      color: colors.textSecondary,
      marginTop: spacing.xs,
      textAlign: 'center',
    },
    filtros: {
      gap: spacing.sm,
      paddingVertical: spacing.xs,
      marginBottom: spacing.sm,
    },
    filtroChip: {
      minHeight: 36,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    filtroChipAtivo: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    filtroTexto: {
      fontSize: typography.size.xs,
      fontWeight: typography.weight.semibold,
      color: colors.textSecondary,
    },
    filtroTextoAtivo: {
      color: colors.white,
    },
    vazioBox: {
      alignItems: 'center',
      paddingVertical: spacing.xl,
    },
    vazioTexto: {
      fontSize: typography.size.sm,
      color: colors.textSecondary,
      marginTop: spacing.sm,
      textAlign: 'center',
    },
    card: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.lg,
      padding: spacing.base,
      marginBottom: spacing.sm,
    },
    cardLinhaTopo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    avatarPaciente: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primaryTint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pacienteNome: {
      flex: 1,
      fontSize: typography.size.sm,
      fontWeight: typography.weight.bold,
      color: colors.textPrimary,
    },
    statusBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: borderRadius.sm,
    },
    statusTexto: {
      fontSize: typography.size.xs,
      fontWeight: typography.weight.bold,
    },
    cardDetalhes: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
      marginBottom: spacing.sm,
    },
    detalhe: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    detalheTexto: {
      fontSize: typography.size.xs,
      color: colors.textSecondary,
    },
    acoes: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    acaoBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      minHeight: 34,
      paddingHorizontal: spacing.sm,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      backgroundColor: colors.surface,
    },
    acaoTexto: {
      fontSize: typography.size.xs,
      fontWeight: typography.weight.semibold,
      color: colors.textSecondary,
    },
    acaoReuniao: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 'auto',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.lg,
    },
    modalContent: {
      width: '100%',
      maxWidth: 420,
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: spacing.base,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitulo: {
      flex: 1,
      fontSize: typography.size.md,
      fontWeight: typography.weight.bold,
      color: colors.textPrimary,
      marginRight: spacing.sm,
    },
    modalBody: {
      padding: spacing.base,
      gap: spacing.xs,
    },
    modalLinha: {
      fontSize: typography.size.sm,
      color: colors.textPrimary,
      lineHeight: 20,
    },
    modalRotulo: {
      fontWeight: typography.weight.bold,
    },
    modalFooter: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      padding: spacing.base,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    modalBtnOutline: {
      minHeight: 44,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalBtnOutlineTexto: {
      fontSize: typography.size.sm,
      fontWeight: typography.weight.semibold,
      color: colors.textSecondary,
    },
  });





