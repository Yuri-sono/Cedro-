import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuthStore } from '../../store/authStore';
import { useAuth } from '../../hooks/useAuth';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../types/navigation.types';
import { TipoUsuario } from '../../types/api.types';
import { formatAgendaSummary } from '../../utils/psychologistAgenda';
import { capitalizeName } from '../../utils/format';

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'Profile'>;

export const ProfileScreen = () => {
  const user = useAuthStore((state) => state.user);
  const { logout } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const isPsicologo = user?.tipoUsuario === TipoUsuario.psicologo;

  const confirmLogout = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const confirmed = window.confirm('Tem certeza que deseja sair da sua conta?');
      if (confirmed) {
        logout();
      }
      return;
    }

    Alert.alert('Sair', 'Tem certeza que deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  };

  if (!user) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Avatar url={user.fotoUrl} size={100} style={styles.avatar} />
        <Text style={styles.nome} numberOfLines={2}>{capitalizeName(user.nome)}</Text>
        <Text style={styles.email} numberOfLines={2}>{user.email}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{user.tipoUsuario.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('EditProfile')}>
          <View style={styles.menuItemIcon}>
            <Ionicons name="person" size={18} color={colors.primary} />
          </View>
          <Text style={styles.menuItemText}>Editar Perfil</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
        </TouchableOpacity>

        {isPsicologo && (
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PsychologistSettings')}>
            <View style={styles.menuItemIcon}>
              <Ionicons name="settings" size={18} color={colors.primary} />
            </View>
            <Text style={styles.menuItemText}>Configurar Atendimento</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('MySessions')}>
          <View style={styles.menuItemIcon}>
            <Ionicons name="calendar" size={18} color={colors.primary} />
          </View>
          <Text style={styles.menuItemText}>Minhas Sessões</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
        </TouchableOpacity>
        
        {user.tipoUsuario === 'paciente' && (
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Subscription')}>
            <View style={styles.menuItemIcon}>
              <Ionicons name="star" size={18} color={colors.accent} />
            </View>
            <Text style={styles.menuItemText}>Assinatura Premium</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ChangePassword')}>
          <View style={styles.menuItemIcon}>
            <Ionicons name="lock-closed" size={18} color={colors.primary} />
          </View>
          <Text style={styles.menuItemText}>Alterar Senha</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
        </TouchableOpacity>
      </View>

      {isPsicologo && (
        <View style={styles.professionalCard}>
          <Text style={styles.professionalTitle}>Atendimento</Text>
          <Text style={styles.professionalText}>
            {user.especialidade || 'Especialidade ainda não informada'}
          </Text>
          <Text style={styles.professionalText}>
            {user.precoSessao != null ? `Consulta: R$ ${user.precoSessao.toFixed(2)}` : 'Valor da consulta não definido'}
          </Text>
          <Text style={styles.professionalText}>
            {formatAgendaSummary(user.diasAtendimento, user.horariosAtendimento)}
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        <Button
          title="Sair da Conta"
          variant="outline"
          onPress={confirmLogout}
          style={styles.logoutButton}
          textStyle={styles.logoutButtonText}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    maxWidth: 520,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: spacing['3xl'],
  },
  header: {
    alignItems: 'center',
    padding: spacing['2xl'],
    backgroundColor: colors.surfaceWarm,
    borderBottomWidth: 1,
    borderBottomColor: '#E7DCC6',
  },
  avatar: {
    marginBottom: spacing.base,
  },
  nome: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  email: {
    fontSize: typography.size.base,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  badge: {
    marginTop: spacing.sm,
    backgroundColor: colors.mint,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.base,
    marginBottom: spacing.sm,
  },
  menuItemIcon: {
    width: 34,
    height: 34,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    flex: 1,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
  footer: {
    padding: spacing.xl,
    marginTop: spacing.xl,
  },
  professionalCard: {
    backgroundColor: colors.surfaceWarm,
    marginHorizontal: spacing.base,
    marginTop: spacing.base,
    padding: spacing.base,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: '#E7DCC6',
    gap: spacing.xs,
  },
  professionalTitle: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  professionalText: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },
  logoutButton: {
    borderColor: colors.border,
    minHeight: 50,
  },
  logoutButtonText: {
    color: colors.textPrimary,
    fontWeight: typography.weight.semibold,
  },
});
