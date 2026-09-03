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
  Linking,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery } from '@tanstack/react-query';
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

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

// Chave YYYY-MM-DD de um Date (horário local)
const chaveDia = (d: Date) => {
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
};

// Domingo da semana de uma data (00:00)
const inicioSemana = (d: Date) => {
  const base = new Date(d);
  base.setHours(0, 0, 0, 0);
  base.setDate(base.getDate() - base.getDay());
  return base;
};

const adicionarDias = (d: Date, dias: number) => {
  const nova = new Date(d);
  nova.setDate(nova.getDate() + dias);
  return nova;
};

const formatarDataHora = (dataStr: string) => {
  if (!dataStr) return '-';
  return new Date(dataStr).toLocaleString('pt-BR');
};

const formatarBRL = (valor: number | null | undefined) => {
  const n = Number(valor || 0);
  return `R$ ${n.toFixed(2).replace('.', ',')}`;
};


export const AgendaPsicologoScreen = () => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<NavigationProp>();
  const user = useAuthStore((state) => state.user);

  // Deslocamento em semanas a partir da semana atual (0 = semana corrente)
  const [offsetSemanas, setOffsetSemanas] = useState(0);
  const [sessaoSelecionada, setSessaoSelecionada] = useState<Sessao | null>(null);
  const [linkState, setLinkState] = useState({ loading: false, message: '' });

  const { data: sessoes, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['psicologo', 'agenda', user?.id],
    queryFn: () => (user?.id ? sessaoService.sessoesDoPsicologo(user.id) : []),
    enabled: Boolean(user?.id),
  });

  // Espelho de `eventos` (useMemo) da AgendaPsicologo.jsx (web): sessões agrupadas
  // por dia, com cor por status (agendada/confirmada/realizada/cancelada).
  const diasDaSemana = useMemo(() => {
    const porDia = new Map<string, Sessao[]>();
    (sessoes || []).forEach((sessao) => {
      const chave = chaveDia(new Date(sessao.dataSessao));
      if (!porDia.has(chave)) porDia.set(chave, []);
      porDia.get(chave)!.push(sessao);
    });

    const primeiroDia = adicionarDias(inicioSemana(new Date()), offsetSemanas * 7);
    return Array.from({ length: 7 }, (_, i) => {
      const data = adicionarDias(primeiroDia, i);
      const chave = chaveDia(data);
      return {
        data,
        chave,
        isHoje: chave === chaveDia(new Date()),
        sessoes: (porDia.get(chave) || []).sort(
          (a, b) => new Date(a.dataSessao).getTime() - new Date(b.dataSessao).getTime(),
        ),
      };
    });
  }, [sessoes, offsetSemanas]);

  const corStatus = (status: string) => {
    switch (status) {
      case 'realizada':
        return colors.success;
      case 'confirmada':
        return colors.warning;
      case 'cancelada':
        return colors.textFaint;
      default:
        return colors.primary;
    }
  };

  const labelStatus = (status: string) => {
    switch (status) {
      case 'realizada':
        return 'Realizada';
      case 'confirmada':
        return 'Confirmada';
      case 'cancelada':
        return 'Cancelada';
      case 'agendada':
        return 'Agendada';
      default:
        return status || '-';
    }
  };

  const irParaSemana = (delta: number) => setOffsetSemanas((prev) => prev + delta);
  const voltarHoje = () => setOffsetSemanas(0);

  // Espelho de abrirLinkReuniao() da AgendaPsicologo.jsx (web)
  const abrirLinkReuniao = async () => {
    if (!sessaoSelecionada) return;
    try {
      setLinkState({ loading: true, message: '' });
      const response = await sessaoService.linkReuniao(sessaoSelecionada.id);

      if (!response.liberado) {
        setLinkState({
          loading: false,
          message: `Link liberado em ${formatarDataHora(response.disponivelEm || '')}`,
        });
        return;
      }

      if (response.link) {
        await Linking.openURL(response.link);
        setLinkState({ loading: false, message: '' });
        return;
      }

      setLinkState({
        loading: false,
        message: response.erro || 'Link ainda não disponível para esta sessão.',
      });
    } catch (error) {
      console.error('Erro ao buscar link da reunião:', error);
      setLinkState({ loading: false, message: 'Não foi possível obter o link da reunião.' });
    }
  };

  const rotuloIntervalo = () => {
    const primeiro = diasDaSemana[0]?.data;
    const ultimo = diasDaSemana[6]?.data;
    if (!primeiro || !ultimo) return '';
    return `${primeiro.getDate()} ${MESES[primeiro.getMonth()]} — ${ultimo.getDate()} ${MESES[ultimo.getMonth()]}`;
  };

  
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      >
        {/* Toolbar da semana (equivalente à toolbar do FullCalendar na web) */}
        <View style={styles.toolbar}>
          <TouchableOpacity
            style={styles.toolbarBtn}
            onPress={() => irParaSemana(-1)}
            accessibilityLabel="Semana anterior"
          >
            <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.toolbarTitulo}>{rotuloIntervalo()}</Text>
          <TouchableOpacity
            style={styles.toolbarBtn}
            onPress={() => irParaSemana(1)}
            accessibilityLabel="Próxima semana"
          >
            <Ionicons name="chevron-forward" size={18} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.toolbarRow}>
          <TouchableOpacity style={styles.hojeBtn} onPress={voltarHoje} activeOpacity={0.7}>
            <Text style={styles.hojeBtnTexto}>Hoje</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.novaConsultaBtn}
            onPress={() => navigation.navigate('NewSessionPsicologo')}
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle" size={16} color={colors.white} />
            <Text style={styles.novaConsultaTexto}>Nova Consulta</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          diasDaSemana.map((dia) => (
            <View key={dia.chave} style={[styles.diaCard, dia.isHoje && styles.diaCardHoje]}>
              <View style={styles.diaHeader}>
                <Text style={[styles.diaTitulo, dia.isHoje && styles.diaTituloHoje]}>
                  {DIAS_SEMANA[dia.data.getDay()]}, {dia.data.getDate()} {MESES[dia.data.getMonth()]}
                  {dia.isHoje ? ' • Hoje' : ''}
                </Text>
                <Text style={styles.diaContagem}>
                  {dia.sessoes.length > 0
                    ? `${dia.sessoes.length} ${dia.sessoes.length === 1 ? 'sessão' : 'sessões'}`
                    : ''}
                </Text>
              </View>
              {dia.sessoes.length === 0 ? (
                <Text style={styles.diaVazio}>Sem sessões</Text>
              ) : (
                dia.sessoes.map((sessao) => (
                  <TouchableOpacity
                    key={sessao.id}
                    style={[styles.evento, { borderLeftColor: corStatus(sessao.statusSessao) }]}
                    onPress={() => {
                      setLinkState({ loading: false, message: '' });
                      setSessaoSelecionada(sessao);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.eventoInfo}>
                      <Text style={styles.eventoTitulo}>
                        {sessao.pacienteNome || `Paciente #${sessao.pacienteId}`}
                      </Text>
                      <Text style={styles.eventoHora}>
                        {new Date(sessao.dataSessao).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        • {sessao.duracao || 60} min
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: `${corStatus(sessao.statusSessao)}1A` },
                      ]}
                    >
                      <Text style={[styles.statusTexto, { color: corStatus(sessao.statusSessao) }]}>
                        {labelStatus(sessao.statusSessao)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* ── Modal: Detalhes da Sessão (espelho do modal da web) ── */}
      <Modal
        visible={Boolean(sessaoSelecionada)}
        transparent
        animationType="fade"
        onRequestClose={() => setSessaoSelecionada(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo} numberOfLines={1}>
                {sessaoSelecionada?.pacienteNome || `Sessão #${sessaoSelecionada?.id ?? ''}`}
              </Text>
              <TouchableOpacity
                onPress={() => setSessaoSelecionada(null)}
                accessibilityLabel="Fechar"
              >
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.modalLinha}>
                <Text style={styles.modalRotulo}>Paciente: </Text>
                {sessaoSelecionada?.pacienteNome || `Paciente #${sessaoSelecionada?.pacienteId}`}
              </Text>
              <Text style={styles.modalLinha}>
                <Text style={styles.modalRotulo}>Psicólogo: </Text>
                {sessaoSelecionada?.psicologoNome || `Psicólogo #${sessaoSelecionada?.psicologoId}`}
              </Text>
              <Text style={styles.modalLinha}>
                <Text style={styles.modalRotulo}>Data: </Text>
                {sessaoSelecionada ? formatarDataHora(sessaoSelecionada.dataSessao) : '-'}
              </Text>
              <Text style={styles.modalLinha}>
                <Text style={styles.modalRotulo}>Duração: </Text>
                {sessaoSelecionada?.duracao} minutos
              </Text>
              <Text style={styles.modalLinha}>
                <Text style={styles.modalRotulo}>Status: </Text>
                {labelStatus(sessaoSelecionada?.statusSessao || '')}
              </Text>
              <Text style={styles.modalLinha}>
                <Text style={styles.modalRotulo}>Valor: </Text>
                {formatarBRL(sessaoSelecionada?.valor)}
              </Text>
              <Text style={styles.modalLinha}>
                <Text style={styles.modalRotulo}>Link: </Text>
                {sessaoSelecionada?.linkReuniao || 'Não gerado'}
              </Text>
              {linkState.message ? (
                <View style={styles.alertaAviso}>
                  <Text style={styles.alertaAvisoTexto}>{linkState.message}</Text>
                </View>
              ) : null}
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalBtnOutline}
                onPress={() => setSessaoSelecionada(null)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalBtnOutlineTexto}>Fechar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtnPrimario}
                onPress={abrirLinkReuniao}
                disabled={linkState.loading}
                activeOpacity={0.7}
              >
                {linkState.loading ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.modalBtnPrimarioTexto}>Ver link da reunião</Text>
                )}
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
    toolbar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
    toolbarBtn: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    toolbarTitulo: {
      fontSize: typography.size.md,
      fontWeight: typography.weight.bold,
      color: colors.textPrimary,
      textTransform: 'capitalize',
    },
    toolbarRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.base,
    },
    hojeBtn: {
      minHeight: 40,
      paddingHorizontal: spacing.base,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    hojeBtnTexto: {
      fontSize: typography.size.sm,
      fontWeight: typography.weight.semibold,
      color: colors.textPrimary,
    },
    novaConsultaBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      minHeight: 40,
      paddingHorizontal: spacing.base,
      borderRadius: borderRadius.md,
      backgroundColor: colors.primary,
    },
    novaConsultaTexto: {
      fontSize: typography.size.sm,
      fontWeight: typography.weight.bold,
      color: colors.white,
    },
    diaCard: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.lg,
      padding: spacing.base,
      marginBottom: spacing.sm,
    },
    diaCardHoje: {
      borderColor: colors.primary,
      borderWidth: 2,
    },
    diaHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
    diaTitulo: {
      fontSize: typography.size.sm,
      fontWeight: typography.weight.bold,
      color: colors.textPrimary,
      textTransform: 'capitalize',
    },
    diaTituloHoje: {
      color: colors.primary,
    },
    diaContagem: {
      fontSize: typography.size.xs,
      color: colors.textFaint,
    },
    diaVazio: {
      fontSize: typography.size.xs,
      color: colors.textFaint,
    },
    evento: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm,
      backgroundColor: colors.surface,
      borderLeftWidth: 4,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderTopColor: colors.border,
      borderRightColor: colors.border,
      borderBottomColor: colors.border,
      padding: spacing.sm,
      marginBottom: spacing.sm,
    },
    eventoInfo: {
      flex: 1,
    },
    eventoTitulo: {
      fontSize: typography.size.sm,
      fontWeight: typography.weight.semibold,
      color: colors.textPrimary,
    },
    eventoHora: {
      fontSize: typography.size.xs,
      color: colors.textSecondary,
      marginTop: 2,
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
    alertaAviso: {
      marginTop: spacing.sm,
      backgroundColor: colors.accentTint,
      borderRadius: borderRadius.md,
      padding: spacing.sm,
    },
    alertaAvisoTexto: {
      fontSize: typography.size.xs,
      color: colors.textPrimary,
    },
    modalFooter: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: spacing.sm,
      padding: spacing.base,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    modalBtnOutline: {
      minHeight: 44,
      paddingHorizontal: spacing.base,
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
    modalBtnPrimario: {
      minHeight: 44,
      paddingHorizontal: spacing.base,
      borderRadius: borderRadius.md,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalBtnPrimarioTexto: {
      fontSize: typography.size.sm,
      fontWeight: typography.weight.bold,
      color: colors.white,
    },
  });




