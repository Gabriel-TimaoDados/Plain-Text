import { useEffect, useCallback } from "react";
import { useRoute } from "@react-navigation/native";

interface AnalyticsEvent {
  name: string;
  parameters?: Record<string, string | number | boolean>;
}

/**
 * Hook para integrar Google Analytics
 */
export function useAnalytics() {
  const route = useRoute();

  // Rastrear visualização de página
  useEffect(() => {
    if (route.name) {
      trackPageView(route.name);
    }
  }, [route.name]);

  const trackPageView = useCallback((pageName: string) => {
    const event: AnalyticsEvent = {
      name: "page_view",
      parameters: {
        page_title: pageName,
        timestamp: new Date().toISOString(),
      },
    };

    logEvent(event);
  }, []);

  const trackEvent = useCallback((eventName: string, parameters?: Record<string, any>) => {
    const event: AnalyticsEvent = {
      name: eventName,
      parameters: {
        ...parameters,
        timestamp: new Date().toISOString(),
      },
    };

    logEvent(event);
  }, []);

  const trackShare = useCallback((platform: string, itemType: string, itemId: string) => {
    trackEvent("share", {
      platform,
      item_type: itemType,
      item_id: itemId,
    });
  }, [trackEvent]);

  const trackFavorite = useCallback((action: "add" | "remove", itemType: string, itemId: string) => {
    trackEvent("favorite", {
      action,
      item_type: itemType,
      item_id: itemId,
    });
  }, [trackEvent]);

  const trackSearch = useCallback((query: string, resultsCount: number) => {
    trackEvent("search", {
      query,
      results_count: resultsCount,
    });
  }, [trackEvent]);

  const trackNotification = useCallback((type: string, action: "received" | "clicked") => {
    trackEvent("notification", {
      notification_type: type,
      action,
    });
  }, [trackEvent]);

  const trackPredictionView = useCallback((gameId: string, confidence: number) => {
    trackEvent("prediction_view", {
      game_id: gameId,
      confidence: Math.round(confidence * 100),
    });
  }, [trackEvent]);

  const trackGameView = useCallback((gameId: string, status: string) => {
    trackEvent("game_view", {
      game_id: gameId,
      game_status: status,
    });
  }, [trackEvent]);

  const trackPlayerView = useCallback((playerId: string, playerName: string) => {
    trackEvent("player_view", {
      player_id: playerId,
      player_name: playerName,
    });
  }, [trackEvent]);

  const trackError = useCallback((errorName: string, errorMessage: string) => {
    trackEvent("error", {
      error_name: errorName,
      error_message: errorMessage,
    });
  }, [trackEvent]);

  return {
    trackPageView,
    trackEvent,
    trackShare,
    trackFavorite,
    trackSearch,
    trackNotification,
    trackPredictionView,
    trackGameView,
    trackPlayerView,
    trackError,
  };
}

/**
 * Função auxiliar para registrar eventos (mock para Google Analytics)
 */
function logEvent(event: AnalyticsEvent) {
  // Em produção, isso seria enviado para Google Analytics
  console.log("[Analytics]", event.name, event.parameters);

  // Simulação de envio para servidor
  try {
    // fetch("/api/analytics", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(event),
    // }).catch(err => console.error("Analytics error:", err));
  } catch (error) {
    console.error("Error logging analytics:", error);
  }
}

/**
 * Hook para rastrear tempo de sessão
 */
export function useSessionTracking() {
  useEffect(() => {
    const startTime = Date.now();

    return () => {
      const sessionDuration = Date.now() - startTime;
      logEvent({
        name: "session_end",
        parameters: {
          session_duration_ms: sessionDuration,
        },
      });
    };
  }, []);
}

/**
 * Hook para rastrear performance
 */
export function usePerformanceTracking() {
  useEffect(() => {
    if (typeof window !== "undefined" && "performance" in window) {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

      logEvent({
        name: "page_load_performance",
        parameters: {
          page_load_time_ms: pageLoadTime,
          dom_ready_time_ms: perfData.domContentLoadedEventEnd - perfData.navigationStart,
        },
      });
    }
  }, []);
}
