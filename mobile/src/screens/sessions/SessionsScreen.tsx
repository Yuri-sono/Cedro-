import React from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Text } from 'react-native';
import { useSessoes } from '../../hooks/useSessoes';
import { SessionCard } from '../../components/SessionCard';
import { colors, spacing, typography } from '../../theme';

export const SessionsScreen = () => {
  const { sessoes, isLoading, refetch } = useSessoes();

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
        renderItem={({ item }) => <SessionCard sessao={item} />}
        onRefresh={refetch}
        refreshing={isLoading}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Você ainda não possui sessões.</Text>
          </View>
        }
      />
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
});
