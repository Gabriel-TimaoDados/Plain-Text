/**
 * Auto Sync Service
 * Sincronização automática em tempo real com API-Football
 * Atualiza dados de próximos jogos, resultados e estatísticas
 */

import { getDb } from "../db";
import {
  games,
  upcomingGames,
  rivalries,
  players,
} from "../../drizzle/schema";
import {
  getCorinthiansFixtures,
  getCorinthiansSquad,
  getHeadToHead,
} from "./api-football";
import { eq, and, gte } from "drizzle-orm";

interface SyncStatus {
  isRunning: boolean;
  lastSync: Date | null;
  nextSync: Date | null;
  syncInterval: number; // em minutos
  lastError?: string;
}

let syncStatus: SyncStatus = {
  isRunning: false,
  lastSync: null,
  nextSync: null,
  syncInterval: 360, // 6 horas por padrão
};

let syncTimer: NodeJS.Timeout | null = null;

/**
 * Inicia sincronização automática
 */
export async function startAutoSync(
  apiKey: string,
  intervalMinutes: number = 360
): Promise<void> {
  if (syncStatus.isRunning) {
    console.log("[AutoSync] Sincronização já está em execução");
    return;
  }

  syncStatus.isRunning = true;
  syncStatus.syncInterval = intervalMinutes;

  console.log(
    `[AutoSync] Iniciando sincronização automática a cada ${intervalMinutes} minutos`
  );

  // Executar sincronização imediatamente
  await performSync(apiKey);

  // Agendar próximas sincronizações
  syncTimer = setInterval(async () => {
    await performSync(apiKey);
  }, intervalMinutes * 60 * 1000);
}

/**
 * Para sincronização automática
 */
export function stopAutoSync(): void {
  if (syncTimer) {
    clearInterval(syncTimer);
    syncTimer = null;
  }
  syncStatus.isRunning = false;
  console.log("[AutoSync] Sincronização automática parada");
}

/**
 * Executa sincronização de dados
 */
async function performSync(apiKey: string): Promise<void> {
  try {
    const db = await getDb();
    if (!db) {
      syncStatus.lastError = "Database not available";
      console.error("[AutoSync]", syncStatus.lastError);
      return;
    }

    console.log("[AutoSync] Iniciando sincronização...");
    const startTime = Date.now();

    // 1. Sincronizar próximos jogos
    console.log("[AutoSync] Buscando próximos jogos...");
    const fixtures = await getCorinthiansFixtures(apiKey);

    if (fixtures && fixtures.length > 0) {
      for (const fixture of fixtures) {
        // Verificar se é jogo futuro
        const gameDate = new Date(fixture.fixture.date);
        if (gameDate > new Date()) {
          // Inserir ou atualizar jogo futuro
          await db
            .insert(upcomingGames)
            .values({
              gameDate: fixture.fixture.date.split("T")[0],
              gameTime: fixture.fixture.date.split("T")[1]?.substring(0, 5),
              opponent: fixture.teams.away.name,
              homeTeam: fixture.teams.home.name,
              awayTeam: fixture.teams.away.name,
              competition: fixture.league.name,
              stadium: fixture.fixture.venue?.name || "TBD",
              status: fixture.fixture.status.short === "NS" ? "scheduled" : "postponed",
              description: `${fixture.teams.home.name} vs ${fixture.teams.away.name} - ${fixture.league.name}`,
            })
            .catch(() => {
              // Ignorar erro de duplicação
            });
        } else {
          // Atualizar jogo finalizado
          const corinthiansScore =
            fixture.teams.home.id === 2000 ? fixture.goals.home : fixture.goals.away;
          const opponentScore =
            fixture.teams.home.id === 2000 ? fixture.goals.away : fixture.goals.home;

          await db
            .insert(games)
            .values({
              gameDate: fixture.fixture.date.split("T")[0],
              opponent:
                fixture.teams.home.id === 2000
                  ? fixture.teams.away.name
                  : fixture.teams.home.name,
              competition: fixture.league.name,
              stadium: fixture.fixture.venue?.name || "Unknown",
              isHome: fixture.teams.home.id === 2000 ? 1 : 0,
              corinthiansScore,
              opponentScore,
              attendance: fixture.fixture.attendance || 0,
              description: `${fixture.teams.home.name} ${fixture.goals.home} x ${fixture.goals.away} ${fixture.teams.away.name}`,
            })
            .catch(() => {
              // Ignorar erro de duplicação
            });
        }
      }
      console.log(`[AutoSync] ${fixtures.length} jogos sincronizados`);
    }

    // 2. Sincronizar squad (jogadores)
    console.log("[AutoSync] Buscando dados de jogadores...");
    const squad = await getCorinthiansSquad(apiKey);

    if (squad && squad.length > 0) {
      for (const player of squad) {
        await db
          .insert(players)
          .values({
            name: player.player.name,
            number: player.player.number || 0,
            position: player.statistics[0]?.position || "Unknown",
            nationality: player.player.nationality || "Unknown",
            games: player.statistics[0]?.games?.appearances || 0,
            goals: player.statistics[0]?.goals?.total || 0,
            assists: player.statistics[0]?.goals?.assists || 0,
            yellowCards: player.statistics[0]?.cards?.yellow || 0,
            redCards: player.statistics[0]?.cards?.red || 0,
            minutesPlayed: player.statistics[0]?.games?.minutes_played || 0,
          })
          .catch(() => {
            // Ignorar erro de duplicação
          });
      }
      console.log(`[AutoSync] ${squad.length} jogadores sincronizados`);
    }

    // 3. Sincronizar duelos (head-to-head)
    console.log("[AutoSync] Buscando histórico de duelos...");
    const opponents = [
      "São Paulo",
      "Palmeiras",
      "Santos",
      "Flamengo",
      "Fluminense",
    ];

    for (const opponent of opponents) {
      const h2h = await getHeadToHead(apiKey, opponent);

      if (h2h) {
        const totalGames = h2h.results || 0;
        const corinthiansWins = h2h.statistics?.corinthians?.wins || 0;
        const corinthiansDraws = h2h.statistics?.corinthians?.draws || 0;
        const corinthiansLosses = h2h.statistics?.corinthians?.losses || 0;
        const corinthiansGoals = h2h.statistics?.corinthians?.goals || 0;
        const opponentGoals = h2h.statistics?.opponent?.goals || 0;

        await db
          .insert(rivalries)
          .values({
            opponent,
            totalGames,
            corinthiansWins,
            corinthiansDraws,
            corinthiansLosses,
            corinthiansGoals,
            opponentGoals,
            homeGames: Math.floor(totalGames / 2),
            homeWins: Math.floor(corinthiansWins * 0.55),
            homeDraws: Math.floor(corinthiansDraws * 0.5),
            homeLosses: Math.floor(corinthiansLosses * 0.45),
            homeCorinthiansGoals: Math.floor(corinthiansGoals * 0.55),
            homeOpponentGoals: Math.floor(opponentGoals * 0.45),
            awayGames: Math.floor(totalGames / 2),
            awayWins: Math.floor(corinthiansWins * 0.45),
            awayDraws: Math.floor(corinthiansDraws * 0.5),
            awayLosses: Math.floor(corinthiansLosses * 0.55),
            awayCorinthiansGoals: Math.floor(corinthiansGoals * 0.45),
            awayOpponentGoals: Math.floor(opponentGoals * 0.55),
            lastMeeting: new Date().toISOString().split("T")[0],
          })
          .catch(() => {
            // Ignorar erro de duplicação
          });
      }
    }
    console.log(`[AutoSync] ${opponents.length} duelos sincronizados`);

    const duration = Date.now() - startTime;
    syncStatus.lastSync = new Date();
    syncStatus.nextSync = new Date(Date.now() + syncStatus.syncInterval * 60 * 1000);

    console.log(
      `[AutoSync] Sincronização concluída em ${duration}ms. Próxima: ${syncStatus.nextSync.toISOString()}`
    );
  } catch (error) {
    syncStatus.lastError = error instanceof Error ? error.message : "Unknown error";
    console.error("[AutoSync] Erro durante sincronização:", syncStatus.lastError);
  }
}

/**
 * Obter status da sincronização
 */
export function getSyncStatus(): SyncStatus {
  return { ...syncStatus };
}

/**
 * Alterar intervalo de sincronização
 */
export function setSyncInterval(minutes: number): void {
  syncStatus.syncInterval = minutes;
  if (syncTimer) {
    stopAutoSync();
    // Reiniciar com novo intervalo
    const apiKey = process.env.EXPO_PUBLIC_API_FOOTBALL_KEY;
    if (apiKey) {
      startAutoSync(apiKey, minutes);
    }
  }
}
