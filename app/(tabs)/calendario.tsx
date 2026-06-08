import { ScrollView, Text, View } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { GameCalendar, CalendarGame } from "@/components/game-calendar";

/**
 * Tela de calendário com previsões
 */
export default function CalendarioScreen() {
  const [selectedGame, setSelectedGame] = useState<CalendarGame | null>(null);

  // Mock data - em produção, isso viria da API
  const mockGames: CalendarGame[] = [
    {
      id: "1",
      date: "2024-01-15",
      opponent: "São Paulo",
      result: "win",
      score: { corinthians: 2, opponent: 1 },
      status: "played",
    },
    {
      id: "2",
      date: "2024-01-22",
      opponent: "Palmeiras",
      result: "draw",
      score: { corinthians: 1, opponent: 1 },
      status: "played",
    },
    {
      id: "3",
      date: "2024-02-05",
      opponent: "Santos",
      result: "win",
      score: { corinthians: 3, opponent: 0 },
      status: "played",
    },
    {
      id: "4",
      date: "2024-02-12",
      opponent: "Botafogo",
      result: "loss",
      score: { corinthians: 0, opponent: 1 },
      status: "played",
    },
    {
      id: "5",
      date: "2024-03-01",
      opponent: "Flamengo",
      prediction: { result: "win", confidence: 0.78 },
      status: "upcoming",
    },
    {
      id: "6",
      date: "2024-03-10",
      opponent: "Grêmio",
      prediction: { result: "draw", confidence: 0.65 },
      status: "upcoming",
    },
    {
      id: "7",
      date: "2024-03-17",
      opponent: "Internacional",
      prediction: { result: "win", confidence: 0.72 },
      status: "upcoming",
    },
    {
      id: "8",
      date: "2024-04-05",
      opponent: "Atlético Mineiro",
      prediction: { result: "draw", confidence: 0.60 },
      status: "upcoming",
    },
  ];

  const handleGameSelect = (game: CalendarGame) => {
    setSelectedGame(game);
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-black px-6 pt-6 pb-4 gap-4">
          <Text className="text-white font-bold text-2xl">Calendário</Text>
          <Text className="text-orange-400 text-sm">Todos os jogos da temporada</Text>
        </View>

        {/* Calendário */}
        <View className="flex-1 px-6 py-4">
          <GameCalendar games={mockGames} onGameSelect={handleGameSelect} />
        </View>

        {/* Detalhes do Jogo Selecionado */}
        {selectedGame && (
          <View className="px-6 py-4 gap-3 border-t border-border">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-foreground font-semibold text-base">Detalhes do Jogo</Text>
              <TouchableOpacity onPress={() => setSelectedGame(null)}>
                <Text className="text-primary font-bold text-lg">✕</Text>
              </TouchableOpacity>
            </View>

            <View className="bg-surface rounded-lg border border-border p-4 gap-4">
              {/* Informações Básicas */}
              <View className="gap-2">
                <Text className="text-foreground font-semibold">
                  Corinthians vs {selectedGame.opponent}
                </Text>
                <Text className="text-muted text-sm">
                  {new Date(selectedGame.date).toLocaleDateString("pt-BR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </View>

              {/* Resultado ou Previsão */}
              {selectedGame.status === "played" && selectedGame.score ? (
                <View className="bg-black rounded-lg p-4 gap-2">
                  <Text className="text-white text-center text-xs font-semibold">RESULTADO</Text>
                  <View className="flex-row items-center justify-between">
                    <View className="items-center">
                      <Text className="text-white font-bold text-2xl">
                        {selectedGame.score.corinthians}
                      </Text>
                      <Text className="text-white text-xs">Corinthians</Text>
                    </View>
                    <Text className="text-white text-xl font-bold">vs</Text>
                    <View className="items-center">
                      <Text className="text-white font-bold text-2xl">
                        {selectedGame.score.opponent}
                      </Text>
                      <Text className="text-white text-xs">{selectedGame.opponent}</Text>
                    </View>
                  </View>

                  {/* Status */}
                  <View className="pt-2 border-t border-white border-opacity-20">
                    <Text className="text-white text-center font-bold">
                      {selectedGame.result === "win"
                        ? "✅ Vitória"
                        : selectedGame.result === "draw"
                          ? "🤝 Empate"
                          : "❌ Derrota"}
                    </Text>
                  </View>
                </View>
              ) : selectedGame.prediction ? (
                <View className="bg-primary bg-opacity-10 rounded-lg p-4 gap-2 border border-primary">
                  <Text className="text-primary text-center text-xs font-semibold">PREVISÃO</Text>
                  <View className="flex-row items-center justify-between">
                    <View className="items-center">
                      <Text className="text-primary font-bold text-2xl">
                        {selectedGame.prediction.result === "win"
                          ? "🏆"
                          : selectedGame.prediction.result === "draw"
                            ? "🤝"
                            : "😔"}
                      </Text>
                      <Text className="text-foreground text-xs mt-1">
                        {selectedGame.prediction.result === "win"
                          ? "Vitória"
                          : selectedGame.prediction.result === "draw"
                            ? "Empate"
                            : "Derrota"}
                      </Text>
                    </View>

                    <View className="items-center">
                      <Text className="text-primary font-bold text-2xl">
                        {(selectedGame.prediction.confidence * 100).toFixed(0)}%
                      </Text>
                      <Text className="text-foreground text-xs">Confiança</Text>
                    </View>
                  </View>

                  {/* Barra de Confiança */}
                  <View className="pt-2 gap-1">
                    <View className="bg-border rounded-full h-2 overflow-hidden">
                      <View
                        className="bg-primary h-full"
                        style={{ width: `${selectedGame.prediction.confidence * 100}%` }}
                      />
                    </View>
                  </View>
                </View>
              ) : null}

              {/* Insights */}
              <View className="gap-2">
                <Text className="text-foreground font-semibold text-sm">Insights</Text>
                <Text className="text-muted text-sm leading-relaxed">
                  {selectedGame.status === "played"
                    ? selectedGame.result === "win"
                      ? "Corinthians conquistou uma vitória importante neste jogo, demonstrando bom desempenho."
                      : selectedGame.result === "draw"
                        ? "Jogo equilibrado com ambas as equipes em bom desempenho."
                        : "Corinthians não conseguiu vencer neste jogo, mas segue focado nos próximos desafios."
                    : "Baseado no histórico e forma recente, Corinthians tem boas chances neste confronto."}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Estatísticas Gerais */}
        <View className="px-6 py-4 gap-3 border-t border-border pb-6">
          <Text className="text-foreground font-semibold text-base">Resumo da Temporada</Text>

          <View className="gap-2">
            <StatCard
              title="Jogos Realizados"
              value={mockGames.filter((g) => g.status === "played").length.toString()}
              icon="🎮"
            />
            <StatCard
              title="Vitórias"
              value={mockGames.filter((g) => g.result === "win").length.toString()}
              icon="🏆"
            />
            <StatCard
              title="Próximos Jogos"
              value={mockGames.filter((g) => g.status === "upcoming").length.toString()}
              icon="⏳"
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <View className="bg-surface rounded-lg border border-border p-3 flex-row items-center justify-between">
      <View className="flex-row items-center gap-3">
        <Text className="text-2xl">{icon}</Text>
        <Text className="text-foreground font-medium">{title}</Text>
      </View>
      <Text className="text-primary font-bold text-lg">{value}</Text>
    </View>
  );
}

import { TouchableOpacity } from "react-native";
