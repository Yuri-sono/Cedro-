import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, typography, spacing, borderRadius , useTheme, ThemeColors } from '../../theme';
import { TRANSTORNOS, Transtorno } from './saudeMentalData';

export const SaudeMentalScreen = () => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const [ativo, setAtivo] = useState<string | null>(null);

  const toggle = (id: string) => setAtivo((prev) => (prev === id ? null : id));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <Text style={styles.titulo}>Guia de Saúde Mental</Text>
      <Text style={styles.subtitulo}>
        Toque em cada card para explorar informações detalhadas sobre sintomas, causas e os
        melhores tratamentos disponíveis.
      </Text>

      {TRANSTORNOS.map((t) => (
        <View key={t.id} style={styles.card}>
          <TouchableOpacity
            style={styles.cardHeader}
            onPress={() => toggle(t.id)}
            activeOpacity={0.7}
            accessibilityLabel={`${t.titulo}. Toque para ${ativo === t.id ? 'fechar' : 'expandir'} detalhes`}
          >
            <Text style={styles.cardEmoji}>{t.emoji}</Text>
            <View style={styles.cardHeaderTexto}>
              <Text style={styles.cardTitulo}>{t.titulo}</Text>
              <View style={styles.cardBadges}>
                <View style={styles.badge}>
                  <Text style={styles.badgeTexto}>{t.badge}</Text>
                </View>
                <Text style={styles.prevalencia}>{t.prevalencia}% · {t.afetadosBR}</Text>
              </View>
            </View>
            <Ionicons
              name={ativo === t.id ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={colors.textFaint}
            />
          </TouchableOpacity>

          {ativo === t.id && <TranstornoDetalhes transtorno={t} />}
        </View>
      ))}

      {/* CTA */}
      <View style={styles.cta}>
        <Ionicons name="pulse" size={32} color={colors.white} />
        <Text style={styles.ctaTitulo}>Precisa de ajuda profissional?</Text>
        <Text style={styles.ctaTexto}>
          O primeiro passo é o mais importante. Nossa equipe de psicólogos está pronta para te
          acolher.
        </Text>
      </View>

      <View style={styles.infoBoxes}>
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={16} color={colors.info} />
          <Text style={styles.infoBoxTexto}>
            Este conteúdo é informativo e não substitui diagnóstico ou tratamento profissional.
          </Text>
        </View>
        <View style={styles.infoBox}>
          <Ionicons name="shield-checkmark" size={16} color={colors.success} />
          <Text style={styles.infoBoxTexto}>
            Fontes: OMS, APA (American Psychiatric Association) e Ministério da Saúde do Brasil.
          </Text>
        </View>
        <View style={styles.infoBox}>
          <Ionicons name="call" size={16} color={colors.warning} />
          <Text style={styles.infoBoxTexto}>
            Em caso de crise, ligue 188 (CVV), 192 (SAMU) ou vá ao pronto-socorro mais próximo.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const TranstornoDetalhes = ({ transtorno: t }: { transtorno: Transtorno }) => {
  const { colors } = useTheme();
  return (
    <View style={[detalhes, { borderTopColor: colors.border, paddingHorizontal: spacing.base, paddingBottom: spacing.base, paddingTop: spacing.base }]}>
      <Text style={[secaoTitulo, { color: colors.primary }]}>O que é?</Text>
      <Text style={[texto, { color: colors.textSecondary }]}>{t.descricao}</Text>

      <Text style={[secaoTitulo, { color: colors.primary }]}>Sintomas comuns</Text>
      {t.sintomas.map((s) => (
        <View key={s} style={item}>
          <Ionicons name="ellipse" size={6} color={colors.primary} />
          <Text style={[itemTexto, { color: colors.textSecondary }]}>{s}</Text>
        </View>
      ))}

      <Text style={[secaoTitulo, { color: colors.primary }]}>Tratamentos</Text>
      {t.tratamentos.map((tr) => (
        <View key={tr.titulo} style={[tratamento, { backgroundColor: colors.mint }]}>
          <Text style={[tratamentoTitulo, { color: colors.textPrimary }]}>{tr.titulo}</Text>
          <Text style={[tratamentoDesc, { color: colors.textSecondary }]}>{tr.desc}</Text>
        </View>
      ))}

      <View style={[aviso, { backgroundColor: colors.accentTint }]}>
        <Ionicons name="warning" size={14} color={colors.accent} />
        <Text style={[avisoTexto, { color: colors.textSecondary }]}>{t.aviso}</Text>
      </View>
    </View>
  );
};

// Estilos internos do TranstornoDetalhes
const detalhes = {};
const secaoTitulo = {
  fontSize: typography.size.sm,
  fontWeight: typography.weight.bold,
  marginTop: spacing.sm,
  marginBottom: spacing.xs,
};
const texto = {
  fontSize: typography.size.sm,
  lineHeight: typography.size.sm * 1.5,
};
const item = {
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  gap: spacing.sm,
  marginBottom: spacing.xs,
};
const itemTexto = {
  flex: 1,
  fontSize: typography.size.sm,
};
const tratamento = {
  borderRadius: borderRadius.md,
  padding: spacing.sm,
  marginBottom: spacing.xs,
};
const tratamentoTitulo = {
  fontSize: typography.size.sm,
  fontWeight: typography.weight.semibold,
};
const tratamentoDesc = {
  fontSize: typography.size.xs,
  marginTop: 2,
};
const aviso = {
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  gap: spacing.sm,
  borderRadius: borderRadius.md,
  padding: spacing.sm,
  marginTop: spacing.base,
};
const avisoTexto = {
  flex: 1,
  fontSize: typography.size.xs,
  lineHeight: typography.size.xs * 1.4,
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  conteudo: {
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
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.base,
    minHeight: 52,
  },
  cardEmoji: {
    fontSize: 28,
  },
  cardHeaderTexto: {
    flex: 1,
  },
  cardTitulo: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
  cardBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 4,
  },
  badge: {
    backgroundColor: colors.primaryTint,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  badgeTexto: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.primary,
  },
  prevalencia: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
  },
  cta: {
    alignItems: 'center',
    backgroundColor: colors.forest,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginTop: spacing.lg,
  },
  ctaTitulo: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.white,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  ctaTexto: {
    fontSize: typography.size.sm,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: typography.size.sm * 1.5,
  },
  infoBoxes: {
    gap: spacing.sm,
    marginTop: spacing.base,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.base,
  },
  infoBoxTexto: {
    flex: 1,
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    lineHeight: typography.size.xs * 1.4,
  },
});
