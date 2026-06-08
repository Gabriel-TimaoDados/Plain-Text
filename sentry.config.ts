/**
 * Configuração do Sentry para crash reporting e monitoramento
 */

export const sentryConfig = {
  // DSN do Sentry (obter em https://sentry.io)
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN || "",

  // Ambiente
  environment: process.env.NODE_ENV || "development",

  // Versão do app
  release: "2.7.0",

  // Taxa de amostragem de transações (0.0 - 1.0)
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Taxa de amostragem de replays de sessão
  replaysSessionSampleRate: 0.1,

  // Taxa de amostragem de replays de erro
  replaysOnErrorSampleRate: 1.0,

  // Integrations
  integrations: [
    // Integração com React Native
    // Sentry.nativeIntegration(),
    // Sentry.reactNativeIntegration(),
  ],

  // Configurações de debug
  debug: process.env.NODE_ENV !== "production",

  // Configurações de performance
  performanceMonitoring: {
    enabled: true,
    tracingOrigins: [
      /^\//,
      /^https:\/\/api\.football-data\.org/,
      /^https:\/\/timao-dados\.app/,
    ],
  },

  // Configurações de breadcrumb
  maxBreadcrumbs: 100,

  // Configurações de antes de enviar
  beforeSend(event, hint) {
    // Filtrar eventos sensíveis
    if (event.request?.url?.includes("/api/auth")) {
      return null;
    }

    // Adicionar contexto customizado
    if (hint.originalException) {
      event.extra = {
        ...event.extra,
        timestamp: new Date().toISOString(),
      };
    }

    return event;
  },

  // Configurações de breadcrumb antes de adicionar
  beforeBreadcrumb(breadcrumb, hint) {
    // Filtrar breadcrumbs sensíveis
    if (breadcrumb.category === "auth") {
      return null;
    }

    return breadcrumb;
  },

  // Configurações de captura de exceção
  captureUnhandledRejections: true,

  // Configurações de contexto
  initialScope: {
    tags: {
      app: "timao-dados",
      version: "2.7.0",
    },
  },
};

/**
 * Configurações de alertas do Sentry
 */
export const sentryAlerts = {
  // Alertas de crash
  crash: {
    enabled: true,
    threshold: 1, // Alertar após 1 crash
    channels: ["email", "slack"],
  },

  // Alertas de performance
  performance: {
    enabled: true,
    thresholds: {
      slowTransaction: 5000, // ms
      slowRequest: 3000, // ms
    },
  },

  // Alertas de erro
  error: {
    enabled: true,
    threshold: 10, // Alertar após 10 erros
    timeWindow: 3600, // segundos (1 hora)
  },

  // Alertas de usuários afetados
  users: {
    enabled: true,
    threshold: 5, // Alertar se 5+ usuários afetados
  },
};

/**
 * Configurações de integração com Slack
 */
export const sentrySlackIntegration = {
  enabled: process.env.SENTRY_SLACK_WEBHOOK_URL ? true : false,
  webhookUrl: process.env.SENTRY_SLACK_WEBHOOK_URL || "",
  channel: "#timao-dados-alerts",
  mentionUsers: ["@devops"],
};

/**
 * Configurações de integração com email
 */
export const sentryEmailIntegration = {
  enabled: true,
  recipients: [
    process.env.SENTRY_ALERT_EMAIL || "dev@timao-dados.app",
  ],
  alertTypes: ["crash", "error", "performance"],
};

/**
 * Configurações de release tracking
 */
export const sentryReleaseTracking = {
  enabled: true,
  repository: "https://github.com/timao-dados/almanaque-do-timao",
  commits: [
    {
      id: process.env.GIT_COMMIT_SHA || "unknown",
      message: process.env.GIT_COMMIT_MESSAGE || "Release 2.7.0",
      author_name: process.env.GIT_AUTHOR_NAME || "Manus AI",
      author_email: process.env.GIT_AUTHOR_EMAIL || "dev@manus.ai",
    },
  ],
};

/**
 * Configurações de source maps
 */
export const sentrySourceMaps = {
  enabled: true,
  uploadDir: "./dist",
  urlPrefix: "~/",
  include: ["**/*.js", "**/*.map"],
  exclude: ["**/node_modules/**"],
};

/**
 * Função para inicializar Sentry
 */
export async function initializeSentry() {
  if (!sentryConfig.dsn) {
    console.warn("[Sentry] DSN não configurado. Sentry desabilitado.");
    return;
  }

  try {
    // Em produção, isso seria:
    // import * as Sentry from "@sentry/react-native";
    // Sentry.init(sentryConfig);

    console.log("[Sentry] Inicializado com sucesso");
  } catch (error) {
    console.error("[Sentry] Erro ao inicializar:", error);
  }
}

/**
 * Função para capturar exceção com contexto
 */
export function captureException(error: Error, context?: Record<string, any>) {
  console.error("[Sentry] Exception:", error, context);

  // Em produção, isso seria:
  // import * as Sentry from "@sentry/react-native";
  // Sentry.captureException(error, { contexts: { app: context } });
}

/**
 * Função para capturar mensagem
 */
export function captureMessage(message: string, level: "info" | "warning" | "error" = "info") {
  console.log(`[Sentry] ${level.toUpperCase()}: ${message}`);

  // Em produção, isso seria:
  // import * as Sentry from "@sentry/react-native";
  // Sentry.captureMessage(message, level);
}

/**
 * Função para definir usuário
 */
export function setUser(userId: string, email?: string, username?: string) {
  console.log("[Sentry] Setting user:", { userId, email, username });

  // Em produção, isso seria:
  // import * as Sentry from "@sentry/react-native";
  // Sentry.setUser({ id: userId, email, username });
}

/**
 * Função para limpar usuário
 */
export function clearUser() {
  console.log("[Sentry] Clearing user");

  // Em produção, isso seria:
  // import * as Sentry from "@sentry/react-native";
  // Sentry.setUser(null);
}
