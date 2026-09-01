import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList, MainTabParamList } from '../../types/navigation.types';
import { useAuthStore } from '../../store/authStore';
import { usePsicologos } from '../../hooks/usePsicologos';
import { useSessoes } from '../../hooks/useSessoes';
import { typography, spacing, borderRadius, useTheme, ThemeColors } from '../../theme';
import { SessionCard } from '../../components/SessionCard';
import { Avatar } from '../../components/Avatar';
import { PsicologoListItem, TipoUsuario } from '../../types/api.types';
import { usePsychologistDashboard } from '../../hooks/usePsychologistDashboard';
import { formatAgendaSummary } from '../../utils/psychologistAgenda';
import { capitalizeName } from '../../utils/format';

type HomeNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

const TELEGRAM_URL = 'https://t.me/cedroapoio';

// Dourado do redesign (--accent) para a estrela de destaque
const STAR_GOLD = '#C6952F';

interface PsicologoChipProps {
  psicologo: PsicologoListItem;
  onPress: () => void;
}

// Chip compacto para o carrossel horizontal de "Psicólogos em destaque"
// (equivalente ao .psy-chip do cedro-redesign.html)
const PsicologoChip = ({ psicologo, onPress }: PsicologoChipProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
  <TouchableOpacity style={styles.psyChip} onPress={onPress} activeOpacity={0.8}>
    <Avatar url={psicologo.fotoUrl} size={48} />
    <Text style={styles.psyChipName} numberOfLines={1}>
      {psicologo.nome}
    </Text>
    <Text style={styles.psyChipEspecialidade} numberOfLines={1}>
      {psicologo.especialidade || 'Psicologia'}
    </Text>
    <View style={styles.psyChipRatingRow}>
      <Ionicons name="star" size={11} color={STAR_GOLD} />
      <Text style={styles.psyChipRatingText}>
        {psicologo.avaliacao?.toFixed(1) ?? 'Novo'}
      </Text>
    </View>
  </TouchableOpacity>
  );
};

export const HomeScreen = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const user = useAuthStore((state) => state.user);
  const { colors, isDark } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const isPsicologo = user?.tipoUsuario === TipoUsuario.psicologo;

  const { psicologos, isLoading: loadingPsicos } = usePsicologos();
  const { sessoes, isLoading: loadingSessoes } = useSessoes();
  const { estatisticas, proximasConsultas, isLoading: loadingDashboard } = usePsychologistDashboard();

  const destaquePsicologos = psicologos.slice(0, 6);
  const proximaSessao = sessoes.find((s) => s.statusSessao.toLowerCase() === 'agendada');
  // Badge do sino: indica avisos pendentes (próxima sessão / pacientes confirmados)
  const temNotificacao = isPsicologo ? proximasConsultas.length > 0 : !!proximaSessao;
  const openProfileTab = (screen: 'PsychologistSettings' | 'MySessions') => {
    const parentNavigation = navigation.getParent() as NavigationProp<MainTabParamList> | undefined;
    parentNavigation?.navigate('ProfileStack', { screen });
  };

  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundSecondary]}
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
              <Text style={styles.brandText}>Cedro</Text>
              <Text style={styles.brandSubText}>Apoio psicológico</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.bellButton} activeOpacity={0.8}>
            <Ionicons name="notifications" size={17} color={colors.primary} />
            {temNotificacao && <View style={styles.bellDot} />}
          </TouchableOpacity>
        </View>

        <LinearGradient
          colors={[colors.surface, colors.surface]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroContent}>
            <View style={styles.heroEyebrowRow}>
              <Ionicons name="leaf" size={14} color={colors.primary} />
              <Text style={styles.heroEyebrow}>Bem-estar hoje</Text>
            </View>
            <Text style={styles.greeting} numberOfLines={2}>
              Olá, {capitalizeName(user?.nome) || 'Bem-vindo'}
            </Text>
            <Text style={styles.subtitle}>Respire com calma. Seu cuidado continua aqui.</Text>
          </View>
          <View style={styles.heroDecor} />
        </LinearGradient>

        {isPsicologo ? (
          <>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <Ionicons name="stats-chart" size={20} color={colors.primary} />
                  <Text style={styles.sectionTitle}>Resumo do atendimento</Text>
                </View>
                <TouchableOpacity onPress={() => openProfileTab('PsychologistSettings')} activeOpacity={0.7}>
                  <Text style={styles.seeAllText}>Editar</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.statsGrid}>
                <LinearGradient colors={[colors.surface, colors.surface]} style={styles.statCard}>
                  <Text style={styles.statValue}>{loadingDashboard ? '...' : estatisticas?.consultasHoje ?? 0}</Text>
                  <Text style={styles.statLabel}>Hoje</Text>
                </LinearGradient>
                <LinearGradient colors={[colors.surface, colors.surface]} style={styles.statCard}>
                  <Text style={styles.statValue}>{loadingDashboard ? '...' : estatisticas?.consultasSemana ?? 0}</Text>
                  <Text style={styles.statLabel}>Semana</Text>
                </LinearGradient>
                <LinearGradient colors={[colors.surface, colors.surface]} style={styles.statCard}>
                  <Text style={styles.statValue}>{loadingDashboard ? '...' : estatisticas?.pacientesAtivos ?? 0}</Text>
                  <Text style={styles.statLabel}>Pacientes</Text>
                </LinearGradient>
              </View>

              <LinearGradient colors={[colors.surface, colors.surface]} style={styles.professionalSummary}>
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
                <View style={styles.sectionTitleRow}>
                  <Ionicons name="calendar" size={20} color={colors.primary} />
                  <Text style={styles.sectionTitle}>Próximas consultas</Text>
                </View>
                <TouchableOpacity onPress={() => openProfileTab('MySessions')} activeOpacity={0.7}>
                  <Text style={styles.seeAllText}>Ver agenda</Text>
                </TouchableOpacity>
              </View>

              {loadingSessoes ? (
                <ActivityIndicator color={colors.primary} />
              ) : sessoes.length > 0 ? (
                sessoes.slice(0, 3).map((sessao) => <SessionCard key={sessao.id} sessao={sessao} />)
              ) : (
                <LinearGradient colors={[colors.surface, colors.surface]} style={styles.emptyCard}>
                  <Text style={styles.emptyText}>Nenhuma consulta agendada no momento.</Text>
                </LinearGradient>
              )}

              {proximasConsultas.length > 0 && (
                <LinearGradient colors={[colors.surface, colors.surface]} style={styles.nextPatientsCard}>
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
              <View style={styles.telegramCard}>
                <View style={styles.telegramIcon}>
                  <Ionicons name="people" size={20} color={colors.white} />
                </View>
                <View style={styles.telegramTextBlock}>
                  <Text style={styles.telegramTitle}>Grupo da instituição</Text>
                  <Text style={styles.telegramText}>
                    Conteúdos, eventos e avisos para a comunidade Cedro.
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.white} />
              </View>
            </TouchableOpacity>

            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="calendar" size={20} color={colors.primary} />
                <Text style={styles.sectionTitle}>Sua próxima sessão</Text>
              </View>
              {loadingSessoes ? (
                <ActivityIndicator color={colors.primary} />
              ) : proximaSessao ? (
                <SessionCard sessao={proximaSessao} />
              ) : (
                <LinearGradient colors={['#FFFFFF', '#FFFFFF']} style={styles.emptyCard}>
                  <View style={styles.emptyIconCircle}>
                    <Ionicons name="calendar" size={20} color={colors.primary} />
                  </View>
                  <Text style={styles.emptyText}>Você não tem consultas agendadas.</Text>
                  <TouchableOpacity
                    style={styles.emptyActionButton}
                    onPress={() => navigation.navigate('PsicologoList')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.emptyActionButtonText}>Encontrar um psicólogo</Text>
                  </TouchableOpacity>
                </LinearGradient>
              )}
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <Ionicons name="star" size={20} color={STAR_GOLD} />
                  <Text style={styles.sectionTitle}>Psicólogos em destaque</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('PsicologoList')} activeOpacity={0.7}>
                  <Text style={styles.seeAllText}>Ver todos</Text>
                </TouchableOpacity>
              </View>

              {loadingPsicos ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: spacing.sm }}
                >
                  {destaquePsicologos.map((psi) => (
                    <PsicologoChip
                      key={psi.id}
                      psicologo={psi}
                      onPress={() => navigation.navigate('PsicologoDetail', { psicologoId: psi.id })}
                    />
                  ))}
                </ScrollView>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLogo: {
    width: 32,
    height: 32,
  },
  brandText: {
    fontSize: typography.size.base,
    color: colors.primary,
    fontWeight: typography.weight.bold,
    letterSpacing: 0.2,
  },
  brandSubText: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: typography.weight.medium,
  },
  bellButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.accent,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  heroCard: {
    borderRadius: borderRadius['2xl'],
    padding: spacing.xl,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.forest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 2,
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
  heroEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  heroEyebrow: {
    color: colors.primary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
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
    backgroundColor: colors.primary,
    shadowColor: colors.forest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  telegramIcon: {
    width: 42,
    height: 42,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
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
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
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
    borderColor: colors.border,
    shadowColor: colors.forest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  emptyIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm + 2,
  },
  emptyActionButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: 11,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xs,
  },
  emptyActionButtonText: {
    color: colors.white,
    fontWeight: typography.weight.semibold,
    fontSize: typography.size.md - 0.5,
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
    borderColor: colors.border,
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
    borderColor: colors.border,
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
    borderColor: colors.border,
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
  psyChip: {
    width: 118,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  psyChipName: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  psyChipEspecialidade: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  psyChipRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 3,
  },
  psyChipRatingText: {
    color: STAR_GOLD,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
  },
});
