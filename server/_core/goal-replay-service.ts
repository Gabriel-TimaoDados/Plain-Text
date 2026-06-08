import { getDb } from "../db";
import { games, players } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export interface GoalReplay {
  id: string;
  fixtureId: number;
  playerName: string;
  minute: string;
  type: "normal" | "penalty" | "own_goal";
  opponent: string;
  gameDate: string;
  corinthiansScore: number;
  opponentScore: number;
  playerStats?: {
    totalGoals: number;
    totalGames: number;
    goalsThisSeason: number;
  };
}

/**
 * Busca replays de gols de um jogo específico
 */
export async function getGameGoalReplays(
  fixtureId: number
): Promise<GoalReplay[]> {
  try {
    const db = getDb();

    const game = await db.query.games.findFirst({
      where: eq(games.fixtureId, fixtureId),
    });

    if (!game) {
      return [];
    }

    const goalsData = game.goals ? JSON.parse(game.goals) : [];
    const corinthiansGoals = goalsData.filter(
      (goal: any) => goal.team === "Corinthians"
    );

    const replays: GoalReplay[] = [];

    for (const goal of corinthiansGoals) {
      // Busca estatísticas do jogador
      const player = await db.query.players.findFirst({
        where: eq(players.name, goal.playerName || ""),
      });

      replays.push({
        id: `${fixtureId}-${goal.minute}`,
        fixtureId,
        playerName: goal.playerName || "Corinthians",
        minute: goal.minute || "?",
        type: goal.type || "normal",
        opponent: game.opponent || "Adversário",
        gameDate: game.gameDate || new Date().toISOString(),
        corinthiansScore: game.corinthiansScore || 0,
        opponentScore: game.opponentScore || 0,
        playerStats: player
          ? {
              totalGoals: player.goals || 0,
              totalGames: player.games || 0,
              goalsThisSeason: 0, // Seria calculado com mais dados
            }
          : undefined,
      });
    }

    return replays;
  } catch (error) {
    console.error("Erro ao buscar replays de gols:", error);
    return [];
  }
}

/**
 * Busca replays de gols recentes (últimos 7 dias)
 */
export async function getRecentGoalReplays(): Promise<GoalReplay[]> {
  try {
    const db = getDb();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentGames = await db.query.games.findMany({
      where: (games, { gte }) =>
        gte(games.gameDate, sevenDaysAgo.toISOString()),
    });

    const allReplays: GoalReplay[] = [];

    for (const game of recentGames) {
      const goalsData = game.goals ? JSON.parse(game.goals) : [];
      const corinthiansGoals = goalsData.filter(
        (goal: any) => goal.team === "Corinthians"
      );

      for (const goal of corinthiansGoals) {
        const player = await db.query.players.findFirst({
          where: eq(players.name, goal.playerName || ""),
        });

        allReplays.push({
          id: `${game.fixtureId}-${goal.minute}`,
          fixtureId: game.fixtureId || 0,
          playerName: goal.playerName || "Corinthians",
          minute: goal.minute || "?",
          type: goal.type || "normal",
          opponent: game.opponent || "Adversário",
          gameDate: game.gameDate || new Date().toISOString(),
          corinthiansScore: game.corinthiansScore || 0,
          opponentScore: game.opponentScore || 0,
          playerStats: player
            ? {
                totalGoals: player.goals || 0,
                totalGames: player.games || 0,
                goalsThisSeason: 0,
              }
            : undefined,
        });
      }
    }

    // Ordena por data mais recente
    return allReplays.sort(
      (a, b) =>
        new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime()
    );
  } catch (error) {
    console.error("Erro ao buscar replays recentes:", error);
    return [];
  }
}

/**
 * Busca replays de gols de um jogador específico
 */
export async function getPlayerGoalReplays(
  playerName: string
): Promise<GoalReplay[]> {
  try {
    const db = getDb();

    const allGames = await db.query.games.findMany();
    const playerReplays: GoalReplay[] = [];

    for (const game of allGames) {
      const goalsData = game.goals ? JSON.parse(game.goals) : [];
      const playerGoals = goalsData.filter(
        (goal: any) =>
          goal.team === "Corinthians" && goal.playerName === playerName
      );

      for (const goal of playerGoals) {
        const player = await db.query.players.findFirst({
          where: eq(players.name, playerName),
        });

        playerReplays.push({
          id: `${game.fixtureId}-${goal.minute}`,
          fixtureId: game.fixtureId || 0,
          playerName,
          minute: goal.minute || "?",
          type: goal.type || "normal",
          opponent: game.opponent || "Adversário",
          gameDate: game.gameDate || new Date().toISOString(),
          corinthiansScore: game.corinthiansScore || 0,
          opponentScore: game.opponentScore || 0,
          playerStats: player
            ? {
                totalGoals: player.goals || 0,
                totalGames: player.games || 0,
                goalsThisSeason: 0,
              }
            : undefined,
        });
      }
    }

    return playerReplays.sort(
      (a, b) =>
        new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime()
    );
  } catch (error) {
    console.error("Erro ao buscar replays do jogador:", error);
    return [];
  }
}

/**
 * Busca estatísticas de gols por período
 */
export async function getGoalStatsByPeriod(
  startDate: string,
  endDate: string
): Promise<{
  totalGoals: number;
  topScorers: Array<{ playerName: string; goals: number }>;
  averageGoalsPerGame: number;
}> {
  try {
    const db = getDb();

    const games = await db.query.games.findMany();

    const filteredGames = games.filter((game) => {
      const gameDate = new Date(game.gameDate || "");
      return (
        gameDate >= new Date(startDate) && gameDate <= new Date(endDate)
      );
    });

    let totalGoals = 0;
    const scorerMap = new Map<string, number>();

    for (const game of filteredGames) {
      const goalsData = game.goals ? JSON.parse(game.goals) : [];
      const corinthiansGoals = goalsData.filter(
        (goal: any) => goal.team === "Corinthians"
      );

      totalGoals += corinthiansGoals.length;

      for (const goal of corinthiansGoals) {
        const playerName = goal.playerName || "Corinthians";
        scorerMap.set(playerName, (scorerMap.get(playerName) || 0) + 1);
      }
    }

    const topScorers = Array.from(scorerMap.entries())
      .map(([playerName, goals]) => ({ playerName, goals }))
      .sort((a, b) => b.goals - a.goals)
      .slice(0, 10);

    const averageGoalsPerGame =
      filteredGames.length > 0 ? totalGoals / filteredGames.length : 0;

    return {
      totalGoals,
      topScorers,
      averageGoalsPerGame,
    };
  } catch (error) {
    console.error("Erro ao buscar estatísticas de gols:", error);
    return {
      totalGoals: 0,
      topScorers: [],
      averageGoalsPerGame: 0,
    };
  }
}
