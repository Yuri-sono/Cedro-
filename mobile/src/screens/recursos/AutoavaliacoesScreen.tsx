import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing, borderRadius , useTheme, ThemeColors } from '../../theme';
import { Button } from '../../components/Button';
import { RootStackParamList } from '../../types/navigation.types';
import { TESTES, OPCOES_ESCALA, calcularResultado, Teste } from './autoavaliacoesData';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const AutoavaliacoesScreen = () => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<NavigationProp>();
  const [testeAtual, setTesteAtual] = useState<Teste | null>(null);
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [respostas, setRespostas] = useState<number[]>([]);
  const [mostrandoResultado, setMostrandoResultado] = useState(false);

  const iniciarTeste = (teste: Teste) => {
    setTesteAtual(teste);
    setPerguntaAtual(0);
    setRespostas([]);
    setMostrandoResultado(false);
  };

  const responder = (valor: number) => {
    const novas = [...respostas];
    novas[perguntaAtual] = valor;
    setRespostas(novas);
    if (perguntaAtual + 1 < (testeAtual?.perguntas.length ?? 0)) {
      setPerguntaAtual(perguntaAtual + 1);
    } else {
      setMostrandoResultado(true);
    }
  };

  const voltarPergunta = () => {
    if (perguntaAtual > 0) setPerguntaAtual(perguntaAtual - 1);
  };

  const reiniciar = () => {
    setTesteAtual(null);
    setPerguntaAtual(0);
    setRespostas([]);
    setMostrandoResultado(false);
  };

  // ── Menu inicial ──
  if (!testeAtual) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
        <Text style={styles.titulo}>Como você está se sentindo?</Text>
        <Text style={styles.subtitulo}>
          Escolha um teste rápido. As respostas são confidenciais e ficam apenas no seu aparelho.
        </Text>

        {TESTES.map((teste) => (
          <TouchableOpacity
            key={teste.id}
            style={styles.card}
            onPress={() => iniciarTeste(teste)}
            activeOpacity={0.7}
          >
            <Text style={styles.cardEmoji}>{teste.emoji}</Text>
            <View style={styles.cardTexto}>
              <Text style={styles.cardTitulo}>{teste.titulo}</Text>
              <Text style={styles.cardDescricao}>{teste.descricao}</Text>
              <Text style={styles.cardMeta}>5 perguntas · ~1 minuto</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
          </TouchableOpacity>
        ))}

        <View style={styles.aviso}>
          <Ionicons name="information-circle" size={16} color={colors.info} />
          <Text style={styles.avisoTexto}>
            Este teste é apenas uma ferramenta de autoavaliação e não substitui uma avaliação
            profissional.
          </Text>
        </View>
      </ScrollView>
    );
  }

  // ── Resultado ──
  if (mostrandoResultado) {
    const pontuacao = respostas.reduce((soma, r) => soma + (r ?? 0), 0);
    const resultado = calcularResultado(pontuacao);
    const corResultado =
      resultado.cor === 'success'
        ? colors.success
        : resultado.cor === 'warning'
          ? colors.warning
          : colors.error;

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
        <View style={styles.resultadoCard}>
          <Ionicons name="checkmark-circle" size={64} color={colors.success} />
          <Text style={styles.resultadoTitulo}>Resultado da Avaliação</Text>
          <Text style={styles.resultadoTeste}>{testeAtual.titulo}</Text>
          <View style={[styles.resultadoNivelBox, { backgroundColor: `${corResultado}1A` }]}>
            <Text style={[styles.resultadoNivel, { color: corResultado }]}>
              Nível: {resultado.nivel}
            </Text>
            <Text style={styles.resultadoRecomendacao}>{resultado.recomendacao}</Text>
          </View>

          <Text style={styles.disclaimer}>
            <Text style={{ fontWeight: typography.weight.bold }}>Importante: </Text>
            este teste é apenas uma ferramenta de autoavaliação e não substitui uma avaliação
            profissional. Para um diagnóstico preciso, consulte um psicólogo ou psiquiatra.
          </Text>

          <Button
            title="Encontrar Psicólogo"
            onPress={() =>
              navigation.navigate('Main', {
                screen: 'HomeStack',
                params: { screen: 'PsicologoList' },
              })
            }
            style={styles.botaoAcao}
          />
          <Button
            title="Fazer outro teste"
            variant="outline"
            onPress={reiniciar}
            style={styles.botaoAcao}
          />
        </View>
      </ScrollView>
    );
  }

  // ── Questionário ──
  const pergunta = testeAtual.perguntas[perguntaAtual];
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <View style={styles.progressoInfo}>
          <Text style={styles.progressoTexto}>
            Pergunta {perguntaAtual + 1} de {testeAtual.perguntas.length}
          </Text>
          <Text style={styles.progressoTeste}>{testeAtual.titulo}</Text>
        </View>
        <View style={styles.progressoBarra}>
          <View
            style={[
              styles.progressoBarraPreenchida,
              { width: `${((perguntaAtual + 1) / testeAtual.perguntas.length) * 100}%` },
            ]}
          />
        </View>

        <Text style={styles.pergunta}>{pergunta.texto}</Text>

        <View style={styles.opcoes}>
          {OPCOES_ESCALA.map((opcao, index) => (
            <TouchableOpacity
              key={opcao}
              style={styles.opcao}
              onPress={() => responder(index)}
              activeOpacity={0.7}
            >
              <Text style={styles.opcaoTexto}>{opcao}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {perguntaAtual > 0 && (
          <Button
            title="Voltar"
            variant="text"
            onPress={voltarPergunta}
            style={styles.botaoVoltar}
          />
        )}
      </ScrollView>
    </View>
  );
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
  cardEmoji: {
    fontSize: 28,
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
  },
  cardMeta: {
    fontSize: typography.size.xs,
    color: colors.primary,
    fontWeight: typography.weight.medium,
    marginTop: spacing.xs,
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
  progressoInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressoTexto: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.primary,
  },
  progressoTeste: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
  },
  progressoBarra: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    overflow: 'hidden',
  },
  progressoBarraPreenchida: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  pergunta: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
    lineHeight: typography.size.xl * 1.4,
  },
  opcoes: {
    gap: spacing.sm,
  },
  opcao: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.base,
    minHeight: 52,
    justifyContent: 'center',
  },
  opcaoTexto: {
    fontSize: typography.size.sm,
    color: colors.textPrimary,
    fontWeight: typography.weight.medium,
  },
  botaoVoltar: {
    marginTop: spacing.lg,
  },
  resultadoCard: {
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  resultadoTitulo: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    marginTop: spacing.base,
  },
  resultadoTeste: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  resultadoNivelBox: {
    width: '100%',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  resultadoNivel: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
  },
  resultadoRecomendacao: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: typography.size.sm * 1.5,
  },
  disclaimer: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.size.xs * 1.5,
    marginTop: spacing.xl,
  },
  botaoAcao: {
    alignSelf: 'stretch',
    marginTop: spacing.sm,
  },
});
