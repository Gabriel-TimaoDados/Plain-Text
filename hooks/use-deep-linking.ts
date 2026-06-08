import { useEffect, useCallback } from "react";
import * as Linking from "expo-linking";
import { useNavigation } from "@react-navigation/native";

interface DeepLink {
  path: string;
  handler: (params: Record<string, any>) => void;
}

/**
 * Hook para gerenciar Deep Linking
 */
export function useDeepLinking() {
  const navigation = useNavigation();

  // Configurar URL scheme
  const prefix = Linking.createURL("/");

  const linking = {
    prefixes: [prefix, "manus20240605://", "https://timao-dados.app"],
    config: {
      screens: {
        // Tabs
        index: "home",
        proximos: "proximos",
        resultados: "resultados",
        tabela: "tabela",
        escalacoes: "escalacoes",
        analises: "analises",
        jogadores: "jogadores",
        historico: "historico",
        previsoes: "previsoes",
        tecnicos: "tecnicos",
        calendario: "calendario",
        favoritos: "favoritos",
        news: "news",
        settings: "settings",

        // Deep links específicos
        "game/:id": "game/:id",
        "player/:id": "player/:id",
        "prediction/:id": "prediction/:id",
        "coach/:id": "coach/:id",
        "share/:type/:id": "share/:type/:id",
      },
    },
  };

  // Lidar com URLs iniciais
  useEffect(() => {
    const getInitialURL = async () => {
      const url = await Linking.getInitialURL();

      if (url != null) {
        handleDeepLink(url);
      }
    };

    getInitialURL();
  }, []);

  // Lidar com mudanças de URL
  useEffect(() => {
    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleDeepLink(url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleDeepLink = useCallback((url: string) => {
    const route = url.replace(/.*?:\/\//g, "");
    const routeName = route.split("/")[0];
    const params = parseDeepLinkParams(route);

    navigateToDeepLink(routeName, params);
  }, []);

  const navigateToDeepLink = useCallback(
    (routeName: string, params: Record<string, any>) => {
      if (routeName === "game" && params.id) {
        navigation.navigate("game" as any, { id: params.id });
      } else if (routeName === "player" && params.id) {
        navigation.navigate("jogadores" as any, { playerId: params.id });
      } else if (routeName === "prediction" && params.id) {
        navigation.navigate("previsoes" as any, { predictionId: params.id });
      } else if (routeName === "coach" && params.id) {
        navigation.navigate("tecnicos" as any, { coachId: params.id });
      } else if (routeName === "share" && params.type && params.id) {
        handleShareDeepLink(params.type, params.id);
      } else {
        // Navegar para aba padrão
        navigation.navigate(routeName as any);
      }
    },
    [navigation]
  );

  const handleShareDeepLink = useCallback((type: string, id: string) => {
    console.log(`Compartilhamento recebido: ${type}/${id}`);
    // Lógica para processar compartilhamento
  }, []);

  const generateDeepLink = useCallback(
    (type: "game" | "player" | "prediction" | "coach", id: string) => {
      return `manus20240605://${type}/${id}`;
    },
    []
  );

  const generateShareLink = useCallback((type: string, id: string) => {
    return `https://timao-dados.app/share/${type}/${id}`;
  }, []);

  return {
    linking,
    generateDeepLink,
    generateShareLink,
  };
}

/**
 * Parsear parâmetros de Deep Link
 */
function parseDeepLinkParams(route: string): Record<string, any> {
  const params: Record<string, any> = {};
  const parts = route.split("/");

  if (parts.length >= 2) {
    params.type = parts[0];
    params.id = parts[1];
  }

  return params;
}

/**
 * Hook para gerar e compartilhar Deep Links
 */
export function useShareDeepLink() {
  const { generateShareLink } = useDeepLinking();

  const shareGame = useCallback(
    (gameId: string, gameName: string) => {
      const link = generateShareLink("game", gameId);
      return {
        title: gameName,
        message: `Confira este jogo no Timão Dados: ${link}`,
        url: link,
      };
    },
    [generateShareLink]
  );

  const sharePlayer = useCallback(
    (playerId: string, playerName: string) => {
      const link = generateShareLink("player", playerId);
      return {
        title: playerName,
        message: `Acompanhe ${playerName} no Timão Dados: ${link}`,
        url: link,
      };
    },
    [generateShareLink]
  );

  const sharePrediction = useCallback(
    (predictionId: string, gameInfo: string) => {
      const link = generateShareLink("prediction", predictionId);
      return {
        title: "Previsão do Timão Dados",
        message: `Confira a previsão para ${gameInfo}: ${link}`,
        url: link,
      };
    },
    [generateShareLink]
  );

  const shareCoach = useCallback(
    (coachId: string, coachName: string) => {
      const link = generateShareLink("coach", coachId);
      return {
        title: coachName,
        message: `Conheça o histórico de ${coachName} no Timão Dados: ${link}`,
        url: link,
      };
    },
    [generateShareLink]
  );

  return {
    shareGame,
    sharePlayer,
    sharePrediction,
    shareCoach,
  };
}
