import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '../../store/authStore';
import { psicologoService } from '../../services/psicologoService';
import { typography, spacing, borderRadius, useTheme, ThemeColors } from '../../theme';
import { ProfileStackParamList, RootStackParamList } from '../../types/navigation.types';
import { AtividadeRecente, ProximaConsulta } from '../../types/api.types';

// As telas do portal vivem na ProfileStack, mas navegam para rotas globais
// (ex.: Reuniao) — por isso a união dos dois ParamLists.
type NavigationProp = NativeStackNavigationProp<ProfileStackParamList & RootStackParamList>;

const formatarBRL = (valor: number | null | undefined) => {
  const n = Number(valor || 0);
  return `R$ ${n.toFixed(2).replace('.', ',')}`;
};

// Espelho de formatarData/formatarTempoRelativo do DashboardPsicologo.jsx (web)
const rotuloRelativoData = (iso: string) => {
  const data = new Date(iso);
  if (isNaN(data.getTime())) return '—';
  const hoje = new Date();
  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);
  if (data.toDateString() === hoje.toDateString()) return 'Hoje';
  if (data.toDateString() === amanha.toDateString()) return 'Amanhã';
  return data.toLocaleDateString('pt-BR');
};

const formatarTempoRelativo = (dataStr?: string | null) => {
  if (!dataStr) return '';
  const data = new Date(dataStr);
  if (isNaN(data.getTime())) return '';
  const agora = new Date();
  const diffMs = agora.getTime() - data.getTime();

  if (diffMs < 60000) return 'Agora mesmo';

  const minutos = Math.floor(diffMs / 60000);
  if (minutos < 60) return `Há ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;

  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `Há ${horas} ${horas === 1 ? 'hora' : 'horas'}`;

  const ontem = new Date(agora);
  ontem.setDate(ontem.getDate() - 1);
  if (data.toDateString() === ontem.toDateString()) return 'Ontem';

  const dias = Math.floor(horas / 24);
  if (dias < 30) return `Há ${dias} ${dias === 1 ? 'dia' : 'dias'}`;

  return data.toLocaleDateString('pt-BR');
};

const formatarMensagemAtividade = (atividade: AtividadeRecente) => {
  if (atividade.tipo === 'consulta_finalizada') {
    return `Consulta finalizada com ${atividade.pacienteNome}`;
  }
  if (atividade.tipo === 'novo_agendamento') {
    return `${atividade.pacienteNome} agendou consulta para ${rotuloRelativoData(
      atividade.dataSessao || atividade.data,
    )}`;
  }
  return '';
};


export const DashboardPsicologoScreen = () => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<NavigationProp>();
  const user = useAuthStore((state) => state.user);

  const statsQuery = useQuery({
    queryKey: ['psicologo', 'dashboard', 'stats', user?.id],
    queryFn: () => psicologoService.estatisticas(),
    enabled: Boolean(user),
  });

  const consultasQuery = useQuery({
    queryKey: ['psicologo', 'dashboard', 'appointments', user?.id],
    queryFn: () => psicologoService.proximasConsultas(),
    enabled: Boolean(user),
  });

  const atividadesQuery = useQuery({
    queryKey: ['psicologo', 'dashboard', 'atividades', user?.id],
    queryFn: () => psicologoService.atividadesRecentes(),
    enabled: Boolean(user),
  });

  const isLoading = statsQuery.isLoading || consultasQuery.isLoading || atividadesQuery.isLoading;

  const refetch = async () => {
    await Promise.all([statsQuery.refetch(), consultasQuery.refetch(), atividadesQuery.refetch()]);
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const stats = statsQuery.data;
  const proximasConsultas = (consultasQuery.data || []).slice(0, 3);
  const atividadesRecentes = atividadesQuery.data || [];

  const CARDS: {
    chave: string;
    label: string;
    icone: React.ComponentProps<typeof Ionicons>['name'];
    cor: string;
  }[] = [
    { chave: 'consultasHoje', label: 'Consultas hoje', icone: 'today', cor: colors.primary },
    { chave: 'consultasSemana', label: 'Consultas na semana', icone: 'calendar', cor: colors.info },
    { chave: 'pacientesAtivos', label: 'Pacientes ativos', icone: 'people', cor: colors.accent },
    { chave: 'faturamentoMes', label: 'Faturamento no mês', icone: 'cash', cor: colors.success },
  ];

  const formatarValor = (chave: string, valor: unknown) =>
    chave === 'faturamentoMes' ? formatarBRL(Number(valor)) : String(valor ?? 0);

  
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={!isLoading} onRefresh={refetch} />}
    >
      {/* Saudação */}
      <Text style={styles.saudacao}>Olá, {user?.nome?.split(' ')[0] || 'Psicólogo'}! 👋</Text>
      <Text style={styles.subtitulo}>Aqui está o resumo do seu consultório hoje.</Text>

      {/* Cards de estatísticas */}
      <View style={styles.statsGrid}>
        {CARDS.map((card) => (
          <View key={card.chave} style={styles.statCard}>
            <View style={[styles.statIcone, { backgroundColor: `${card.cor}1A` }]}>
              <Ionicons name={card.icone} size={18} color={card.cor} />
            </View>
            <Text style={[styles.statValor, { color: card.cor }]}>
              {formatarValor(card.chave, stats?.[card.chave as keyof typeof stats])}
            </Text>
            <Text style={styles.statLabel}>{card.label}</Text>
          </View>
        ))}
      </View>

      {/* Próximas consultas */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="calendar" size={16} color={colors.success} />
          <Text style={styles.cardTitulo}>Próximas Consultas</Text>
        </View>
        {proximasConsultas.length > 0 ? (
          <>
            {proximasConsultas.map((item) => (
              <View key={item.id} style={styles.consultaItem}>
                <View style={styles.consultaIcone}>
                  <Ionicons name="person" size={16} color={colors.primary} />
                </View>
                <View style={styles.consultaInfo}>
                  <Text style={styles.consultaPaciente}>{item.pacienteNome}</Text>
                  <Text style={styles.consultaDetalhe}>
                    {rotuloRelativoData(item.data)} • {item.horario} — {item.tipo}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.consultaAcao}
                  onPress={() => navigation.navigate('Reuniao', { sessaoId: item.id })}
                  activeOpacity={0.7}
                  accessibilityLabel={`Entrar na sessão com ${item.pacienteNome}`}
                >
                  <Ionicons name="videocam" size={18} color={colors.white} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={styles.botaoSecundario}
              onPress={() => navigation.navigate('AgendaPsicologo')}
              activeOpacity={0.7}
            >
              <Ionicons name="calendar-outline" size={16} color={colors.primary} />
              <Text style={styles.botaoSecundarioTexto}>Ver Agenda Completa</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.vazioBox}>
            <Ionicons name="calendar-clear" size={40} color={colors.textFaint} />
            <Text style={styles.vazioTexto}>Nenhuma consulta agendada</Text>
            <TouchableOpacity
              style={styles.botaoPrimario}
              onPress={() => navigation.navigate('NewSessionPsicologo')}
              activeOpacity={0.7}
            >
              <Text style={styles.botaoPrimarioTexto}>Agendar Consulta</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Atividades recentes */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="pulse" size={16} color={colors.success} />
          <Text style={styles.cardTitulo}>Atividades Recentes</Text>
        </View>
        {atividadesRecentes.length > 0 ? (
          atividadesRecentes.map((atividade) => (
            <View key={atividade.sessaoId} style={styles.atividadeItem}>
              <View
                style={[
                  styles.atividadeIcone,
                  {
                    backgroundColor:
                      atividade.tipo === 'consulta_finalizada' ? colors.success : colors.primary,
                  },
                ]}
              >
                <Ionicons
                  name={atividade.tipo === 'consulta_finalizada' ? 'checkmark' : 'add'}
                  size={18}
                  color={colors.white}
                />
              </View>
              <View style={styles.atividadeInfo}>
                <Text style={styles.atividadeTitulo}>
                  {atividade.tipo === 'consulta_finalizada'
                    ? 'Consulta finalizada'
                    : 'Novo agendamento'}
                </Text>
                <Text style={styles.atividadeMensagem}>{formatarMensagemAtividade(atividade)}</Text>
                <Text style={styles.atividadeTempo}>{formatarTempoRelativo(atividade.data)}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.vazioBox}>
            <Ionicons name="file-tray" size={40} color={colors.textFaint} />
            <Text style={styles.vazioTexto}>Nenhuma atividade recente</Text>
          </View>
        )}
      </View>
    </ScrollView>
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
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.cream,
    },
    saudacao: {
      fontSize: typography.size.xl,
      fontWeight: typography.weight.bold,
      color: colors.textPrimary,
    },
    subtitulo: {
      fontSize: typography.size.sm,
      color: colors.textSecondary,
      marginTop: spacing.xs,
      marginBottom: spacing.base,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginBottom: spacing.base,
    },
    statCard: {
      width: '48.5%',
      flexGrow: 1,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.lg,
      padding: spacing.base,
    },
    statIcone: {
      width: 34,
      height: 34,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    statValor: {
      fontSize: typography.size['2xl'],
      fontWeight: typography.weight.bold,
    },
    statLabel: {
      fontSize: typography.size.xs,
      color: colors.textSecondary,
      marginTop: spacing.xs,
    },
    card: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.lg,
      padding: spacing.base,
      marginBottom: spacing.base,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginBottom: spacing.base,
    },
    cardTitulo: {
      fontSize: typography.size.md,
      fontWeight: typography.weight.bold,
      color: colors.textPrimary,
    },
    consultaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    consultaIcone: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primaryTint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    consultaInfo: {
      flex: 1,
    },
    consultaPaciente: {
      fontSize: typography.size.sm,
      fontWeight: typography.weight.semibold,
      color: colors.textPrimary,
    },
    consultaDetalhe: {
      fontSize: typography.size.xs,
      color: colors.textSecondary,
      marginTop: 2,
    },
    consultaAcao: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    botaoSecundario: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      marginTop: spacing.base,
      minHeight: 44,
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.sm,
    },
    botaoSecundarioTexto: {
      fontSize: typography.size.sm,
      fontWeight: typography.weight.semibold,
      color: colors.primary,
    },
    botaoPrimario: {
      minHeight: 44,
      backgroundColor: colors.primary,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.md,
    },
    botaoPrimarioTexto: {
      fontSize: typography.size.sm,
      fontWeight: typography.weight.bold,
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
    atividadeItem: {
      flexDirection: 'row',
      gap: spacing.md,
      marginBottom: spacing.base,
    },
    atividadeIcone: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    atividadeInfo: {
      flex: 1,
    },
    atividadeTitulo: {
      fontSize: typography.size.sm,
      fontWeight: typography.weight.bold,
      color: colors.textPrimary,
    },
    atividadeMensagem: {
      fontSize: typography.size.xs,
      color: colors.textSecondary,
      marginTop: 2,
    },
    atividadeTempo: {
      fontSize: typography.size.xs,
      color: colors.textFaint,
      marginTop: 2,
    },
  });



