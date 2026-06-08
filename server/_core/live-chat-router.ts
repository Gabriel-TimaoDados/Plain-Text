import { router, publicProcedure } from "./trpc";
import { z } from "zod";
import {
  startChatRoom,
  endChatRoom,
  joinChatRoom,
  leaveChatRoom,
  sendChatMessage,
  getChatMessages,
  getActiveUsers,
  getActiveChatRooms,
  createChatUser,
  likeMessage,
  banChatUser,
} from "./live-chat-service";

export const liveChatRouter = router({
  /**
   * Inicia uma sala de chat para uma partida
   */
  startRoom: publicProcedure
    .input(z.object({ fixtureId: z.number() }))
    .mutation(async ({ input }) => {
      startChatRoom(input.fixtureId);
      return {
        success: true,
        message: `Sala de chat iniciada para fixture ${input.fixtureId}`,
      };
    }),

  /**
   * Encerra uma sala de chat
   */
  endRoom: publicProcedure
    .input(z.object({ fixtureId: z.number() }))
    .mutation(async ({ input }) => {
      endChatRoom(input.fixtureId);
      return {
        success: true,
        message: `Sala de chat encerrada para fixture ${input.fixtureId}`,
      };
    }),

  /**
   * Usuário entra na sala de chat
   */
  join: publicProcedure
    .input(
      z.object({
        fixtureId: z.number(),
        userId: z.string(),
        userName: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return joinChatRoom(input.fixtureId, input.userId, input.userName);
    }),

  /**
   * Usuário sai da sala de chat
   */
  leave: publicProcedure
    .input(
      z.object({
        fixtureId: z.number(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      leaveChatRoom(input.fixtureId, input.userId);
      return { success: true, message: "Você saiu da sala" };
    }),

  /**
   * Envia uma mensagem no chat
   */
  sendMessage: publicProcedure
    .input(
      z.object({
        fixtureId: z.number(),
        userId: z.string(),
        userName: z.string(),
        message: z.string(),
        type: z.enum(["message", "goal", "card", "substitution"]).optional(),
        isVerified: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return sendChatMessage({
        fixtureId: input.fixtureId,
        userId: input.userId,
        userName: input.userName,
        message: input.message,
        type: input.type || "message",
        sentiment: "neutral",
        likes: 0,
        isVerified: input.isVerified || false,
      });
    }),

  /**
   * Busca mensagens recentes
   */
  getMessages: publicProcedure
    .input(z.object({ fixtureId: z.number(), limit: z.number().optional() }))
    .query(async ({ input }) => {
      const messages = await getChatMessages(input.fixtureId, input.limit);
      return { messages, count: messages.length };
    }),

  /**
   * Retorna usuários ativos na sala
   */
  getActiveUsers: publicProcedure
    .input(z.object({ fixtureId: z.number() }))
    .query(async ({ input }) => {
      const users = getActiveUsers(input.fixtureId);
      return { users, count: users.length };
    }),

  /**
   * Retorna todas as salas ativas
   */
  getActiveChatRooms: publicProcedure.query(async () => {
    const rooms = getActiveChatRooms();
    return { rooms, count: rooms.length };
  }),

  /**
   * Cria um usuário de chat
   */
  createUser: publicProcedure
    .input(
      z.object({
        id: z.string(),
        userName: z.string(),
        avatar: z.string().optional(),
        isVerified: z.boolean().optional(),
        isModerator: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return createChatUser({
        id: input.id,
        userName: input.userName,
        avatar: input.avatar,
        isVerified: input.isVerified || false,
        isModerator: input.isModerator || false,
      });
    }),

  /**
   * Curte uma mensagem
   */
  likeMessage: publicProcedure
    .input(z.object({ messageId: z.number(), userId: z.string() }))
    .mutation(async ({ input }) => {
      return likeMessage(input.messageId, input.userId);
    }),

  /**
   * Bane um usuário do chat
   */
  banUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        reason: z.string(),
        duration: z.number().optional(), // em segundos
      })
    )
    .mutation(async ({ input }) => {
      return banChatUser(input.userId, input.reason, input.duration);
    }),
});
