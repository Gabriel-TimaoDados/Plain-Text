import React, { ReactNode } from "react";
import { useVariant, ABTestExperiments } from "@/hooks/use-ab-testing";
import { useSentry } from "@/hooks/use-sentry";

interface ABTestWrapperProps {
  experimentId: string;
  userId: string;
  variants: Record<string, ReactNode>;
  defaultVariant?: string;
  onVariantChange?: (variant: string) => void;
}

/**
 * Componente wrapper para A/B Testing
 */
export function ABTestWrapper({
  experimentId,
  userId,
  variants,
  defaultVariant = "control",
  onVariantChange,
}: ABTestWrapperProps) {
  const { variant, loading } = useVariant(experimentId, userId, defaultVariant);
  const { captureMessage } = useSentry();

  React.useEffect(() => {
    if (!loading && onVariantChange) {
      onVariantChange(variant);
      captureMessage(`A/B Test variant assigned: ${experimentId} - ${variant}`, "info");
    }
  }, [variant, loading, experimentId, onVariantChange, captureMessage]);

  if (loading) {
    return <>{variants[defaultVariant]}</>;
  }

  return <>{variants[variant] || variants[defaultVariant]}</>;
}

/**
 * Componente para testar layout do widget de placar
 */
export function LiveScoreLayoutTest({ children }: { children: ReactNode }) {
  const userId = "user_123"; // Em produção, obter do contexto de autenticação

  return (
    <ABTestWrapper
      experimentId={ABTestExperiments.liveScoreLayout.id}
      userId={userId}
      variants={{
        control: <div className="p-4">{children}</div>,
        compact: <div className="p-2">{children}</div>,
        expanded: <div className="p-6">{children}</div>,
      }}
      defaultVariant="control"
    />
  );
}

/**
 * Componente para testar cor do botão compartilhar
 */
export function ShareButtonColorTest({ children }: { children: ReactNode }) {
  const userId = "user_123";

  return (
    <ABTestWrapper
      experimentId={ABTestExperiments.shareButtonColor.id}
      userId={userId}
      variants={{
        orange: <div className="bg-orange-500">{children}</div>,
        blue: <div className="bg-blue-500">{children}</div>,
      }}
      defaultVariant="orange"
    />
  );
}

/**
 * Componente para testar posição de favoritos
 */
export function FavoritesPositionTest({ children }: { children: ReactNode }) {
  const userId = "user_123";

  return (
    <ABTestWrapper
      experimentId={ABTestExperiments.favoritesPosition.id}
      userId={userId}
      variants={{
        top_right: <div className="absolute top-4 right-4">{children}</div>,
        bottom_right: <div className="absolute bottom-4 right-4">{children}</div>,
      }}
      defaultVariant="top_right"
    />
  );
}

/**
 * Componente para testar frequência de notificações
 */
export function NotificationFrequencyTest({ children }: { children: ReactNode }) {
  const userId = "user_123";

  return (
    <ABTestWrapper
      experimentId={ABTestExperiments.pushNotificationFrequency.id}
      userId={userId}
      variants={{
        low: <div data-notification-frequency="low">{children}</div>,
        medium: <div data-notification-frequency="medium">{children}</div>,
        high: <div data-notification-frequency="high">{children}</div>,
      }}
      defaultVariant="medium"
    />
  );
}

/**
 * Componente para testar animações
 */
export function AnimationsTest({ children }: { children: ReactNode }) {
  const userId = "user_123";

  return (
    <ABTestWrapper
      experimentId={ABTestExperiments.animations.id}
      userId={userId}
      variants={{
        disabled: <div className="animate-none">{children}</div>,
        subtle: <div className="animate-fade">{children}</div>,
        prominent: <div className="animate-bounce">{children}</div>,
      }}
      defaultVariant="subtle"
    />
  );
}

/**
 * Hook para rastrear conversão em A/B Test
 */
export function useABTestConversion(experimentId: string, userId: string) {
  const { trackConversion } = useVariant(experimentId, userId);

  return {
    trackConversion,
  };
}
