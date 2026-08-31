import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation.types';
import { useAuthStore } from '../store/authStore';
import { useNotifications } from '../hooks/useNotifications';
import { navigationRef } from './navigationRef';

import { AuthStack } from './AuthStack';
import { MainTabs } from './MainTabs';
import { SplashScreen } from '../screens/SplashScreen';
import { ReuniaoScreen } from '../screens/calls/ReuniaoScreen';
import { PaywallScreen } from '../screens/subscription/PaywallScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const [showLoginSplash, setShowLoginSplash] = useState(false);
  const previousAuth = useRef<boolean | null>(null);

  // Inicializa o listener de notificações (só registra se isAuthenticated for true)
  useNotifications();

  useEffect(() => {
    const wasAuthenticated = previousAuth.current;
    previousAuth.current = isAuthenticated;

    if (wasAuthenticated === false && isAuthenticated) {
      setShowLoginSplash(true);
      const timeout = setTimeout(() => setShowLoginSplash(false), 2600);
      return () => clearTimeout(timeout);
    }

    if (!isAuthenticated) {
      setShowLoginSplash(false);
    }
  }, [isAuthenticated]);

  if (isLoading || showLoginSplash) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <RootStack.Screen name="Main" component={MainTabs} />

            {/* Modais Globais de Chamada */}
            <RootStack.Group screenOptions={{ presentation: 'fullScreenModal', headerShown: false }}>
              <RootStack.Screen name="Reuniao" component={ReuniaoScreen} />
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
