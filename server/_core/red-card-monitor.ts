import * as Notifications from "expo-notifications";
import { getDb } from "../db";
import { games } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

interface RedCardMonitor {
  fixtureId: number;
  lastRedCardCount: number;
  lastYellowCardCount: number;
  isMonitoring: boolean;
}

const activeRedCardMonitors = new Map<number, RedCardMonitor>();

/**
 * Inicia monitoramento de cartões vermelhos e amarelos para uma partida
 */
export async function startRedCardMonitoring(fixtureId: number) {
  if (activeRedCardMonitors.has(fixtureId)) {
    console.log(`Monitoramento de cartões já ativo para fixture ${fixtureId}`);
    return;
  }

  const monitor: RedCardMonitor = {
    fixtureId,
    lastRedCardCount: 0,
    lastYellowCardCount: 0,
    isMonitoring: true,
  };

  activeRedCardMonitors.set(fixtureId, monitor);

  // Inicia polling a cada 30 segundos
  const interval = setInterval(async () => {
    try {
      await checkForCards(fixtureId, monitor);
    } catch (error) {
      console.error(`Erro ao verificar cartões para fixture ${fixtureId}:`, error);
    }
  }, 30000); // 30 segundos

  (monitor as any).intervalId = interval;

  console.log(`✅ Monitoramento de cartões iniciado para fixture ${fixtureId}`);
}

/**
 * Para monitoramento de cartões para uma partida
 */
export function stopRedCardMonitoring(fixtureId: number) {
  const monitor = activeRedCardMonitors.get(fixtureId);
  if (monitor) {
    clearInterval((monitor as any).intervalId);
    activeRedCardMonitors.delete(fixtureId);
    console.log(`⏹️ Monitoramento de cartões parado para fixture ${fixtureId}`);
  }
}

/**
 * Verifica se há novos cartões e envia notificações
 */
async function checkForCards(fixtureId: number, monitor: RedCardMonitor) {
  try {
    const db = getDb();

    const game = await db.query.games.findFirst({
      where: eq(games.fixtureId, fixtureId),
    });

    if (!game) {
      console.log(`Jogo ${fixtureId} não encontrado`);
      return;
    }

    // Conta cartões do Corinthians
    const cardsData = game.cards ? JSON.parse(game.cards) : [];
    const corinthiansCards = cardsData.filter(
      (card: any) => card.team === "Corinthians"
    );

    const redCards = corinthiansCards.filter((card: any) => card.type === "red");
    const yellowCards = corinthiansCards.filter(
      (card: any) => card.type === "yellow"
    );

    // Verifica novos cartões vermelhos
    if (redCards.length > monitor.lastRedCardCount) {
      const newRedCards = redCards.length - monitor.lastRedCardCount;

      for (let i = 0; i < newRedCards; i++) {
        const cardIndex = monitor.lastRedCardCount + i;
        const card = redCards[cardIndex];

        await sendRedCardNotification({
          fixtureId,
          playerName: card.playerName || "Corinthians",
          minute: card.minute || "?",
          opponent: game.opponent || "Adversário",
        });
      }

      monitor.lastRedCardCount = redCards.length;
    }

    // Verifica novos cartões amarelos (acúmulo de 2)
    if (yellowCards.length > monitor.lastYellowCardCount) {
      const newYellowCards = yellowCards.length - monitor.lastYellowCardCount;

      for (let i = 0; i < newYellowCards; i++) {
        const cardIndex = monitor.lastYellowCardCount + i;
        const card = yellowCards[cardIndex];

        // Verifica se o jogador já tem um cartão amarelo
        const playerYellowCount = yellowCards.filter(
          (c: any) => c.playerName === card.playerName
        ).length;

        if (playerYellowCount === 2) {
          await sendDoubleYellowNotification({
            fixtureId,
            playerName: card.playerName || "Corinthians",
            minute: card.minute || "?",
            opponent: game.opponent || "Adversário",
          });
        } else {
          await sendYellowCardNotification({
            fixtureId,
            playerName: card.playerName || "Corinthians",
            minute: card.minute || "?",
            opponent: game.opponent || "Adversário",
          });
        }
      }

      monitor.lastYellowCardCount = yellowCards.length;
    }
  } catch (error) {
    console.error(`Erro ao verificar cartões:`, error);
  }
}

/**
 * Envia notificação de cartão vermelho
 */
async function sendRedCardNotification(data: {
  fixtureId: number;
  playerName: string;
  minute: string;
  opponent: string;
}) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🔴 CARTÃO VERMELHO!",
        body: `${data.playerName} foi expulso! Corinthians vs ${data.opponent} (${data.minute}')`,
        sound: "default",
        badge: 1,
        data: {
          fixtureId: data.fixtureId,
          type: "red_card",
        },
      },
      trigger: null,
    });

    console.log(`📢 Notificação de cartão vermelho enviada: ${data.playerName}`);
  } catch (error) {
    console.error(`Erro ao enviar notificação de cartão vermelho:`, error);
  }
}

/**
 * Envia notificação de cartão amarelo
 */
async function sendYellowCardNotification(data: {
  fixtureId: number;
  playerName: string;
  minute: string;
  opponent: string;
}) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🟨 CARTÃO AMARELO",
        body: `${data.playerName} recebeu cartão amarelo vs ${data.opponent} (${data.minute}')`,
        sound: "default",
        badge: 1,
        data: {
          fixtureId: data.fixtureId,
          type: "yellow_card",
        },
      },
      trigger: null,
    });

    console.log(`📢 Notificação de cartão amarelo enviada: ${data.playerName}`);
  } catch (error) {
    console.error(`Erro ao enviar notificação de cartão amarelo:`, error);
  }
}

/**
 * Envia notificação de segundo cartão amarelo (expulsão)
 */
async function sendDoubleYellowNotification(data: {
  fixtureId: number;
  playerName: string;
  minute: string;
  opponent: string;
}) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🔴 SEGUNDO AMARELO - EXPULSÃO!",
        body: `${data.playerName} foi expulso com segundo cartão amarelo vs ${data.opponent} (${data.minute}')`,
        sound: "default",
        badge: 1,
        data: {
          fixtureId: data.fixtureId,
          type: "double_yellow",
        },
      },
      trigger: null,
    });

    console.log(
      `📢 Notificação de segundo amarelo enviada: ${data.playerName}`
    );
  } catch (error) {
    console.error(`Erro ao enviar notificação de segundo amarelo:`, error);
  }
}

/**
 * Retorna status de todos os monitoramentos ativos
 */
export function getActiveRedCardMonitors() {
  return Array.from(activeRedCardMonitors.values()).map((monitor) => ({
    fixtureId: monitor.fixtureId,
    isMonitoring: monitor.isMonitoring,
    lastRedCardCount: monitor.lastRedCardCount,
    lastYellowCardCount: monitor.lastYellowCardCount,
  }));
}

/**
 * Para todos os monitoramentos
 */
export function stopAllRedCardMonitoring() {
  activeRedCardMonitors.forEach((monitor, fixtureId) => {
    stopRedCardMonitoring(fixtureId);
  });
  console.log(`⏹️ Todos os monitoramentos de cartões parados`);
}
