import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/navigation.types';
import { colors } from '../theme';

import { HomeStack } from './HomeStack';
import { ProfileStack } from './ProfileStack';
import { ChatStack } from './ChatStack';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tab.Screen name="HomeStack" component={HomeStack} options={{ title: 'Home' }} />
      <Tab.Screen name="ChatStack" component={ChatStack} options={{ title: 'Chat' }} />
      <Tab.Screen name="ProfileStack" component={ProfileStack} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
};
