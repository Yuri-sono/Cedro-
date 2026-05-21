import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, ChatStackParamList } from '../../types/navigation.types';
import { useChat } from '../../hooks/useChat';
import { MessageBubble } from '../../components/MessageBubble';
import { ChatInput } from '../../components/ChatInput';
import { colors, spacing } from '../../theme';

type NavigationProp = NativeStackNavigationProp<ChatStackParamList, 'Chat'>;

export const ChatScreen = () => {
  const route = useRoute<any>();
  // Precisa do RootStack para chamar a tela de chamadas
  const navigation = useNavigation<any>();
  
  const { userId, userName } = route.params;

  // Atualiza o título e adiciona botões de chamada no header
  useEffect(() => {
    navigation.setOptions({ 
      title: userName,
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('VoiceCall', { channelName: `chat-${userId}`, userName })}
          >
            <Text style={styles.headerIcon}>📞</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('VideoCall', { channelName: `chat-${userId}`, userName })}
          >
            <Text style={styles.headerIcon}>📹</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, userName, userId]);

  const { mensagens, isLoading, enviarMensagem } = useChat(userId);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = (text: string) => {
    enviarMensagem(text);
  };

  if (isLoading && mensagens.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={mensagens}
        keyExtractor={(item, index) => item.id ? item.id.toString() : `temp-${index}`}
        renderItem={({ item }) => <MessageBubble mensagem={item} />}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      <ChatInput onSend={handleSend} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  listContent: {
    paddingVertical: 16,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  headerButton: {
    padding: spacing.xs,
  },
  headerIcon: {
    fontSize: 20,
  },
});
