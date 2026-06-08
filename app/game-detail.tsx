import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";

interface GameDetail {
  id: number;
  gameDate: string;
  gameTime: string;
  location: string;
  stadium: string;
  competition: string;
  opponent: string;
  isHome: boolean;
  corinthiansScore: number;
  opponentScore: number;
  attendance: number;
  referee: string;
  goals: Array<{
    scorer: string;
    minute: number;
    type: string;
    assist?: string;
  }>;
  yellowCards: Array<{
    player: string;
    minute: number;
  }>;
  redCards: Array<{
    player: string;
    minute: number;
  }>;
  substitutions: Array<{
    playerIn: string;
    playerOut: string;
    minute: number;
  }>;
  gameStats: {
    possession: number;
    shots: number;
    shotsOnTarget: number;
    passes: number;
    tackles: number;
    fouls: number;
    offsides: number;
    corners: number;
  };
}

export default function GameDetailScreen() {
  const router = useRouter();
  const colors = useColors();
  const { gameId } = useLocalSearchParams();
  const [selectedTab, setSelectedTab] = useState<"resumo" | "gols" | "cartoes" | "stats">("resumo");

  // Mock data - será substituído por dados reais da API
  const game: GameDetail = {
    id: parseInt(gameId as string) || 1,
    gameDate: "2026-05-31",
    gameTime: "19:00",
    location: "São Paulo, SP",
    stadium: "Arena Corinthians",
    competition: "Campeonato Brasileiro",
    opponent: "São Paulo FC",
    isHome: true,
    corinthiansScore: 2,
    opponentScore: 1,
    attendance: 45000,
    referee: "Wilton Pereira Sampaio",
    goals: [
      {
        scorer: "Yuri Alberto",
        minute: 23,
        type: "normal",
        assist: "Garro",
      },
      {
        scorer: "Romero",
        minute: 67,
        type: "normal",
        assist: "Matheuzinho",
      },
    ],
    yellowCards: [
      {
        player: "Fábio Santos",
        minute: 34,
      },
      {
        player: "Luciano",
        minute: 45,
      },
    ],
    redCards: [],
    substitutions: [
      {
        playerIn: "Matheus Araújo",
        playerOut: "Fábio Santos",
        minute: 72,
      },
    ],
    gameStats: {
      possession: 58,
      shots: 14,
      shotsOnTarget: 6,
      passes: 487,
      tackles: 18,
      fouls: 12,
      offsides: 2,
      corners: 7,
    },
  };

  const handleBack = () => {
    router.back();
  };

  const resultColor = game.corinthiansScore > game.opponentScore
    ? "text-success"
    : game.corinthiansScore < game.opponentScore
      ? "text-error"
      : "text-muted";

  return (
    <ScreenContainer className="p-0">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-primary p-6">
          <Pressable onPress={handleBack} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
            <Text className="text-background text-lg mb-4">← Voltar</Text>
          </Pressable>

          <View className="items-center gap-2">
            <Text className="text-background text-sm">{game.competition}</Text>
            <Text className="text-background text-xs opacity-80">{game.gameDate} às {game.gameTime}</Text>
          </View>
        </View>

        {/* Placar */}
        <View className="bg-surface p-6 items-center gap-4 border-b border-border">
          <View className="flex-row items-center gap-4">
            <View className="flex-1 items-center">
              <Text className="text-foreground text-sm font-semibold mb-2">Corinthians</Text>
              <Text className={cn("text-5xl font-bold", resultColor)}>
                {game.corinthiansScore}
              </Text>
            </View>

            <Text className="text-foreground text-2xl font-bold">×</Text>

            <View className="flex-1 items-center">
              <Text className="text-foreground text-sm font-semibold mb-2">{game.opponent}</Text>
              <Text className={cn("text-5xl font-bold", resultColor)}>
                {game.opponentScore}
              </Text>
            </View>
          </View>

          <View className="w-full items-center gap-1 pt-4 border-t border-border">
            <Text className="text-muted text-xs">{game.stadium}</Text>
            <Text className="text-muted text-xs">Público: {game.attendance.toLocaleString()}</Text>
            <Text className="text-muted text-xs">Árbitro: {game.referee}</Text>
          </View>
        </View>

        {/* Abas */}
        <View className="flex-row bg-background border-b border-border">
          {["resumo", "gols", "cartoes", "stats"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setSelectedTab(tab as any)}
              className={cn(
                "flex-1 py-3 items-center border-b-2",
                selectedTab === tab
                  ? "border-primary"
                  : "border-transparent"
              )}
            >
              <Text
                className={cn(
                  "text-xs font-semibold",
                  selectedTab === tab
                    ? "text-primary"
                    : "text-muted"
                )}
              >
                {tab === "resumo"
                  ? "Resumo"
                  : tab === "gols"
                    ? "Gols"
                    : tab === "cartoes"
                      ? "Cartões"
                      : "Estatísticas"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Conteúdo das Abas */}
        <View className="p-4">
          {selectedTab === "resumo" && (
            <View className="gap-4">
              <View className="bg-surface rounded-lg p-4">
                <Text className="text-foreground font-semibold mb-3">Informações do Jogo</Text>
                <View className="gap-2">
                  <View className="flex-row justify-between">
                    <Text className="text-muted">Local:</Text>
                    <Text className="text-foreground font-medium">{game.location}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-muted">Estádio:</Text>
                    <Text className="text-foreground font-medium">{game.stadium}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-muted">Público:</Text>
                    <Text className="text-foreground font-medium">{game.attendance.toLocaleString()}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {selectedTab === "gols" && (
            <View className="gap-3">
              {game.goals.length > 0 ? (
                game.goals.map((goal, idx) => (
                  <View key={idx} className="bg-success/10 rounded-lg p-4 border border-success/20">
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="text-foreground font-semibold">{goal.scorer}</Text>
                      <Text className="text-success font-bold">{goal.minute}'</Text>
                    </View>
                    {goal.assist && (
                      <Text className="text-muted text-xs">Assistência: {goal.assist}</Text>
                    )}
                  </View>
                ))
              ) : (
                <Text className="text-muted text-center py-4">Nenhum gol registrado</Text>
              )}
            </View>
          )}

          {selectedTab === "cartoes" && (
            <View className="gap-3">
              {game.yellowCards.length > 0 && (
                <View>
                  <Text className="text-foreground font-semibold mb-2">Cartões Amarelos</Text>
                  {game.yellowCards.map((card, idx) => (
                    <View key={idx} className="bg-warning/10 rounded-lg p-3 mb-2 border border-warning/20">
                      <View className="flex-row justify-between items-center">
                        <Text className="text-foreground">{card.player}</Text>
                        <Text className="text-warning font-bold">{card.minute}'</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {game.redCards.length > 0 && (
                <View>
                  <Text className="text-foreground font-semibold mb-2">Cartões Vermelhos</Text>
                  {game.redCards.map((card, idx) => (
                    <View key={idx} className="bg-error/10 rounded-lg p-3 mb-2 border border-error/20">
                      <View className="flex-row justify-between items-center">
                        <Text className="text-foreground">{card.player}</Text>
                        <Text className="text-error font-bold">{card.minute}'</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {game.yellowCards.length === 0 && game.redCards.length === 0 && (
                <Text className="text-muted text-center py-4">Nenhum cartão registrado</Text>
              )}
            </View>
          )}

          {selectedTab === "stats" && (
            <View className="gap-3">
              <View className="bg-surface rounded-lg p-4">
                <Text className="text-foreground font-semibold mb-4">Estatísticas do Jogo</Text>
                {[
                  { label: "Posse", value: `${game.gameStats.possession}%` },
                  { label: "Chutes", value: game.gameStats.shots },
                  { label: "Chutes no Alvo", value: game.gameStats.shotsOnTarget },
                  { label: "Passes", value: game.gameStats.passes },
                  { label: "Escanteios", value: game.gameStats.corners },
                  { label: "Faltas", value: game.gameStats.fouls },
                ].map((stat, idx) => (
                  <View key={idx} className="flex-row justify-between py-2 border-b border-border last:border-b-0">
                    <Text className="text-muted">{stat.label}</Text>
                    <Text className="text-foreground font-semibold">{stat.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
