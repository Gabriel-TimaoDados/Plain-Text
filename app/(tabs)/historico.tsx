import { ScrollView, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { PerformanceHistory, MonthlyStats } from "@/components/performance-history";

/**
 * Tela de histórico e evolução da temporada
 */
export default function HistoricoScreen() {
  // Mock data - em produção, isso viria da API
  const monthlyData: MonthlyStats[] = [
    {
      month: "Janeiro",
      matches: 4,
      wins: 3,
      draws: 1,
      losses: 0,
      goalsFor: 10,
      goalsAgainst: 2,
      points: 10,
    },
    {
      month: "Fevereiro",
      matches: 4,
      wins: 2,
      draws: 1,
      losses: 1,
      goalsFor: 7,
      goalsAgainst: 4,
      points: 7,
    },
    {
      month: "Março",
      matches: 5,
      wins: 3,
      draws: 1,
      losses: 1,
      goalsFor: 12,
      goalsAgainst: 5,
      points: 10,
    },
    {
      month: "Abril",
      matches: 4,
      wins: 2,
      draws: 2,
      losses: 0,
      goalsFor: 8,
      goalsAgainst: 3,
      points: 8,
    },
    {
      month: "Maio",
      matches: 4,
      wins: 3,
      draws: 0,
      losses: 1,
      goalsFor: 9,
      goalsAgainst: 4,
      points: 9,
    },
    {
      month: "Junho",
      matches: 3,
      wins: 3,
      draws: 0,
      losses: 0,
      goalsFor: 2,
      goalsAgainst: 10,
      points: 0,
    },
  ];

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-black px-6 pt-6 pb-4 gap-4">
          <Text className="text-white font-bold text-2xl">Histórico</Text>
          <Text className="text-orange-400 text-sm">Evolução da Temporada 2024</Text>
        </View>

        {/* Performance History Component */}
        <View className="flex-1">
          <PerformanceHistory monthlyData={monthlyData} />
        </View>

        {/* Insights */}
        <View className="px-6 py-4 gap-3 border-t border-border">
          <Text className="text-foreground font-semibold text-base">Insights</Text>

          <View className="gap-2">
            <InsightCard
              title="Melhor Desempenho"
              description="Março foi o melhor mês com 3 vitórias e 12 gols marcados"
              icon="🔥"
            />
            <InsightCard
              title="Consistência"
              description="Corinthians ganhou em 4 dos 6 meses (67% de aproveitamento)"
              icon="💪"
            />
            <InsightCard
              title="Defesa"
              description="Média de 3.8 gols sofridos por mês, melhorando ao longo da temporada"
              icon="🛡️"
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
    <View className="bg-surface rounded-lg border border-border p-4 flex-row gap-3">
      <View className="w-10 h-10 bg-primary rounded-lg items-center justify-center">
        <Text className="text-lg">{icon}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-foreground font-semibold">{title}</Text>
        <Text className="text-muted text-sm mt-1">{description}</Text>
      </View>
    </View>
  );
}
