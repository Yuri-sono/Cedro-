import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking, Image } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList, MainTabParamList } from '../../types/navigation.types';
import { useAuthStore } from '../../store/authStore';
import { usePsicologos } from '../../hooks/usePsicologos';
import { useSessoes } from '../../hooks/useSessoes';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { Avatar } from '../../components/Avatar';
import { PsicologoCard } from '../../components/PsicologoCard';
import { SessionCard } from '../../components/SessionCard';
import { TipoUsuario } from '../../types/api.types';
import { usePsychologistDashboard } from '../../hooks/usePsychologistDashboard';
import { formatAgendaSummary } from '../../utils/psychologistAgenda';

type HomeNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

const TELEGRAM_URL = 'https://t.me/cedroapoio';

export const HomeScreen = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const user = useAuthStore((state) => state.user);
  const isPsicologo = user?.tipoUsuario === TipoUsuario.psicologo;

  const { psicologos, isLoading: loadingPsicos } = usePsicologos();
  const { sessoes, isLoading: loadingSessoes } = useSessoes();
  const { estatisticas, proximasConsultas, isLoading: loadingDashboard } = usePsychologistDashboard();

  const destaquePsicologos = psicologos.slice(0, 3);
  const proximaSessao = sessoes.find((s) => s.statusSessao.toLowerCase() === 'agendada');
  const firstName = user?.nome?.split(' ')[0] || 'bem-vindo';
  const openProfileTab = (screen: 'PsychologistSettings' | 'MySessions') => {
    const parentNavigation = navigation.getParent() as NavigationProp<MainTabParamList> | undefined;
    parentNavigation?.navigate('ProfileStack', { screen });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <View style={styles.brandMini}>
          <Image source={require('../../../assets/splash-icon.png')} style={styles.brandLogo} resizeMode="contain" />
          <View>
            <Text style={styles.brandText}>CEDRO</Text>
            <Text style={styles.brandSubText}>Apoio psicologico</Text>
          </View>
        </View>
        <Avatar url={user?.fotoUrl} size={46} />
      </View>

      <View style={styles.heroCard}>
        <Text style={styles.heroEyebrow}>Bem-estar hoje</Text>
        <Text style={styles.greeting} numberOfLines={2}>Ola, {firstName}</Text>
        <Text style={styles.subtitle}>Respire com calma. Seu cuidado continua aqui.</Text>
      </View>

      {isPsicologo ? (
        <>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Resumo do atendimento</Text>
              <TouchableOpacity onPress={() => openProfileTab('PsychologistSettings')}>
                <Text style={styles.seeAllText}>Editar</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{loadingDashboard ? '...' : estatisticas?.consultasHoje ?? 0}</Text>
                <Text style={styles.statLabel}>Hoje</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{loadingDashboard ? '...' : estatisticas?.consultasSemana ?? 0}</Text>
                <Text style={styles.statLabel}>Semana</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{loadingDashboard ? '...' : estatisticas?.pacientesAtivos ?? 0}</Text>
                <Text style={styles.statLabel}>Pacientes</Text>
              </View>
            </View>

            <View style={styles.professionalSummary}>
              <Text style={styles.professionalSummaryTitle}>
                {user?.especialidade || 'Especialidade ainda nao configurada'}
              </Text>
              <Text style={styles.professionalSummaryText}>
                {user?.precoSessao != null ? `Consulta: R$ ${user.precoSessao.toFixed(2)}` : 'Valor da consulta nao definido'}
              </Text>
              <Text style={styles.professionalSummaryText}>
                {formatAgendaSummary(user?.diasAtendimento, user?.horariosAtendimento)}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Proximas consultas</Text>
              <TouchableOpacity onPress={() => openProfileTab('MySessions')}>
                <Text style={styles.seeAllText}>Ver agenda</Text>
              </TouchableOpacity>
            </View>

            {loadingSessoes ? (
              <ActivityIndicator color={colors.primary} />
            ) : sessoes.length > 0 ? (
              sessoes.slice(0, 3).map((sessao) => <SessionCard key={sessao.id} sessao={sessao} />)
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>Nenhuma consulta agendada no momento.</Text>
              </View>
            )}

            {proximasConsultas.length > 0 && (
              <View style={styles.nextPatientsCard}>
                <Text style={styles.nextPatientsTitle}>Pacientes confirmados</Text>
                {proximasConsultas.slice(0, 3).map((consulta) => (
                  <Text key={consulta.id} style={styles.nextPatientsText}>
                    {new Date(consulta.data).toLocaleDateString('pt-BR')} {consulta.horario} • {consulta.pacienteNome}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </>
      ) : (
        <>
          <TouchableOpacity
            style={styles.telegramCard}
            onPress={() => Linking.openURL(TELEGRAM_URL)}
            activeOpacity={0.82}
          >
            <View style={styles.telegramIcon}>
              <Text style={styles.telegramIconText}>TG</Text>
            </View>
            <View style={styles.telegramTextBlock}>
              <Text style={styles.telegramTitle}>Grupo da instituicao</Text>
              <Text style={styles.telegramText}>
                Conteudos importantes, eventos e avisos para a comunidade Cedro.
              </Text>
            </View>
            <Text style={styles.telegramAction}>Abrir</Text>
          </TouchableOpacity>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sua proxima sessao</Text>
            {loadingSessoes ? (
              <ActivityIndicator color={colors.primary} />
            ) : proximaSessao ? (
              <SessionCard sessao={proximaSessao} />
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>Voce nao tem consultas agendadas.</Text>
                <TouchableOpacity onPress={() => navigation.navigate('PsicologoList')}>
                  <Text style={styles.linkText}>Encontrar um psicologo</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Psicologos em destaque</Text>
              <TouchableOpacity onPress={() => navigation.navigate('PsicologoList')}>
                <Text style={styles.seeAllText}>Ver todos</Text>
              </TouchableOpacity>
            </View>

            {loadingPsicos ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              destaquePsicologos.map((psi) => (
                <PsicologoCard
                  key={psi.id}
                  psicologo={psi}
                  onPress={() => navigation.navigate('PsicologoDetail', { psicologoId: psi.id })}
                />
              ))
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    padding: spacing.base,
    paddingTop: spacing.xl,
    paddingBottom: spacing['3xl'],
    maxWidth: 520,
    width: '100%',
    alignSelf: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.base,
  },
  brandMini: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  brandLogo: {
    width: 48,
    height: 48,
  },
  brandText: {
    fontSize: typography.size.xs,
    color: colors.forest,
    fontWeight: typography.weight.bold,
    letterSpacing: 0.4,
  },
  brandSubText: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },
  heroCard: {
    backgroundColor: colors.surfaceWarm,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.base,
    borderWidth: 1,
    borderColor: '#E7DCC6',
    shadowColor: colors.forest,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 18,
    elevation: 4,
  },
  heroEyebrow: {
    color: colors.primary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.sm,
  },
  greeting: {
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.size.base,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  telegramCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.forest,
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  telegramIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.leaf,
    alignItems: 'center',
    justifyContent: 'center',
  },
  telegramIconText: {
    color: colors.white,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
  },
  telegramTextBlock: {
    flex: 1,
  },
  telegramTitle: {
    color: colors.white,
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
  },
  telegramText: {
    color: colors.white,
    fontSize: typography.size.sm,
    lineHeight: typography.size.sm * 1.35,
    opacity: 0.88,
    marginTop: 2,
  },
  telegramAction: {
    color: colors.white,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.base,
    marginBottom: spacing.base,
  },
  sectionTitle: {
    flex: 1,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  seeAllText: {
    color: colors.primary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
  emptyCard: {
    backgroundColor: colors.surfaceWarm,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E7DCC6',
  },
  emptyText: {
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surfaceWarm,
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: '#E7DCC6',
  },
  statValue: {
    fontSize: typography.size['2xl'],
    color: colors.primary,
    fontWeight: typography.weight.bold,
  },
  statLabel: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  professionalSummary: {
    backgroundColor: colors.surfaceWarm,
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: '#E7DCC6',
    marginTop: spacing.base,
  },
  professionalSummaryTitle: {
    color: colors.textPrimary,
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
  },
  professionalSummaryText: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    marginTop: spacing.xs,
  },
  nextPatientsCard: {
    backgroundColor: colors.surfaceWarm,
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    marginTop: spacing.base,
    borderWidth: 1,
    borderColor: '#E7DCC6',
  },
  nextPatientsTitle: {
    color: colors.textPrimary,
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.xs,
  },
  nextPatientsText: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    marginTop: spacing.xs,
  },
  linkText: {
    color: colors.primary,
    fontWeight: typography.weight.semibold,
  },
});
