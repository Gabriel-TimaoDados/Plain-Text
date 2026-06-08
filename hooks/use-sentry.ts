import { useEffect, useCallback } from "react";
import { useRoute } from "@react-navigation/native";

interface SentryConfig {
  dsn: string;
  environment: string;
  tracesSampleRate: number;
  release: string;
}

/**
 * Hook para integrar Sentry para crash reporting e monitoramento
 */
export function useSentry() {
  const route = useRoute();

  // Configuração do Sentry
  const sentryConfig: SentryConfig = {
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN || "",
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: 1.0,
    release: "2.6.0",
  };

  // Inicializar Sentry
  useEffect(() => {
    if (sentryConfig.dsn) {
      initializeSentry(sentryConfig);
    }
  }, []);

  // Rastrear navegação
  useEffect(() => {
    if (route.name) {
      captureNavigation(route.name);
    }
  }, [route.name]);

  const captureException = useCallback((error: Error, context?: Record<string, any>) => {
    console.error("[Sentry]", error);
    // Em produção, isso seria enviado para Sentry
    logToSentry({
      level: "error",
      message: error.message,
      stack: error.stack,
      context,
    });
  }, []);

  const captureMessage = useCallback((message: string, level: "info" | "warning" | "error" = "info") => {
    console.log(`[Sentry] ${level.toUpperCase()}: ${message}`);
    logToSentry({
      level,
      message,
    });
  }, []);

  const setUser = useCallback((userId: string, email?: string, username?: string) => {
    console.log("[Sentry] Setting user:", userId);
    // Em produção, isso seria enviado para Sentry
  }, []);

  const clearUser = useCallback(() => {
    console.log("[Sentry] Clearing user");
    // Em produção, isso seria enviado para Sentry
  }, []);

  const addBreadcrumb = useCallback((message: string, category: string, data?: Record<string, any>) => {
    console.log(`[Sentry] Breadcrumb: ${category} - ${message}`);
    // Em produção, isso seria enviado para Sentry
  }, []);

  const startTransaction = useCallback((name: string) => {
    const startTime = Date.now();
    return {
      name,
      startTime,
      finish: () => {
        const duration = Date.now() - startTime;
        captureMessage(`Transaction ${name} completed in ${duration}ms`, "info");
      },
    };
  }, [captureMessage]);

  return {
    captureException,
    captureMessage,
    setUser,
    clearUser,
    addBreadcrumb,
    startTransaction,
  };
}

/**
 * Inicializar Sentry
 */
function initializeSentry(config: SentryConfig) {
  console.log("[Sentry] Initializing with config:", {
    environment: config.environment,
    release: config.release,
  });

  // Em produção, isso seria:
  // import * as Sentry from "@sentry/react-native";
  // Sentry.init({
  //   dsn: config.dsn,
  //   environment: config.environment,
  //   tracesSampleRate: config.tracesSampleRate,
  //   release: config.release,
  // });
}

/**
 * Registrar evento no Sentry
 */
function logToSentry(event: {
  level: string;
  message: string;
  stack?: string;
  context?: Record<string, any>;
}) {
  try {
    // Em produção, isso seria enviado para Sentry
    console.log("[Sentry Event]", event);

    // Simulação de envio para servidor
    // fetch("/api/sentry", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(event),
    // }).catch(err => console.error("Sentry error:", err));
  } catch (error) {
    console.error("Error logging to Sentry:", error);
  }
}

/**
 * Rastrear navegação no Sentry
 */
function captureNavigation(screenName: string) {
  logToSentry({
    level: "info",
    message: `Navigation to ${screenName}`,
    context: {
      screen: screenName,
    },
  });
}

/**
 * Hook para rastrear performance de componentes
 */
export function useComponentPerformance(componentName: string) {
  const { startTransaction } = useSentry();

  useEffect(() => {
    const transaction = startTransaction(`Component.${componentName}`);

    return () => {
      transaction.finish();
    };
  }, [componentName, startTransaction]);
}

/**
 * Hook para rastrear erros de API
 */
export function useAPIErrorTracking() {
  const { captureException, addBreadcrumb } = useSentry();

  const trackAPIError = useCallback(
    (endpoint: string, error: Error, statusCode?: number) => {
      addBreadcrumb(`API Error: ${endpoint}`, "api", {
        statusCode,
        endpoint,
      });

      captureException(error, {
        endpoint,
        statusCode,
      });
    },
    [captureException, addBreadcrumb]
  );

  const trackAPISuccess = useCallback(
    (endpoint: string, duration: number) => {
      addBreadcrumb(`API Success: ${endpoint}`, "api", {
        duration,
      });
    },
    [addBreadcrumb]
  );

  return {
    trackAPIError,
    trackAPISuccess,
  };
}

/**
 * Hook para rastrear performance de renderização
 */
export function useRenderPerformance(componentName: string) {
  const renderStartTime = Date.now();
  const { captureMessage } = useSentry();

  useEffect(() => {
    const renderTime = Date.now() - renderStartTime;

    if (renderTime > 1000) {
      captureMessage(`Slow render detected: ${componentName} took ${renderTime}ms`, "warning");
    }
  }, [componentName, captureMessage]);
}
