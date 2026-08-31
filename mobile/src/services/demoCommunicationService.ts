import AsyncStorage from '@react-native-async-storage/async-storage';
import { ConversaResumo, Mensagem, TipoUsuario, UsuarioResponse } from '../types/api.types';

const DEMO_CHAT_PREFIX = 'cedro_demo_chat';
const DEMO_COUNTERPARTS = {
  psicologo: { userId: -101, nome: 'Funcionário Cedro', fotoUrl: null as string | null },
  paciente: { userId: -102, nome: 'Psicólogo Demo', fotoUrl: null as string | null },
};

function getStorageKey(currentUserId: number, otherUserId: number) {
  return `${DEMO_CHAT_PREFIX}:${currentUserId}:${otherUserId}`;
}

function getCounterpartFor(user?: UsuarioResponse | null) {
  if (user?.tipoUsuario === TipoUsuario.psicologo) {
    return DEMO_COUNTERPARTS.psicologo;
  }

  return DEMO_COUNTERPARTS.paciente;
}

async function readMessages(currentUserId: number, otherUserId: number): Promise<Mensagem[]> {
  const stored = await AsyncStorage.getItem(getStorageKey(currentUserId, otherUserId));
  if (!stored) return [];

  try {
    return JSON.parse(stored) as Mensagem[];
  } catch {
    return [];
  }
}

async function writeMessages(currentUserId: number, otherUserId: number, messages: Mensagem[]) {
  await AsyncStorage.setItem(getStorageKey(currentUserId, otherUserId), JSON.stringify(messages));
}

function createMessage(
  id: number,
  remetenteId: number,
  destinatarioId: number,
  mensagem: string,
  lida = true,
): Mensagem {
  return {
    id,
    remetenteId,
    destinatarioId,
    mensagem,
    lida,
    dataCriacao: new Date().toISOString(),
  };
}

export const demoCommunicationService = {
  isDemoUser(userId: number) {
    return userId < 0;
  },

  getDemoConversation(currentUser: UsuarioResponse | null): ConversaResumo | null {
    if (!currentUser) return null;

    const counterpart = getCounterpartFor(currentUser);

    return {
      userId: counterpart.userId,
      nome: counterpart.nome,
      fotoUrl: counterpart.fotoUrl,
      ultimaMensagem: 'Conversa de demonstração pronta para a apresentação.',
      dataUltimaMensagem: new Date().toISOString(),
      naoLidas: 0,
    };
  },

  async getMessages(currentUser: UsuarioResponse | null, otherUserId: number): Promise<Mensagem[]> {
    if (!currentUser) return [];

    const existing = await readMessages(currentUser.id, otherUserId);
    if (existing.length > 0) {
      return existing;
    }

    const counterpart = getCounterpartFor(currentUser);
    const seeded = [
      createMessage(1, counterpart.userId, currentUser.id, 'Oi! Podemos testar o chat para a apresentação?'),
      createMessage(2, currentUser.id, counterpart.userId, 'Sim, estou vendo tudo pelo mobile web neste momento.'),
      createMessage(3, counterpart.userId, currentUser.id, 'Perfeito. Depois testa também a reunião via Google Meet.'),
    ];

    await writeMessages(currentUser.id, otherUserId, seeded);
    return seeded;
  },

  async sendMessage(currentUser: UsuarioResponse | null, otherUserId: number, text: string): Promise<Mensagem[]> {
    if (!currentUser) return [];

    const counterpart = getCounterpartFor(currentUser);
    const messages = await this.getMessages(currentUser, otherUserId);
    const nextId = messages.reduce((max, item) => Math.max(max, item.id), 0) + 1;

    const updated = [
      ...messages,
      createMessage(nextId, currentUser.id, otherUserId, text),
    ];

    const autoReply = createMessage(
      nextId + 1,
      counterpart.userId,
      currentUser.id,
      currentUser.tipoUsuario === TipoUsuario.psicologo
        ? 'Recebido. Vou alinhar isso com a equipe e seguimos no atendimento.'
        : 'Recebi sua mensagem. Vamos prosseguir com o atendimento.',
    );

    const finalMessages = [...updated, autoReply];
    await writeMessages(currentUser.id, otherUserId, finalMessages);
    return finalMessages;
  },
};
