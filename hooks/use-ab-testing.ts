import { useEffect, useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Variant {
  name: string;
  weight: number;
}

interface Experiment {
  id: string;
  name: string;
  variants: Variant[];
  active: boolean;
  startDate: string;
  endDate?: string;
}

interface UserVariant {
  experimentId: string;
  variant: string;
  assignedAt: string;
}

/**
 * Hook para A/B Testing
 */
export function useABTesting() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [userVariants, setUserVariants] = useState<Map<string, UserVariant>>(new Map());

  // Carregar experimentos ao iniciar
  useEffect(() => {
    loadExperiments();
  }, []);

  const loadExperiments = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem("ab_experiments");
      if (stored) {
        setExperiments(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading experiments:", error);
    }
  }, []);

  const loadUserVariants = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem("ab_user_variants");
      if (stored) {
        const data = JSON.parse(stored);
        setUserVariants(new Map(data));
      }
    } catch (error) {
      console.error("Error loading user variants:", error);
    }
  }, []);

  const createExperiment = useCallback(
    async (experiment: Experiment) => {
      try {
        const updated = [...experiments, experiment];
        setExperiments(updated);
        await AsyncStorage.setItem("ab_experiments", JSON.stringify(updated));
      } catch (error) {
        console.error("Error creating experiment:", error);
      }
    },
    [experiments]
  );

  const assignVariant = useCallback(
    async (experimentId: string, userId: string) => {
      const experiment = experiments.find((e) => e.id === experimentId);
      if (!experiment) {
        throw new Error(`Experiment ${experimentId} not found`);
      }

      // Verificar se usuário já tem variante atribuída
      const key = `${experimentId}_${userId}`;
      if (userVariants.has(key)) {
        return userVariants.get(key)!.variant;
      }

      // Atribuir variante baseado em peso
      const variant = selectVariant(experiment.variants, userId);

      const userVariant: UserVariant = {
        experimentId,
        variant,
        assignedAt: new Date().toISOString(),
      };

      const updated = new Map(userVariants);
      updated.set(key, userVariant);
      setUserVariants(updated);

      try {
        await AsyncStorage.setItem("ab_user_variants", JSON.stringify(Array.from(updated.entries())));
      } catch (error) {
        console.error("Error saving user variant:", error);
      }

      return variant;
    },
    [experiments, userVariants]
  );

  const getUserVariant = useCallback(
    (experimentId: string, userId: string) => {
      const key = `${experimentId}_${userId}`;
      return userVariants.get(key)?.variant;
    },
    [userVariants]
  );

  const trackConversion = useCallback(
    async (experimentId: string, userId: string, conversionValue: number = 1) => {
      const variant = getUserVariant(experimentId, userId);
      if (!variant) {
        console.warn(`No variant found for experiment ${experimentId}`);
        return;
      }

      try {
        // Registrar conversão
        const conversionKey = `conversion_${experimentId}_${userId}`;
        const existing = await AsyncStorage.getItem(conversionKey);
        const count = (existing ? parseInt(existing) : 0) + conversionValue;
        await AsyncStorage.setItem(conversionKey, count.toString());

        console.log(`[A/B Test] Conversion tracked: ${experimentId} - ${variant} - ${count}`);
      } catch (error) {
        console.error("Error tracking conversion:", error);
      }
    },
    [getUserVariant]
  );

  const getExperimentStats = useCallback(
    async (experimentId: string) => {
      const experiment = experiments.find((e) => e.id === experimentId);
      if (!experiment) {
        throw new Error(`Experiment ${experimentId} not found`);
      }

      const stats: Record<string, { users: number; conversions: number; rate: number }> = {};

      for (const variant of experiment.variants) {
        const variantUsers = Array.from(userVariants.values()).filter(
          (uv) => uv.experimentId === experimentId && uv.variant === variant.name
        ).length;

        let totalConversions = 0;
        for (const [key] of userVariants) {
          const conversionKey = `conversion_${experimentId}_${key.split("_")[1]}`;
          const conversions = await AsyncStorage.getItem(conversionKey);
          if (conversions) {
            totalConversions += parseInt(conversions);
          }
        }

        stats[variant.name] = {
          users: variantUsers,
          conversions: totalConversions,
          rate: variantUsers > 0 ? totalConversions / variantUsers : 0,
        };
      }

      return stats;
    },
    [experiments, userVariants]
  );

  const endExperiment = useCallback(
    async (experimentId: string) => {
      const updated = experiments.map((e) =>
        e.id === experimentId ? { ...e, active: false, endDate: new Date().toISOString() } : e
      );
      setExperiments(updated);
      await AsyncStorage.setItem("ab_experiments", JSON.stringify(updated));
    },
    [experiments]
  );

  return {
    experiments,
    createExperiment,
    assignVariant,
    getUserVariant,
    trackConversion,
    getExperimentStats,
    endExperiment,
  };
}

/**
 * Selecionar variante baseado em peso
 */
function selectVariant(variants: Variant[], userId: string): string {
  // Hash do userId para distribuição consistente
  const hash = hashCode(userId);
  const random = Math.abs(hash) % 100;

  let cumulativeWeight = 0;
  for (const variant of variants) {
    cumulativeWeight += variant.weight;
    if (random < cumulativeWeight) {
      return variant.name;
    }
  }

  return variants[variants.length - 1].name;
}

/**
 * Gerar hash simples do userId
 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

/**
 * Hook para usar variante em componente
 */
export function useVariant(experimentId: string, userId: string, defaultVariant: string = "control") {
  const { assignVariant, trackConversion } = useABTesting();
  const [variant, setVariant] = useState<string>(defaultVariant);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVariant = async () => {
      try {
        const assigned = await assignVariant(experimentId, userId);
        setVariant(assigned);
      } catch (error) {
        console.error("Error loading variant:", error);
        setVariant(defaultVariant);
      } finally {
        setLoading(false);
      }
    };

    loadVariant();
  }, [experimentId, userId, assignVariant, defaultVariant]);

  const trackConversionEvent = useCallback(
    (value: number = 1) => {
      trackConversion(experimentId, userId, value);
    },
    [experimentId, userId, trackConversion]
  );

  return {
    variant,
    loading,
    trackConversion: trackConversionEvent,
  };
}

/**
 * Predefinições de experimentos comuns
 */
export const ABTestExperiments = {
  // Teste de layout do widget de placar
  liveScoreLayout: {
    id: "live_score_layout",
    name: "Live Score Widget Layout",
    variants: [
      { name: "control", weight: 50 },
      { name: "compact", weight: 25 },
      { name: "expanded", weight: 25 },
    ],
    active: true,
    startDate: new Date().toISOString(),
  },

  // Teste de cor de botão compartilhar
  shareButtonColor: {
    id: "share_button_color",
    name: "Share Button Color",
    variants: [
      { name: "orange", weight: 50 },
      { name: "blue", weight: 50 },
    ],
    active: true,
    startDate: new Date().toISOString(),
  },

  // Teste de posição de favoritos
  favoritesPosition: {
    id: "favorites_position",
    name: "Favorites Button Position",
    variants: [
      { name: "top_right", weight: 50 },
      { name: "bottom_right", weight: 50 },
    ],
    active: true,
    startDate: new Date().toISOString(),
  },

  // Teste de notificações push
  pushNotificationFrequency: {
    id: "push_notification_frequency",
    name: "Push Notification Frequency",
    variants: [
      { name: "low", weight: 33 },
      { name: "medium", weight: 33 },
      { name: "high", weight: 34 },
    ],
    active: true,
    startDate: new Date().toISOString(),
  },

  // Teste de animações
  animations: {
    id: "animations",
    name: "Animation Effects",
    variants: [
      { name: "disabled", weight: 25 },
      { name: "subtle", weight: 50 },
      { name: "prominent", weight: 25 },
    ],
    active: true,
    startDate: new Date().toISOString(),
  },
};
