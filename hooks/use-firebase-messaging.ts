import { useEffect, useCallback, useState } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/**
 * Hook para gerenciar Firebase Cloud Messaging (FCM)
 * Nota: Em ambiente Expo, usamos expo-notifications que se integra com FCM
 */
export function useFirebaseMessaging() {
  const [deviceToken, setDeviceToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  /**
   * Inicializa Firebase Messaging
   */
  const initializeMessaging = useCallback(async () => {
    if (Platform.OS === "web") {
      console.log("Firebase Messaging não disponível na web");
      setIsReady(true);
      return;
    }

    try {
      // Solicitar permissões
      const { status } = await Notifications.requestPermissionsAsync();

      if (status !== "granted") {
        console.warn("Permissão de notificação não concedida");
        setIsReady(true);
        return;
      }

      // Obter token do dispositivo
      const token = await Notifications.getExpoPushTokenAsync();

      if (token.data) {
        setDeviceToken(token.data);
        console.log("Token de dispositivo obtido:", token.data);

        // Em produção, enviar este token para seu servidor
        // para registrar o dispositivo e enviar notificações
        await registerDeviceToken(token.data);
      }

      setIsReady(true);
    } catch (error) {
      console.error("Erro ao inicializar Firebase Messaging:", error);
      setIsReady(true);
    }
  }, []);

  /**
   * Registra token do dispositivo no servidor
   */
  const registerDeviceToken = useCallback(async (token: string) => {
    try {
      // Em produção, fazer chamada para seu servidor
      // POST /api/devices/register com { token, platform, userId }
      console.log("Registrando token do dispositivo:", token);

      // Exemplo de chamada para servidor:
      // await fetch('https://seu-servidor.com/api/devices/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     token,
      //     platform: Platform.OS,
      //     userId: userId, // Se houver autenticação
      //   }),
      // });
    } catch (error) {
      console.error("Erro ao registrar token do dispositivo:", error);
    }
  }, []);

  /**
   * Envia notificação de teste
   */
  const sendTestNotification = useCallback(async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🧪 Notificação de Teste",
          body: "Firebase Messaging está funcionando corretamente!",
          sound: "default",
          badge: 1,
        },
        trigger: null, // Imediata
      });

      console.log("Notificação de teste enviada");
    } catch (error) {
      console.error("Erro ao enviar notificação de teste:", error);
    }
  }, []);

  /**
   * Configura listener para notificações recebidas
   */
  useEffect(() => {
    initializeMessaging();

    // Listener para notificações recebidas enquanto app está em foreground
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notificação recebida:", notification);

        // Processar notificação baseado no tipo
        const data = notification.request.content.data;
        if (data.type === "goal") {
          console.log("🎉 Notificação de gol recebida!");
        } else if (data.type === "card") {
          console.log("🟨 Notificação de cartão recebida!");
        }
      }
    );

    // Listener para notificações clicadas
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("Notificação clicada:", response);

        const data = response.notification.request.content.data;
        // Navegar para tela apropriada baseado no tipo de notificação
        // Por exemplo: router.push(`/game/${data.gameId}`)
      }
    );

    return () => {
      subscription.remove();
      responseSubscription.remove();
    };
  }, [initializeMessaging]);

  return {
    deviceToken,
    isReady,
    sendTestNotification,
  };
}

/**
 * Hook para gerenciar tópicos de notificação
 */
export function useNotificationTopics() {
  /**
   * Inscrever em tópico de notificações
   */
  const subscribeToTopic = useCallback(async (topic: string) => {
    try {
      console.log(`Inscrito no tópico: ${topic}`);

      // Em produção, fazer chamada para seu servidor
      // POST /api/subscriptions/topics com { topic, deviceToken }
      // O servidor se encarrega de inscrever o dispositivo no tópico via Firebase Admin SDK

      // Exemplo:
      // await fetch('https://seu-servidor.com/api/subscriptions/topics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     topic,
      //     deviceToken: await Notifications.getExpoPushTokenAsync(),
      //   }),
      // });
    } catch (error) {
      console.error(`Erro ao inscrever no tópico ${topic}:`, error);
    }
  }, []);

  /**
   * Desinscrever de tópico de notificações
   */
  const unsubscribeFromTopic = useCallback(async (topic: string) => {
    try {
      console.log(`Desinscrito do tópico: ${topic}`);

      // Em produção, fazer chamada para seu servidor
      // DELETE /api/subscriptions/topics/{topic} com { deviceToken }
    } catch (error) {
      console.error(`Erro ao desinscrever do tópico ${topic}:`, error);
    }
  }, []);

  /**
   * Inscrever em tópicos padrão do Corinthians
   */
  const subscribeToCorinthiansTopics = useCallback(async () => {
    const topics = [
      "corinthians-live-games", // Partidas ao vivo
      "corinthians-goals", // Gols do Corinthians
      "corinthians-news", // Notícias
      "corinthians-transfers", // Mercado
    ];

    for (const topic of topics) {
      await subscribeToTopic(topic);
    }
  }, [subscribeToTopic]);

  return {
    subscribeToTopic,
    unsubscribeFromTopic,
    subscribeToCorinthiansTopics,
  };
}

/**
 * Hook para gerenciar preferências de notificação
 */
export function useNotificationPreferences() {
  const [preferences, setPreferences] = useState({
    goals: true,
    cards: true,
    substitutions: true,
    news: true,
    transfers: true,
  });

  /**
   * Atualizar preferência de notificação
   */
  const updatePreference = useCallback(
    (key: keyof typeof preferences, value: boolean) => {
      setPreferences((prev) => ({
        ...prev,
        [key]: value,
      }));

      // Salvar preferência no AsyncStorage ou servidor
      console.log(`Preferência atualizada: ${key} = ${value}`);
    },
    []
  );

  /**
   * Obter todas as preferências
   */
  const getPreferences = useCallback(() => preferences, [preferences]);

  return {
    preferences,
    updatePreference,
    getPreferences,
  };
}
