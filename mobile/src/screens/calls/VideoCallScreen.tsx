import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import createAgoraRtcEngine, {
  IRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  RtcSurfaceView,
} from 'react-native-agora';
import { useCall } from '../../hooks/useCall';
import { colors, spacing, typography } from '../../theme';
import { RootStackParamList } from '../../types/navigation.types';

type VideoCallRouteProp = RouteProp<RootStackParamList, 'VideoCall'>;
type VideoCallNavigationProp = NativeStackNavigationProp<RootStackParamList, 'VideoCall'>;

export const VideoCallScreen = () => {
  const route = useRoute<VideoCallRouteProp>();
  const navigation = useNavigation<VideoCallNavigationProp>();
  const { channelName, userName } = route.params;

  const { iniciarChamada, encerrarChamada, isInitializing } = useCall();

  const [joined, setJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const startTimeRef = useRef<Date | null>(null);
  const agoraEngineRef = useRef<IRtcEngine | null>(null);

  const handleEndCall = async () => {
    const startTime = startTimeRef.current;
    const duration = startTime ? Math.floor((Date.now() - startTime.getTime()) / 1000) : 0;
    await encerrarChamada(channelName, duration, 'video');
    navigation.goBack();
  };

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const tokenData = await iniciarChamada(channelName, true);
      if (!tokenData) {
        if (isMounted) navigation.goBack();
        return;
      }

      try {
        const engine = createAgoraRtcEngine();
        agoraEngineRef.current = engine;

        engine.initialize({ appId: tokenData.appId });
        engine.enableVideo();
        engine.enableAudio();

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
          publishCameraTrack: true,
          autoSubscribeAudio: true,
          autoSubscribeVideo: true,
        });
      } catch (error) {
        console.error('Erro ao inicializar Agora Video', error);
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

  const toggleMuteAudio = () => {
    if (agoraEngineRef.current) {
      agoraEngineRef.current.muteLocalAudioStream(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const toggleMuteVideo = () => {
    if (agoraEngineRef.current) {
      agoraEngineRef.current.muteLocalVideoStream(!isVideoMuted);
      setIsVideoMuted(!isVideoMuted);
    }
  };

  if (isInitializing && !joined) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Iniciando video com {userName}...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {remoteUid ? (
        <RtcSurfaceView
          canvas={{ uid: remoteUid }}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <View style={styles.waitingContainer}>
          <Text style={styles.waitingText}>Aguardando {userName}...</Text>
        </View>
      )}

      {joined && !isVideoMuted && (
        <View style={styles.localVideoContainer}>
          <RtcSurfaceView
            canvas={{ uid: 0 }}
            style={styles.localVideo}
          />
        </View>
      )}

      <View style={styles.controlsOverlay}>
        <TouchableOpacity style={[styles.controlButton, isMuted && styles.controlButtonActive]} onPress={toggleMuteAudio}>
          <Text style={styles.controlIcon}>{isMuted ? 'Mute' : 'Mic'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.controlButton, isVideoMuted && styles.controlButtonActive]} onPress={toggleMuteVideo}>
          <Text style={styles.controlIcon}>{isVideoMuted ? 'Video off' : 'Video'}</Text>
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
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: colors.white,
    marginTop: spacing.md,
    fontSize: typography.size.base,
  },
  waitingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waitingText: {
    color: colors.white,
    fontSize: typography.size.lg,
  },
  localVideoContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 100,
    height: 150,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: '#333',
  },
  localVideo: {
    width: '100%',
    height: '100%',
  },
  controlsOverlay: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
  },
  controlButton: {
    minWidth: 56,
    height: 56,
    borderRadius: 28,
    paddingHorizontal: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  controlButtonActive: {
    backgroundColor: colors.textSecondary,
  },
  endCallButton: {
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
  controlIcon: {
    color: colors.white,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
  },
});
