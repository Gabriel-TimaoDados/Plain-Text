import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

export default function RivalriesScreen() {
  const colors = useColors();
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const rivalriesQuery = trpc.almanaque.rivalries.list.useQuery({
    limit,
    offset,
  });

  const handleLoadMore = () => {
    setOffset(offset + limit);
  };

  if (rivalriesQuery.isLoading) {
    return (
      <ScreenContainer className="p-0 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  const rivalries = rivalriesQuery.data || [];

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-black px-6 pt-6 pb-4">
          <Text className="text-2xl font-bold text-white">Duelos</Text>
          <Text className="text-sm text-orange-500 mt-1">Histórico de confrontos</Text>
        </View>

        {/* Rivalries List */}
        <View className="px-6 py-4 gap-3">
          {rivalries.length === 0 ? (
            <View className="items-center justify-center py-8">
              <Text className="text-muted">Nenhum duelo encontrado</Text>
            </View>
          ) : (
            <>
              {rivalries.map((rivalry: any) => (
                <TouchableOpacity
                  key={rivalry.id}
                  className="bg-surface rounded-lg p-4 border border-border"
                >
                  {/* Opponent Name */}
                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-lg font-bold text-foreground flex-1">
                      Corinthians vs {rivalry.opponent}
                    </Text>
                  </View>

                  {/* Overall Stats */}
                  <View className="bg-black bg-opacity-30 rounded-lg p-3 mb-3">
                    <Text className="text-xs text-muted uppercase tracking-wide font-semibold mb-2">
                      Geral
                    </Text>
                    <View className="flex-row justify-between items-center">
                      <View className="items-center flex-1">
                        <Text className="text-2xl font-bold text-primary">
                          {rivalry.corinthiansWins}
                        </Text>
                        <Text className="text-xs text-muted">Vitórias</Text>
                      </View>
                      <View className="items-center flex-1">
                        <Text className="text-2xl font-bold text-yellow-500">
                          {rivalry.corinthiansDraws}
                        </Text>
                        <Text className="text-xs text-muted">Empates</Text>
                      </View>
                      <View className="items-center flex-1">
                        <Text className="text-2xl font-bold text-red-500">
                          {rivalry.corinthiansLosses}
                        </Text>
                        <Text className="text-xs text-muted">Derrotas</Text>
                      </View>
                    </View>
                    <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-border border-opacity-30">
                      <Text className="text-sm text-foreground font-semibold">
                        Total: {rivalry.totalGames} jogos
                      </Text>
                      <Text className="text-sm text-foreground font-semibold">
                        {rivalry.corinthiansGoals} x {rivalry.opponentGoals}
                      </Text>
                    </View>
                  </View>

                  {/* Home Stats */}
                  <View className="bg-black bg-opacity-20 rounded-lg p-3 mb-3">
                    <Text className="text-xs text-muted uppercase tracking-wide font-semibold mb-2">
                      🏠 Mandante
                    </Text>
                    <View className="flex-row justify-between items-center">
                      <View className="items-center flex-1">
                        <Text className="text-lg font-bold text-primary">
                          {rivalry.homeWins}
                        </Text>
                        <Text className="text-xs text-muted">V</Text>
                      </View>
                      <View className="items-center flex-1">
                        <Text className="text-lg font-bold text-yellow-500">
                          {rivalry.homeDraws}
                        </Text>
                        <Text className="text-xs text-muted">E</Text>
                      </View>
                      <View className="items-center flex-1">
                        <Text className="text-lg font-bold text-red-500">
                          {rivalry.homeLosses}
                        </Text>
                        <Text className="text-xs text-muted">D</Text>
                      </View>
                      <View className="items-center flex-1">
                        <Text className="text-sm text-foreground font-semibold">
                          {rivalry.homeCorinthiansGoals}x{rivalry.homeOpponentGoals}
                        </Text>
                        <Text className="text-xs text-muted">{rivalry.homeGames}J</Text>
                      </View>
                    </View>
                  </View>

                  {/* Away Stats */}
                  <View className="bg-black bg-opacity-20 rounded-lg p-3">
                    <Text className="text-xs text-muted uppercase tracking-wide font-semibold mb-2">
                      ✈️ Visitante
                    </Text>
                    <View className="flex-row justify-between items-center">
                      <View className="items-center flex-1">
                        <Text className="text-lg font-bold text-primary">
                          {rivalry.awayWins}
                        </Text>
                        <Text className="text-xs text-muted">V</Text>
                      </View>
                      <View className="items-center flex-1">
                        <Text className="text-lg font-bold text-yellow-500">
                          {rivalry.awayDraws}
                        </Text>
                        <Text className="text-xs text-muted">E</Text>
                      </View>
                      <View className="items-center flex-1">
                        <Text className="text-lg font-bold text-red-500">
                          {rivalry.awayLosses}
                        </Text>
                        <Text className="text-xs text-muted">D</Text>
                      </View>
                      <View className="items-center flex-1">
                        <Text className="text-sm text-foreground font-semibold">
                          {rivalry.awayCorinthiansGoals}x{rivalry.awayOpponentGoals}
                        </Text>
                        <Text className="text-xs text-muted">{rivalry.awayGames}J</Text>
                      </View>
                    </View>
                  </View>

                  {/* Last Meeting */}
                  {rivalry.lastMeeting && (
                    <Text className="text-xs text-muted mt-3">
                      Último confronto: {rivalry.lastMeeting}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}

              {rivalries.length >= limit && (
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
