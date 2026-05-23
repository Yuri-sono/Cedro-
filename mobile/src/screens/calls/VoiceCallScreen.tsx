import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import createAgoraRtcEngine, { IRtcEngine, ChannelProfileType, ClientRoleType } from 'react-native-agora';
import { useCall } from '../../hooks/useCall';
import { colors, spacing, typography } from '../../theme';
import { Avatar } from '../../components/Avatar';
import { RootStackParamList } from '../../types/navigation.types';

type VoiceCallRouteProp = RouteProp<RootStackParamList, 'VoiceCall'>;
type VoiceCallNavigationProp = NativeStackNavigationProp<RootStackParamList, 'VoiceCall'>;

export const VoiceCallScreen = () => {
  const route = useRoute<VoiceCallRouteProp>();
  const navigation = useNavigation<VoiceCallNavigationProp>();
  const { channelName, userName } = route.params;

  const { iniciarChamada, encerrarChamada, isInitializing } = useCall();

  const [joined, setJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const startTimeRef = useRef<Date | null>(null);
  const agoraEngineRef = useRef<IRtcEngine | null>(null);

  const handleEndCall = async () => {
    const startTime = startTimeRef.current;
    const duration = startTime ? Math.floor((Date.now() - startTime.getTime()) / 1000) : 0;
    await encerrarChamada(channelName, duration, 'voz');
    navigation.goBack();
  };

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const tokenData = await iniciarChamada(channelName, false);
      if (!tokenData) {
        if (isMounted) navigation.goBack();
        return;
      }

      try {
        const engine = createAgoraRtcEngine();
        agoraEngineRef.current = engine;

        engine.initialize({ appId: tokenData.appId });
        engine.enableAudio();
        engine.disableVideo();

        engine.addListener('onJoinChannelSuccess', () => {
          if (!isMounted) return;
          setJoined(true);
          startTimeRef.current = new Date();
        });

        engine.addListener('onUserJoined', (_connection, uid) => {
          if (isMounted) setRemoteUid(uid);
        });

        engine.addListener('onUserOffline', () => {
          if (isMounted) {
            setRemoteUid(null);
            handleEndCall();
          }
        });

        engine.joinChannel(tokenData.token, channelName, tokenData.uid, {
          channelProfile: ChannelProfileType.ChannelProfileCommunication,
          clientRoleType: ClientRoleType.ClientRoleBroadcaster,
          publishMicrophoneTrack: true,
          autoSubscribeAudio: true,
        });
      } catch (error) {
        console.error('Erro ao inicializar Agora', error);
        if (isMounted) navigation.goBack();
      }
    };

    init();

    return () => {
      isMounted = false;
      if (agoraEngineRef.current) {
        agoraEngineRef.current.leaveChannel();
        agoraEngineRef.current.release();
      }
    };
  }, [channelName, iniciarChamada, navigation]);

  const toggleMute = () => {
    if (agoraEngineRef.current) {
      agoraEngineRef.current.muteLocalAudioStream(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  if (isInitializing && !joined) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Conectando a {userName}...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.statusText}>
          {remoteUid ? 'Em chamada' : 'Chamando...'}
        </Text>
      </View>

      <View style={styles.centerInfo}>
        <Avatar size={120} />
        <Text style={styles.userName}>{userName}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={[styles.controlButton, isMuted && styles.controlButtonActive]} onPress={toggleMute}>
          <Text style={styles.controlIcon}>{isMuted ? 'Mute' : 'Mic'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.controlButton, styles.endCallButton]} onPress={handleEndCall}>
          <Text style={styles.controlIcon}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    justifyContent: 'space-between',
    paddingVertical: spacing['3xl'],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
  },
  loadingText: {
    color: colors.white,
    marginTop: spacing.md,
    fontSize: typography.size.base,
  },
  header: {
    alignItems: 'center',
  },
  statusText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: typography.size.md,
  },
  centerInfo: {
    alignItems: 'center',
  },
  userName: {
    color: colors.white,
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    marginTop: spacing.xl,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing['2xl'],
    paddingBottom: spacing.xl,
  },
  controlButton: {
    minWidth: 64,
    height: 64,
    borderRadius: 32,
    paddingHorizontal: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonActive: {
    backgroundColor: colors.white,
  },
  endCallButton: {
    backgroundColor: colors.error,
  },
  controlIcon: {
    color: colors.white,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
  },
});
