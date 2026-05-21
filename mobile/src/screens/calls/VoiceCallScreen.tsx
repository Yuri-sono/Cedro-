import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import createAgoraRtcEngine, { IRtcEngine, ChannelProfileType, ClientRoleType } from 'react-native-agora';
import { useCall } from '../../hooks/useCall';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { Avatar } from '../../components/Avatar';

export const VoiceCallScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { channelName, userName } = route.params;

  const { iniciarChamada, encerrarChamada, isInitializing } = useCall();
  
  const [joined, setJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const agoraEngineRef = useRef<IRtcEngine | null>(null);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const tokenData = await iniciarChamada(channelName, false);
      if (!tokenData) {
        if (isMounted) navigation.goBack();
        return;
      }

      try {
        agoraEngineRef.current = createAgoraRtcEngine();
        const engine = agoraEngineRef.current;

        engine.initialize({ appId: tokenData.appId });
        
        // Configurações para chamada de voz pura
        engine.enableAudio();
        engine.disableVideo();

        engine.addListener('onJoinChannelSuccess', () => {
          if (isMounted) {
            setJoined(true);
            setStartTime(new Date());
          }
        });

        engine.addListener('onUserJoined', (_connection, uid) => {
          if (isMounted) setRemoteUid(uid);
        });

        engine.addListener('onUserOffline', (_connection, _uid) => {
          if (isMounted) {
            setRemoteUid(null);
            handleEndCall(); // Encerra se o outro sair
          }
        });

        engine.joinChannel(tokenData.token, channelName, tokenData.uid, {
          channelProfile: ChannelProfileType.ChannelProfileCommunication,
          clientRoleType: ClientRoleType.ClientRoleBroadcaster,
          publishMicrophoneTrack: true,
          autoSubscribeAudio: true,
        });

      } catch (e) {
        console.error('Erro ao inicializar Agora', e);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEndCall = () => {
    const duration = startTime ? Math.floor((new Date().getTime() - startTime.getTime()) / 1000) : 0;
    encerrarChamada(channelName, duration);
    navigation.goBack();
  };

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
          <Text style={styles.controlIcon}>{isMuted ? '🔇' : '🎙️'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.controlButton, styles.endCallButton]} onPress={handleEndCall}>
          <Text style={styles.controlIcon}>📞</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E', // Fundo escuro para tela de chamada
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
    width: 64,
    height: 64,
    borderRadius: 32,
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
    fontSize: 24,
  },
});
