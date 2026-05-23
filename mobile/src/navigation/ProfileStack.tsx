import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../types/navigation.types';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { EditProfileScreen } from '../screens/profile/EditProfileScreen';
import { ChangePasswordScreen } from '../screens/profile/ChangePasswordScreen';
import { SessionsScreen } from '../screens/sessions/SessionsScreen';
import { PaywallScreen } from '../screens/subscription/PaywallScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Meu Perfil' }} 
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen} 
        options={{ title: 'Editar Perfil' }} 
      />
      <Stack.Screen 
        name="ChangePassword" 
        component={ChangePasswordScreen} 
        options={{ title: 'Alterar Senha' }} 
      />
      <Stack.Screen 
        name="MySessions" 
        component={SessionsScreen} 
        options={{ title: 'Minhas Sessões' }} 
      />
      <Stack.Screen 
        name="Subscription" 
        component={PaywallScreen} 
        options={{ title: 'Assinatura' }} 
      />
    </Stack.Navigator>
  );
};
