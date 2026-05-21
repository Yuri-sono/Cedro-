import React, { useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../types/navigation.types';
import { usePsicologos } from '../../hooks/usePsicologos';
import { PsicologoCard } from '../../components/PsicologoCard';
import { Input } from '../../components/Input';
import { colors, spacing } from '../../theme';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'PsicologoList'>;

export const PsicologoListScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { psicologos, isLoading, refetch } = usePsicologos();
  const [busca, setBusca] = useState('');

  const psicologosFiltrados = psicologos.filter(psi => 
    psi.nome.toLowerCase().includes(busca.toLowerCase()) || 
    (psi.especialidade && psi.especialidade.toLowerCase().includes(busca.toLowerCase()))
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Input
          placeholder="Buscar por nome ou especialidade"
          value={busca}
          onChangeText={setBusca}
          style={styles.searchInput}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={psicologosFiltrados}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <PsicologoCard
              psicologo={item}
              onPress={() => navigation.navigate('PsicologoDetail', { psicologoId: item.id })}
            />
          )}
          onRefresh={refetch}
          refreshing={isLoading}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    padding: spacing.base,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInput: {
    marginBottom: 0, // anula o margin bottom default do Input
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: spacing.base,
  },
});
