import { getDb } from "../db";
import { eq, and, desc, lte } from "drizzle-orm";

interface ChatMessage {
  id?: number;
  fixtureId: number;
  userId: string;
  userName: string;
  message: string;
  type: "message" | "goal" | "card" | "substitution";
  sentiment: "positive" | "negative" | "neutral";
  likes: number;
  isVerified: boolean;
  createdAt?: Date;
}

interface ChatUser {
  id: string;
  userName: string;
  avatar?: string;
  isVerified: boolean;
  isModerator: boolean;
  messageCount: number;
}

// Armazenar conexões ativas por fixture
const activeChats = new Map<
  number,
  Set<{ userId: string; userName: string }>
>();

/**
 * Inicia uma nova sala de chat para uma partida
 */
export function startChatRoom(fixtureId: number) {
  if (!activeChats.has(fixtureId)) {
    activeChats.set(fixtureId, new Set());
    console.log(`✅ Sala de chat iniciada para fixture ${fixtureId}`);
  }
}

/**
 * Encerra uma sala de chat
 */
export function endChatRoom(fixtureId: number) {
  activeChats.delete(fixtureId);
  console.log(`⏹️ Sala de chat encerrada para fixture ${fixtureId}`);
}

/**
 * Adiciona um usuário à sala de chat
 */
export function joinChatRoom(
  fixtureId: number,
  userId: string,
  userName: string
) {
  if (!activeChats.has(fixtureId)) {
    startChatRoom(fixtureId);
  }

  const room = activeChats.get(fixtureId);
  room?.add({ userId, userName });

  console.log(
    `👤 ${userName} entrou na sala de chat da fixture ${fixtureId}`
  );
  return {
    success: true,
    message: `${userName} entrou na sala`,
    activeUsers: room?.size || 0,
  };
}

/**
 * Remove um usuário da sala de chat
 */
export function leaveChatRoom(fixtureId: number, userId: string) {
  const room = activeChats.get(fixtureId);
  if (room) {
    const user = Array.from(room).find((u) => u.userId === userId);
    if (user) {
      room.delete(user);
      console.log(`👤 ${user.userName} saiu da sala de chat`);
    }
  }
}

/**
 * Envia uma mensagem no chat
 */
export async function sendChatMessage(message: ChatMessage) {
  try {
    const db = getDb();

    // Validar mensagem
    if (!message.message.trim()) {
      return { success: false, error: "Mensagem vazia" };
    }

    if (message.message.length > 500) {
      return { success: false, error: "Mensagem muito longa (máx 500 caracteres)" };
    }

    // Detectar sentimento (análise simples)
    const sentiment = detectSentiment(message.message);

    // Salvar mensagem no banco (quando implementar tabela)
    console.log(`💬 Mensagem no chat: ${message.userName}: ${message.message}`);

    return {
      success: true,
      message: {
        ...message,
        sentiment,
        createdAt: new Date(),
      },
    };
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    return { success: false, error: "Erro ao enviar mensagem" };
  }
}

/**
 * Busca mensagens recentes de uma partida
 */
export async function getChatMessages(
  fixtureId: number,
  limit: number = 50
): Promise<ChatMessage[]> {
  try {
    // Quando implementar banco de dados, fazer query aqui
    // Por enquanto, retorna array vazio
    return [];
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    return [];
  }
}

/**
 * Retorna usuários ativos em uma sala
 */
export function getActiveUsers(fixtureId: number) {
  const room = activeChats.get(fixtureId);
  if (!room) return [];

  return Array.from(room).map((user) => ({
    userId: user.userId,
    userName: user.userName,
  }));
}

/**
 * Retorna status de todas as salas ativas
 */
export function getActiveChatRooms() {
  return Array.from(activeChats.entries()).map(([fixtureId, users]) => ({
    fixtureId,
    activeUsers: users.size,
  }));
}

/**
 * Detecta sentimento da mensagem (análise simples)
 */
function detectSentiment(
  message: string
): "positive" | "negative" | "neutral" {
  const positiveWords = [
    "gol",
    "vitória",
    "boa",
    "excelente",
    "incrível",
    "legal",
    "top",
    "show",
    "massa",
    "perfeito",
    "amo",
    "adorei",
    "uau",
    "wow",
    "🎉",
    "😍",
    "❤️",
  ];
  const negativeWords = [
    "péssimo",
    "horrível",
    "ruim",
    "derrota",
    "odeio",
    "raiva",
    "chato",
    "decepção",
    "😡",
    "😤",
    "😭",
  ];

  const lowerMessage = message.toLowerCase();

  const positiveCount = positiveWords.filter((word) =>
    lowerMessage.includes(word)
  ).length;
  const negativeCount = negativeWords.filter((word) =>
    lowerMessage.includes(word)
  ).length;

  if (positiveCount > negativeCount) {
    return "positive";
  } else if (negativeCount > positiveCount) {
    return "negative";
  }

  return "neutral";
}

/**
 * Cria um usuário de chat
 */
export async function createChatUser(user: Omit<ChatUser, "messageCount">) {
  try {
    console.log(`✅ Usuário de chat criado: ${user.userName}`);
    return {
      success: true,
      user: {
        ...user,
        messageCount: 0,
      },
    };
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return { success: false, error: "Erro ao criar usuário" };
  }
}

/**
 * Curte uma mensagem
 */
export async function likeMessage(messageId: number, userId: string) {
  try {
    console.log(`👍 Mensagem ${messageId} curtida por ${userId}`);
    return { success: true, message: "Mensagem curtida" };
  } catch (error) {
    console.error("Erro ao curtir mensagem:", error);
    return { success: false, error: "Erro ao curtir mensagem" };
  }
}

/**
 * Bane um usuário do chat
 */
export async function banChatUser(
  userId: string,
  reason: string,
  duration?: number
) {
  try {
    const bannedUntil = duration
      ? new Date(Date.now() + duration * 1000)
      : null;

    console.log(`🚫 Usuário ${userId} banido do chat. Motivo: ${reason}`);

    return {
      success: true,
      message: `Usuário banido ${bannedUntil ? `até ${bannedUntil.toLocaleString()}` : "permanentemente"}`,
    };
  } catch (error) {
    console.error("Erro ao banir usuário:", error);
    return { success: false, error: "Erro ao banir usuário" };
  }
}
