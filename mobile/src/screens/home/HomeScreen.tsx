import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
    <LinearGradient
      colors={['#F5F7F1', '#E7F2EC']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <View style={styles.brandMini}>
            <View style={styles.logoCircle}>
              <Image source={require('../../../assets/splash-icon.png')} style={styles.brandLogo} resizeMode="contain" />
            </View>
            <View>
              <Text style={styles.brandText}>CEDRO</Text>
              <Text style={styles.brandSubText}>Apoio psicológico</Text>
            </View>
          </View>
          <View style={styles.avatarContainer}>
            <Avatar url={user?.fotoUrl} size={48} />
          </View>
        </View>

        <LinearGradient
          colors={['#FFFFFF', '#FFFDF8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroContent}>
            <Text style={styles.heroEyebrow}>🌿 Bem-estar hoje</Text>
            <Text style={styles.greeting} numberOfLines={2}>Olá, {firstName}</Text>
            <Text style={styles.subtitle}>Respire com calma. Seu cuidado continua aqui.</Text>
          </View>
          <View style={styles.heroDecor} />
        </LinearGradient>

        {isPsicologo ? (
          <>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📊 Resumo do atendimento</Text>
                <TouchableOpacity onPress={() => openProfileTab('PsychologistSettings')} activeOpacity={0.7}>
                  <Text style={styles.seeAllText}>Editar</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.statsGrid}>
                <LinearGradient colors={['#FFFFFF', '#FFFDF8']} style={styles.statCard}>
                  <Text style={styles.statValue}>{loadingDashboard ? '...' : estatisticas?.consultasHoje ?? 0}</Text>
                  <Text style={styles.statLabel}>Hoje</Text>
                </LinearGradient>
                <LinearGradient colors={['#FFFFFF', '#FFFDF8']} style={styles.statCard}>
                  <Text style={styles.statValue}>{loadingDashboard ? '...' : estatisticas?.consultasSemana ?? 0}</Text>
                  <Text style={styles.statLabel}>Semana</Text>
                </LinearGradient>
                <LinearGradient colors={['#FFFFFF', '#FFFDF8']} style={styles.statCard}>
                  <Text style={styles.statValue}>{loadingDashboard ? '...' : estatisticas?.pacientesAtivos ?? 0}</Text>
                  <Text style={styles.statLabel}>Pacientes</Text>
                </LinearGradient>
              </View>

              <LinearGradient colors={['#FFFFFF', '#FFFDF8']} style={styles.professionalSummary}>
                <Text style={styles.professionalSummaryTitle}>
                  {user?.especialidade || 'Especialidade ainda não configurada'}
                </Text>
                <Text style={styles.professionalSummaryText}>
                  {user?.precoSessao != null ? `Consulta: R$ ${user.precoSessao.toFixed(2)}` : 'Valor da consulta não definido'}
                </Text>
                <Text style={styles.professionalSummaryText}>
                  {formatAgendaSummary(user?.diasAtendimento, user?.horariosAtendimento)}
                </Text>
              </LinearGradient>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📅 Próximas consultas</Text>
                <TouchableOpacity onPress={() => openProfileTab('MySessions')} activeOpacity={0.7}>
                  <Text style={styles.seeAllText}>Ver agenda</Text>
                </TouchableOpacity>
              </View>

              {loadingSessoes ? (
                <ActivityIndicator color={colors.primary} />
              ) : sessoes.length > 0 ? (
                sessoes.slice(0, 3).map((sessao) => <SessionCard key={sessao.id} sessao={sessao} />)
              ) : (
                <LinearGradient colors={['#FFFFFF', '#FFFDF8']} style={styles.emptyCard}>
                  <Text style={styles.emptyText}>Nenhuma consulta agendada no momento.</Text>
                </LinearGradient>
              )}

              {proximasConsultas.length > 0 && (
                <LinearGradient colors={['#FFFFFF', '#FFFDF8']} style={styles.nextPatientsCard}>
                  <Text style={styles.nextPatientsTitle}>Pacientes confirmados</Text>
                  {proximasConsultas.slice(0, 3).map((consulta) => (
                    <Text key={consulta.id} style={styles.nextPatientsText}>
                      {new Date(consulta.data).toLocaleDateString('pt-BR')} {consulta.horario} • {consulta.pacienteNome}
                    </Text>
                  ))}
                </LinearGradient>
              )}
            </View>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.telegramCardWrapper}
              onPress={() => Linking.openURL(TELEGRAM_URL)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#173B2F', '#24745B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.telegramCard}
              >
                <View style={styles.telegramIcon}>
                  <Text style={styles.telegramIconText}>📱</Text>
                </View>
                <View style={styles.telegramTextBlock}>
                  <Text style={styles.telegramTitle}>Grupo da instituição</Text>
                  <Text style={styles.telegramText}>
                    Conteúdos importantes, eventos e avisos para a comunidade Cedro.
                  </Text>
                </View>
                <Text style={styles.telegramAction}>→</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🗓️ Sua próxima sessão</Text>
              {loadingSessoes ? (
                <ActivityIndicator color={colors.primary} />
              ) : proximaSessao ? (
                <SessionCard sessao={proximaSessao} />
              ) : (
                <LinearGradient colors={['#FFFFFF', '#FFFDF8']} style={styles.emptyCard}>
                  <Text style={styles.emptyText}>Você não tem consultas agendadas.</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('PsicologoList')} activeOpacity={0.7}>
                    <Text style={styles.linkText}>Encontrar um psicólogo</Text>
                  </TouchableOpacity>
                </LinearGradient>
              )}
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>⭐ Psicólogos em destaque</Text>
                <TouchableOpacity onPress={() => navigation.navigate('PsicologoList')} activeOpacity={0.7}>
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: spacing.lg,
  },
  brandMini: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  logoCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.forest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  brandLogo: {
    width: 40,
    height: 40,
  },
  brandText: {
    fontSize: typography.size.base,
    color: colors.forest,
    fontWeight: typography.weight.bold,
    letterSpacing: 1.2,
  },
  brandSubText: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: typography.weight.medium,
  },
  avatarContainer: {
    shadowColor: colors.forest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
    borderRadius: 24,
  },
  heroCard: {
    borderRadius: borderRadius['2xl'],
    padding: spacing.xl,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: '#E7DCC6',
    shadowColor: colors.forest,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 6,
    overflow: 'hidden',
  },
  heroContent: {
    position: 'relative',
    zIndex: 1,
  },
  heroDecor: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.mint,
    opacity: 0.3,
  },
  heroEyebrow: {
    color: colors.primary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.sm,
    letterSpacing: 0.5,
  },
  greeting: {
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: typography.size.base,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    lineHeight: typography.size.base * 1.5,
  },
  telegramCardWrapper: {
    marginBottom: spacing.xl,
  },
  telegramCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius['2xl'],
    padding: spacing.lg,
    gap: spacing.base,
    shadowColor: colors.forest,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 5,
  },
  telegramIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  telegramIconText: {
    fontSize: typography.size['2xl'],
  },
  telegramTextBlock: {
    flex: 1,
  },
  telegramTitle: {
    color: colors.white,
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    letterSpacing: 0.3,
  },
  telegramText: {
    color: colors.white,
    fontSize: typography.size.sm,
    lineHeight: typography.size.sm * 1.4,
    opacity: 0.9,
    marginTop: 4,
  },
  telegramAction: {
    color: colors.white,
    fontSize: typography.size['2xl'],
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
    letterSpacing: 0.3,
  },
  seeAllText: {
    color: colors.primary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    letterSpacing: 0.3,
  },
  emptyCard: {
    borderRadius: borderRadius['2xl'],
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E7DCC6',
    shadowColor: colors.forest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  emptyText: {
    color: colors.textSecondary,
    marginBottom: spacing.base,
    textAlign: 'center',
    fontSize: typography.size.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  statCard: {
    flex: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: '#E7DCC6',
    shadowColor: colors.forest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
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
    fontWeight: typography.weight.medium,
  },
  professionalSummary: {
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: '#E7DCC6',
    shadowColor: colors.forest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
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
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    marginTop: spacing.base,
    borderWidth: 1,
    borderColor: '#E7DCC6',
    shadowColor: colors.forest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
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
    fontWeight: typography.weight.bold,
    fontSize: typography.size.sm,
    marginTop: spacing.xs,
  },
});
