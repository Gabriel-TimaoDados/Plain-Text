import { router, publicProcedure } from "./trpc";
import { z } from "zod";
import {
  getGameGoalReplays,
  getRecentGoalReplays,
  getPlayerGoalReplays,
  getGoalStatsByPeriod,
} from "./goal-replay-service";

export const goalReplayRouter = router({
  /**
   * Busca replays de gols de um jogo específico
   */
  byGame: publicProcedure
    .input(z.object({ fixtureId: z.number() }))
    .query(async ({ input }) => {
      const replays = await getGameGoalReplays(input.fixtureId);
      return {
        count: replays.length,
        replays,
      };
    }),

  /**
   * Busca replays de gols recentes (últimos 7 dias)
   */
  recent: publicProcedure.query(async () => {
    const replays = await getRecentGoalReplays();
    return {
      count: replays.length,
      replays,
    };
  }),

  /**
   * Busca replays de gols de um jogador específico
   */
  byPlayer: publicProcedure
    .input(z.object({ playerName: z.string() }))
    .query(async ({ input }) => {
      const replays = await getPlayerGoalReplays(input.playerName);
      return {
        count: replays.length,
        replays,
      };
    }),

  /**
   * Busca estatísticas de gols por período
   */
  statsByPeriod: publicProcedure
    .input(
      z.object({
        startDate: z.string(),
        endDate: z.string(),
      })
    )
    .query(async ({ input }) => {
      const stats = await getGoalStatsByPeriod(input.startDate, input.endDate);
      return stats;
    }),
});
