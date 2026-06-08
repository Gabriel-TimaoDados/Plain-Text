import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import {
  useAIPredictions,
  Prediction,
  getResultEmoji,
  getResultText,
  getConfidenceLabel,
} from "@/hooks/use-ai-predictions";

/**
 * Tela de previsões de resultados com IA
 */
export default function PrevisoeScreen() {
  const { getPrediction, loading, error } = useAIPredictions();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);

  // Mock próximos jogos
  const upcomingMatches = [
    { opponent: "São Paulo", date: "15 de Junho" },
    { opponent: "Palmeiras", date: "22 de Junho" },
    { opponent: "Santos", date: "29 de Junho" },
    { opponent: "Botafogo", date: "6 de Julho" },
  ];

  // Mock dados da temporada
  const seasonStats = {
    wins: 16,
    draws: 6,
    losses: 6,
    goalsFor: 48,
    goalsAgainst: 28,
  };

  const recentForm = [
    { result: "win" as const, goalsFor: 2, goalsAgainst: 1 },
    { result: "win" as const, goalsFor: 1, goalsAgainst: 0 },
    { result: "draw" as const, goalsFor: 1, goalsAgainst: 1 },
    { result: "win" as const, goalsFor: 3, goalsAgainst: 1 },
    { result: "loss" as const, goalsFor: 0, goalsAgainst: 2 },
  ];

  useEffect(() => {
    const generatePredictions = async () => {
      const newPredictions: Prediction[] = [];

      for (const match of upcomingMatches) {
        const prediction = await getPrediction({
          opponent: match.opponent,
          recentForm,
          seasonStats,
        });

        if (prediction) {
          newPredictions.push(prediction);
        }
      }

      setPredictions(newPredictions);
    };

    generatePredictions();
  }, []);

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-black px-6 pt-6 pb-4 gap-4">
          <Text className="text-white font-bold text-2xl">Previsões</Text>
          <Text className="text-orange-400 text-sm">Análise com IA dos próximos jogos</Text>
        </View>

        {/* Loading State */}
        {loading && predictions.length === 0 && (
          <View className="flex-1 items-center justify-center py-12">
            <ActivityIndicator size="large" color="#0a7ea4" />
            <Text className="text-foreground mt-4">Gerando previsões...</Text>
          </View>
        )}

        {/* Error State */}
        {error && (
          <View className="px-6 py-4">
            <View className="bg-error bg-opacity-10 rounded-lg border border-error p-4">
              <Text className="text-error font-bold">Erro ao gerar previsões</Text>
              <Text className="text-error text-sm mt-1">{error}</Text>
            </View>
          </View>
        )}

        {/* Predictions List */}
        {predictions.length > 0 && (
          <View className="px-6 py-4 gap-3">
            <Text className="text-foreground font-semibold text-base">Próximos Jogos</Text>

            {predictions.map((prediction, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedPrediction(prediction)}
                className="bg-surface rounded-lg border border-border p-4 gap-3"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-foreground font-bold text-base">
                      Corinthians vs {prediction.opponent}
                    </Text>
                    <Text className="text-muted text-xs mt-1">
                      {upcomingMatches[index]?.date}
                    </Text>
                  </View>
                  <View className="items-center gap-1">
                    <Text className="text-3xl">{getResultEmoji(prediction.predictedResult)}</Text>
                    <Text className="text-primary font-bold text-xs">
                      {(prediction.confidence * 100).toFixed(0)}%
                    </Text>
                  </View>
                </View>

                <View className="flex-row gap-2 items-center pt-2 border-t border-border">
                  <View className="flex-1 items-center py-2 bg-primary bg-opacity-10 rounded">
                    <Text className="text-foreground text-xs">Corinthians</Text>
                    <Text className="text-primary font-bold text-lg">
                      {prediction.expectedGoals.corinthians.toFixed(1)}
                    </Text>
                  </View>
                  <View className="flex-1 items-center py-2 bg-border rounded">
                    <Text className="text-foreground text-xs">{prediction.opponent}</Text>
                    <Text className="text-foreground font-bold text-lg">
                      {prediction.expectedGoals.opponent.toFixed(1)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Detailed Prediction */}
        {selectedPrediction && (
          <View className="px-6 py-4 gap-3 border-t border-border">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-foreground font-semibold text-base">Análise Detalhada</Text>
              <TouchableOpacity onPress={() => setSelectedPrediction(null)}>
                <Text className="text-primary font-bold">✕</Text>
              </TouchableOpacity>
            </View>

            <View className="bg-surface rounded-lg border border-border p-4 gap-4">
              {/* Resultado Previsto */}
              <View className="items-center gap-2">
                <Text className="text-5xl">{getResultEmoji(selectedPrediction.predictedResult)}</Text>
                <Text className="text-foreground font-bold text-xl">
                  {getResultText(selectedPrediction.predictedResult)}
                </Text>
                <Text className="text-primary font-bold">
                  Confiança: {getConfidenceLabel(selectedPrediction.confidence)}
                </Text>
              </View>

              {/* Placar Esperado */}
              <View className="bg-black rounded-lg p-4 gap-2">
                <Text className="text-white text-center text-xs font-semibold">PLACAR ESPERADO</Text>
                <View className="flex-row items-center justify-between">
                  <View className="items-center">
                    <Text className="text-white font-bold text-2xl">
                      {selectedPrediction.expectedGoals.corinthians.toFixed(1)}
                    </Text>
                    <Text className="text-white text-xs">Corinthians</Text>
                  </View>
                  <Text className="text-white text-xl font-bold">vs</Text>
                  <View className="items-center">
                    <Text className="text-white font-bold text-2xl">
                      {selectedPrediction.expectedGoals.opponent.toFixed(1)}
                    </Text>
                    <Text className="text-white text-xs">{selectedPrediction.opponent}</Text>
                  </View>
                </View>
              </View>

              {/* Reasoning */}
              <View className="gap-2">
                <Text className="text-foreground font-semibold">Análise</Text>
                <Text className="text-muted text-sm leading-relaxed">
                  {selectedPrediction.reasoning}
                </Text>
              </View>

              {/* Confidence Breakdown */}
              <View className="gap-2">
                <Text className="text-foreground font-semibold">Confiança</Text>
                <View className="bg-border rounded-full h-2 overflow-hidden">
                  <View
                    className="bg-primary h-full"
                    style={{ width: `${selectedPrediction.confidence * 100}%` }}
                  />
                </View>
                <Text className="text-muted text-xs">
                  {(selectedPrediction.confidence * 100).toFixed(0)}% de certeza
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Insights */}
        <View className="px-6 py-4 gap-3 border-t border-border pb-6">
          <Text className="text-foreground font-semibold text-base">Insights</Text>

          <View className="gap-2">
            <InsightCard
              title="Forma Recente"
              description="Corinthians com 3 vitórias nos últimos 5 jogos (60% de aproveitamento)"
              icon="🔥"
            />
            <InsightCard
              title="Confrontos Diretos"
              description="Histórico favorável contra a maioria dos próximos adversários"
              icon="💪"
            />
            <InsightCard
              title="Recomendação"
              description="Apostar em vitória do Corinthians em 3 dos 4 próximos jogos"
              icon="⭐"
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

interface InsightCardProps {
  title: string;
  description: string;
  icon: string;
}

function InsightCard({ title, description, icon }: InsightCardProps) {
  return (
    <View className="bg-surface rounded-lg border border-border p-3 flex-row gap-3">
      <View className="w-10 h-10 bg-primary rounded-lg items-center justify-center">
        <Text className="text-lg">{icon}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-foreground font-semibold text-sm">{title}</Text>
        <Text className="text-muted text-xs mt-1">{description}</Text>
      </View>
    </View>
  );
}
