import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import createAgoraRtcEngine, { IRtcEngine, ChannelProfileType, ClientRoleType, RtcSurfaceView } from 'react-native-agora';
import { useCall } from '../../hooks/useCall';
import { colors, spacing, typography } from '../../theme';

export const VideoCallScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { channelName, userName } = route.params;

  const { iniciarChamada, encerrarChamada, isInitializing } = useCall();
  
  const [joined, setJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const agoraEngineRef = useRef<IRtcEngine | null>(null);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const tokenData = await iniciarChamada(channelName, true);
      if (!tokenData) {
        if (isMounted) navigation.goBack();
        return;
      }

      try {
        agoraEngineRef.current = createAgoraRtcEngine();
        const engine = agoraEngineRef.current;

        engine.initialize({ appId: tokenData.appId });
        
        // Configurações para chamada de vídeo
        engine.enableVideo();
        engine.enableAudio();

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

      } catch (e) {
        console.error('Erro ao inicializar Agora Video', e);
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
        <Text style={styles.loadingText}>Iniciando vídeo com {userName}...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Remote Video (Full Screen) */}
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

      {/* Local Video (Floating Mini Window) */}
      {joined && !isVideoMuted && (
        <View style={styles.localVideoContainer}>
          <RtcSurfaceView
            canvas={{ uid: 0 }} // 0 = local
            style={styles.localVideo}
          />
        </View>
      )}

      {/* Controls Overlay */}
      <View style={styles.controlsOverlay}>
        <TouchableOpacity style={[styles.controlButton, isMuted && styles.controlButtonActive]} onPress={toggleMuteAudio}>
          <Text style={styles.controlIcon}>{isMuted ? '🔇' : '🎙️'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.controlButton, isVideoMuted && styles.controlButtonActive]} onPress={toggleMuteVideo}>
          <Text style={styles.controlIcon}>{isVideoMuted ? '🚫' : '📹'}</Text>
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
    gap: spacing.xl,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  controlButtonActive: {
    backgroundColor: colors.white,
  },
  endCallButton: {
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
  controlIcon: {
    fontSize: 20,
  },
});
