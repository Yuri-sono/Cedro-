import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme, ThemeColors, spacing, typography, borderRadius } from '../../theme';

const OPCOES = [
  {
    id: 'light' as const,
    titulo: 'Claro',
    descricao: 'Tema claro padrão do aplicativo',
    icone: 'sunny' as const,
  },
  {
    id: 'dark' as const,
    titulo: 'Escuro',
    descricao: 'Ideal para uso em ambientes com pouca luz',
    icone: 'moon' as const,
  },
  {
    id: 'system' as const,
    titulo: 'Sistema',
    descricao: 'Acompanha automaticamente o tema do seu dispositivo',
    icone: 'phone-portrait' as const,
  },
] as const;

// Modos de cor (daltonismo) — espelho do PersonalizacaoMenu do web
const MODOS_COR = [
  {
    id: 'padrao' as const,
    titulo: 'Padrão',
    descricao: 'Cores originais do aplicativo',
    swatches: ['#1F4D3A', '#2F6B4F', '#A6432B'],
  },
  {
    id: 'protanopia' as const,
    titulo: 'Protanopia',
    descricao: 'Dificuldade com vermelho — azul/laranja',
    swatches: ['#0066cc', '#3399ff', '#ff8800'],
  },
  {
    id: 'deuteranopia' as const,
    titulo: 'Deuteranopia',
    descricao: 'Dificuldade com verde — azul/amarelo',
    swatches: ['#0073e6', '#4da6ff', '#ffaa00'],
  },
  {
    id: 'tritanopia' as const,
    titulo: 'Tritanopia',
    descricao: 'Dificuldade com azul — magenta/ciano',
    swatches: ['#cc0066', '#ff3399', '#00cccc'],
  },
] as const;

export const AppearanceScreen = () => {
  const { colors, isDark, themePreference, setThemePreference, colorMode, setColorMode, dislexia, setDislexia } =
    useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.titulo}>Aparência</Text>
      <Text style={styles.subtitulo}>
        Escolha o tema e as cores do aplicativo. As preferências ficam salvas no seu aparelho.
      </Text>

      <Text style={styles.secaoLabel}>Tema</Text>

      {OPCOES.map((opcao) => {
        const ativo = themePreference === opcao.id;
        return (
          <TouchableOpacity
            key={opcao.id}
            style={[styles.opcao, ativo && styles.opcaoAtiva]}
            onPress={() => setThemePreference(opcao.id)}
            activeOpacity={0.7}
            accessibilityRole="radio"
            accessibilityState={{ selected: ativo }}
            accessibilityLabel={`Tema ${opcao.titulo}`}
          >
            <View style={styles.opcaoIcone}>
              <Ionicons
                name={opcao.icone}
                size={20}
                color={ativo ? colors.white : colors.primary}
              />
            </View>
            <View style={styles.opcaoTexto}>
              <Text
                style={[
                  styles.opcaoTitulo,
                  ativo && { color: colors.white },
                ]}
              >
                {opcao.titulo}
              </Text>
              <Text
                style={[
                  styles.opcaoDescricao,
                  ativo && { color: 'rgba(255,255,255,0.75)' },
                ]}
              >
                {opcao.descricao}
              </Text>
            </View>
            {ativo && <Ionicons name="checkmark-circle" size={22} color={colors.white} />}
          </TouchableOpacity>
        );
      })}

      <Text style={styles.secaoLabel}>Fonte para dislexia</Text>

      <View style={styles.opcao}>
        <View style={styles.opcaoIcone}>
          <Ionicons name="text" size={20} color={colors.primary} />
        </View>
        <View style={styles.opcaoTexto}>
          <Text style={styles.opcaoTitulo}>Fonte Lexend</Text>
          <Text style={styles.opcaoDescricao}>
            Fonte de alta legibilidade, recomendada para dislexia e leitura prolongada
          </Text>
        </View>
        <Switch
          value={dislexia}
          onValueChange={setDislexia}
          trackColor={{ false: colors.border, true: colors.primaryAccent }}
          thumbColor={dislexia ? colors.primary : colors.textFaint}
          accessibilityLabel="Ativar fonte para dislexia"
        />
      </View>

      <Text style={styles.secaoLabel}>Modo de cor (daltonismo)</Text>

      {MODOS_COR.map((modo) => {
        const ativo = colorMode === modo.id;
        return (
          <TouchableOpacity
            key={modo.id}
            style={[styles.opcao, ativo && styles.opcaoAtiva]}
            onPress={() => setColorMode(modo.id)}
            activeOpacity={0.7}
            accessibilityRole="radio"
            accessibilityState={{ selected: ativo }}
            accessibilityLabel={`Modo de cor ${modo.titulo}`}
          >
            <View style={styles.swatchRow}>
              {modo.swatches.map((cor) => (
                <View key={cor} style={[styles.swatch, { backgroundColor: cor }]} />
              ))}
            </View>
            <View style={styles.opcaoTexto}>
              <Text style={[styles.opcaoTitulo, ativo && { color: colors.white }]}>
                {modo.titulo}
              </Text>
              <Text
                style={[styles.opcaoDescricao, ativo && { color: 'rgba(255,255,255,0.75)' }]}
              >
                {modo.descricao}
              </Text>
            </View>
            {ativo && <Ionicons name="checkmark-circle" size={22} color={colors.white} />}
          </TouchableOpacity>
        );
      })}

      <View style={styles.info}>
        <Ionicons name="information-circle" size={16} color={colors.info} />
        <Text style={styles.infoTexto}>
          Tema atual: {isDark ? 'Escuro' : 'Claro'}
          {themePreference === 'system' ? ' (segundo o sistema)' : ''}.
          {dislexia ? ' Fonte Lexend ativa.' : ''} O filtro de daltonismo ajusta as cores dos
          botões e elementos interativos para melhor diferenciação.
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
    titulo: {
      fontSize: typography.size['2xl'],
      fontWeight: typography.weight.bold,
      color: colors.textPrimary,
    },
    subtitulo: {
      fontSize: typography.size.sm,
      color: colors.textSecondary,
      marginTop: spacing.xs,
      marginBottom: spacing.xl,
      lineHeight: typography.size.sm * 1.5,
    },
    secaoLabel: {
      fontSize: typography.size.xs,
      fontWeight: typography.weight.bold,
      color: colors.textFaint,
      textTransform: 'uppercase',
      marginBottom: spacing.sm,
      marginLeft: spacing.xs,
    },
    opcao: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: borderRadius.lg,
      padding: spacing.base,
      marginBottom: spacing.sm,
      minHeight: 68,
    },
    opcaoAtiva: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    opcaoIcone: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.md,
      backgroundColor: colors.primaryTint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    swatchRow: {
      width: 40,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
      alignItems: 'center',
      justifyContent: 'center',
    },
    swatch: {
      width: 13,
      height: 13,
      borderRadius: 7,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.15)',
    },
    opcaoTexto: {
      flex: 1,
    },
    opcaoTitulo: {
      fontSize: typography.size.md,
      fontWeight: typography.weight.semibold,
      color: colors.textPrimary,
    },
    opcaoDescricao: {
      fontSize: typography.size.xs,
      color: colors.textSecondary,
      marginTop: 2,
      lineHeight: typography.size.xs * 1.4,
    },
    info: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: colors.backgroundTertiary,
      borderRadius: borderRadius.md,
      padding: spacing.base,
      marginTop: spacing.lg,
    },
    infoTexto: {
      flex: 1,
      fontSize: typography.size.xs,
      color: colors.textSecondary,
      lineHeight: typography.size.xs * 1.4,
    },
  });
