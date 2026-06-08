import * as Notifications from "expo-notifications";
import { getDb } from "../db";
import { games, upcomingGames } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

interface LiveGameMonitor {
  fixtureId: number;
  lastGoalCount: number;
  isMonitoring: boolean;
  lastCheckTime: number;
}

const activeMonitors = new Map<number, LiveGameMonitor>();

/**
 * Inicia monitoramento de gols em tempo real para uma partida
 */
export async function startLiveGoalsMonitoring(fixtureId: number) {
  if (activeMonitors.has(fixtureId)) {
    console.log(`Monitoramento já ativo para fixture ${fixtureId}`);
    return;
  }

  const monitor: LiveGameMonitor = {
    fixtureId,
    lastGoalCount: 0,
    isMonitoring: true,
    lastCheckTime: Date.now(),
  };

  activeMonitors.set(fixtureId, monitor);

  // Inicia polling a cada 30 segundos
  const interval = setInterval(async () => {
    try {
      await checkForNewGoals(fixtureId, monitor);
    } catch (error) {
      console.error(`Erro ao verificar gols para fixture ${fixtureId}:`, error);
    }
  }, 30000); // 30 segundos

  // Armazena o interval para poder cancelar depois
  (monitor as any).intervalId = interval;

  console.log(`✅ Monitoramento iniciado para fixture ${fixtureId}`);
}

/**
 * Para monitoramento de gols para uma partida
 */
export function stopLiveGoalsMonitoring(fixtureId: number) {
  const monitor = activeMonitors.get(fixtureId);
  if (monitor) {
    clearInterval((monitor as any).intervalId);
    activeMonitors.delete(fixtureId);
    console.log(`⏹️ Monitoramento parado para fixture ${fixtureId}`);
  }
}

/**
 * Verifica se há novos gols e envia notificações
 */
async function checkForNewGoals(fixtureId: number, monitor: LiveGameMonitor) {
  try {
    const db = getDb();

    // Busca o jogo no banco de dados
    const game = await db.query.games.findFirst({
      where: eq(games.fixtureId, fixtureId),
    });

    if (!game) {
      console.log(`Jogo ${fixtureId} não encontrado`);
      return;
    }

    // Conta gols do Corinthians
    const goalsData = game.goals ? JSON.parse(game.goals) : [];
    const corinthiansGoals = goalsData.filter(
      (goal: any) => goal.team === "Corinthians"
    );
    const currentGoalCount = corinthiansGoals.length;

    // Se há novos gols, envia notificação
    if (currentGoalCount > monitor.lastGoalCount) {
      const newGoals = currentGoalCount - monitor.lastGoalCount;

      for (let i = 0; i < newGoals; i++) {
        const goalIndex = monitor.lastGoalCount + i;
        const goal = corinthiansGoals[goalIndex];

        await sendGoalNotification({
          fixtureId,
          playerName: goal.playerName || "Corinthians",
          minute: goal.minute || "?",
          score: currentGoalCount,
          opponent: game.opponent || "Adversário",
        });
      }

      monitor.lastGoalCount = currentGoalCount;
    }

    monitor.lastCheckTime = Date.now();
  } catch (error) {
    console.error(`Erro ao verificar gols:`, error);
  }
}

/**
 * Envia notificação de gol
 */
async function sendGoalNotification(data: {
  fixtureId: number;
  playerName: string;
  minute: string;
  score: number;
  opponent: string;
}) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⚽ GOL DO CORINTHIANS!",
        body: `${data.playerName} marcou! ${data.score}x0 vs ${data.opponent} (${data.minute}')`,
        sound: "default",
        badge: 1,
        data: {
          fixtureId: data.fixtureId,
          type: "goal",
        },
      },
      trigger: null, // Notificação imediata
    });

    console.log(`📢 Notificação de gol enviada: ${data.playerName}`);
  } catch (error) {
    console.error(`Erro ao enviar notificação:`, error);
  }
}

/**
 * Retorna status de todos os monitoramentos ativos
 */
export function getActiveMonitors() {
  return Array.from(activeMonitors.values()).map((monitor) => ({
    fixtureId: monitor.fixtureId,
    isMonitoring: monitor.isMonitoring,
    lastCheckTime: new Date(monitor.lastCheckTime).toISOString(),
    lastGoalCount: monitor.lastGoalCount,
  }));
}

/**
 * Para todos os monitoramentos
 */
export function stopAllMonitoring() {
  activeMonitors.forEach((monitor, fixtureId) => {
    stopLiveGoalsMonitoring(fixtureId);
  });
  console.log(`⏹️ Todos os monitoramentos parados`);
}
