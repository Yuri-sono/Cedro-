import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { borderRadius, colors, spacing, typography , useTheme, ThemeColors } from '../../theme';
import { HomeStackParamList, RootStackParamList } from '../../types/navigation.types';
import { sessaoService } from '../../services/sessaoService';

type PaymentRouteProp = RouteProp<HomeStackParamList, 'Payment'>;
// RootStackParamList: permite navegar entre stacks (Main → ProfileStack → MySessions).
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Metodo = 'cartao' | 'pix';
type Etapa = 'escolha' | 'processando' | 'sucesso';

const formatNumeroCartao = (v: string) =>
  v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');

const formatValidade = (v: string) => {
  const cleaned = v.replace(/\D/g, '').slice(0, 4);
  return cleaned.length > 2 ? `${cleaned.slice(0, 2)}/${cleaned.slice(2)}` : cleaned;
};

const formatCvv = (v: string) => v.replace(/\D/g, '').slice(0, 4);

export const PaymentScreen = () => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<PaymentRouteProp>();
  const { sessaoId, psicologoNome, valor } = route.params;

  const [metodo, setMetodo] = useState<Metodo>('cartao');
  const [etapa, setEtapa] = useState<Etapa>('escolha');
  const [pixCode, setPixCode] = useState('');
  const [cartao, setCartao] = useState({ numero: '', nome: '', validade: '', cvv: '' });
  const [loading, setLoading] = useState(false);

  const isCartaoValido = () =>
    cartao.numero.replace(/\s/g, '').length >= 13 &&
    cartao.nome.trim().length > 2 &&
    cartao.validade.length === 5 &&
    cartao.cvv.length >= 3;

  const gerarPixCode = () =>
    `00020126580014BR.GOV.BCB.PIX0136${Math.random()
      .toString(36)
      .substring(2, 15)}5204000053039865802BR5925CEDRO APOIO PSICOLOGICO6009SAO PAULO62070503***6304`;

  const processarPagamento = async () => {
    setLoading(true);
    setEtapa('processando');
    try {
      const confirmar = async () => {
        await sessaoService.confirmarPagamento(sessaoId);
        setEtapa('sucesso');
        setLoading(false);
      };

      if (metodo === 'pix') {
        // Simula o tempo de compensação do PIX, igual ao fluxo do web
        setTimeout(() => {
          void confirmar();
        }, 3000);
      } else {
        await confirmar();
      }
    } catch {
      setLoading(false);
      setEtapa('escolha');
    }
  };

  const trocarMetodo = (novoMetodo: Metodo) => {
    setMetodo(novoMetodo);
    setPixCode('');
    setEtapa('escolha');
    setLoading(false);
  };

  const valorFormatado = valor.toFixed(2).replace('.', ',');
  const mostrarFormulario = etapa === 'escolha';

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Cabeçalho com valor */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Pagamento da Sessão</Text>
            <Text style={styles.headerPsicologo}>com {psicologoNome}</Text>
            <Text style={styles.headerValor}>R$ {valorFormatado}</Text>
          </View>

          {etapa === 'sucesso' ? (
            <View style={styles.sucessoContainer}>
              <Ionicons
                name="checkmark-circle"
                size={96}
                color={colors.primary}
                style={styles.sucessoIcone}
              />
              <Text style={styles.sucessoTitulo}>Pagamento confirmado!</Text>
              <Text style={styles.sucessoMensagem}>
                Sua sessão com {psicologoNome} está agendada e paga. Você já pode conversar com o
                psicólogo e acessar a reunião.
              </Text>
              <Button
                title="Ver minhas sessões"
                onPress={() =>
                  navigation.navigate('Main', {
                    screen: 'ProfileStack',
                    params: { screen: 'MySessions' },
                  })
                }
                style={styles.sucessoBotao}
              />
            </View>
          ) : etapa === 'processando' ? (
            <View style={styles.processandoContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.processandoTexto}>Processando pagamento...</Text>
              <Text style={styles.processandoSubtexto}>
                Aguarde, isso leva apenas alguns segundos
              </Text>
            </View>
          ) : (
            <>
              {/* Seletor de método */}
              <View style={styles.metodoRow}>
                <TouchableOpacity
                  style={[styles.metodoBotao, metodo === 'cartao' && styles.metodoBotaoSelecionado]}
                  onPress={() => trocarMetodo('cartao')}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="card-outline"
                    size={22}
                    color={metodo === 'cartao' ? colors.white : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.metodoTexto,
                      metodo === 'cartao' && styles.metodoTextoSelecionado,
                    ]}
                  >
                    Cartão de Crédito
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.metodoBotao, metodo === 'pix' && styles.metodoBotaoSelecionado]}
                  onPress={() => trocarMetodo('pix')}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="qr-code-outline"
                    size={22}
                    color={metodo === 'pix' ? colors.white : colors.textSecondary}
                  />
                  <Text
                    style={[styles.metodoTexto, metodo === 'pix' && styles.metodoTextoSelecionado]}
                  >
                    PIX
                  </Text>
                </TouchableOpacity>
              </View>

              {metodo === 'cartao' && mostrarFormulario && (
                <View style={styles.formulario}>
                  <Input
                    label="Número do Cartão"
                    placeholder="XXXX XXXX XXXX XXXX"
                    keyboardType="numeric"
                    maxLength={19}
                    value={cartao.numero}
                    onChangeText={(v) => setCartao((p) => ({ ...p, numero: formatNumeroCartao(v) }))}
                  />
                  <Input
                    label="Nome no Cartão"
                    placeholder="Como está impresso no cartão"
                    autoCapitalize="words"
                    value={cartao.nome}
                    onChangeText={(v) => setCartao((p) => ({ ...p, nome: v }))}
                  />
                  <View style={styles.linhaCartao}>
                    <View style={styles.colunaValidade}>
                      <Input
                        label="Validade MM/AA"
                        placeholder="MM/AA"
                        keyboardType="numeric"
                        maxLength={5}
                        value={cartao.validade}
                        onChangeText={(v) =>
                          setCartao((p) => ({ ...p, validade: formatValidade(v) }))
                        }
                      />
                    </View>
                    <View style={styles.colunaCvv}>
                      <Input
                        label="CVV"
                        placeholder="123"
                        keyboardType="numeric"
                        maxLength={4}
                        secureTextEntry
                        value={cartao.cvv}
                        onChangeText={(v) => setCartao((p) => ({ ...p, cvv: formatCvv(v) }))}
                      />
                    </View>
                  </View>
                  <Button
                    title={`Confirmar R$ ${valorFormatado}`}
                    disabled={!isCartaoValido() || loading}
                    isLoading={loading}
                    onPress={processarPagamento}
                    style={styles.botaoConfirmar}
                  />
                </View>
              )}

              {metodo === 'pix' && mostrarFormulario && !pixCode && (
                <View style={styles.pixContainer}>
                  <Ionicons name="qr-code" size={120} color={colors.primary} />
                  <Text style={styles.pixTitulo}>Pagar com PIX</Text>
                  <Text style={styles.pixMensagem}>
                    Gere o código PIX para realizar o pagamento pelo seu aplicativo do banco.
                  </Text>
                  <Button
                    title="Gerar código PIX"
                    onPress={() => setPixCode(gerarPixCode())}
                    style={styles.botaoConfirmar}
                  />
                </View>
              )}

              {metodo === 'pix' && mostrarFormulario && pixCode && (
                <View style={styles.pixContainer}>
                  <View style={styles.pixCodeBox}>
                    <Text selectable style={styles.pixCodeTexto}>
                      {pixCode}
                    </Text>
                  </View>
                  <Button
                    title="Copiar código"
                    variant="secondary"
                    onPress={() => void Clipboard.setStringAsync(pixCode)}
                    style={styles.botaoConfirmar}
                  />
                  <Button
                    title={`Confirmar pagamento R$ ${valorFormatado}`}
                    onPress={processarPagamento}
                  />
                </View>
              )}
            </>
          )}
        </ScrollView>

        {/* Rodapé fixo */}
        {etapa !== 'sucesso' && (
          <View style={styles.rodape}>
            <Ionicons name="shield-checkmark-outline" size={16} color={colors.success} />
            <Text style={styles.rodapeTexto}>Pagamento 100% seguro</Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xl * 2,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  headerTitle: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  headerPsicologo: {
    fontSize: typography.size.base,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  headerValor: {
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.bold,
    color: colors.primary,
    marginTop: spacing.base,
  },
  metodoRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  metodoBotao: {
    flex: 1,
    minHeight: 64,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  metodoBotaoSelecionado: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  metodoTexto: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  metodoTextoSelecionado: {
    color: colors.white,
  },
  formulario: {},
  linhaCartao: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  colunaValidade: {
    flex: 1,
  },
  colunaCvv: {
    flex: 1,
  },
  botaoConfirmar: {
    marginTop: spacing.sm,
  },
  pixContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  pixTitulo: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    marginTop: spacing.base,
  },
  pixMensagem: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    lineHeight: typography.size.sm * 1.5,
  },
  pixCodeBox: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    marginBottom: spacing.base,
  },
  pixCodeTexto: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: typography.size.xs,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  processandoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 3,
  },
  processandoTexto: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    marginTop: spacing.lg,
  },
  processandoSubtexto: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  sucessoContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  sucessoIcone: {
    marginBottom: spacing.lg,
  },
  sucessoTitulo: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.base,
  },
  sucessoMensagem: {
    fontSize: typography.size.base,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.size.base * 1.5,
    marginBottom: spacing.xl,
  },
  sucessoBotao: {
    alignSelf: 'stretch',
  },
  rodape: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.base,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.cream,
  },
  rodapeTexto: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    fontWeight: typography.weight.medium,
  },
});
