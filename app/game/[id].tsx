import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { GameStatistics, SubstitutionsDisplay, GameEvents } from "@/components/game-statistics";
import { useState, useEffect } from "react";

/**
 * Tela de detalhes de jogo com estatísticas em tempo real
 */
export default function GameDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"stats" | "events" | "subs">("stats");

  // Mock data - em produção, isso viria da API
  const mockGameData = {
    id: 1,
    opponent: "São Paulo",
    corinthiansScore: 2,
    opponentScore: 1,
    status: "live" as const,
    minute: 67,
    stadium: "Arena Corinthians",
    competition: "Campeonato Paulista",
    isHome: true,
    corinthiansStats: {
      possession: 58,
      shots: 12,
      shotsOnTarget: 5,
      corners: 4,
      fouls: 8,
      yellowCards: 1,
      redCards: 0,
      passes: 456,
      passAccuracy: 82,
      tackles: 15,
      interceptions: 8,
    },
    opponentStats: {
      possession: 42,
      shots: 8,
      shotsOnTarget: 3,
      corners: 2,
      fouls: 10,
      yellowCards: 2,
      redCards: 0,
      passes: 324,
      passAccuracy: 78,
      tackles: 12,
      interceptions: 6,
    },
    events: [
      {
        minute: 15,
        type: "goal" as const,
        player: "Róger Guedes",
        team: "Corinthians" as const,
      },
      {
        minute: 28,
        type: "yellow_card" as const,
        player: "Fábio Santos",
        team: "Corinthians" as const,
      },
      {
        minute: 42,
        type: "goal" as const,
        player: "Yuri Alberto",
        team: "Corinthians" as const,
      },
      {
        minute: 55,
        type: "yellow_card" as const,
        player: "Calleri",
        team: "São Paulo" as const,
      },
      {
        minute: 61,
        type: "goal" as const,
        player: "Luciano",
        team: "São Paulo" as const,
      },
    ],
    substitutions: [
      {
        minute: 45,
        playerOut: "Fábio Santos",
        playerIn: "Matheus Bidu",
        team: "Corinthians" as const,
      },
      {
        minute: 58,
        playerOut: "Róger Guedes",
        playerIn: "Otero",
        team: "Corinthians" as const,
      },
      {
        minute: 60,
        playerOut: "Arboleda",
        playerIn: "Ferraresi",
        team: "São Paulo" as const,
      },
    ],
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header com placar */}
        <View className="bg-black px-6 pt-6 pb-4 gap-4">
          <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-2">
            <Text className="text-white text-lg">←</Text>
            <Text className="text-white font-semibold">{mockGameData.competition}</Text>
          </TouchableOpacity>

          {/* Placar grande */}
          <View className="flex-row items-center justify-between gap-4">
            <View className="flex-1 items-center gap-2">
              <Text className="text-white font-bold text-lg">Corinthians</Text>
              <Text className="text-white font-bold text-5xl">{mockGameData.corinthiansScore}</Text>
              <Text className="text-orange-400 text-xs">
                {mockGameData.isHome ? "Mandante" : "Visitante"}
              </Text>
            </View>

            <View className="items-center gap-2">
              <Text className="text-orange-400 font-bold text-sm">
                {mockGameData.minute}'
              </Text>
              <View className="w-12 h-12 bg-orange-400 rounded-full items-center justify-center">
                <Text className="text-2xl">⚽</Text>
              </View>
              <Text className="text-orange-400 font-bold text-sm">AO VIVO</Text>
            </View>

            <View className="flex-1 items-center gap-2">
              <Text className="text-white font-bold text-lg">{mockGameData.opponent}</Text>
              <Text className="text-white font-bold text-5xl">{mockGameData.opponentScore}</Text>
              <Text className="text-orange-400 text-xs">
                {mockGameData.isHome ? "Visitante" : "Mandante"}
              </Text>
            </View>
          </View>

          {/* Informações do jogo */}
          <View className="bg-surface rounded-lg p-3 gap-2">
            <Text className="text-muted text-xs font-semibold">LOCAL</Text>
            <Text className="text-foreground font-semibold">{mockGameData.stadium}</Text>
          </View>
        </View>

        {/* Tabs */}
        <View className="flex-row border-b border-border px-6 pt-4">
          {["stats", "events", "subs"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab as any)}
              className={`flex-1 pb-3 border-b-2 ${
                activeTab === tab ? "border-primary" : "border-transparent"
              }`}
            >
              <Text
                className={`text-center font-semibold ${
                  activeTab === tab ? "text-primary" : "text-muted"
                }`}
              >
                {tab === "stats"
                  ? "Estatísticas"
                  : tab === "events"
                    ? "Eventos"
                    : "Substituições"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Conteúdo das tabs */}
        <View className="px-6 py-4 gap-6">
          {activeTab === "stats" && (
            <GameStatistics
              corinthiansStats={mockGameData.corinthiansStats}
              opponentStats={mockGameData.opponentStats}
              opponentName={mockGameData.opponent}
            />
          )}

          {activeTab === "events" && <GameEvents events={mockGameData.events} />}

          {activeTab === "subs" && (
            <SubstitutionsDisplay substitutions={mockGameData.substitutions} />
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
