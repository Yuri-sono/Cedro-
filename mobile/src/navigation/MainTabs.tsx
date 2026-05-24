import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MainTabParamList } from '../types/navigation.types';
import { colors } from '../theme';

import { HomeStack } from './HomeStack';
import { ProfileStack } from './ProfileStack';
import { ChatStack } from './ChatStack';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 64,
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarIcon: ({ color, size, focused }) => {
          const iconName =
            route.name === 'HomeStack'
              ? focused
                ? 'home'
                : 'home-outline'
              : route.name === 'ChatStack'
                ? focused
                  ? 'chatbubbles'
                  : 'chatbubbles-outline'
                : focused
                  ? 'person'
                  : 'person-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeStack" component={HomeStack} options={{ title: 'Home' }} />
      <Tab.Screen name="ChatStack" component={ChatStack} options={{ title: 'Chat' }} />
      <Tab.Screen name="ProfileStack" component={ProfileStack} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
};
