import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ChatStackParamList } from '../types/navigation.types';
import { ConversasScreen } from '../screens/chat/ConversasScreen';
import { ChatScreen } from '../screens/chat/ChatScreen';

const Stack = createNativeStackNavigator<ChatStackParamList>();

export const ChatStack = () => {
  return (
    <Stack.Navigator>
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
