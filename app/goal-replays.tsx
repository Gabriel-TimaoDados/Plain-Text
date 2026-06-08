import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { trpc } from "@/lib/trpc";

interface GoalReplay {
  id: string;
  fixtureId: number;
  playerName: string;
  minute: string;
  type: "normal" | "penalty" | "own_goal";
  opponent: string;
  gameDate: string;
  corinthiansScore: number;
  opponentScore: number;
  playerStats?: {
    totalGoals: number;
    totalGames: number;
    goalsThisSeason: number;
  };
}

export default function GoalReplaysScreen() {
  const router = useRouter();
  const [replays, setReplays] = useState<GoalReplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "recent" | "penalties">("recent");

  useEffect(() => {
    loadReplays();
  }, [filter]);

  const loadReplays = async () => {
    setLoading(true);
    try {
      const result = await trpc.goalReplays.recent.query();
      setReplays(result.replays);
    } catch (error) {
      console.error("Erro ao carregar replays:", error);
    } finally {
      setLoading(false);
    }
  };

  const getGoalTypeLabel = (type: string) => {
    switch (type) {
      case "penalty":
        return "⚽ Pênalti";
      case "own_goal":
        return "🔴 Contra";
      default:
        return "⚽ Gol";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR");
    } catch {
      return dateString;
    }
  };

  const renderReplayCard = (replay: GoalReplay) => (
    <TouchableOpacity
      key={replay.id}
      activeOpacity={0.7}
      className="bg-surface rounded-xl p-4 mb-3 border border-border"
    >
      <View className="gap-2">
        {/* Header com jogador e tipo de gol */}
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-lg font-bold text-foreground">
              {replay.playerName}
            </Text>
            <Text className="text-sm text-muted">{getGoalTypeLabel(replay.type)}</Text>
          </View>
          <Text className="text-2xl font-bold text-primary">
            {replay.minute}'
          </Text>
        </View>

        {/* Placar e adversário */}
        <View className="bg-black rounded-lg p-3 flex-row justify-between items-center">
          <Text className="text-white font-bold">Corinthians</Text>
          <Text className="text-2xl font-bold text-orange-400">
            {replay.corinthiansScore} x {replay.opponentScore}
          </Text>
          <Text className="text-white font-bold">{replay.opponent}</Text>
        </View>

        {/* Data do jogo */}
        <Text className="text-xs text-muted">{formatDate(replay.gameDate)}</Text>

        {/* Estatísticas do jogador */}
        {replay.playerStats && (
          <View className="bg-background rounded-lg p-3 flex-row justify-around">
            <View className="items-center">
              <Text className="text-xs text-muted">Total de Gols</Text>
              <Text className="text-lg font-bold text-foreground">
                {replay.playerStats.totalGoals}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-xs text-muted">Jogos</Text>
              <Text className="text-lg font-bold text-foreground">
                {replay.playerStats.totalGames}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-xs text-muted">Média</Text>
              <Text className="text-lg font-bold text-foreground">
                {(
                  replay.playerStats.totalGoals /
                  (replay.playerStats.totalGames || 1)
                ).toFixed(2)}
              </Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1">
          {/* Header */}
          <View className="bg-black px-6 pt-6 pb-4">
            <Text className="text-3xl font-bold text-white">⚽</Text>
            <Text className="text-2xl font-bold text-white">Replay de Gols</Text>
            <Text className="text-sm text-orange-400">Todos os gols do Corinthians</Text>
          </View>

          {/* Filtros */}
          <View className="px-6 py-4 gap-2">
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setFilter("recent")}
                className={`flex-1 rounded-lg py-2 px-3 ${
                  filter === "recent"
                    ? "bg-primary"
                    : "bg-surface border border-border"
                }`}
              >
                <Text
                  className={`text-center font-semibold text-sm ${
                    filter === "recent"
                      ? "text-background"
                      : "text-foreground"
                  }`}
                >
                  Recentes
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setFilter("penalties")}
                className={`flex-1 rounded-lg py-2 px-3 ${
                  filter === "penalties"
                    ? "bg-primary"
                    : "bg-surface border border-border"
                }`}
              >
                <Text
                  className={`text-center font-semibold text-sm ${
                    filter === "penalties"
                      ? "text-background"
                      : "text-foreground"
                  }`}
                >
                  Pênaltis
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Lista de replays */}
          <View className="px-6 pb-6">
            {loading ? (
              <Text className="text-center text-muted py-8">Carregando...</Text>
            ) : replays.length > 0 ? (
              <FlatList
                data={replays}
                renderItem={({ item }) => renderReplayCard(item)}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            ) : (
              <Text className="text-center text-muted py-8">
                Nenhum replay encontrado
              </Text>
            )}
          </View>

          {/* Estatísticas gerais */}
          {replays.length > 0 && (
            <View className="px-6 pb-6 border-t border-border pt-6">
              <Text className="text-sm font-semibold text-muted uppercase mb-3">
                Estatísticas
              </Text>
              <View className="bg-surface rounded-lg p-4 gap-2">
                <View className="flex-row justify-between">
                  <Text className="text-foreground">Total de Gols</Text>
                  <Text className="font-bold text-primary">{replays.length}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-foreground">Período</Text>
                  <Text className="font-bold text-primary">Últimos 7 dias</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
