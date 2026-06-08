import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

export default function UpcomingGamesScreen() {
  const colors = useColors();
  const [offset, setOffset] = useState(0);
  const limit = 10;

  const upcomingQuery = trpc.almanaque.upcomingGames.list.useQuery({
    limit,
    offset,
    status: "scheduled",
  });

  const handleLoadMore = () => {
    setOffset(offset + limit);
  };

  if (upcomingQuery.isLoading) {
    return (
      <ScreenContainer className="p-0 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  const upcomingGames = upcomingQuery.data || [];

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-black px-6 pt-6 pb-4">
          <Text className="text-2xl font-bold text-white">Próximos Jogos</Text>
          <Text className="text-sm text-orange-500 mt-1">Agenda do Timão</Text>
        </View>

        {/* Upcoming Games List */}
        <View className="px-6 py-4 gap-3">
          {upcomingGames.length === 0 ? (
            <View className="items-center justify-center py-8">
              <Text className="text-4xl mb-2">📅</Text>
              <Text className="text-lg font-bold text-foreground">Nenhum jogo agendado</Text>
              <Text className="text-sm text-muted mt-2">Fique atento para novos jogos</Text>
            </View>
          ) : (
            <>
              {upcomingGames.map((game: any) => (
                <TouchableOpacity
                  key={game.id}
                  className="bg-surface rounded-lg p-4 border-2 border-orange-500 overflow-hidden"
                >
                  {/* Date and Time */}
                  <View className="flex-row items-center gap-2 mb-3">
                    <Text className="text-2xl">📅</Text>
                    <View>
                      <Text className="text-sm font-semibold text-orange-500">
                        {game.gameDate}
                      </Text>
                      {game.gameTime && (
                        <Text className="text-xs text-muted">{game.gameTime}</Text>
                      )}
                    </View>
                  </View>

                  {/* Match Info */}
                  <View className="bg-black bg-opacity-30 rounded-lg p-3 mb-3">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1 items-center">
                        <Text className="text-sm font-bold text-foreground">Corinthians</Text>
                        <Text className="text-2xl font-bold text-primary mt-1">⚽</Text>
                      </View>
                      <View className="items-center px-2">
                        <Text className="text-xs text-muted uppercase font-semibold">vs</Text>
                      </View>
                      <View className="flex-1 items-center">
                        <Text className="text-sm font-bold text-foreground">
                          {game.opponent}
                        </Text>
                        <Text className="text-2xl font-bold text-primary mt-1">⚽</Text>
                      </View>
                    </View>
                  </View>

                  {/* Competition and Stadium */}
                  <View className="gap-2">
                    {game.competition && (
                      <View className="flex-row items-center gap-2">
                        <Text className="text-sm">🏆</Text>
                        <Text className="text-sm text-foreground font-semibold">
                          {game.competition}
                        </Text>
                      </View>
                    )}
                    {game.stadium && (
                      <View className="flex-row items-center gap-2">
                        <Text className="text-sm">🏟️</Text>
                        <Text className="text-sm text-foreground font-semibold">
                          {game.stadium}
                        </Text>
                      </View>
                    )}
                    {game.location && (
                      <View className="flex-row items-center gap-2">
                        <Text className="text-sm">📍</Text>
                        <Text className="text-sm text-muted">{game.location}</Text>
                      </View>
                    )}
                  </View>

                  {/* Status Badge */}
                  {game.status && game.status !== "scheduled" && (
                    <View className="mt-3 pt-3 border-t border-border border-opacity-30">
                      <Text
                        className={`text-xs font-bold px-2 py-1 rounded self-start ${
                          game.status === "postponed"
                            ? "bg-yellow-500 text-black"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {game.status === "postponed" ? "ADIADO" : "CANCELADO"}
                      </Text>
                    </View>
                  )}

                  {/* Confronto History Placeholder */}
                  <TouchableOpacity className="mt-3 pt-3 border-t border-border border-opacity-30">
                    <Text className="text-xs text-primary font-semibold">
                      Ver histórico do confronto →
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}

              {upcomingGames.length >= limit && (
                <TouchableOpacity
                  onPress={handleLoadMore}
                  className="bg-primary rounded-lg py-3 items-center mt-4"
                >
                  <Text className="text-white font-semibold">Carregar Mais</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
