import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../types/navigation.types';
import { HeaderBackButton } from '../components/HeaderBackButton';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { EditProfileScreen } from '../screens/profile/EditProfileScreen';
import { PsychologistSettingsScreen } from '../screens/profile/PsychologistSettingsScreen';
import { ChangePasswordScreen } from '../screens/profile/ChangePasswordScreen';
import { SessionsScreen } from '../screens/sessions/SessionsScreen';
import { NewSessionPsicologoScreen } from '../screens/sessions/NewSessionPsicologoScreen';
import { PaywallScreen } from '../screens/subscription/PaywallScreen';
import { AppearanceScreen } from '../screens/profile/AppearanceScreen';
import { PacientesPsicologoScreen } from '../screens/psicologo/PacientesPsicologoScreen';
import { ConsultasPsicologoScreen } from '../screens/psicologo/ConsultasPsicologoScreen';
import { FinanceiroPsicologoScreen } from '../screens/psicologo/FinanceiroPsicologoScreen';
import { EstatisticasPsicologoScreen } from '../screens/psicologo/EstatisticasPsicologoScreen';
import { DashboardPsicologoScreen } from '../screens/psicologo/DashboardPsicologoScreen';
import { AgendaPsicologoScreen } from '../screens/psicologo/AgendaPsicologoScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        // Garante a setinha de voltar em todas as telas do Perfil (inclusive Assinatura),
        // inclusive onde o botão nativo do header não aparece (ex.: web).
        headerLeft: ({ canGoBack, tintColor }) => (
          <HeaderBackButton
            canGoBack={!!canGoBack}
            onPress={() => navigation.goBack()}
            color={tintColor ?? undefined}
          />
        ),
      })}
    >
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
        name="DashboardPsicologo"
        component={DashboardPsicologoScreen}
        options={{ title: 'Dashboard' }}
      />
      <Stack.Screen
        name="AgendaPsicologo"
        component={AgendaPsicologoScreen}
        options={{ title: 'Agenda' }}
      />
      <Stack.Screen
        name="PacientesPsicologo"
        component={PacientesPsicologoScreen}
        options={{ title: 'Meus Pacientes' }}
      />
      <Stack.Screen
        name="ConsultasPsicologo"
        component={ConsultasPsicologoScreen}
        options={{ title: 'Consultas' }}
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
      <Stack.Screen
        name="Appearance"
        component={AppearanceScreen}
        options={{ title: 'Aparência' }}
      />
    </Stack.Navigator>
  );
};
