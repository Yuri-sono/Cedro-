import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { usePsychologistDashboard } from '../../hooks/usePsychologistDashboard';
import { colors, typography, spacing, borderRadius , useTheme, ThemeColors } from '../../theme';
import { RootStackParamList } from '../../types/navigation.types';
import { ProximaConsulta } from '../../types/api.types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Converte ISO (LocalDateTime) para exibição legível
const formatarData = (iso: string) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return 'Data indisponível';
  const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  return `${dias[d.getDay()]}, ${d.getDate()} ${meses[d.getMonth()]}`;
};

export const ConsultasPsicologoScreen = () => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<NavigationProp>();
  const { proximasConsultas, isLoading, refetch } = usePsychologistDashboard();

  const renderItem = ({ item }: { item: ProximaConsulta }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <Text style={styles.cardData}>{formatarData(item.data)}</Text>
        <Text style={styles.cardHorario}>{item.horario}</Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardPaciente}>{item.pacienteNome || 'Paciente'}</Text>
        <Text style={styles.cardTipo}>{item.tipo}</Text>
        <View
          style={[
            styles.statusBadge,
            item.status === 'agendada' ? styles.statusAgendada : styles.statusConfirmada,
          ]}
        >
          <Text style={styles.statusTexto}>
            {item.status === 'agendada' ? 'Pendente' : 'Confirmada'}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.reuniaoButton}
        onPress={() => navigation.navigate('Reuniao', { sessaoId: item.id })}
        activeOpacity={0.7}
        accessibilityLabel={`Entrar na reunião da sessão`}
      >
        <Ionicons name="videocam" size={20} color={colors.white} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={proximasConsultas}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshing={isLoading}
        onRefresh={refetch}
        ListHeaderComponent={
          <Text style={styles.headerText}>Próximas consultas (até 10). Toque no vídeo para entrar.</Text>
        }
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhuma consulta futura agendada.</Text>
            </View>
          )
        }
        renderItem={renderItem}
      />
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  listContent: {
    padding: spacing.base,
    paddingBottom: spacing['2xl'],
  },
  headerText: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginBottom: spacing.base,
  },
  center: {
    padding: spacing['2xl'],
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: spacing['2xl'],
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: typography.size.base,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  cardLeft: {
    alignItems: 'center',
    minWidth: 70,
  },
  cardData: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.primary,
    textAlign: 'center',
  },
  cardHorario: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    marginTop: 2,
  },
  cardInfo: {
    flex: 1,
  },
  cardPaciente: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
  cardTipo: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  statusAgendada: {
    backgroundColor: colors.accentTint,
  },
  statusConfirmada: {
    backgroundColor: colors.primaryTint,
  },
  statusTexto: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.primary,
  },
  reuniaoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
