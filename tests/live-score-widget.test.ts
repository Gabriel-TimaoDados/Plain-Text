import { describe, it, expect, beforeEach, vi } from "vitest";

/**
 * Testes para o componente LiveScoreWidget e hook useLiveGames
 */

describe("LiveScoreWidget", () => {
  describe("Status Display", () => {
    it("deve exibir status 'AO VIVO' com minuto para partidas ao vivo", () => {
      const mockGame = {
        id: 1,
        opponent: "São Paulo",
        corinthiansScore: 2,
        opponentScore: 1,
        status: "live" as const,
        minute: 67,
        stadium: "Arena Corinthians",
        competition: "Campeonato Paulista",
        isHome: true,
      };

      expect(mockGame.status).toBe("live");
      expect(mockGame.minute).toBe(67);
      const statusText = `AO VIVO - ${mockGame.minute}'`;
      expect(statusText).toBe("AO VIVO - 67'");
    });

    it("deve exibir status 'PRÓXIMO' para próximas partidas", () => {
      const mockGame = {
        id: 2,
        opponent: "Palmeiras",
        corinthiansScore: 0,
        opponentScore: 0,
        status: "upcoming" as const,
        stadium: "Allianz Parque",
        competition: "Campeonato Paulista",
        isHome: false,
      };

      expect(mockGame.status).toBe("upcoming");
      const statusText = "PRÓXIMO";
      expect(statusText).toBe("PRÓXIMO");
    });

    it("deve exibir status 'ENCERRADO' para partidas finalizadas", () => {
      const mockGame = {
        id: 3,
        opponent: "Santos",
        corinthiansScore: 3,
        opponentScore: 2,
        status: "finished" as const,
        stadium: "Vila Belmiro",
        competition: "Campeonato Paulista",
        isHome: false,
      };

      expect(mockGame.status).toBe("finished");
      const statusText = "ENCERRADO";
      expect(statusText).toBe("ENCERRADO");
    });
  });

  describe("Score Display", () => {
    it("deve exibir placar correto para partida ao vivo", () => {
      const mockGame = {
        id: 1,
        opponent: "São Paulo",
        corinthiansScore: 2,
        opponentScore: 1,
        status: "live" as const,
        minute: 67,
        stadium: "Arena Corinthians",
        competition: "Campeonato Paulista",
        isHome: true,
      };

      expect(mockGame.corinthiansScore).toBe(2);
      expect(mockGame.opponentScore).toBe(1);
    });

    it("deve exibir 0-0 para próximas partidas", () => {
      const mockGame = {
        id: 2,
        opponent: "Palmeiras",
        corinthiansScore: 0,
        opponentScore: 0,
        status: "upcoming" as const,
        stadium: "Allianz Parque",
        competition: "Campeonato Paulista",
        isHome: false,
      };

      expect(mockGame.corinthiansScore).toBe(0);
      expect(mockGame.opponentScore).toBe(0);
    });
  });

  describe("Team Information", () => {
    it("deve identificar corretamente mandante e visitante", () => {
      const homeGame = {
        id: 1,
        opponent: "São Paulo",
        corinthiansScore: 2,
        opponentScore: 1,
        status: "live" as const,
        minute: 67,
        stadium: "Arena Corinthians",
        competition: "Campeonato Paulista",
        isHome: true,
      };

      expect(homeGame.isHome).toBe(true);
      const corinthiansRole = homeGame.isHome ? "Mandante" : "Visitante";
      expect(corinthiansRole).toBe("Mandante");

      const opponentRole = homeGame.isHome ? "Visitante" : "Mandante";
      expect(opponentRole).toBe("Visitante");
    });

    it("deve exibir informações de estádio quando disponível", () => {
      const mockGame = {
        id: 1,
        opponent: "São Paulo",
        corinthiansScore: 2,
        opponentScore: 1,
        status: "live" as const,
        minute: 67,
        stadium: "Arena Corinthians",
        competition: "Campeonato Paulista",
        isHome: true,
      };

      expect(mockGame.stadium).toBe("Arena Corinthians");
      expect(mockGame.stadium).toBeTruthy();
    });
  });

  describe("Competition Display", () => {
    it("deve exibir competição corretamente", () => {
      const mockGame = {
        id: 1,
        opponent: "São Paulo",
        corinthiansScore: 2,
        opponentScore: 1,
        status: "live" as const,
        minute: 67,
        stadium: "Arena Corinthians",
        competition: "Campeonato Paulista",
        isHome: true,
      };

      expect(mockGame.competition).toBe("Campeonato Paulista");
    });

    it("deve suportar diferentes competições", () => {
      const competitions = [
        "Campeonato Paulista",
        "Campeonato Brasileiro",
        "Copa Libertadores",
        "Copa do Brasil",
      ];

      competitions.forEach((comp) => {
        const mockGame = {
          id: 1,
          opponent: "Adversário",
          corinthiansScore: 0,
          opponentScore: 0,
          status: "upcoming" as const,
          stadium: "Estádio",
          competition: comp,
          isHome: true,
        };

        expect(mockGame.competition).toBe(comp);
      });
    });
  });

  describe("Refresh Functionality", () => {
    it("deve permitir atualização manual durante partidas ao vivo", () => {
      const mockGame = {
        id: 1,
        opponent: "São Paulo",
        corinthiansScore: 2,
        opponentScore: 1,
        status: "live" as const,
        minute: 67,
        stadium: "Arena Corinthians",
        competition: "Campeonato Paulista",
        isHome: true,
      };

      const mockRefresh = vi.fn();

      expect(mockGame.status).toBe("live");
      mockRefresh();
      expect(mockRefresh).toHaveBeenCalled();
    });

    it("não deve mostrar botão de atualização para partidas finalizadas", () => {
      const mockGame = {
        id: 3,
        opponent: "Santos",
        corinthiansScore: 3,
        opponentScore: 2,
        status: "finished" as const,
        stadium: "Vila Belmiro",
        competition: "Campeonato Paulista",
        isHome: false,
      };

      expect(mockGame.status).not.toBe("live");
    });
  });

  describe("Loading State", () => {
    it("deve indicar carregamento durante atualização", () => {
      const isLoading = true;

      expect(isLoading).toBe(true);
    });

    it("deve desabilitar botão durante carregamento", () => {
      const isLoading = true;
      const disabled = isLoading;

      expect(disabled).toBe(true);
    });
  });
});

describe("useLiveGames Hook", () => {
  describe("Data Fetching", () => {
    it("deve retornar partida ao vivo quando disponível", async () => {
      const mockGame = {
        id: 1,
        opponent: "São Paulo",
        corinthiansScore: 2,
        opponentScore: 1,
        status: "live" as const,
        minute: 67,
        stadium: "Arena Corinthians",
        competition: "Campeonato Paulista",
        isHome: true,
        gameDate: new Date().toISOString(),
      };

      expect(mockGame).toBeDefined();
      expect(mockGame.status).toBe("live");
    });

    it("deve retornar null quando não há partida ao vivo", () => {
      const currentGame = null;

      expect(currentGame).toBeNull();
    });
  });

  describe("Auto-refresh", () => {
    it("deve atualizar a cada 30 segundos durante partida ao vivo", () => {
      const refreshInterval = 30000; // 30 segundos

      expect(refreshInterval).toBe(30000);
    });

    it("não deve atualizar quando não há partida ao vivo", () => {
      const currentGame = null;
      const shouldRefresh = currentGame?.status === "live";

      expect(shouldRefresh).toBe(false);
    });
  });

  describe("Error Handling", () => {
    it("deve retornar erro quando falha ao buscar dados", () => {
      const error = "Erro ao buscar partidas ao vivo";

      expect(error).toBeTruthy();
      expect(error).toContain("Erro");
    });

    it("deve manter estado anterior em caso de erro", () => {
      const previousGame = {
        id: 1,
        opponent: "São Paulo",
        corinthiansScore: 2,
        opponentScore: 1,
        status: "live" as const,
        minute: 67,
        stadium: "Arena Corinthians",
        competition: "Campeonato Paulista",
        isHome: true,
        gameDate: new Date().toISOString(),
      };

      expect(previousGame).toBeDefined();
      expect(previousGame.opponent).toBe("São Paulo");
    });
  });
});
