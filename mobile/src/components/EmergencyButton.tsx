import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme, spacing, typography, borderRadius } from '../theme';
import { ThemeColors } from '../theme/colors';

/**
 * Bot�o SOS flutuante global � espelho do EmergencyButton.jsx do web.
 * Abre popover com n�meros oficiais de socorro no Brasil, com liga��o
 * direta via Linking.openURL('tel:...').
 */
const NUMEROS_SOCORRO = [
  { nome: 'SAMU', numero: '192', desc: 'Emerg�ncia m�dica / ambul�ncia', icone: 'medical' as const },
  { nome: 'Pol�cia Militar', numero: '190', desc: 'Emerg�ncia policial', icone: 'shield' as const },
  { nome: 'Corpo de Bombeiros', numero: '193', desc: 'Inc�ndios e resgates', icone: 'flame' as const },
];

export const EmergencyButton = () => {
  const [aberto, setAberto] = useState(false);
  const { colors } = useTheme();

  const ligar = (numero: string) => {
    setAberto(false);
    void Linking.openURL(`tel:${numero}`);
  };

  const styles = createStyles(colors);

  return (
    <>
      {aberto && (
        <>
          <View style={styles.overlay} />
          <View style={styles.popover}>
            <View style={styles.popoverHeader}>
              <Text style={styles.popoverTitulo}>Precisa de ajuda agora?</Text>
              <TouchableOpacity
                onPress={() => setAberto(false)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={22} color={colors.white} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.itemDestaque} onPress={() => ligar('188')}>
              <View style={[styles.icone, styles.iconeDestaque]}>
                <Ionicons name="pulse" size={20} color={colors.white} />
              </View>
              <View style={styles.itemTexto}>
                <Text style={styles.itemTitulo}>CVV � Ligue 188</Text>
                <Text style={styles.itemDesc}>
                  Apoio emocional gratuito, sigiloso e 24 horas por dia
                </Text>
              </View>
              <Ionicons name="call" size={18} color={colors.white} />
            </TouchableOpacity>

            <Text style={styles.divisor}>Outros servi�os de emerg�ncia</Text>

            {NUMEROS_SOCORRO.map((n) => (
              <TouchableOpacity key={n.numero} style={styles.item} onPress={() => ligar(n.numero)}>
                <View style={styles.icone}>
                  <Ionicons name={n.icone} size={20} color={colors.textPrimary} />
                </View>
                <View style={styles.itemTexto}>
                  <Text style={[styles.itemTitulo, { color: colors.textPrimary }]}>
                    {n.nome} � {n.numero}
                  </Text>
                  <Text style={styles.itemDesc}>{n.desc}</Text>
                </View>
                <Ionicons name="call" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}

            <View style={styles.nota}>
              <Ionicons name="warning" size={14} color={colors.accent} />
              <Text style={styles.notaTexto}>
                Em risco imediato, ligue 188 ou v� ao pronto-socorro mais pr�ximo.
              </Text>
            </View>
          </View>
        </>
      )}

      <TouchableOpacity
        style={styles.botao}
        onPress={() => setAberto((a) => !a)}
        activeOpacity={0.85}
        accessibilityLabel="N�meros de emerg�ncia � CVV 188"
      >
        <Ionicons name={aberto ? 'close' : 'call'} size={22} color={colors.white} />
        <Text style={styles.botaoTexto}>SOS</Text>
      </TouchableOpacity>
    </>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    zIndex: 998,
  },
  popover: {
    position: 'absolute',
    right: spacing.lg,
    bottom: 110,
    width: 310,
    maxWidth: '92%',
    backgroundColor: colors.forest,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    zIndex: 999,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
  },
  popoverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.base,
  },
  popoverTitulo: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.white,
  },
  itemDestaque: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  icone: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconeDestaque: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  itemTexto: {
    flex: 1,
  },
  itemTitulo: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    color: colors.white,
  },
  itemDesc: {
    fontSize: typography.size.xs,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  divisor: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  nota: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  notaTexto: {
    flex: 1,
    fontSize: typography.size.xs,
    color: 'rgba(255,255,255,0.8)',
  },
  botao: {
    position: 'absolute',
    right: spacing.lg,
    bottom: 100,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  botaoTexto: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.white,
    marginTop: 1,
  },
});
