import { ScrollView, Text, View, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { useState, useCallback } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

type SearchCategory = "all" | "players" | "coaches" | "games" | "curiosities";

const categories: { id: SearchCategory; name: string; icon: string }[] = [
  { id: "all", name: "Todos", icon: "🔍" },
  { id: "players", name: "Jogadores", icon: "👤" },
  { id: "coaches", name: "Técnicos", icon: "👨‍💼" },
  { id: "games", name: "Jogos", icon: "⚽" },
  { id: "curiosities", name: "Curiosidades", icon: "📚" },
];

export default function SearchScreen() {
  const colors = useColors();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<SearchCategory>("all");
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Ronaldo",
    "Libertadores 2012",
    "Cássio",
  ]);

  // Search queries
  const globalSearch = trpc.almanaque.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 0 }
  );

  const playersSearch = trpc.almanaque.players.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 0 && selectedCategory === "players" }
  );

  const coachesSearch = trpc.almanaque.coaches.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 0 && selectedCategory === "coaches" }
  );

  const gamesSearch = trpc.almanaque.games.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 0 && selectedCategory === "games" }
  );

  const curiositiesSearch = trpc.almanaque.curiosities.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 0 && selectedCategory === "curiosities" }
  );

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    if (text.length > 0 && !recentSearches.includes(text)) {
      setRecentSearches([text, ...recentSearches.slice(0, 4)]);
    }
  }, [recentSearches]);

  const handleRecentSearch = (search: string) => {
    setSearchQuery(search);
  };

  const handleClearHistory = () => {
    setRecentSearches([]);
  };

  const renderSearchResults = () => {
    if (searchQuery.length === 0) {
      return (
        <View className="px-6 py-6 gap-4">
          {recentSearches.length > 0 && (
            <View className="gap-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm font-semibold text-muted uppercase tracking-wide">
                  Buscas Recentes
                </Text>
                <TouchableOpacity onPress={handleClearHistory}>
                  <Text className="text-xs text-primary font-semibold">Limpar</Text>
                </TouchableOpacity>
              </View>
              <View className="gap-2">
                {recentSearches.map((search, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleRecentSearch(search)}
                    className="bg-surface rounded-lg p-3 flex-row items-center justify-between border border-border"
                  >
                    <Text className="text-foreground font-medium">{search}</Text>
                    <Text className="text-muted">→</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      );
    }

    if (selectedCategory === "all") {
      const results = globalSearch.data;
      if (globalSearch.isLoading) {
        return (
          <View className="flex-1 items-center justify-center py-8">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        );
      }

      if (!results || (results.players.length === 0 && results.coaches.length === 0 && 
          results.games.length === 0 && results.curiosities.length === 0)) {
        return (
          <View className="flex-1 items-center justify-center py-8">
            <Text className="text-muted">Nenhum resultado encontrado</Text>
          </View>
        );
      }

      return (
        <View className="px-6 py-4 gap-6">
          {results.players.length > 0 && (
            <View className="gap-2">
              <Text className="text-sm font-semibold text-muted uppercase tracking-wide">
                Jogadores
              </Text>
              {results.players.map((player) => (
                <TouchableOpacity
                  key={player.id}
                  className="bg-surface rounded-lg p-3 border border-border"
                >
                  <Text className="font-semibold text-foreground">{player.name}</Text>
                  <Text className="text-xs text-muted">
                    {player.position} • {player.nationality}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {results.coaches.length > 0 && (
            <View className="gap-2">
              <Text className="text-sm font-semibold text-muted uppercase tracking-wide">
                Técnicos
              </Text>
              {results.coaches.map((coach) => (
                <TouchableOpacity
                  key={coach.id}
                  className="bg-surface rounded-lg p-3 border border-border"
                >
                  <Text className="font-semibold text-foreground">{coach.name}</Text>
                  <Text className="text-xs text-muted">
                    {coach.startDate} - {coach.endDate || "Presente"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {results.games.length > 0 && (
            <View className="gap-2">
              <Text className="text-sm font-semibold text-muted uppercase tracking-wide">
                Jogos
              </Text>
              {results.games.map((game) => (
                <TouchableOpacity
                  key={game.id}
                  className="bg-surface rounded-lg p-3 border border-border"
                >
                  <Text className="font-semibold text-foreground">
                    Corinthians vs {game.opponent}
                  </Text>
                  <Text className="text-xs text-muted">
                    {game.gameDate} • {game.competition}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {results.curiosities.length > 0 && (
            <View className="gap-2">
              <Text className="text-sm font-semibold text-muted uppercase tracking-wide">
                Curiosidades
              </Text>
              {results.curiosities.map((curiosity) => (
                <TouchableOpacity
                  key={curiosity.id}
                  className="bg-surface rounded-lg p-3 border border-border"
                >
                  <Text className="font-semibold text-foreground">{curiosity.title}</Text>
                  <Text className="text-xs text-muted">{curiosity.category}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      );
    }

    // Single category search
    let results: any[] = [];
    let isLoading = false;

    if (selectedCategory === "players") {
      results = playersSearch.data || [];
      isLoading = playersSearch.isLoading;
    } else if (selectedCategory === "coaches") {
      results = coachesSearch.data || [];
      isLoading = coachesSearch.isLoading;
    } else if (selectedCategory === "games") {
      results = gamesSearch.data || [];
      isLoading = gamesSearch.isLoading;
    } else if (selectedCategory === "curiosities") {
      results = curiositiesSearch.data || [];
      isLoading = curiositiesSearch.isLoading;
    }

    if (isLoading) {
      return (
        <View className="flex-1 items-center justify-center py-8">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (results.length === 0) {
      return (
        <View className="flex-1 items-center justify-center py-8">
          <Text className="text-muted">Nenhum resultado encontrado</Text>
        </View>
      );
    }

    return (
      <View className="px-6 py-4 gap-2">
        {results.map((item) => (
          <TouchableOpacity
            key={item.id}
            className="bg-surface rounded-lg p-3 border border-border"
          >
            <Text className="font-semibold text-foreground">{item.name || item.title}</Text>
            <Text className="text-xs text-muted">
              {item.position || item.opponent || item.category || ""}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-black px-6 pt-6 pb-4">
          <Text className="text-2xl font-bold text-white">Busca</Text>
        </View>

        {/* Search Input */}
        <View className="px-6 py-4 gap-3">
          <View className="bg-surface rounded-lg border border-border flex-row items-center px-3">
            <Text className="text-lg text-muted mr-2">🔍</Text>
            <TextInput
              placeholder="Buscar jogador, técnico, jogo..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={handleSearch}
              className="flex-1 py-3 text-foreground"
              returnKeyType="search"
            />
          </View>
        </View>

        {/* Category Filter */}
        <View className="px-6 py-2 gap-2">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full border ${
                  selectedCategory === category.id
                    ? "bg-primary border-primary"
                    : "bg-surface border-border"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    selectedCategory === category.id ? "text-white" : "text-foreground"
                  }`}
                >
                  {category.icon} {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Results */}
        {renderSearchResults()}
      </ScrollView>
    </ScreenContainer>
  );
}
