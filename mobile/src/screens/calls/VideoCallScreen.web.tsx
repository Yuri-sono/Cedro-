import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCall } from '../../hooks/useCall';
import { colors, spacing, typography } from '../../theme';
import { RootStackParamList } from '../../types/navigation.types';

type VideoCallRouteProp = RouteProp<RootStackParamList, 'VideoCall'>;
type VideoCallNavigationProp = NativeStackNavigationProp<RootStackParamList, 'VideoCall'>;

const HtmlVideo = 'video' as any;

function formatDuration(totalSeconds: number) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export const VideoCallScreen = () => {
  const route = useRoute<VideoCallRouteProp>();
  const navigation = useNavigation<VideoCallNavigationProp>();
  const { channelName, userName } = route.params;
  const { iniciarChamada, encerrarChamada, isInitializing } = useCall();
  const localVideoRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const durationRef = useRef(0);

  const [status, setStatus] = useState('Conectando video de demonstracao...');
  const [duration, setDuration] = useState(0);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  const durationText = useMemo(() => formatDuration(duration), [duration]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;

    async function init() {
      await iniciarChamada(channelName, true);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          await localVideoRef.current.play().catch(() => undefined);
        }

        setStatus('Em videochamada de demonstracao');
      } catch {
        setStatus('Videochamada de demonstracao sem acesso a camera/microfone');
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
      encerrarChamada(channelName, durationRef.current, 'video');
    };
  }, [channelName, encerrarChamada, iniciarChamada]);

  const toggleCamera = () => {
    const nextValue = !isCameraOn;
    streamRef.current?.getVideoTracks().forEach((track) => {
      track.enabled = nextValue;
    });
    setIsCameraOn(nextValue);
  };

  const toggleMic = () => {
    const nextValue = !isMicOn;
    streamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = nextValue;
    });
    setIsMicOn(nextValue);
  };

  return (
    <View style={styles.container}>
      <View style={styles.remoteStage}>
        <View style={styles.remoteAvatar}>
          <Ionicons name="person" size={56} color={colors.white} />
        </View>
        <Text style={styles.remoteName}>{userName}</Text>
        <Text style={styles.remoteStatus}>{isInitializing ? 'Preparando...' : status}</Text>
        <Text style={styles.remoteDuration}>{durationText}</Text>
      </View>

      <View style={styles.localPreviewShell}>
        {isCameraOn ? (
          <HtmlVideo
            ref={localVideoRef}
            muted
            playsInline
            autoPlay
            style={styles.localVideo}
          />
        ) : (
          <View style={[styles.localVideo, styles.localVideoFallback]}>
            <Ionicons name="videocam-off" size={28} color={colors.white} />
            <Text style={styles.localVideoFallbackText}>Camera desligada</Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={toggleMic}>
          <Ionicons name={isMicOn ? 'mic' : 'mic-off'} size={22} color={colors.white} />
          <Text style={styles.actionText}>{isMicOn ? 'Microfone' : 'Mic off'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={toggleCamera}>
          <Ionicons name={isCameraOn ? 'videocam' : 'videocam-off'} size={22} color={colors.white} />
          <Text style={styles.actionText}>{isCameraOn ? 'Camera' : 'Cam off'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.endButton]} onPress={() => navigation.goBack()}>
          <Ionicons name="call" size={22} color={colors.white} />
          <Text style={styles.actionText}>Encerrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1114',
    padding: spacing.base,
  },
  remoteStage: {
    flex: 1,
    backgroundColor: '#1A1F26',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  remoteAvatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: colors.forest,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  remoteName: {
    color: colors.white,
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
  },
  remoteStatus: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: typography.size.base,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  remoteDuration: {
    color: colors.white,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    marginTop: spacing.base,
  },
  localPreviewShell: {
    position: 'absolute',
    right: spacing.lg,
    top: spacing['2xl'],
    width: 150,
    height: 220,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.16)',
    backgroundColor: '#20252C',
  },
  localVideo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    backgroundColor: '#20252C',
  },
  localVideoFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  localVideoFallbackText: {
    color: colors.white,
    fontSize: typography.size.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.base,
    marginTop: spacing.base,
    marginBottom: spacing.lg,
  },
  actionButton: {
    flex: 1,
    minHeight: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: '#232A33',
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
