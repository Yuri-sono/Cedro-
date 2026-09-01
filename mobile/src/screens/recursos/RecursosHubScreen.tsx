import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing, borderRadius , useTheme, ThemeColors } from '../../theme';
import { RecursosStackParamList } from '../../types/navigation.types';

type NavigationProp = NativeStackNavigationProp<RecursosStackParamList, 'RecursosHub'>;

const RECURSOS = [
  {
    rota: 'SaudeMental' as const,
    icone: 'happy' as const,
    titulo: 'Guia de Sa�de Mental',
    descricao: 'Entenda ansiedade, depress�o, TDAH, burnout e s�ndrome do p�nico.',
  },
  {
    rota: 'Autoavaliacoes' as const,
    icone: 'clipboard' as const,
    titulo: 'Autoavalia��es',
    descricao: 'Testes r�pidos de ansiedade, depress�o e estresse.',
  },
  {
    rota: 'Passatempos' as const,
    icone: 'game-controller' as const,
    titulo: 'Passatempos',
    descricao: 'Atividades interativas para relaxar e aliviar a ansiedade.',
  },
  {
    rota: 'ChatEmergencia' as const,
    icone: 'chatbubbles' as const,
    titulo: 'Preciso de Ajuda',
    descricao: 'Apoio imediato com t�cnicas guiadas e n�meros de emerg�ncia.',
  },
];

export const RecursosHubScreen = () => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<NavigationProp>();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Recursos para voc�</Text>
        <Text style={styles.subtitulo}>
          Conte�dos, atividades e apoio emocional para cuidar da sua mente � tudo aqui � gratuito.
        </Text>
      </View>

      {RECURSOS.map((item) => (
        <TouchableOpacity
          key={item.rota}
          style={styles.card}
          onPress={() => navigation.navigate(item.rota)}
          activeOpacity={0.7}
        >
          <View style={styles.cardIcone}>
            <Ionicons name={item.icone} size={22} color={colors.primary} />
          </View>
          <View style={styles.cardTexto}>
            <Text style={styles.cardTitulo}>{item.titulo}</Text>
            <Text style={styles.cardDescricao}>{item.descricao}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
        </TouchableOpacity>
      ))}

      <View style={styles.aviso}>
        <Ionicons name="warning" size={16} color={colors.accent} />
        <Text style={styles.avisoTexto}>
          Em crise, ligue 188 (CVV) � gratuito, sigiloso, 24h. Ou use o bot�o SOS no canto da tela.
        </Text>
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
  header: {
    marginBottom: spacing.xl,
  },
  titulo: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  subtitulo: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: typography.size.sm * 1.5,
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
  cardIcone: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTexto: {
    flex: 1,
  },
  cardTitulo: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
  cardDescricao: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: typography.size.xs * 1.4,
  },
  aviso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.accentTint,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    marginTop: spacing.lg,
  },
  avisoTexto: {
    flex: 1,
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    lineHeight: typography.size.xs * 1.4,
  },
});
