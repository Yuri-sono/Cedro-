import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RecursosStackParamList } from '../types/navigation.types';
import { HeaderBackButton } from '../components/HeaderBackButton';
import { RecursosHubScreen } from '../screens/recursos/RecursosHubScreen';
import { SaudeMentalScreen } from '../screens/recursos/SaudeMentalScreen';
import { AutoavaliacoesScreen } from '../screens/recursos/AutoavaliacoesScreen';
import { PassatemposScreen } from '../screens/recursos/PassatemposScreen';
import { ChatEmergenciaScreen } from '../screens/recursos/ChatEmergenciaScreen';

const Stack = createNativeStackNavigator<RecursosStackParamList>();

export const RecursosStack = () => {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        // Garante a setinha de voltar em todas as telas de Recursos,
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
        name="RecursosHub"
        component={RecursosHubScreen}
        options={{ title: 'Recursos' }}
      />
      <Stack.Screen
        name="SaudeMental"
        component={SaudeMentalScreen}
        options={{ title: 'Saúde Mental' }}
      />
      <Stack.Screen
        name="Autoavaliacoes"
        component={AutoavaliacoesScreen}
        options={{ title: 'Autoavaliações' }}
      />
      <Stack.Screen
        name="Passatempos"
        component={PassatemposScreen}
        options={{ title: 'Passatempos' }}
      />
      <Stack.Screen
        name="ChatEmergencia"
        component={ChatEmergenciaScreen}
        options={{ title: 'Preciso de Ajuda' }}
      />
    </Stack.Navigator>
  );
};