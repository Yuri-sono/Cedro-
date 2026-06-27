import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import { colors, spacing, typography } from '../../theme';

type IRtcEngine = any;
type createAgoraRtcEngineType = any;

export const TesteAgoraScreen = () => {
  const [status, setStatus] = useState('Iniciando spike...');
  const [engine, setEngine] = useState<IRtcEngine | null>(null);

  useEffect(() => {
    let isMounted = true;
    const initSpike = async () => {
      try {
        if (Platform.OS === 'android') {
          setStatus('Solicitando permissoes...');
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            PermissionsAndroid.PERMISSIONS.CAMERA,
          ]);
          
          if (
            granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] !== PermissionsAndroid.RESULTS.GRANTED ||
            granted[PermissionsAndroid.PERMISSIONS.CAMERA] !== PermissionsAndroid.RESULTS.GRANTED
          ) {
            setStatus('Permissoes negadas. O spike falhou.');
            return;
          }
        }

        setStatus('Inicializando Agora Engine...');
        const { createAgoraRtcEngine } = require('react-native-agora');
        const rtcEngine = createAgoraRtcEngine();
        setEngine(rtcEngine);

        // App ID hardcoded temporario apenas para ver se o SDK roda sem crashar. 
        // Em prod deve vir do backend
        rtcEngine.initialize({ appId: '8b4d8d9b9c9f4d2f8d4e4f7a6a4d3d2c' }); // Dummy App ID
        
        rtcEngine.addListener('onJoinChannelSuccess', () => {
          if (isMounted) setStatus('Entrou no canal de teste com sucesso!');
        });

        rtcEngine.addListener('onError', (err: any, msg: any) => {
          if (isMounted) setStatus(`Erro: ${err} - ${msg}`);
        });

        setStatus('Pronto! RtcEngine inicializado com sucesso.');
        
      } catch (error: any) {
        if (isMounted) {
          setStatus(`Crash/Erro capturado: ${error?.message || error}`);
        }
      }
    };

    initSpike();

    return () => {
      isMounted = false;
      if (engine) {
        engine.release();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spike Agora.io</Text>
      <View style={styles.statusBox}>
        <Text style={styles.statusText}>{status}</Text>
      </View>
      <Text style={styles.info}>
        Se você está vendo esta tela no device físico sem o app ter fechado sozinho (crash), significa que a integração nativa funcionou perfeitamente.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.primary,
    marginBottom: spacing.xl,
  },
  statusBox: {
    padding: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
    width: '100%',
  },
  statusText: {
    fontSize: typography.size.md,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  info: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
