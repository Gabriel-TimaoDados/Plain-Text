import { useCallback, useRef, useEffect } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

interface GameEvent {
  minute: number;
  type: "goal" | "yellow_card" | "red_card" | "substitution";
  player: string;
  team: "Corinthians" | "Opponent";
  opponentName?: string;
}

/**
 * Hook para gerenciar notificações de eventos do jogo
 */
export function useGameEventNotifications() {
  const lastNotifiedEventRef = useRef<string>("");

  /**
   * Envia notificação de gol
   */
  const notifyGoal = useCallback(
    async (player: string, team: string, minute: number, score: string) => {
      const eventKey = `goal-${team}-${minute}-${player}`;

      // Evitar notificações duplicadas
      if (lastNotifiedEventRef.current === eventKey) {
        return;
      }

      lastNotifiedEventRef.current = eventKey;

      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "⚽ GOL!",
            body: `${player} marcou! ${score}`,
            sound: "default",
            badge: 1,
            data: {
              type: "goal",
              player,
              team,
              minute,
            },
          },
          trigger: null, // Notificação imediata
        });

        console.log(`📢 Notificação de gol enviada: ${player}`);
      } catch (error) {
        console.warn("Erro ao enviar notificação de gol:", error);
      }
    },
    []
  );

  /**
   * Envia notificação de cartão
   */
  const notifyCard = useCallback(
    async (
      player: string,
      team: string,
      cardType: "yellow" | "red",
      minute: number
    ) => {
      const eventKey = `card-${team}-${cardType}-${minute}-${player}`;

      if (lastNotifiedEventRef.current === eventKey) {
        return;
      }

      lastNotifiedEventRef.current = eventKey;

      try {
        const cardEmoji = cardType === "yellow" ? "🟨" : "🟥";
        const cardText = cardType === "yellow" ? "Cartão Amarelo" : "Cartão Vermelho";

        await Notifications.scheduleNotificationAsync({
          content: {
            title: `${cardEmoji} ${cardText}`,
            body: `${player} (${team}) recebeu ${cardText.toLowerCase()}`,
            sound: "default",
            badge: 1,
            data: {
              type: "card",
              cardType,
              player,
              team,
              minute,
            },
          },
          trigger: null,
        });

        console.log(`📢 Notificação de cartão enviada: ${player}`);
      } catch (error) {
        console.warn("Erro ao enviar notificação de cartão:", error);
      }
    },
    []
  );

  /**
   * Envia notificação de substituição
   */
  const notifySubstitution = useCallback(
    async (
      playerOut: string,
      playerIn: string,
      team: string,
      minute: number
    ) => {
      const eventKey = `sub-${team}-${minute}-${playerOut}-${playerIn}`;

      if (lastNotifiedEventRef.current === eventKey) {
        return;
      }

      lastNotifiedEventRef.current = eventKey;

      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "🔄 Substituição",
            body: `${playerOut} saiu, ${playerIn} entrou (${team})`,
            sound: "default",
            badge: 1,
            data: {
              type: "substitution",
              playerOut,
              playerIn,
              team,
              minute,
            },
          },
          trigger: null,
        });

        console.log(`📢 Notificação de substituição enviada`);
      } catch (error) {
        console.warn("Erro ao enviar notificação de substituição:", error);
      }
    },
    []
  );

  /**
   * Envia notificação de início/fim de tempo
   */
  const notifyMatchStatus = useCallback(
    async (status: "started" | "half_time" | "finished", minute: number) => {
      const eventKey = `status-${status}-${minute}`;

      if (lastNotifiedEventRef.current === eventKey) {
        return;
      }

      lastNotifiedEventRef.current = eventKey;

      try {
        const messages = {
          started: { title: "⏱️ Jogo Iniciado", body: "A partida começou!" },
          half_time: { title: "⏸️ Intervalo", body: "Fim do primeiro tempo" },
          finished: { title: "🏁 Jogo Finalizado", body: "A partida terminou" },
        };

        const message = messages[status];

        await Notifications.scheduleNotificationAsync({
          content: {
            title: message.title,
            body: message.body,
            sound: "default",
            badge: 1,
            data: {
              type: "match_status",
              status,
              minute,
            },
          },
          trigger: null,
        });

        console.log(`📢 Notificação de status enviada: ${status}`);
      } catch (error) {
        console.warn("Erro ao enviar notificação de status:", error);
      }
    },
    []
  );

  /**
   * Processa evento do jogo e envia notificação apropriada
   */
  const handleGameEvent = useCallback(
    async (event: GameEvent, score?: string) => {
      switch (event.type) {
        case "goal":
          await notifyGoal(event.player, event.team, event.minute, score || "");
          break;
        case "yellow_card":
          await notifyCard(event.player, event.team, "yellow", event.minute);
          break;
        case "red_card":
          await notifyCard(event.player, event.team, "red", event.minute);
          break;
        case "substitution":
          // Substituição é tratada separadamente
          break;
      }
    },
    [notifyGoal, notifyCard]
  );

  /**
   * Configura listener para notificações recebidas
   */
  useEffect(() => {
    if (Platform.OS === "web") return;

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        console.log("Notificação clicada:", data);

        // Aqui você pode navegar para a tela apropriada baseado no tipo de evento
        // Por exemplo: router.push(`/game/${data.gameId}`)
      }
    );

    return () => subscription.remove();
  }, []);

  return {
    notifyGoal,
    notifyCard,
    notifySubstitution,
    notifyMatchStatus,
    handleGameEvent,
  };
}

/**
 * Hook para gerenciar permissões de notificações
 */
export function useNotificationPermissions() {
  const requestPermissions = useCallback(async () => {
    if (Platform.OS === "web") {
      console.log("Notificações não suportadas na web");
      return false;
    }

    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.warn("Erro ao solicitar permissões de notificação:", error);
      return false;
    }
  }, []);

  const checkPermissions = useCallback(async () => {
    if (Platform.OS === "web") {
      return false;
    }

    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.warn("Erro ao verificar permissões de notificação:", error);
      return false;
    }
  }, []);

  return {
    requestPermissions,
    checkPermissions,
  };
}
