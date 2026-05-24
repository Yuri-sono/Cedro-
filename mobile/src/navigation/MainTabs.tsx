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
        tabBarActiveTintColor: colors.forest,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          marginTop: 2,
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: '#E8DDC8',
          height: 72,
          paddingBottom: 10,
          paddingTop: 8,
          shadowColor: colors.forest,
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.08,
          shadowRadius: 10,
          elevation: 12,
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
