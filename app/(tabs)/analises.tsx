import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { PerformanceCharts } from "@/components/performance-charts";
import { useMultipleSeasons } from "@/hooks/use-season-data";

/**
 * Tela de análises da temporada do Corinthians
 */
export default function AnalisesScreen() {
  const [selectedSeason, setSelectedSeason] = useState(2024);
  const { data: seasonData, loading, error } = useMultipleSeasons([2024, 2023, 2022]);

  const seasons = [2024, 2023, 2022];
  const currentSeasonData = seasonData[selectedSeason];

  if (loading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color="#0a7ea4" />
        <Text className="text-foreground mt-4">Carregando dados...</Text>
      </ScreenContainer>
    );
  }

  if (error || !currentSeasonData) {
    return (
      <ScreenContainer className="items-center justify-center p-6">
        <Text className="text-error font-bold text-lg">Erro ao carregar dados</Text>
        <Text className="text-muted mt-2">{error || "Dados não disponíveis"}</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-black px-6 pt-6 pb-4 gap-4">
          <Text className="text-white font-bold text-2xl">Análises</Text>
          <Text className="text-orange-400 text-sm">Desempenho do Corinthians</Text>
        </View>

        {/* Seletor de Temporada */}
        <View className="px-6 py-4 gap-3">
          <Text className="text-foreground font-semibold">Temporada</Text>
          <View className="flex-row gap-2">
            {seasons.map((season) => (
              <TouchableOpacity
                key={season}
                onPress={() => setSelectedSeason(season)}
                className={`flex-1 py-2 px-3 rounded-lg border ${
                  selectedSeason === season
                    ? "bg-primary border-primary"
                    : "bg-surface border-border"
                }`}
              >
                <Text
                  className={`text-center font-semibold ${
                    selectedSeason === season ? "text-white" : "text-foreground"
                  }`}
                >
                  {season}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Gráficos */}
        <View className="pb-6">
          <PerformanceCharts seasonStats={currentSeasonData} />
        </View>

        {/* Seção de Comparação */}
        <View className="px-6 py-4 gap-3">
          <Text className="text-foreground font-semibold text-base">
            Comparação com Temporadas Anteriores
          </Text>

          <View className="bg-surface rounded-lg border border-border overflow-hidden">
            <View className="flex-row bg-primary p-3 gap-2">
              <Text className="flex-1 text-white font-semibold text-xs">Temporada</Text>
              <Text className="flex-1 text-white font-semibold text-xs text-right">Pontos</Text>
              <Text className="flex-1 text-white font-semibold text-xs text-right">Gols</Text>
            </View>

            {seasons.map((season) => {
              const data = seasonData[season];
              if (!data) return null;
              return (
                <View
                  key={season}
                  className="flex-row p-3 gap-2 border-t border-border items-center"
                >
                  <Text className="flex-1 text-foreground font-semibold">{season}</Text>
                  <Text className="flex-1 text-primary font-bold text-right">{data.points}</Text>
                  <Text className="flex-1 text-primary font-bold text-right">{data.goalsFor}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Destaques */}
        <View className="px-6 py-4 gap-3">
          <Text className="text-foreground font-semibold text-base">Destaques da Temporada</Text>

          <View className="gap-2">
            <HighlightCard
              icon="🏆"
              title="Melhor Desempenho"
              value={`${currentSeasonData.wins} Vitórias`}
              subtitle="Maior número de vitórias"
            />
            <HighlightCard
              icon="⚽"
              title="Maior Ataque"
              value={`${currentSeasonData.goalsFor} Gols`}
              subtitle="Gols marcados na temporada"
            />
            <HighlightCard
              icon="🛡️"
              title="Melhor Defesa"
              value={`${currentSeasonData.goalsAgainst} Gols`}
              subtitle="Gols sofridos na temporada"
            />
            <HighlightCard
              icon="📊"
              title="Saldo de Gols"
              value={`+${currentSeasonData.goalDifference}`}
              subtitle="Diferença entre marcados e sofridos"
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

interface HighlightCardProps {
  icon: string;
  title: string;
  value: string;
  subtitle: string;
}

function HighlightCard({ icon, title, value, subtitle }: HighlightCardProps) {
  return (
    <View className="bg-surface rounded-lg border border-border p-4 flex-row items-center gap-3">
      <View className="w-12 h-12 bg-primary rounded-lg items-center justify-center">
        <Text className="text-2xl">{icon}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-foreground font-semibold">{title}</Text>
        <Text className="text-primary font-bold text-lg">{value}</Text>
        <Text className="text-muted text-xs">{subtitle}</Text>
      </View>
    </View>
  );
}
