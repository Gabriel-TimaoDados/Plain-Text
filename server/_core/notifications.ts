/**
 * Serviço de Notificações Push
 * Gerencia notificações para próximos jogos, resultados e marcos históricos
 */

import * as Notifications from "expo-notifications";

export interface PushNotificationData {
  type: "game" | "result" | "milestone" | "news";
  title: string;
  body: string;
  data?: Record<string, any>;
}

/**
 * Configurar o handler de notificações
 */
export function setupNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

/**
 * Registrar para receber notificações push
 */
export async function registerForPushNotifications() {
  try {
    const token = await Notifications.getExpoPushTokenAsync();
    console.log("Push token:", token.data);
    return token.data;
  } catch (error) {
    console.error("Erro ao registrar para notificações:", error);
    throw error;
  }
}

/**
 * Enviar notificação local para próximo jogo
 */
export async function sendUpcomingGameNotification(
  opponent: string,
  date: string,
  time: string
) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `⚽ Próximo Jogo: Corinthians x ${opponent}`,
        body: `${date} às ${time}`,
        sound: "default",
        badge: 1,
        data: {
          type: "game",
          opponent,
          date,
          time,
        },
      },
      trigger: {
        seconds: 60, // Notificação em 1 minuto (para teste)
      },
    });

    console.log(`✅ Notificação de jogo agendada: ${opponent}`);
  } catch (error) {
    console.error("Erro ao agendar notificação de jogo:", error);
  }
}

/**
 * Enviar notificação de resultado de jogo
 */
export async function sendGameResultNotification(
  opponent: string,
  corinthiansScore: number,
  opponentScore: number
) {
  const result =
    corinthiansScore > opponentScore
      ? "Vitória! 🏆"
      : corinthiansScore < opponentScore
        ? "Derrota 😞"
        : "Empate 🤝";

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${result} Corinthians ${corinthiansScore} × ${opponentScore} ${opponent}`,
        body: "Veja os detalhes do jogo no app",
        sound: "default",
        badge: 1,
        data: {
          type: "result",
          opponent,
          corinthiansScore,
          opponentScore,
        },
      },
      trigger: {
        seconds: 10,
      },
    });

    console.log(`✅ Notificação de resultado enviada`);
  } catch (error) {
    console.error("Erro ao enviar notificação de resultado:", error);
  }
}

/**
 * Enviar notificação de marco histórico
 */
export async function sendMilestoneNotification(
  title: string,
  description: string
) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `🎉 ${title}`,
        body: description,
        sound: "default",
        badge: 1,
        data: {
          type: "milestone",
          title,
          description,
        },
      },
      trigger: {
        seconds: 30,
      },
    });

    console.log(`✅ Notificação de marco histórico enviada`);
  } catch (error) {
    console.error("Erro ao enviar notificação de marco:", error);
  }
}

/**
 * Enviar notificação de notícia
 */
export async function sendNewsNotification(title: string, summary: string) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `📰 ${title}`,
        body: summary,
        sound: "default",
        badge: 1,
        data: {
          type: "news",
          title,
          summary,
        },
      },
      trigger: {
        seconds: 20,
      },
    });

    console.log(`✅ Notificação de notícia enviada`);
  } catch (error) {
    console.error("Erro ao enviar notificação de notícia:", error);
  }
}

/**
 * Cancelar todas as notificações agendadas
 */
export async function cancelAllNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log("✅ Todas as notificações foram canceladas");
  } catch (error) {
    console.error("Erro ao cancelar notificações:", error);
  }
}

/**
 * Obter todas as notificações agendadas
 */
export async function getScheduledNotifications() {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log("Notificações agendadas:", notifications);
    return notifications;
  } catch (error) {
    console.error("Erro ao obter notificações agendadas:", error);
    return [];
  }
}
