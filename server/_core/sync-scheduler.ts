/**
 * Sync Scheduler
 * Handles automatic synchronization of Corinthians data from API-Football
 * Runs periodically to keep data up-to-date
 */

import { getDb } from "../db";
import {
  games,
  players,
  coaches,
  upcomingGames,
  rivalries,
} from "../../drizzle/schema";
import {
  getCorinthiansFixtures,
  getCorinthiansSquad,
  getHeadToHead,
} from "./api-football";
import { eq, and } from "drizzle-orm";

interface SyncResult {
  success: boolean;
  timestamp: string;
  gamesUpdated: number;
  playersUpdated: number;
  upcomingGamesUpdated: number;
  rivalriesUpdated: number;
  error?: string;
}

/**
 * Sync Corinthians data from API-Football
 */
export async function syncCorinthiansData(apiKey: string): Promise<SyncResult> {
  const timestamp = new Date().toISOString();

  try {
    const db = await getDb();
    if (!db) {
      return {
        success: false,
        timestamp,
        gamesUpdated: 0,
        playersUpdated: 0,
        upcomingGamesUpdated: 0,
        rivalriesUpdated: 0,
        error: "Database not available",
      };
    }

    const currentYear = new Date().getFullYear();

    // Fetch data from API-Football
    const [fixtures, squad] = await Promise.all([
      getCorinthiansFixtures(apiKey, currentYear, 100),
      getCorinthiansSquad(apiKey),
    ]);

    let gamesUpdated = 0;
    let playersUpdated = 0;
    let upcomingGamesUpdated = 0;
    let rivalriesUpdated = 0;

    // Update players
    if (squad.players && squad.players.length > 0) {
      for (const player of squad.players) {
        await db
          .insert(players)
          .values({
            name: player.name,
            number: player.number || 0,
            position: player.position || "Unknown",
            nationality: player.nationality || "",
            startDate: new Date().toISOString(),
            biography: `${player.firstname} ${player.lastname}`,
            games: 0,
            goals: 0,
            assists: 0,
            photoUrl: player.photo || "",
          });
      }
      playersUpdated = squad.players.length;
    }

    // Update games and upcoming games
    if (fixtures && fixtures.length > 0) {
      const now = new Date();

      for (const fixture of fixtures) {
        const fixtureDate = new Date(fixture.date);
        const isUpcoming = fixtureDate > now;

        const gameData = {
          gameDate: fixture.date,
          location: fixture.venue?.name || "Unknown",
          competition: fixture.league?.name || "Unknown",
          opponent: fixture.teams.away.id === 45 ? fixture.teams.home.name : fixture.teams.away.name,
          corinthiansScore: fixture.goals.home || 0,
          opponentScore: fixture.goals.away || 0,
          lineup: JSON.stringify({}),
          goals: JSON.stringify([]),
          description: `${fixture.league?.name} - ${fixture.status.long}`,
        };

        if (isUpcoming) {
          // Insert upcoming game
          await db
            .insert(upcomingGames)
            .values({
              ...gameData,
              status: fixture.status.short === "NS" ? "scheduled" : "postponed",
            });
          upcomingGamesUpdated++;
        } else {
          // Insert completed game
          await db
            .insert(games)
            .values(gameData);
          gamesUpdated++;
        }

        // Update rivalries
        const opponentName = fixture.teams.away.id === 45 ? fixture.teams.home.name : fixture.teams.away.name;
        const isHome = fixture.teams.home.id === 45;
        const corScore = (isHome ? fixture.goals.home : fixture.goals.away) || 0;
        const oppScore = (isHome ? fixture.goals.away : fixture.goals.home) || 0;

        const existingRivalry = await db
          .select()
          .from(rivalries)
          .where(eq(rivalries.opponent, opponentName));

        if (existingRivalry.length > 0) {
          // Update existing rivalry
          const current = existingRivalry[0];
          let newWins = current.corinthiansWins;
          let newLosses = current.corinthiansLosses;
          let newDraws = current.corinthiansDraws;

          if (corScore > oppScore) newWins++;
          else if (corScore < oppScore) newLosses++;
          else if (newDraws !== null) newDraws++; else newDraws = 1;

          await db
            .update(rivalries)
            .set({
              totalGames: (current.totalGames ?? 0) + 1,
              corinthiansWins: newWins,
              corinthiansLosses: newLosses,
              corinthiansDraws: newDraws,
              corinthiansGoals: (current.corinthiansGoals ?? 0) + corScore,
              opponentGoals: (current.opponentGoals ?? 0) + oppScore,
            })
            .where(eq(rivalries.opponent, opponentName));
        } else {
          // Create new rivalry
          let wins = 0,
            losses = 0,
            draws = 0;

          if (corScore > oppScore) wins = 1;
          else if (corScore < oppScore) losses = 1;
          else draws = 1;

          await db
            .insert(rivalries)
            .values({
              opponent: opponentName,
              totalGames: 1,
              corinthiansWins: wins,
              corinthiansLosses: losses,
              corinthiansDraws: draws,
              corinthiansGoals: corScore,
              opponentGoals: oppScore,
              homeWins: isHome && corScore > oppScore ? 1 : 0,
              awayWins: !isHome && corScore > oppScore ? 1 : 0,
              lastMeeting: fixture.date,
            });
        }

        rivalriesUpdated++;
      }
    }

    return {
      success: true,
      timestamp,
      gamesUpdated,
      playersUpdated,
      upcomingGamesUpdated,
      rivalriesUpdated,
    };
  } catch (error) {
    return {
      success: false,
      timestamp,
      gamesUpdated: 0,
      playersUpdated: 0,
      upcomingGamesUpdated: 0,
      rivalriesUpdated: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Start automatic sync scheduler
 * Syncs every 6 hours
 */
export function startSyncScheduler(apiKey: string) {
  const SYNC_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours

  // Run sync immediately on startup
  syncCorinthiansData(apiKey).then((result) => {
    console.log("[Sync Scheduler] Initial sync completed:", result);
  });

  // Schedule periodic syncs
  const intervalId = setInterval(async () => {
    const result = await syncCorinthiansData(apiKey);
    console.log("[Sync Scheduler] Periodic sync completed:", result);
  }, SYNC_INTERVAL);

  return () => clearInterval(intervalId);
}
