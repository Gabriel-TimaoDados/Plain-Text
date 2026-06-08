import { ScrollView, Text, View } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { CoachComparison, CoachStats } from "@/components/coach-comparison";

/**
 * Tela de técnicos do Corinthians
 */
export default function TecnicosScreen() {
  const [selectedCoaches, setSelectedCoaches] = useState<CoachStats[]>([]);

  // Mock data - em produção, isso viria da API
  const mockCoaches: CoachStats[] = [
    {
      id: "1",
      name: "Vítor Pereira",
      nationality: "Portugal",
      startDate: "2022",
      endDate: "2023",
      matches: 38,
      wins: 20,
      draws: 8,
      losses: 10,
      goalsFor: 62,
      goalsAgainst: 42,
      points: 68,
      trophies: ["Campeonato Paulista 2023"],
      style: "Ofensivo",
    },
    {
      id: "2",
      name: "Mano Menezes",
      nationality: "Brasil",
      startDate: "2023",
      endDate: "2024",
      matches: 28,
      wins: 16,
      draws: 6,
      losses: 6,
      goalsFor: 48,
      goalsAgainst: 28,
      points: 54,
      trophies: [],
      style: "Equilibrado",
    },
    {
      id: "3",
      name: "Tite",
      nationality: "Brasil",
      startDate: "2021",
      endDate: "2022",
      matches: 42,
      wins: 24,
      draws: 10,
      losses: 8,
      goalsFor: 78,
      goalsAgainst: 35,
      points: 82,
      trophies: ["Copa do Brasil 2022"],
      style: "Defensivo",
    },
    {
      id: "4",
      name: "Sylvinho",
      nationality: "Brasil",
      startDate: "2020",
      endDate: "2021",
      matches: 35,
      wins: 18,
      draws: 7,
      losses: 10,
      goalsFor: 55,
      goalsAgainst: 40,
      points: 61,
      trophies: [],
      style: "Ofensivo",
    },
  ];

  const handleCoachSelect = (coach: CoachStats) => {
    setSelectedCoaches((prev) => {
      const isSelected = prev.some((c) => c.id === coach.id);
      if (isSelected) {
        return prev.filter((c) => c.id !== coach.id);
      } else {
        return [...prev, coach];
      }
    });
  };

  const currentCoach = mockCoaches[1]; // Mano Menezes é o técnico atual

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-black px-6 pt-6 pb-4 gap-4">
          <Text className="text-white font-bold text-2xl">Técnicos</Text>
          <Text className="text-orange-400 text-sm">Histórico de treinadores</Text>
        </View>

        {/* Técnico Atual */}
        <View className="px-6 py-4 gap-3">
          <Text className="text-foreground font-semibold">Técnico Atual</Text>

          <View className="bg-primary rounded-lg p-4 gap-3">
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="text-white font-bold text-lg">{currentCoach.name}</Text>
                <Text className="text-white text-opacity-80 text-sm">{currentCoach.nationality}</Text>
              </View>
              <View className="items-center">
                <Text className="text-white font-bold text-2xl">
                  {((currentCoach.wins / currentCoach.matches) * 100).toFixed(0)}%
                </Text>
                <Text className="text-white text-opacity-80 text-xs">Aproveitamento</Text>
              </View>
            </View>

            <View className="flex-row gap-2 pt-2 border-t border-white border-opacity-20">
              <View className="flex-1 items-center">
                <Text className="text-white text-opacity-80 text-xs">Partidas</Text>
                <Text className="text-white font-bold text-lg">{currentCoach.matches}</Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="text-white text-opacity-80 text-xs">Vitórias</Text>
                <Text className="text-white font-bold text-lg">{currentCoach.wins}</Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="text-white text-opacity-80 text-xs">Pontos</Text>
                <Text className="text-white font-bold text-lg">{currentCoach.points}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Comparação de Técnicos */}
        <View className="flex-1 px-6 py-4">
          <Text className="text-foreground font-semibold mb-3">Todos os Técnicos</Text>
          <CoachComparison coaches={mockCoaches} onCoachSelect={handleCoachSelect} />
        </View>

        {/* Detalhes dos Técnicos Selecionados */}
        {selectedCoaches.length > 0 && (
          <View className="px-6 py-4 gap-3 border-t border-border">
            <Text className="text-foreground font-semibold">Comparação Detalhada</Text>

            <View className="bg-surface rounded-lg border border-border overflow-hidden">
              <View className="flex-row bg-primary p-3 gap-2">
                <Text className="flex-1 text-white font-semibold text-xs">Técnico</Text>
                <Text className="flex-1 text-white font-semibold text-xs text-right">Vitórias</Text>
                <Text className="flex-1 text-white font-semibold text-xs text-right">Taxa</Text>
              </View>

              {selectedCoaches.map((coach) => (
                <View key={coach.id} className="flex-row p-3 gap-2 border-t border-border">
                  <Text className="flex-1 text-foreground font-medium">{coach.name}</Text>
                  <Text className="flex-1 text-primary font-bold text-right">{coach.wins}</Text>
                  <Text className="flex-1 text-primary font-bold text-right">
                    {((coach.wins / coach.matches) * 100).toFixed(0)}%
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Estatísticas Gerais */}
        <View className="px-6 py-4 gap-3 border-t border-border pb-6">
          <Text className="text-foreground font-semibold text-base">Destaques</Text>

          <View className="gap-2">
            <HighlightCard
              title="Melhor Técnico"
              description="Tite com 82 pontos em 42 partidas (57% de aproveitamento)"
              icon="🏆"
            />
            <HighlightCard
              title="Mais Troféus"
              description="Tite conquistou Copa do Brasil 2022"
              icon="🏅"
            />
            <HighlightCard
              title="Técnico Atual"
              description="Mano Menezes desde 2023 com 54 pontos"
              icon="👨‍💼"
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

interface HighlightCardProps {
  title: string;
  description: string;
  icon: string;
}

function HighlightCard({ title, description, icon }: HighlightCardProps) {
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
