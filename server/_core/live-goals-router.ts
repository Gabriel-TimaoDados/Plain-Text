import { router, publicProcedure } from "./trpc";
import { z } from "zod";
import {
  startLiveGoalsMonitoring,
  stopLiveGoalsMonitoring,
  getActiveMonitors,
  stopAllMonitoring,
} from "./live-goals-monitor";

export const liveGoalsRouter = router({
  /**
   * Inicia monitoramento de gols em tempo real para uma partida
   */
  start: publicProcedure
    .input(z.object({ fixtureId: z.number() }))
    .mutation(async ({ input }) => {
      startLiveGoalsMonitoring(input.fixtureId);
      return {
        success: true,
        message: `Monitoramento iniciado para fixture ${input.fixtureId}`,
      };
    }),

  /**
   * Para monitoramento de gols para uma partida
   */
  stop: publicProcedure
    .input(z.object({ fixtureId: z.number() }))
    .mutation(async ({ input }) => {
      stopLiveGoalsMonitoring(input.fixtureId);
      return {
        success: true,
        message: `Monitoramento parado para fixture ${input.fixtureId}`,
      };
    }),

  /**
   * Retorna status de todos os monitoramentos ativos
   */
  status: publicProcedure.query(async () => {
    const monitors = getActiveMonitors();
    return {
      activeCount: monitors.length,
      monitors,
    };
  }),

  /**
   * Para todos os monitoramentos
   */
  stopAll: publicProcedure.mutation(async () => {
    stopAllMonitoring();
    return {
      success: true,
      message: "Todos os monitoramentos foram parados",
    };
  }),
});
