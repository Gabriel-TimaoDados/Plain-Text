import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

interface LiveGame {
  id: number;
  opponent: string;
  corinthiansScore: number;
  opponentScore: number;
  status: "live" | "upcoming" | "finished";
  minute?: number;
  stadium?: string;
  competition?: string;
  isHome: boolean;
  gameDate: string;
  fixtureId?: number;
}

interface GoalEvent {
  playerName: string;
  minute: number;
  team: "Corinthians" | "Opponent";
  isNewGoal: boolean;
}

/**
 * Hook para gerenciar dados de partidas ao vivo com integração API-Football
 * Busca a próxima partida do Corinthians (ao vivo ou próxima)
 */
export function useLiveGames() {
  const [currentGame, setCurrentGame] = useState<LiveGame | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastGoalCount, setLastGoalCount] = useState(0);
  const [goalEvent, setGoalEvent] = useState<GoalEvent | null>(null);
  const previousScoreRef = useRef({ corinthians: 0, opponent: 0 });

  // Buscar dados da API-Football
  const fetchLiveGames = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Tentar buscar dados reais da API-Football
      const apiKey = process.env.EXPO_PUBLIC_FOOTBALL_API_KEY;

      if (apiKey) {
        try {
          // Buscar fixtures do Corinthians (ID: 87)
          const response = await axios.get(
            "https://api-football-v1.p.rapidapi.com/v3/fixtures",
            {
              params: {
                team: 87, // Corinthians
                season: new Date().getFullYear(),
                status: "LIVE",
              },
              headers: {
                "x-rapidapi-key": apiKey,
                "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
              },
              timeout: 10000,
            }
          );

          if (response.data?.response && response.data.response.length > 0) {
            const fixture = response.data.response[0];
            const isHome = fixture.teams.home.id === 87;

            const liveGame: LiveGame = {
              id: fixture.fixture.id,
              fixtureId: fixture.fixture.id,
              opponent: isHome ? fixture.teams.away.name : fixture.teams.home.name,
              corinthiansScore: isHome ? fixture.goals.home : fixture.goals.away,
              opponentScore: isHome ? fixture.goals.away : fixture.goals.home,
              status: "live",
              minute: fixture.fixture.status.elapsed || 0,
              stadium: fixture.fixture.venue?.name || "Estádio",
              competition: fixture.league?.name || "Campeonato",
              isHome,
              gameDate: fixture.fixture.date,
            };

            // Detectar gols novos
            const previousScore = previousScoreRef.current;
            if (liveGame.corinthiansScore > previousScore.corinthians) {
              const newGoals = liveGame.corinthiansScore - previousScore.corinthians;
              setGoalEvent({
                playerName: "Corinthians",
                minute: liveGame.minute || 0,
                team: "Corinthians",
                isNewGoal: true,
              });
              setLastGoalCount((prev) => prev + newGoals);
            }

            previousScoreRef.current = {
              corinthians: liveGame.corinthiansScore,
              opponent: liveGame.opponentScore,
            };

            setCurrentGame(liveGame);
            return;
          }
        } catch (apiError) {
          console.warn("Erro ao buscar dados da API-Football:", apiError);
          // Continuar com dados mock se API falhar
        }
      }

      // Fallback: dados mock quando API não está disponível
      const mockLiveGame: LiveGame = {
        id: 1,
        fixtureId: 1,
        opponent: "São Paulo",
        corinthiansScore: 2,
        opponentScore: 1,
        status: "live",
        minute: 67,
        stadium: "Arena Corinthians",
        competition: "Campeonato Paulista",
        isHome: true,
        gameDate: new Date().toISOString(),
      };

      // Simular delay de rede
      await new Promise((resolve) => setTimeout(resolve, 500));

      setCurrentGame(mockLiveGame);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar partidas ao vivo");
      console.error("Erro ao buscar partidas ao vivo:", err);

      // Fallback para dados mock em caso de erro
      const mockLiveGame: LiveGame = {
        id: 1,
        fixtureId: 1,
        opponent: "São Paulo",
        corinthiansScore: 2,
        opponentScore: 1,
        status: "live",
        minute: 67,
        stadium: "Arena Corinthians",
        competition: "Campeonato Paulista",
        isHome: true,
        gameDate: new Date().toISOString(),
      };
      setCurrentGame(mockLiveGame);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Buscar partidas ao vivo ao montar o componente
  useEffect(() => {
    fetchLiveGames();

    // Atualizar a cada 30 segundos durante partidas ao vivo
    const interval = setInterval(() => {
      if (currentGame?.status === "live") {
        fetchLiveGames();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [currentGame?.status, fetchLiveGames]);

  const refresh = useCallback(async () => {
    await fetchLiveGames();
  }, [fetchLiveGames]);

  const clearGoalEvent = useCallback(() => {
    setGoalEvent(null);
  }, []);

  return {
    currentGame,
    isLoading,
    error,
    refresh,
    goalEvent,
    clearGoalEvent,
    lastGoalCount,
  };
}

/**
 * Hook para buscar próximas partidas do Corinthians
 */
export function useUpcomingGames() {
  const [games, setGames] = useState<LiveGame[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUpcomingGames = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Tentar buscar dados reais da API-Football
      const apiKey = process.env.EXPO_PUBLIC_FOOTBALL_API_KEY;

      if (apiKey) {
        try {
          const response = await axios.get(
            "https://api-football-v1.p.rapidapi.com/v3/fixtures",
            {
              params: {
                team: 87, // Corinthians
                season: new Date().getFullYear(),
                status: "NS", // Not started
              },
              headers: {
                "x-rapidapi-key": apiKey,
                "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
              },
              timeout: 10000,
            }
          );

          if (response.data?.response && response.data.response.length > 0) {
            const upcomingGames = response.data.response.slice(0, 5).map((fixture: any) => {
              const isHome = fixture.teams.home.id === 87;
              return {
                id: fixture.fixture.id,
                fixtureId: fixture.fixture.id,
                opponent: isHome ? fixture.teams.away.name : fixture.teams.home.name,
                corinthiansScore: 0,
                opponentScore: 0,
                status: "upcoming" as const,
                stadium: fixture.fixture.venue?.name || "Estádio",
                competition: fixture.league?.name || "Campeonato",
                isHome,
                gameDate: fixture.fixture.date,
              };
            });

            setGames(upcomingGames);
            return;
          }
        } catch (apiError) {
          console.warn("Erro ao buscar próximas partidas da API-Football:", apiError);
        }
      }

      // Fallback: dados mock
      const mockUpcomingGames: LiveGame[] = [
        {
          id: 2,
          fixtureId: 2,
          opponent: "Palmeiras",
          corinthiansScore: 0,
          opponentScore: 0,
          status: "upcoming",
          stadium: "Allianz Parque",
          competition: "Campeonato Paulista",
          isHome: false,
          gameDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 3,
          fixtureId: 3,
          opponent: "Santos",
          corinthiansScore: 0,
          opponentScore: 0,
          status: "upcoming",
          stadium: "Vila Belmiro",
          competition: "Campeonato Paulista",
          isHome: false,
          gameDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];

      await new Promise((resolve) => setTimeout(resolve, 500));
      setGames(mockUpcomingGames);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar próximas partidas");
      console.error("Erro ao buscar próximas partidas:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUpcomingGames();
  }, [fetchUpcomingGames]);

  const refresh = useCallback(async () => {
    await fetchUpcomingGames();
  }, [fetchUpcomingGames]);

  return {
    games,
    isLoading,
    error,
    refresh,
  };
}
