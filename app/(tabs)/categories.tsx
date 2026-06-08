import { ScrollView, Text, View, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

type ActiveCategory = "players" | "coaches" | "games" | "curiosities";

const categories: { id: ActiveCategory; name: string; icon: string }[] = [
  { id: "players", name: "Jogadores", icon: "👤" },
  { id: "coaches", name: "Técnicos", icon: "👨‍💼" },
  { id: "games", name: "Jogos", icon: "⚽" },
  { id: "curiosities", name: "Curiosidades", icon: "📚" },
];

export default function CategoriesScreen() {
  const colors = useColors();
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>("players");
  const [offset, setOffset] = useState(0);
  const limit = 20;

  // Queries for each category
  const playersQuery = trpc.almanaque.players.list.useQuery(
    { limit, offset },
    { enabled: activeCategory === "players" }
  );

  const coachesQuery = trpc.almanaque.coaches.list.useQuery(
    { limit, offset },
    { enabled: activeCategory === "coaches" }
  );

  const gamesQuery = trpc.almanaque.games.list.useQuery(
    { limit, offset },
    { enabled: activeCategory === "games" }
  );

  const curiositiesQuery = trpc.almanaque.curiosities.list.useQuery(
    { limit, offset },
    { enabled: activeCategory === "curiosities" }
  );

  const handleLoadMore = () => {
    setOffset(offset + limit);
  };

  const renderPlayerItem = (item: any) => (
    <TouchableOpacity className="bg-surface rounded-lg p-4 mb-3 border border-border">
      <View className="flex-row justify-between items-start gap-3">
        <View className="flex-1">
          <Text className="font-bold text-lg text-foreground">{item.name}</Text>
          <View className="flex-row gap-2 mt-1">
            {item.position && (
              <Text className="text-xs bg-primary text-white px-2 py-1 rounded">
                {item.position}
              </Text>
            )}
            {item.number && (
              <Text className="text-xs bg-primary text-white px-2 py-1 rounded">
                #{item.number}
              </Text>
            )}
          </View>
          {item.nationality && (
            <Text className="text-sm text-muted mt-2">🌍 {item.nationality}</Text>
          )}
          {item.games > 0 && (
            <Text className="text-sm text-muted mt-1">
              ⚽ {item.games} jogos • ⚽ {item.goals} gols
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCoachItem = (item: any) => (
    <TouchableOpacity className="bg-surface rounded-lg p-4 mb-3 border border-border">
      <Text className="font-bold text-lg text-foreground">{item.name}</Text>
      <Text className="text-sm text-muted mt-1">
        {item.startDate} - {item.endDate || "Presente"}
      </Text>
      {item.games > 0 && (
        <Text className="text-sm text-muted mt-2">
          🎯 {item.games} jogos • ✅ {item.wins}V • ❌ {item.losses}D • ➖ {item.draws}E
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderGameItem = (item: any) => (
    <TouchableOpacity className="bg-surface rounded-lg p-4 mb-3 border border-border">
      <Text className="font-bold text-lg text-foreground">
        Corinthians vs {item.opponent}
      </Text>
      <Text className="text-sm text-muted mt-1">{item.gameDate}</Text>
      <View className="flex-row items-center gap-2 mt-2">
        <Text className="font-bold text-lg text-primary">
          {item.corinthiansScore || "-"}
        </Text>
        <Text className="text-muted">vs</Text>
        <Text className="font-bold text-lg text-primary">
          {item.opponentScore || "-"}
        </Text>
      </View>
      {item.competition && (
        <Text className="text-xs text-muted mt-2">🏆 {item.competition}</Text>
      )}
    </TouchableOpacity>
  );

  const renderCuriosityItem = (item: any) => (
    <TouchableOpacity className="bg-surface rounded-lg p-4 mb-3 border border-border">
      <Text className="font-bold text-lg text-foreground">{item.title}</Text>
      {item.category && (
        <Text className="text-xs bg-primary text-white px-2 py-1 rounded mt-2 self-start">
          {item.category}
        </Text>
      )}
      <Text className="text-sm text-muted mt-2 line-clamp-2">{item.description}</Text>
    </TouchableOpacity>
  );

  const renderContent = () => {
    let data: any[] = [];
    let isLoading = false;

    if (activeCategory === "players") {
      data = playersQuery.data || [];
      isLoading = playersQuery.isLoading;
    } else if (activeCategory === "coaches") {
      data = coachesQuery.data || [];
      isLoading = coachesQuery.isLoading;
    } else if (activeCategory === "games") {
      data = gamesQuery.data || [];
      isLoading = gamesQuery.isLoading;
    } else if (activeCategory === "curiosities") {
      data = curiositiesQuery.data || [];
      isLoading = curiositiesQuery.isLoading;
    }

    if (isLoading) {
      return (
        <View className="flex-1 items-center justify-center py-8">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (data.length === 0) {
      return (
        <View className="flex-1 items-center justify-center py-8">
          <Text className="text-muted">Nenhum item encontrado</Text>
        </View>
      );
    }

    return (
      <View className="px-6 py-4">
        {data.map((item) => {
          if (activeCategory === "players") return renderPlayerItem(item);
          if (activeCategory === "coaches") return renderCoachItem(item);
          if (activeCategory === "games") return renderGameItem(item);
          if (activeCategory === "curiosities") return renderCuriosityItem(item);
        })}
        {data.length >= limit && (
          <TouchableOpacity
            onPress={handleLoadMore}
            className="bg-primary rounded-lg py-3 items-center mt-4"
          >
            <Text className="text-white font-semibold">Carregar Mais</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-black px-6 pt-6 pb-4">
          <Text className="text-2xl font-bold text-white">Categorias</Text>
        </View>

        {/* Category Tabs */}
        <View className="px-6 py-4 gap-2">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => {
                  setActiveCategory(category.id);
                  setOffset(0);
                }}
                className={`px-4 py-2 rounded-full border ${
                  activeCategory === category.id
                    ? "bg-primary border-primary"
                    : "bg-surface border-border"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    activeCategory === category.id ? "text-white" : "text-foreground"
                  }`}
                >
                  {category.icon} {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Content */}
        {renderContent()}
      </ScrollView>
    </ScreenContainer>
  );
}
