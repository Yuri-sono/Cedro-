import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCall } from '../../hooks/useCall';
import { colors, spacing, typography } from '../../theme';
import { RootStackParamList } from '../../types/navigation.types';

type VoiceCallRouteProp = RouteProp<RootStackParamList, 'VoiceCall'>;
type VoiceCallNavigationProp = NativeStackNavigationProp<RootStackParamList, 'VoiceCall'>;

function formatDuration(totalSeconds: number) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export const VoiceCallScreen = () => {
  const route = useRoute<VoiceCallRouteProp>();
  const navigation = useNavigation<VoiceCallNavigationProp>();
  const { encerrarChamada, iniciarChamada, isInitializing } = useCall();
  const { channelName, userName } = route.params;
  const streamRef = useRef<MediaStream | null>(null);
  const durationRef = useRef(0);

  const [status, setStatus] = useState('Conectando chamada de demonstracao...');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [duration, setDuration] = useState(0);

  const durationText = useMemo(() => formatDuration(duration), [duration]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;

    async function init() {
      await iniciarChamada(channelName, false);

      try {
        streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        setStatus('Em chamada com audio ativo');
      } catch {
        setStatus('Em chamada de demonstracao sem captacao de microfone');
      }

      intervalId = setInterval(() => {
        durationRef.current += 1;
        setDuration(durationRef.current);
      }, 1000);
    }

    init();

    return () => {
      if (intervalId) clearInterval(intervalId);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      encerrarChamada(channelName, durationRef.current, 'voz');
    };
  }, [channelName, encerrarChamada, iniciarChamada]);

  const toggleMute = () => {
    const nextValue = !isMuted;
    streamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = !nextValue;
    });
    setIsMuted(nextValue);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topCard}>
        <View style={styles.avatarFake}>
          <Ionicons name="person" size={42} color={colors.white} />
        </View>
        <Text style={styles.name}>{userName}</Text>
        <Text style={styles.status}>{isInitializing ? 'Preparando...' : status}</Text>
        <Text style={styles.duration}>{durationText}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Demo de chamada de voz</Text>
        <Text style={styles.infoText}>
          Esta tela simula a chamada para a apresentacao e ativa o microfone no navegador quando permitido.
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={toggleMute}>
          <Ionicons name={isMuted ? 'mic-off' : 'mic'} size={24} color={colors.white} />
          <Text style={styles.actionText}>{isMuted ? 'Desmutar' : 'Mutar'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => setIsSpeakerOn((value) => !value)}>
          <Ionicons name={isSpeakerOn ? 'volume-high' : 'volume-mute'} size={24} color={colors.white} />
          <Text style={styles.actionText}>{isSpeakerOn ? 'Audio on' : 'Audio off'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.endButton]} onPress={() => navigation.goBack()}>
          <Ionicons name="call" size={24} color={colors.white} />
          <Text style={styles.actionText}>Encerrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#11231C',
    justifyContent: 'space-between',
    padding: spacing.xl,
  },
  topCard: {
    alignItems: 'center',
    marginTop: spacing['3xl'],
  },
  avatarFake: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: colors.forest,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  name: {
    color: colors.white,
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
  },
  status: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: typography.size.base,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  duration: {
    color: colors.white,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    marginTop: spacing.base,
  },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 24,
    padding: spacing.lg,
  },
  infoTitle: {
    color: colors.white,
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
  },
  infoText: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: typography.size.sm,
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.base,
    marginBottom: spacing.xl,
  },
  actionButton: {
    flex: 1,
    minHeight: 88,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  endButton: {
    backgroundColor: '#D9564D',
  },
  actionText: {
    color: colors.white,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
});
