import { router, publicProcedure } from "./trpc";
import { z } from "zod";
import {
  startRedCardMonitoring,
  stopRedCardMonitoring,
  getActiveRedCardMonitors,
  stopAllRedCardMonitoring,
} from "./red-card-monitor";

export const redCardRouter = router({
  /**
   * Inicia monitoramento de cartões para uma partida
   */
  start: publicProcedure
    .input(z.object({ fixtureId: z.number() }))
    .mutation(async ({ input }) => {
      startRedCardMonitoring(input.fixtureId);
      return {
        success: true,
        message: `Monitoramento de cartões iniciado para fixture ${input.fixtureId}`,
      };
    }),

  /**
   * Para monitoramento de cartões para uma partida
   */
  stop: publicProcedure
    .input(z.object({ fixtureId: z.number() }))
    .mutation(async ({ input }) => {
      stopRedCardMonitoring(input.fixtureId);
      return {
        success: true,
        message: `Monitoramento de cartões parado para fixture ${input.fixtureId}`,
      };
    }),

  /**
   * Retorna status de todos os monitoramentos ativos
   */
  status: publicProcedure.query(async () => {
    const monitors = getActiveRedCardMonitors();
    return {
      activeCount: monitors.length,
      monitors,
    };
  }),

  /**
   * Para todos os monitoramentos
   */
  stopAll: publicProcedure.mutation(async () => {
    stopAllRedCardMonitoring();
    return {
      success: true,
      message: "Todos os monitoramentos de cartões foram parados",
    };
  }),
});
