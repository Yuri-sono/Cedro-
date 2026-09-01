import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { RootStackParamList, ChatStackParamList } from '../../types/navigation.types';
import { useChat } from '../../hooks/useChat';
import { MessageBubble } from '../../components/MessageBubble';
import { ChatInput } from '../../components/ChatInput';
import { borderRadius, colors, spacing , useTheme, ThemeColors } from '../../theme';

type ChatRouteProp = RouteProp<ChatStackParamList, 'Chat'>;
type ChatNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ChatScreen = () => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const route = useRoute<ChatRouteProp>();
  const navigation = useNavigation<ChatNavigationProp>();

  const { userId, userName, sessaoId } = route.params;

  useEffect(() => {
    navigation.setOptions({
      title: userName,
      headerRight: () => (
        <View style={styles.headerButtons}>
          {sessaoId ? (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation.navigate('Reuniao', { sessaoId })}
            >
              <Ionicons name="videocam-outline" size={21} color={colors.primaryDark} />
            </TouchableOpacity>
          ) : null}
        </View>
      ),
    });
  }, [navigation, sessaoId, userName]);

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
        keyExtractor={(item, index) => (item.id ? item.id.toString() : `temp-${index}`)}
        renderItem={({ item }) => <MessageBubble mensagem={item} />}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      <ChatInput onSend={handleSend} />
    </KeyboardAvoidingView>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
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
    gap: spacing.sm,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundTertiary,
  },
});
