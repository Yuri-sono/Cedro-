import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ChatStackParamList } from '../types/navigation.types';
import { HeaderBackButton } from '../components/HeaderBackButton';
import { ConversasScreen } from '../screens/chat/ConversasScreen';
import { ChatScreen } from '../screens/chat/ChatScreen';

const Stack = createNativeStackNavigator<ChatStackParamList>();

export const ChatStack = () => {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        // Garante a setinha de voltar em todas as telas do Chat,
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
        name="Conversas" 
        component={ConversasScreen} 
        options={{ title: 'Mensagens' }} 
      />
      <Stack.Screen 
        name="Chat" 
        component={ChatScreen} 
        // title is set dynamically inside ChatScreen based on params
      />
    </Stack.Navigator>
  );
};
