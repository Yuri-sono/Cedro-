import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../types/navigation.types';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { EditProfileScreen } from '../screens/profile/EditProfileScreen';
import { PsychologistSettingsScreen } from '../screens/profile/PsychologistSettingsScreen';
import { ChangePasswordScreen } from '../screens/profile/ChangePasswordScreen';
import { SessionsScreen } from '../screens/sessions/SessionsScreen';
import { NewSessionPsicologoScreen } from '../screens/sessions/NewSessionPsicologoScreen';
import { PaywallScreen } from '../screens/subscription/PaywallScreen';
import { PacientesPsicologoScreen } from '../screens/psicologo/PacientesPsicologoScreen';
import { ConsultasPsicologoScreen } from '../screens/psicologo/ConsultasPsicologoScreen';
import { FinanceiroPsicologoScreen } from '../screens/psicologo/FinanceiroPsicologoScreen';
import { EstatisticasPsicologoScreen } from '../screens/psicologo/EstatisticasPsicologoScreen';

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
        name="PsychologistSettings"
        component={PsychologistSettingsScreen}
        options={{ title: 'Atendimento' }}
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
        name="NewSessionPsicologo"
        component={NewSessionPsicologoScreen}
        options={{ title: 'Nova Consulta' }}
      />
      <Stack.Screen 
        name="Subscription" 
        component={PaywallScreen} 
        options={{ title: 'Assinatura' }} 
      />
      <Stack.Screen
        name="PacientesPsicologo"
        component={PacientesPsicologoScreen}
        options={{ title: 'Meus Pacientes' }}
      />
      <Stack.Screen
        name="ConsultasPsicologo"
        component={ConsultasPsicologoScreen}
        options={{ title: 'Próximas Consultas' }}
      />
      <Stack.Screen
        name="FinanceiroPsicologo"
        component={FinanceiroPsicologoScreen}
        options={{ title: 'Financeiro' }}
      />
      <Stack.Screen
        name="EstatisticasPsicologo"
        component={EstatisticasPsicologoScreen}
        options={{ title: 'Estatísticas' }}
      />
    </Stack.Navigator>
  );
};
