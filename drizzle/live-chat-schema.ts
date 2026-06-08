import { mysqlTable, varchar, text, timestamp, int, boolean } from "drizzle-orm/mysql-core";

/**
 * Tabela para armazenar mensagens do live chat durante partidas
 */
export const liveChatMessages = mysqlTable("live_chat_messages", {
  id: int().primaryKey().autoincrement(),
  fixtureId: int().notNull(), // ID da partida
  userId: varchar({ length: 255 }).notNull(), // ID do usuário (anônimo ou autenticado)
  userName: varchar({ length: 255 }).notNull(), // Nome do usuário
  message: text().notNull(), // Conteúdo da mensagem
  type: varchar({ length: 50 }).default("message"), // "message", "goal", "card", "substitution"
  sentiment: varchar({ length: 50 }).default("neutral"), // "positive", "negative", "neutral"
  likes: int().default(0), // Número de curtidas
  isVerified: boolean().default(false), // Se é um usuário verificado
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow().onUpdateNow(),
});

/**
 * Tabela para armazenar reações a mensagens (curtidas, etc)
 */
export const chatMessageReactions = mysqlTable("chat_message_reactions", {
  id: int().primaryKey().autoincrement(),
  messageId: int().notNull(), // ID da mensagem
  userId: varchar({ length: 255 }).notNull(), // ID do usuário que reagiu
  reactionType: varchar({ length: 50 }).default("like"), // "like", "love", "haha", "wow", "sad", "angry"
  createdAt: timestamp().defaultNow(),
});

/**
 * Tabela para armazenar usuários do chat (perfis)
 */
export const chatUsers = mysqlTable("chat_users", {
  id: varchar({ length: 255 }).primaryKey(),
  userName: varchar({ length: 255 }).notNull().unique(),
  avatar: varchar({ length: 500 }), // URL do avatar
  isVerified: boolean().default(false),
  isModerator: boolean().default(false),
  messageCount: int().default(0), // Total de mensagens enviadas
  joinedAt: timestamp().defaultNow(),
  lastActiveAt: timestamp().defaultNow().onUpdateNow(),
});

/**
 * Tabela para armazenar banimentos/silenciamentos
 */
export const chatBans = mysqlTable("chat_bans", {
  id: int().primaryKey().autoincrement(),
  userId: varchar({ length: 255 }).notNull(),
  reason: text(),
  bannedUntil: timestamp(), // null = permanente
  createdAt: timestamp().defaultNow(),
});
