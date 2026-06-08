/**
 * API-Football Integration Service
 * Handles all interactions with the API-Football API
 * Fetches Corinthians team data, fixtures, players, and statistics
 */

const API_BASE_URL = "https://v3.football.api-sports.io";
const CORINTHIANS_TEAM_ID = 45;

interface ApiFootballResponse<T> {
  get: string;
  parameters: Record<string, unknown>;
  errors: string[];
  results: number;
  response: T;
}

interface Team {
  id: number;
  name: string;
  code: string;
  country: string;
  founded: number;
  national: boolean;
  logo: string;
}

interface Fixture {
  id: number;
  referee: string | null;
  timezone: string;
  date: string;
  timestamp: number;
  periods: {
    first: number | null;
    second: number | null;
  };
  venue: {
    id: number;
    name: string;
    city: string;
  };
  status: {
    long: string;
    short: string;
    elapsed: number | null;
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
    round: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
    away: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: {
      home: number | null;
      away: number | null;
    };
    fulltime: {
      home: number | null;
      away: number | null;
    };
    extratime: {
      home: number | null;
      away: number | null;
    };
    penalty: {
      home: number | null;
      away: number | null;
    };
  };
}

interface Player {
  id: number;
  name: string;
  firstname: string;
  lastname: string;
  age: number;
  birth: {
    date: string;
    country: string;
    city: string | null;
  };
  nationality: string;
  height: string;
  weight: string;
  injured: boolean;
  photo: string;
}

interface Squad {
  team: Team;
  players: Array<Player & { number: number; position: string }>;
}

/**
 * Fetch Corinthians team information
 */
export async function getCorinthiansTeam(apiKey: string): Promise<Team> {
  const response = await fetch(
    `${API_BASE_URL}/teams?id=${CORINTHIANS_TEAM_ID}`,
    {
      method: "GET",
      headers: {
        "x-apisports-key": apiKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Corinthians team: ${response.statusText}`);
  }

  const data: ApiFootballResponse<Array<{ team: Team }>> =
    await response.json();

  if (data.response.length === 0) {
    throw new Error("Corinthians team not found");
  }

  return data.response[0].team;
}

/**
 * Fetch Corinthians fixtures for a specific season
 */
export async function getCorinthiansFixtures(
  apiKey: string,
  season: number,
  limit: number = 50
): Promise<Fixture[]> {
  const response = await fetch(
    `${API_BASE_URL}/fixtures?team=${CORINTHIANS_TEAM_ID}&season=${season}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "x-apisports-key": apiKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch fixtures: ${response.statusText}`);
  }

  const data: ApiFootballResponse<Fixture[]> = await response.json();
  return data.response;
}

/**
 * Fetch Corinthians squad/players
 */
export async function getCorinthiansSquad(apiKey: string): Promise<Squad> {
  const response = await fetch(
    `${API_BASE_URL}/players/squads?team=${CORINTHIANS_TEAM_ID}`,
    {
      method: "GET",
      headers: {
        "x-apisports-key": apiKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch squad: ${response.statusText}`);
  }

  const data: ApiFootballResponse<Squad[]> = await response.json();

  if (data.response.length === 0) {
    throw new Error("Squad not found");
  }

  return data.response[0];
}

/**
 * Fetch fixture details including lineups and events
 */
export async function getFixtureDetails(
  apiKey: string,
  fixtureId: number
): Promise<{
  fixture: Fixture;
  lineups: unknown;
  events: unknown;
  statistics: unknown;
}> {
  const response = await fetch(
    `${API_BASE_URL}/fixtures?id=${fixtureId}`,
    {
      method: "GET",
      headers: {
        "x-apisports-key": apiKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch fixture details: ${response.statusText}`);
  }

  const data: ApiFootballResponse<Fixture[]> = await response.json();

  if (data.response.length === 0) {
    throw new Error("Fixture not found");
  }

  // Fetch additional details
  const [lineups, events, statistics] = await Promise.all([
    fetch(`${API_BASE_URL}/fixtures/lineups?fixture=${fixtureId}`, {
      headers: { "x-apisports-key": apiKey },
    }).then((r) => r.json()),
    fetch(`${API_BASE_URL}/fixtures/events?fixture=${fixtureId}`, {
      headers: { "x-apisports-key": apiKey },
    }).then((r) => r.json()),
    fetch(`${API_BASE_URL}/fixtures/statistics?fixture=${fixtureId}`, {
      headers: { "x-apisports-key": apiKey },
    }).then((r) => r.json()),
  ]);

  return {
    fixture: data.response[0],
    lineups: lineups.response,
    events: events.response,
    statistics: statistics.response,
  };
}

/**
 * Fetch head-to-head statistics between two teams
 */
export async function getHeadToHead(
  apiKey: string,
  opponentTeamId: number,
  limit: number = 10
): Promise<Fixture[]> {
  const response = await fetch(
    `${API_BASE_URL}/fixtures/headtohead?h2h=${CORINTHIANS_TEAM_ID}-${opponentTeamId}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "x-apisports-key": apiKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch head-to-head: ${response.statusText}`);
  }

  const data: ApiFootballResponse<Fixture[]> = await response.json();
  return data.response;
}
