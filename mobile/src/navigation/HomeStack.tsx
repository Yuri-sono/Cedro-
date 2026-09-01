import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../types/navigation.types';
import { HomeScreen } from '../screens/home/HomeScreen';
import { PsicologoListScreen } from '../screens/home/PsicologoListScreen';
import { PsicologoDetailScreen } from '../screens/home/PsicologoDetailScreen';
import { ScheduleSessionScreen } from '../screens/home/ScheduleSessionScreen';
import { PaymentScreen } from '../screens/home/PaymentScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PsicologoList"
        component={PsicologoListScreen}
        options={{ title: 'Psicólogos' }}
      />
      <Stack.Screen
        name="PsicologoDetail"
        component={PsicologoDetailScreen}
        options={{ title: 'Perfil do Psicólogo' }}
      />
      <Stack.Screen
        name="ScheduleSession"
        component={ScheduleSessionScreen}
        options={{ title: 'Agendar Consulta' }}
      />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{ title: 'Pagamento' }}
      />
    </Stack.Navigator>
  );
};
