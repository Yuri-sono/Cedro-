import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation.types';
import { useAuthStore } from '../store/authStore';
import { useNotifications } from '../hooks/useNotifications';

import { AuthStack } from './AuthStack';
import { MainTabs } from './MainTabs';
import { SplashScreen } from '../screens/SplashScreen';
import { VoiceCallScreen } from '../screens/calls/VoiceCallScreen';
import { VideoCallScreen } from '../screens/calls/VideoCallScreen';
import { PaywallScreen } from '../screens/subscription/PaywallScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  
  // Inicializa o listener de notificações (só registra se isAuthenticated for true)
  useNotifications();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <RootStack.Screen name="Main" component={MainTabs} />
            
            {/* Modais Globais de Chamada */}
            <RootStack.Group screenOptions={{ presentation: 'fullScreenModal', headerShown: false }}>
              <RootStack.Screen name="VoiceCall" component={VoiceCallScreen} />
              <RootStack.Screen name="VideoCall" component={VideoCallScreen} />
              <RootStack.Screen name="Paywall" component={PaywallScreen} />
            </RootStack.Group>
          </>
        ) : (
          <RootStack.Screen name="Auth" component={AuthStack} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
