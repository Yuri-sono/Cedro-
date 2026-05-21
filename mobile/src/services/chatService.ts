import { Client } from '@stomp/stompjs';
import * as SecureStore from 'expo-secure-store';

// A URL WebSocket base. Note que a porta/path depende da configuração exata do Spring Boot.
// Geralmente, se a API REST é http://10.0.2.2:8080, o STOMP endpoint é ws://10.0.2.2:8080/ws-chat
const WS_URL = process.env.EXPO_PUBLIC_API_URL?.replace('http', 'ws') + '/ws-chat';

class ChatService {
  private client: Client;
  private messageListeners: ((msg: any) => void)[] = [];

  constructor() {
    this.client = new Client({
      brokerURL: WS_URL,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        // console.log('STOMP: ' + str);
      },
    });

    this.client.onConnect = () => {
      console.log('Conectado ao STOMP WebSocket!');
      
      // Inscreve no canal de fila de usuário:
      // O Spring Boot geralmente direciona mensagens para /user/queue/messages usando SimpMessagingTemplate.convertAndSendToUser
      this.client.subscribe('/user/queue/messages', (message) => {
        if (message.body) {
          const parsedMessage = JSON.parse(message.body);
          this.messageListeners.forEach((listener) => listener(parsedMessage));
        }
      });
    };

    this.client.onStompError = (frame) => {
      console.error('STOMP Error:', frame.headers['message'], frame.body);
    };
  }

  // Conecta ao WebSocket, enviando o JWT token no header de conexão (se o Spring estiver configurado para ler tokens via STOMP headers)
  public async connect() {
    if (this.client.active) return;
    
    const token = await SecureStore.getItemAsync('token');
    
    this.client.connectHeaders = {
      Authorization: `Bearer ${token}`,
    };
    
    this.client.activate();
  }

  public disconnect() {
    if (this.client.active) {
      this.client.deactivate();
    }
  }

  // Envia uma mensagem para o Controller do Spring (ex: @MessageMapping("/chat"))
  public sendMessage(destinatarioId: number, conteudo: string) {
    if (!this.client.active) {
      console.warn('Tentativa de enviar mensagem STOMP sem conexão ativa.');
      return;
    }

    this.client.publish({
      destination: '/app/chat',
      body: JSON.stringify({ destinatarioId, mensagem: conteudo }),
    });
  }

  public addMessageListener(listener: (msg: any) => void) {
    this.messageListeners.push(listener);
    return () => {
      this.messageListeners = this.messageListeners.filter((l) => l !== listener);
    };
  }
}

export const chatService = new ChatService();
