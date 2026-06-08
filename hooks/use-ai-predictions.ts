import { useState, useCallback } from "react";

export interface Prediction {
  opponent: string;
  predictedResult: "win" | "draw" | "loss";
  confidence: number;
  reasoning: string;
  expectedGoals: {
    corinthians: number;
    opponent: number;
  };
}

export interface PredictionRequest {
  recentForm: Array<{
    result: "win" | "draw" | "loss";
    goalsFor: number;
    goalsAgainst: number;
  }>;
  seasonStats: {
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
  };
  opponent: string;
  opponentStats?: {
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
  };
}

/**
 * Hook para integrar LLM do servidor para previsões de resultados
 */
export function useAIPredictions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPrediction = useCallback(async (request: PredictionRequest): Promise<Prediction | null> => {
    setLoading(true);
    setError(null);

    try {
      // Em produção, fazer chamada para LLM do servidor
      // POST /api/predictions com request como body

      // Mock prediction - substitua com chamada real
      const mockPredictions: Record<string, Prediction> = {
        "São Paulo": {
          opponent: "São Paulo",
          predictedResult: "win",
          confidence: 0.78,
          reasoning:
            "Corinthians tem melhor forma recente com 3 vitórias nos últimos 5 jogos. Histórico favorável em clássicos.",
          expectedGoals: {
            corinthians: 2.1,
            opponent: 1.2,
          },
        },
        "Palmeiras": {
          opponent: "Palmeiras",
          predictedResult: "draw",
          confidence: 0.65,
          reasoning:
            "Ambas as equipes em forma semelhante. Clássico equilibrado com histórico de empates recentes.",
          expectedGoals: {
            corinthians: 1.5,
            opponent: 1.5,
          },
        },
        "Santos": {
          opponent: "Santos",
          predictedResult: "win",
          confidence: 0.82,
          reasoning:
            "Corinthians favorito com melhor campanha. Vantagem em casa considerável.",
          expectedGoals: {
            corinthians: 2.3,
            opponent: 0.9,
          },
        },
        "Botafogo": {
          opponent: "Botafogo",
          predictedResult: "win",
          confidence: 0.71,
          reasoning:
            "Corinthians em melhor forma. Botafogo com desempenho irregular fora de casa.",
          expectedGoals: {
            corinthians: 1.9,
            opponent: 1.1,
          },
        },
      };

      const prediction = mockPredictions[request.opponent];

      if (prediction) {
        return prediction;
      } else {
        // Gerar previsão genérica para times não mapeados
        const winRate = request.seasonStats.wins / (request.seasonStats.wins + request.seasonStats.draws + request.seasonStats.losses);
        
        return {
          opponent: request.opponent,
          predictedResult: winRate > 0.6 ? "win" : winRate > 0.4 ? "draw" : "loss",
          confidence: 0.6,
          reasoning: `Previsão baseada no desempenho geral da temporada. Taxa de vitória: ${(winRate * 100).toFixed(0)}%`,
          expectedGoals: {
            corinthians: 1.8,
            opponent: 1.2,
          },
        };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao gerar previsão";
      setError(errorMessage);
      console.error("Erro ao obter previsão:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMultiplePredictions = useCallback(
    async (requests: PredictionRequest[]): Promise<Prediction[]> => {
      setLoading(true);
      setError(null);

      try {
        const predictions = await Promise.all(
          requests.map((req) => getPrediction(req))
        );

        return predictions.filter((p): p is Prediction => p !== null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao gerar previsões";
        setError(errorMessage);
        console.error("Erro ao obter múltiplas previsões:", err);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [getPrediction]
  );

  return {
    getPrediction,
    getMultiplePredictions,
    loading,
    error,
  };
}

/**
 * Função auxiliar para calcular confiança da previsão
 */
export function calculateConfidence(
  recentForm: Array<{ result: "win" | "draw" | "loss" }>,
  seasonWinRate: number
): number {
  // Média ponderada: 60% forma recente, 40% taxa de vitória da temporada
  const recentWins = recentForm.filter((f) => f.result === "win").length;
  const recentWinRate = recentWins / (recentForm.length || 1);

  const confidence = recentWinRate * 0.6 + seasonWinRate * 0.4;

  // Normalizar para 0.5 - 0.95
  return Math.max(0.5, Math.min(0.95, confidence));
}

/**
 * Função auxiliar para gerar texto de confiança
 */
export function getConfidenceLabel(confidence: number): string {
  if (confidence >= 0.85) return "Muito Alta";
  if (confidence >= 0.75) return "Alta";
  if (confidence >= 0.65) return "Moderada";
  if (confidence >= 0.55) return "Baixa";
  return "Muito Baixa";
}

/**
 * Função auxiliar para gerar emoji baseado no resultado
 */
export function getResultEmoji(result: "win" | "draw" | "loss"): string {
  switch (result) {
    case "win":
      return "🏆";
    case "draw":
      return "🤝";
    case "loss":
      return "😔";
  }
}

/**
 * Função auxiliar para gerar texto do resultado
 */
export function getResultText(result: "win" | "draw" | "loss"): string {
  switch (result) {
    case "win":
      return "Vitória";
    case "draw":
      return "Empate";
    case "loss":
      return "Derrota";
  }
}
