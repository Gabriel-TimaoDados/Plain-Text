import { useState, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";

interface LiveGameStatus {
  fixtureId: number;
  isMonitoring: boolean;
  lastCheckTime: string;
  lastGoalCount: number;
}

export function useLiveGoals() {
  const [activeGames, setActiveGames] = useState<LiveGameStatus[]>([]);
  const [loading, setLoading] = useState(false);

  // Buscar status de monitoramentos ativos
  const fetchStatus = useCallback(async () => {
    try {
      const status = await trpc.liveGoals.status.query();
      setActiveGames(status.monitors);
    } catch (error) {
      console.error("Erro ao buscar status de gols:", error);
    }
  }, []);

  // Iniciar monitoramento de um jogo
  const startMonitoring = useCallback(
    async (fixtureId: number) => {
      setLoading(true);
      try {
        await trpc.liveGoals.start.mutate({ fixtureId });
        await fetchStatus();
      } catch (error) {
        console.error("Erro ao iniciar monitoramento:", error);
      } finally {
        setLoading(false);
      }
    },
    [fetchStatus]
  );

  // Parar monitoramento de um jogo
  const stopMonitoring = useCallback(
    async (fixtureId: number) => {
      setLoading(true);
      try {
        await trpc.liveGoals.stop.mutate({ fixtureId });
        await fetchStatus();
      } catch (error) {
        console.error("Erro ao parar monitoramento:", error);
      } finally {
        setLoading(false);
      }
    },
    [fetchStatus]
  );

  // Parar todos os monitoramentos
  const stopAllMonitoring = useCallback(async () => {
    setLoading(true);
    try {
      await trpc.liveGoals.stopAll.mutate();
      setActiveGames([]);
    } catch (error) {
      console.error("Erro ao parar todos os monitoramentos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Verificar se um jogo está sendo monitorado
  const isMonitoring = useCallback(
    (fixtureId: number) => {
      return activeGames.some((game) => game.fixtureId === fixtureId);
    },
    [activeGames]
  );

  // Carregar status ao montar
  useEffect(() => {
    fetchStatus();

    // Atualizar status a cada 10 segundos
    const interval = setInterval(fetchStatus, 10000);

    return () => clearInterval(interval);
  }, [fetchStatus]);

  return {
    activeGames,
    loading,
    startMonitoring,
    stopMonitoring,
    stopAllMonitoring,
    isMonitoring,
    fetchStatus,
  };
}
