import { useState, useEffect, useCallback } from "react";

export interface SeasonStats {
  matches: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

interface RawSeasonData {
  fixtures?: {
    played: number;
    wins: number;
    draws: number;
    losses: number;
  };
  goals?: {
    for: { total: number };
    against: { total: number };
  };
  points?: number;
}

/**
 * Hook para buscar dados reais de temporada do Corinthians
 */
export function useSeasonData(season: number = 2024) {
  const [data, setData] = useState<SeasonStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSeasonData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Em produção, fazer chamada para API-Football
      // GET https://api-football-v1.p.rapidapi.com/v3/teams/statistics?season=2024&team=87 (Corinthians)

      // Mock data - substitua com chamada real
      const mockData: Record<number, SeasonStats> = {
        2024: {
          matches: 28,
          wins: 16,
          draws: 6,
          losses: 6,
          goalsFor: 48,
          goalsAgainst: 28,
          goalDifference: 20,
          points: 54,
        },
        2023: {
          matches: 38,
          wins: 20,
          draws: 8,
          losses: 10,
          goalsFor: 62,
          goalsAgainst: 42,
          goalDifference: 20,
          points: 68,
        },
        2022: {
          matches: 38,
          wins: 18,
          draws: 7,
          losses: 13,
          goalsFor: 56,
          goalsAgainst: 48,
          goalDifference: 8,
          points: 61,
        },
      };

      const seasonData = mockData[season];

      if (seasonData) {
        setData(seasonData);
      } else {
        setError(`Dados da temporada ${season} não encontrados`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar dados");
      console.error("Erro ao buscar dados de temporada:", err);
    } finally {
      setLoading(false);
    }
  }, [season]);

  useEffect(() => {
    fetchSeasonData();
  }, [fetchSeasonData]);

  return { data, loading, error, refetch: fetchSeasonData };
}

/**
 * Hook para buscar dados de múltiplas temporadas
 */
export function useMultipleSeasons(seasons: number[] = [2024, 2023, 2022]) {
  const [data, setData] = useState<Record<number, SeasonStats>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllSeasons = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const seasonDataMap: Record<number, SeasonStats> = {};

      // Mock data
      const mockData: Record<number, SeasonStats> = {
        2024: {
          matches: 28,
          wins: 16,
          draws: 6,
          losses: 6,
          goalsFor: 48,
          goalsAgainst: 28,
          goalDifference: 20,
          points: 54,
        },
        2023: {
          matches: 38,
          wins: 20,
          draws: 8,
          losses: 10,
          goalsFor: 62,
          goalsAgainst: 42,
          goalDifference: 20,
          points: 68,
        },
        2022: {
          matches: 38,
          wins: 18,
          draws: 7,
          losses: 13,
          goalsFor: 56,
          goalsAgainst: 48,
          goalDifference: 8,
          points: 61,
        },
      };

      for (const season of seasons) {
        if (mockData[season]) {
          seasonDataMap[season] = mockData[season];
        }
      }

      setData(seasonDataMap);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar dados");
      console.error("Erro ao buscar múltiplas temporadas:", err);
    } finally {
      setLoading(false);
    }
  }, [seasons]);

  useEffect(() => {
    fetchAllSeasons();
  }, [fetchAllSeasons]);

  return { data, loading, error, refetch: fetchAllSeasons };
}

/**
 * Transforma dados brutos da API em formato padronizado
 */
export function transformSeasonData(rawData: RawSeasonData): SeasonStats {
  const fixtures = rawData.fixtures || { played: 0, wins: 0, draws: 0, losses: 0 };
  const goals = rawData.goals || { for: { total: 0 }, against: { total: 0 } };
  const points = rawData.points || 0;

  const goalsFor = goals.for?.total || 0;
  const goalsAgainst = goals.against?.total || 0;

  return {
    matches: fixtures.played || 0,
    wins: fixtures.wins || 0,
    draws: fixtures.draws || 0,
    losses: fixtures.losses || 0,
    goalsFor,
    goalsAgainst,
    goalDifference: goalsFor - goalsAgainst,
    points,
  };
}
