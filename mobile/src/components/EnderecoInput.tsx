import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Input } from './Input';
import { spacing, useTheme } from '../theme';
import { ThemeColors } from '../theme/colors';

/**
 * Campo de endereço com autocomplete gratuito:
 * - 8 dígitos numéricos → ViaCEP (preenche logradouro, bairro, cidade e UF)
 * - Texto livre (3+ caracteres) → IBGE (sugestões de município, até 5)
 * Ambas as APIs são públicas e não exigem chave.
 *
 * As sugestões são renderizadas INLINE (dentro do fluxo normal do ScrollView),
 * sem posicionamento absoluto — assim não ficam atrás de outros elementos nem
 * tampam o campo de bio/área de interesse.
 */

interface EnderecoInputProps {
  label?: string;
  value: string;
  onChangeText: (texto: string) => void;
  placeholder?: string;
}

type SugestaoCidade = { nome: string; uf: string };

const VIA_CEP_URL = 'https://viacep.com.br/ws';
const IBGE_MUNICIPIOS_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades/municipios';

// A API do IBGE busca municípios por nome exato: removemos acentos e caímos
// para lowercase para que "sao paulo" encontre "São Paulo".
const normalizar = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export const EnderecoInput = ({ label, value, onChangeText, placeholder }: EnderecoInputProps) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const [sugestoes, setSugestoes] = useState<SugestaoCidade[]>([]);
  const [sugestoesAbertas, setSugestoesAbertas] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState<string | undefined>(undefined);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setErro(undefined);

    const valor = value.trim();
    const controller = new AbortController();

    // ── CEP: 8 dígitos numéricos → ViaCEP (busca imediata, sem debounce) ──
    if (/^\d{8}$/.test(valor)) {
      setSugestoes([]);
      setSugestoesAbertas(false);
      setBuscando(true);
      (async () => {
        try {
          const res = await fetch(`${VIA_CEP_URL}/${valor}/json/`, { signal: controller.signal });
          const data = await res.json();
          if (data.erro) {
            setErro('CEP não encontrado. Verifique e tente novamente.');
          } else {
            const partes = [
              data.logradouro,
              data.bairro,
              data.localidade ? `${data.localidade} - ${data.uf}` : '',
            ].filter(Boolean);
            if (partes.length > 0) onChangeText(partes.join(', '));
          }
        } catch (e) {
          if ((e as Error).name !== 'AbortError') {
            setErro('Não foi possível consultar o CEP.');
          }
        } finally {
          setBuscando(false);
        }
      })();
      return () => controller.abort();
    }

    // ── Texto livre → IBGE (debounce de 500ms) ──
    if (valor.length >= 3) {
      const timer = setTimeout(async () => {
        setBuscando(true);
        try {
          const res = await fetch(
            `${IBGE_MUNICIPIOS_URL}?nome=${encodeURIComponent(normalizar(valor))}`,
            { signal: controller.signal },
          );
          const data = await res.json();
          const cidades: SugestaoCidade[] = (Array.isArray(data) ? data : [])
            .slice(0, 5)
            .map((m: any) => ({
              nome: m.nome as string,
              uf:
                (m?.microrregiao?.mesorregiao?.UF?.sigla as string | undefined) ??
                (m?.microrregiao?.mesorregiao?.UF?.nome as string | undefined) ??
                '',
            }))
            .filter((c) => c.nome);
          setSugestoes(cidades);
          setSugestoesAbertas(cidades.length > 0);
        } catch (e) {
          if ((e as Error).name !== 'AbortError') {
            setSugestoes([]);
            setSugestoesAbertas(false);
          }
        } finally {
          setBuscando(false);
        }
      }, 500);
      debounceRef.current = timer;
      return () => {
        clearTimeout(timer);
        controller.abort();
      };
    }

    setSugestoes([]);
    setSugestoesAbertas(false);
    setBuscando(false);
    return undefined;
  }, [value, onChangeText]);

  const selecionarCidade = (cidade: SugestaoCidade) => {
    onChangeText(cidade.uf ? `${cidade.nome} - ${cidade.uf}` : cidade.nome);
    setSugestoesAbertas(false);
    setSugestoes([]);
  };

  const limparCampo = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    onChangeText('');
    setSugestoes([]);
    setSugestoesAbertas(false);
    setErro(undefined);
  };

  return (
    <View style={styles.container}>
      {/* Input + botão de limpar lado a lado (o Input não aceita a prop rightIcon) */}
      <View style={styles.inputRow}>
        <View style={styles.inputWrapper}>
          <Input
            label={label}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            error={erro}
          />
        </View>
        {value.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={limparCampo}
            activeOpacity={0.7}
            accessibilityLabel="Limpar endereço"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close-circle" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {buscando && (
        <View style={styles.statusRow}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.statusTexto}>Buscando endereços...</Text>
        </View>
      )}

      {/* Sugestões inline — dentro do fluxo normal do ScrollView, sem position: absolute */}
      {sugestoesAbertas && sugestoes.length > 0 && (
        <View style={styles.sugestoesContainer}>
          {sugestoes.map((cidade) => (
            <TouchableOpacity
              key={`${cidade.nome}-${cidade.uf}`}
              style={styles.sugestao}
              onPress={() => selecionarCidade(cidade)}
              activeOpacity={0.7}
            >
              <Text style={[styles.sugestaoTexto, { color: colors.textPrimary }]}>
                {cidade.nome}
                {cidade.uf ? ` - ${cidade.uf}` : ''}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      width: '100%',
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    inputWrapper: {
      flex: 1,
    },
    clearButton: {
      // Centraliza o ícone verticalmente em relação ao box do campo (52px):
      // o Input tem label acima e marginBottom abaixo do box
      paddingBottom: 15,
      paddingLeft: spacing.sm,
      paddingRight: spacing.xs,
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginTop: -spacing.sm,
      marginBottom: spacing.sm,
      marginLeft: spacing.xs,
    },
    statusTexto: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    sugestoesContainer: {
      marginBottom: spacing.base,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    sugestao: {
      backgroundColor: colors.surface,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.base,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    sugestaoTexto: {
      fontSize: 14,
    },
  });
