import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, ChatStackParamList } from '../../types/navigation.types';
import { useChat } from '../../hooks/useChat';
import { MessageBubble } from '../../components/MessageBubble';
import { ChatInput } from '../../components/ChatInput';
import { colors, spacing } from '../../theme';
import { useAuthStore } from '../../store/authStore';

type ChatRouteProp = RouteProp<ChatStackParamList, 'Chat'>;
type ChatNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ChatScreen = () => {
  const route = useRoute<ChatRouteProp>();
  const navigation = useNavigation<ChatNavigationProp>();
  const currentUserId = useAuthStore((state) => state.user?.id);
  
  const { userId, userName } = route.params;
  const channelName = currentUserId
    ? `chat-${Math.min(currentUserId, userId)}-${Math.max(currentUserId, userId)}`
    : `chat-${userId}`;

  // Atualiza o título e adiciona botões de chamada no header
  useEffect(() => {
    navigation.setOptions({ 
      title: userName,
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('VoiceCall', { channelName, userName })}
          >
            <Text style={styles.headerIcon}>📞</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('VideoCall', { channelName, userName })}
          >
            <Text style={styles.headerIcon}>📹</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [channelName, navigation, userName]);

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
