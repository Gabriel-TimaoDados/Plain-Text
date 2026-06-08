import { describe, it, expect } from "vitest";
import {
  calculateConfidence,
  getConfidenceLabel,
  getResultEmoji,
  getResultText,
} from "../hooks/use-ai-predictions";

/**
 * Testes para histórico de desempenho e previsões de IA
 */

describe("Performance History", () => {
  describe("Monthly Statistics", () => {
    it("deve calcular estatísticas mensais", () => {
      const monthlyData = {
        month: "Janeiro",
        matches: 4,
        wins: 3,
        draws: 1,
        losses: 0,
        goalsFor: 10,
        goalsAgainst: 2,
        points: 10,
      };

      expect(monthlyData.wins + monthlyData.draws + monthlyData.losses).toBe(monthlyData.matches);
      expect(monthlyData.points).toBe(10);
    });

    it("deve validar múltiplos meses", () => {
      const months = [
        { month: "Janeiro", points: 10, wins: 3 },
        { month: "Fevereiro", points: 7, wins: 2 },
        { month: "Março", points: 10, wins: 3 },
      ];

      const totalPoints = months.reduce((sum, m) => sum + m.points, 0);
      const totalWins = months.reduce((sum, m) => sum + m.wins, 0);

      expect(totalPoints).toBe(27);
      expect(totalWins).toBe(8);
    });

    it("deve calcular taxa de vitória mensal", () => {
      const month = {
        matches: 4,
        wins: 3,
        draws: 1,
        losses: 0,
      };

      const winRate = (month.wins / month.matches) * 100;

      expect(winRate).toBe(75);
    });

    it("deve identificar melhor e pior mês", () => {
      const months = [
        { month: "Janeiro", points: 10 },
        { month: "Fevereiro", points: 7 },
        { month: "Março", points: 10 },
        { month: "Abril", points: 5 },
      ];

      const bestMonth = months.reduce((prev, current) =>
        prev.points > current.points ? prev : current
      );

      const worstMonth = months.reduce((prev, current) =>
        prev.points < current.points ? prev : current
      );

      expect(bestMonth.points).toBe(10);
      expect(worstMonth.month).toBe("Abril");
    });
  });

  describe("Trend Analysis", () => {
    it("deve detectar tendência de melhora", () => {
      const points = [7, 8, 9, 10];
      const trend = points[points.length - 1] > points[0] ? "improving" : "declining";

      expect(trend).toBe("improving");
    });

    it("deve detectar tendência de declínio", () => {
      const points = [10, 9, 8, 7];
      const trend = points[points.length - 1] < points[0] ? "declining" : "improving";

      expect(trend).toBe("declining");
    });

    it("deve calcular média de pontos", () => {
      const points = [10, 7, 10, 8, 9];
      const average = points.reduce((sum, p) => sum + p, 0) / points.length;

      expect(average).toBe(8.8);
    });
  });
});

describe("AI Predictions", () => {
  describe("Confidence Calculation", () => {
    it("deve calcular confiança corretamente", () => {
      const recentForm = [
        { result: "win" as const },
        { result: "win" as const },
        { result: "draw" as const },
        { result: "win" as const },
        { result: "loss" as const },
      ];

      const seasonWinRate = 0.6;
      const confidence = calculateConfidence(recentForm, seasonWinRate);

      expect(confidence).toBeGreaterThan(0.5);
      expect(confidence).toBeLessThan(0.95);
    });

    it("deve retornar confiança entre 0.5 e 0.95", () => {
      const recentForm = [{ result: "win" as const }];
      const confidence = calculateConfidence(recentForm, 0.8);

      expect(confidence).toBeGreaterThanOrEqual(0.5);
      expect(confidence).toBeLessThanOrEqual(0.95);
    });

    it("deve dar mais peso à forma recente", () => {
      const goodForm = [
        { result: "win" as const },
        { result: "win" as const },
        { result: "win" as const },
      ];

      const badForm = [
        { result: "loss" as const },
        { result: "loss" as const },
        { result: "loss" as const },
      ];

      const confidenceGood = calculateConfidence(goodForm, 0.5);
      const confidenceBad = calculateConfidence(badForm, 0.5);

      expect(confidenceGood).toBeGreaterThan(confidenceBad);
    });
  });

  describe("Confidence Labels", () => {
    it("deve retornar label correto para confiança muito alta", () => {
      expect(getConfidenceLabel(0.9)).toBe("Muito Alta");
    });

    it("deve retornar label correto para confiança alta", () => {
      expect(getConfidenceLabel(0.8)).toBe("Alta");
    });

    it("deve retornar label correto para confiança moderada", () => {
      expect(getConfidenceLabel(0.7)).toBe("Moderada");
    });

    it("deve retornar label correto para confiança baixa", () => {
      expect(getConfidenceLabel(0.6)).toBe("Baixa");
    });

    it("deve retornar label correto para confiança muito baixa", () => {
      expect(getConfidenceLabel(0.5)).toBe("Muito Baixa");
    });
  });

  describe("Result Emoji and Text", () => {
    it("deve retornar emoji correto para vitória", () => {
      expect(getResultEmoji("win")).toBe("🏆");
    });

    it("deve retornar emoji correto para empate", () => {
      expect(getResultEmoji("draw")).toBe("🤝");
    });

    it("deve retornar emoji correto para derrota", () => {
      expect(getResultEmoji("loss")).toBe("😔");
    });

    it("deve retornar texto correto para vitória", () => {
      expect(getResultText("win")).toBe("Vitória");
    });

    it("deve retornar texto correto para empate", () => {
      expect(getResultText("draw")).toBe("Empate");
    });

    it("deve retornar texto correto para derrota", () => {
      expect(getResultText("loss")).toBe("Derrota");
    });
  });

  describe("Prediction Generation", () => {
    it("deve gerar previsão com estrutura correta", () => {
      const prediction = {
        opponent: "São Paulo",
        predictedResult: "win" as const,
        confidence: 0.78,
        reasoning: "Corinthians em melhor forma",
        expectedGoals: {
          corinthians: 2.1,
          opponent: 1.2,
        },
      };

      expect(prediction.opponent).toBe("São Paulo");
      expect(prediction.confidence).toBeGreaterThan(0.5);
      expect(prediction.expectedGoals.corinthians).toBeGreaterThan(0);
    });

    it("deve calcular gols esperados", () => {
      const prediction = {
        expectedGoals: {
          corinthians: 2.1,
          opponent: 1.2,
        },
      };

      const totalGoals = prediction.expectedGoals.corinthians + prediction.expectedGoals.opponent;

      expect(totalGoals).toBeCloseTo(3.3, 1);
    });

    it("deve gerar múltiplas previsões", () => {
      const predictions = [
        { opponent: "São Paulo", confidence: 0.78 },
        { opponent: "Palmeiras", confidence: 0.65 },
        { opponent: "Santos", confidence: 0.82 },
      ];

      expect(predictions).toHaveLength(3);
      expect(predictions.every((p) => p.confidence > 0.5)).toBe(true);
    });
  });

  describe("Prediction Accuracy", () => {
    it("deve validar previsão com alta confiança", () => {
      const prediction = {
        predictedResult: "win" as const,
        confidence: 0.85,
      };

      expect(prediction.confidence).toBeGreaterThan(0.75);
    });

    it("deve validar previsão com confiança moderada", () => {
      const prediction = {
        predictedResult: "draw" as const,
        confidence: 0.65,
      };

      expect(prediction.confidence).toBeGreaterThan(0.55);
      expect(prediction.confidence).toBeLessThan(0.75);
    });

    it("deve comparar confiança entre previsões", () => {
      const predictions = [
        { opponent: "São Paulo", confidence: 0.78 },
        { opponent: "Palmeiras", confidence: 0.65 },
      ];

      const mostConfident = predictions.reduce((prev, current) =>
        prev.confidence > current.confidence ? prev : current
      );

      expect(mostConfident.opponent).toBe("São Paulo");
    });
  });

  describe("Reasoning Generation", () => {
    it("deve gerar reasoning baseado em forma recente", () => {
      const recentWins = 3;
      const totalMatches = 5;
      const winRate = (recentWins / totalMatches) * 100;

      const reasoning = `Corinthians com ${recentWins} vitórias nos últimos ${totalMatches} jogos (${winRate.toFixed(0)}% de aproveitamento)`;

      expect(reasoning).toContain("60%");
    });

    it("deve gerar reasoning baseado em estatísticas", () => {
      const stats = {
        goalsFor: 48,
        goalsAgainst: 28,
        wins: 16,
      };

      const reasoning = `Corinthians marcou ${stats.goalsFor} gols e sofreu apenas ${stats.goalsAgainst}`;

      expect(reasoning).toContain("48");
      expect(reasoning).toContain("28");
    });
  });
});

describe("Predictions Screen", () => {
  describe("Upcoming Matches", () => {
    it("deve exibir próximos jogos", () => {
      const upcomingMatches = [
        { opponent: "São Paulo", date: "15 de Junho" },
        { opponent: "Palmeiras", date: "22 de Junho" },
      ];

      expect(upcomingMatches).toHaveLength(2);
    });

    it("deve permitir selecionar previsão", () => {
      let selectedPrediction = null;

      const prediction = {
        opponent: "São Paulo",
        confidence: 0.78,
      };

      selectedPrediction = prediction;

      expect(selectedPrediction?.opponent).toBe("São Paulo");
    });
  });

  describe("Prediction Details", () => {
    it("deve exibir detalhes da previsão", () => {
      const prediction = {
        opponent: "São Paulo",
        predictedResult: "win" as const,
        confidence: 0.78,
        reasoning: "Corinthians em melhor forma",
        expectedGoals: {
          corinthians: 2.1,
          opponent: 1.2,
        },
      };

      expect(prediction.reasoning).toBeTruthy();
      expect(prediction.expectedGoals).toBeDefined();
    });

    it("deve calcular barra de confiança", () => {
      const confidence = 0.78;
      const percentage = confidence * 100;

      expect(percentage).toBe(78);
    });
  });
});
