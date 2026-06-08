/**
 * Auto Sync Router
 * Rotas tRPC para controlar sincronização automática
 */

import { z } from "zod";
import { publicProcedure, router } from "./trpc";
import {
  startAutoSync,
  stopAutoSync,
  getSyncStatus,
  setSyncInterval,
} from "./auto-sync-service";

export const autoSyncRouter = router({
  /**
   * Iniciar sincronização automática
   */
  start: publicProcedure
    .input(
      z.object({
        intervalMinutes: z.number().min(5).max(1440).optional().default(360),
      })
    )
    .mutation(async ({ input }) => {
      const apiKey = process.env.EXPO_PUBLIC_API_FOOTBALL_KEY;
      if (!apiKey) {
        throw new Error("API Key não configurada");
      }

      await startAutoSync(apiKey, input.intervalMinutes);

      return {
        success: true,
        message: `Sincronização automática iniciada a cada ${input.intervalMinutes} minutos`,
      };
    }),

  /**
   * Parar sincronização automática
   */
  stop: publicProcedure.mutation(async () => {
    stopAutoSync();

    return {
      success: true,
      message: "Sincronização automática parada",
    };
  }),

  /**
   * Obter status da sincronização
   */
  status: publicProcedure.query(async () => {
    const status = getSyncStatus();

    return {
      isRunning: status.isRunning,
      lastSync: status.lastSync?.toISOString(),
      nextSync: status.nextSync?.toISOString(),
      syncInterval: status.syncInterval,
      lastError: status.lastError,
    };
  }),

  /**
   * Alterar intervalo de sincronização
   */
  setInterval: publicProcedure
    .input(
      z.object({
        minutes: z.number().min(5).max(1440),
      })
    )
    .mutation(async ({ input }) => {
      setSyncInterval(input.minutes);

      return {
        success: true,
        message: `Intervalo de sincronização alterado para ${input.minutes} minutos`,
      };
    }),
});
