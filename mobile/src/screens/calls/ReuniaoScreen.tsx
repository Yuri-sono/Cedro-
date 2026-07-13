import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { callService } from '../../services/callService';
import { colors, spacing, typography } from '../../theme';
import { RootStackParamList } from '../../types/navigation.types';

type ReuniaoRouteProp = RouteProp<RootStackParamList, 'Reuniao'>;
type ReuniaoNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Reuniao'>;

const POLLING_INTERVAL_MS = 15000;

function formatarContagemRegressiva(totalSegundos: number) {
  const safeSeconds = Math.max(0, Math.floor(totalSegundos));
  const dias = Math.floor(safeSeconds / 86400);
  const horas = Math.floor((safeSeconds % 86400) / 3600);
  const minutos = Math.floor((safeSeconds % 3600) / 60);
  const segundos = safeSeconds % 60;

  const base = `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
  return dias > 0 ? `${dias}d ${base}` : base;
}

export const ReuniaoScreen = () => {
  const route = useRoute<ReuniaoRouteProp>();
  const navigation = useNavigation<ReuniaoNavigationProp>();
  const { sessaoId } = route.params;

  const [loading, setLoading] = useState(true);
  const [liberado, setLiberado] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const [erro, setErro] = useState('');
  const [disponivelEm, setDisponivelEm] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pararPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  const carregarStatus = async () => {
    try {
      const response = await callService.obterLinkReuniao(sessaoId);
      const data = response ?? {};

      setLiberado(Boolean(data.liberado));
      setLink(data.link ?? null);
      setDisponivelEm(data.disponivelEm ?? null);

      if (data.liberado) {
        if (data.link) {
          setErro('');
        } else {
          setErro('Não foi possível gerar o link, contate o suporte');
        }
        pararPolling();
      } else {
        setErro('');
      }
    } catch (error) {
      const message =
        typeof error === 'object' && error && 'message' in error
          ? String((error as { message?: unknown }).message || '')
          : '';
      setErro(message || 'Não foi possível consultar a reunião neste momento.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarStatus();
    pollingRef.current = setInterval(carregarStatus, POLLING_INTERVAL_MS);

    return () => {
      pararPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessaoId]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const segundosRestantes = useMemo(() => {
    if (!disponivelEm || liberado) return 0;
    const destino = new Date(disponivelEm).getTime();
    return Math.max(0, Math.ceil((destino - now) / 1000));
  }, [now, disponivelEm, liberado]);

  const entrarNaReuniao = async () => {
    if (!link) return;
    try {
      await Linking.openURL(link);
    } catch {
      setErro('Não foi possível abrir o link da reunião.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <Ionicons name="videocam" size={28} color={colors.white} />
        </View>

        <Text style={styles.title}>Reunião da sessão</Text>

        {loading && (
          <View style={styles.loadingBlock}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.helperText}>Verificando disponibilidade...</Text>
          </View>
        )}

        {!loading && !liberado && !erro && (
          <View style={styles.statusBlock}>
            <Text style={styles.statusLabel}>A sessão será liberada em</Text>
            <Text style={styles.countdown}>{formatarContagemRegressiva(segundosRestantes)}</Text>
            <Text style={styles.helperText}>
              O link é verificado automaticamente a cada 15 segundos.
            </Text>
          </View>
        )}

        {!loading && liberado && link && (
          <View style={styles.statusBlock}>
            <Text style={styles.statusLabel}>A reunião está pronta</Text>
            <Text style={styles.helperText}>
              Toque no botão abaixo para abrir no app do Meet ou no navegador.
            </Text>
            <TouchableOpacity style={styles.primaryButton} onPress={entrarNaReuniao}>
              <Text style={styles.primaryButtonText}>Entrar na reunião</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && liberado && !link && (
          <View style={styles.statusBlock}>
            <Text style={styles.errorText}>Não foi possível gerar o link, contate o suporte</Text>
          </View>
        )}

        {!!erro && (
          <View style={styles.statusBlock}>
            <Text style={styles.errorText}>{erro}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryButtonText}>Fechar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1412',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    backgroundColor: '#17211D',
    borderRadius: 28,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignSelf: 'center',
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.white,
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  loadingBlock: {
    alignItems: 'center',
    gap: spacing.base,
    paddingVertical: spacing.xl,
  },
  statusBlock: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  statusLabel: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: typography.size.sm,
    textAlign: 'center',
  },
  countdown: {
    color: colors.white,
    fontSize: 34,
    fontWeight: typography.weight.bold,
    letterSpacing: 1,
  },
  helperText: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: typography.size.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  primaryButton: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.xl,
    borderRadius: 999,
    minWidth: 220,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.white,
    fontWeight: typography.weight.bold,
    fontSize: typography.size.base,
  },
  secondaryButton: {
    marginTop: spacing.lg,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    paddingVertical: spacing.base,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.white,
    fontWeight: typography.weight.semibold,
  },
  errorText: {
    color: '#F2B8B5',
    textAlign: 'center',
    fontSize: typography.size.sm,
    lineHeight: 20,
  },
});
