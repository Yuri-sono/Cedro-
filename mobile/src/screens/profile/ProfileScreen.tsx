import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useAuth } from '../../hooks/useAuth';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../types/navigation.types';

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'Profile'>;

export const ProfileScreen = () => {
  const user = useAuthStore((state) => state.user);
  const { logout } = useAuth();
  const navigation = useNavigation<NavigationProp>();

  const confirmLogout = () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  };

  if (!user) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar url={user.fotoUrl} size={100} style={styles.avatar} />
        <Text style={styles.nome}>{user.nome}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{user.tipoUsuario.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('EditProfile')}>
          <Text style={styles.menuItemText}>Editar Perfil</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('MySessions')}>
          <Text style={styles.menuItemText}>Minhas Sessões</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Subscription')}>
          <Text style={styles.menuItemText}>Assinatura Premium</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <Text style={styles.menuItemText}>Alterar Senha</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Button
          title="Sair da Conta"
          variant="outline"
          onPress={confirmLogout}
          style={styles.logoutButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    padding: spacing['2xl'],
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    marginBottom: spacing.base,
  },
  nome: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  email: {
    fontSize: typography.size.base,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  badge: {
    marginTop: spacing.sm,
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  badgeText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.textSecondary,
  },
  menu: {
    marginTop: spacing.xl,
  },
  menuItem: {
    backgroundColor: colors.surface,
    padding: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemText: {
    fontSize: typography.size.base,
    color: colors.textPrimary,
  },
  footer: {
    padding: spacing.xl,
    marginTop: spacing.xl,
  },
  logoutButton: {
    borderColor: colors.error,
  },
});
