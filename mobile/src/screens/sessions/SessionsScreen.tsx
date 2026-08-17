import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSessoes } from '../../hooks/useSessoes';
import { useAuthStore } from '../../store/authStore';
import { SessionCard } from '../../components/SessionCard';
import { colors, spacing, typography } from '../../theme';
import { ProfileStackParamList } from '../../types/navigation.types';
import { TipoUsuario } from '../../types/api.types';

type Sessao = {
  id: number;
  statusSessao: string;
};

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'MySessions'>;

export const SessionsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const user = useAuthStore((state) => state.user);
  const isPsicologo = user?.tipoUsuario === TipoUsuario.psicologo;
  const { sessoes, isLoading, refetch, atualizarStatus } = useSessoes();

  const confirmarAtualizarStatus = (sessao: Sessao, status: 'realizada' | 'cancelada') => {
    const acao = status === 'realizada'
      ? 'marcar esta sessao como realizada'
      : 'cancelar esta sessao';

    const executar = () => atualizarStatus({ id: sessao.id, status });

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      if (window.confirm(`Deseja ${acao}?`)) executar();
      return;
    }

    Alert.alert('Confirmar', `Deseja ${acao}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Confirmar',
        style: status === 'cancelada' ? 'destructive' : 'default',
        onPress: executar,
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sessoes}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <SessionCard
            sessao={item}
            isPaciente={!isPsicologo}
            onMarcarRealizada={
              isPsicologo && item.statusSessao === 'agendada'
                ? () => confirmarAtualizarStatus(item, 'realizada')
                : undefined
            }
            onCancelar={
              isPsicologo && (item.statusSessao === 'agendada' || item.statusSessao === 'confirmada')
                ? () => confirmarAtualizarStatus(item, 'cancelada')
                : undefined
            }
          />
        )}
        onRefresh={refetch}
        refreshing={isLoading}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Você ainda não possui sessões.</Text>
          </View>
        }
      />

      {isPsicologo && (
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('NewSessionPsicologo')}
        >
          <Text style={styles.fabText}>+ Nova Consulta</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: spacing.base,
    paddingBottom: spacing['3xl'],
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['2xl'],
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: typography.size.base,
  },
  fab: {
    position: 'absolute',
    right: spacing.base,
    bottom: spacing['2xl'],
    backgroundColor: colors.primary,
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.lg,
    borderRadius: 999,
    shadowColor: colors.forest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: {
    color: colors.white,
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
  },
});
