/**
 * Advanced API-Football Integration
 * Fetches detailed game data including cards, substitutions, player stats, etc.
 */

const API_BASE = "https://v3.football.api-sports.io";

interface GoalData {
  scorer: string;
  minute: number;
  type: string;
  assist?: string;
}

interface CardData {
  player: string;
  minute: number;
  type: "yellow" | "red";
}

interface SubstitutionData {
  playerIn: string;
  playerOut: string;
  minute: number;
}

interface PlayerStatData {
  player: string;
  position: string;
  rating: number;
  passes: number;
  shots: number;
  tackles: number;
  interceptions: number;
  fouls: number;
  yellowCards: number;
  redCards: number;
}

interface GameStatData {
  possession: number;
  shots: number;
  shotsOnTarget: number;
  passes: number;
  tackles: number;
  fouls: number;
  offsides: number;
  corners: number;
}

/**
 * Get detailed fixture data including events, statistics, and lineups
 */
export async function getDetailedFixture(fixtureId: number, apiKey: string) {
  try {
    const response = await fetch(`${API_BASE}/fixtures?id=${fixtureId}`, {
      headers: { "x-apisports-key": apiKey },
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data = await response.json();
    return data.response?.[0] || null;
  } catch (error) {
    console.error("Error fetching detailed fixture:", error);
    throw error;
  }
}

/**
 * Get fixture events (goals, cards, substitutions)
 */
export async function getFixtureEvents(fixtureId: number, apiKey: string) {
  try {
    const response = await fetch(`${API_BASE}/fixtures/events?fixture=${fixtureId}`, {
      headers: { "x-apisports-key": apiKey },
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data = await response.json();
    const events = data.response || [];

    const goals: GoalData[] = [];
    const yellowCards: CardData[] = [];
    const redCards: CardData[] = [];
    const substitutions: SubstitutionData[] = [];

    for (const event of events) {
      if (event.type === "Goal") {
        goals.push({
          scorer: event.player?.name || "Unknown",
          minute: event.time?.elapsed || 0,
          type: event.detail || "normal",
          assist: event.assist?.name,
        });
      } else if (event.type === "Card") {
        const cardData = {
          player: event.player?.name || "Unknown",
          minute: event.time?.elapsed || 0,
          type: event.detail === "Yellow Card" ? ("yellow" as const) : ("red" as const),
        };

        if (event.detail === "Yellow Card") {
          yellowCards.push(cardData);
        } else {
          redCards.push(cardData);
        }
      } else if (event.type === "subst") {
        substitutions.push({
          playerIn: event.player?.name || "Unknown",
          playerOut: event.playerOut?.name || "Unknown",
          minute: event.time?.elapsed || 0,
        });
      }
    }

    return { goals, yellowCards, redCards, substitutions };
  } catch (error) {
    console.error("Error fetching fixture events:", error);
    throw error;
  }
}

/**
 * Get fixture statistics
 */
export async function getFixtureStatistics(fixtureId: number, apiKey: string) {
  try {
    const response = await fetch(`${API_BASE}/fixtures/statistics?fixture=${fixtureId}`, {
      headers: { "x-apisports-key": apiKey },
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data = await response.json();
    const stats = data.response || [];

    const result: { home: GameStatData; away: GameStatData } = {
      home: {
        possession: 0,
        shots: 0,
        shotsOnTarget: 0,
        passes: 0,
        tackles: 0,
        fouls: 0,
        offsides: 0,
        corners: 0,
      },
      away: {
        possession: 0,
        shots: 0,
        shotsOnTarget: 0,
        passes: 0,
        tackles: 0,
        fouls: 0,
        offsides: 0,
        corners: 0,
      },
    };

    for (let i = 0; i < stats.length; i++) {
      const team = i === 0 ? "home" : "away";
      const stat = stats[i];

      for (const s of stat.statistics) {
        switch (s.type) {
          case "Possession":
            result[team].possession = parseInt(s.value) || 0;
            break;
          case "Shots on Goal":
            result[team].shots = parseInt(s.value) || 0;
            break;
          case "Shots off Goal":
            result[team].shotsOnTarget = parseInt(s.value) || 0;
            break;
          case "Total Passes":
            result[team].passes = parseInt(s.value) || 0;
            break;
          case "Tackles":
            result[team].tackles = parseInt(s.value) || 0;
            break;
          case "Fouls Committed":
            result[team].fouls = parseInt(s.value) || 0;
            break;
          case "Offsides":
            result[team].offsides = parseInt(s.value) || 0;
            break;
          case "Corner Kicks":
            result[team].corners = parseInt(s.value) || 0;
            break;
        }
      }
    }

    return result;
  } catch (error) {
    console.error("Error fetching fixture statistics:", error);
    throw error;
  }
}

/**
 * Get fixture lineups and player statistics
 */
export async function getFixtureLineups(fixtureId: number, apiKey: string) {
  try {
    const response = await fetch(`${API_BASE}/fixtures/lineups?fixture=${fixtureId}`, {
      headers: { "x-apisports-key": apiKey },
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data = await response.json();
    const lineups = data.response || [];

    const result: { home: PlayerStatData[]; away: PlayerStatData[] } = {
      home: [],
      away: [],
    };

    for (let i = 0; i < lineups.length; i++) {
      const team = i === 0 ? "home" : "away";
      const lineup = lineups[i];

      for (const player of lineup.startXI || []) {
        result[team].push({
          player: player.player?.name || "Unknown",
          position: player.player?.pos || "Unknown",
          rating: 0,
          passes: 0,
          shots: 0,
          tackles: 0,
          interceptions: 0,
          fouls: 0,
          yellowCards: 0,
          redCards: 0,
        });
      }

      for (const player of lineup.substitutes || []) {
        result[team].push({
          player: player.player?.name || "Unknown",
          position: player.player?.pos || "Unknown",
          rating: 0,
          passes: 0,
          shots: 0,
          tackles: 0,
          interceptions: 0,
          fouls: 0,
          yellowCards: 0,
          redCards: 0,
        });
      }
    }

    return result;
  } catch (error) {
    console.error("Error fetching fixture lineups:", error);
    throw error;
  }
}

/**
 * Get fixture with all detailed information
 */
export async function getCompleteFixtureData(fixtureId: number, apiKey: string) {
  try {
    const [fixture, events, statistics, lineups] = await Promise.all([
      getDetailedFixture(fixtureId, apiKey),
      getFixtureEvents(fixtureId, apiKey),
      getFixtureStatistics(fixtureId, apiKey),
      getFixtureLineups(fixtureId, apiKey),
    ]);

    return {
      fixture,
      events,
      statistics,
      lineups,
    };
  } catch (error) {
    console.error("Error fetching complete fixture data:", error);
    throw error;
  }
}

/**
 * Get player statistics for the season
 */
export async function getPlayerSeasonStats(playerId: number, season: number, apiKey: string) {
  try {
    const response = await fetch(
      `${API_BASE}/players/statistics?player=${playerId}&season=${season}&team=45`,
      {
        headers: { "x-apisports-key": apiKey },
      }
    );

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data = await response.json();
    return data.response?.[0] || null;
  } catch (error) {
    console.error("Error fetching player season stats:", error);
    throw error;
  }
}
