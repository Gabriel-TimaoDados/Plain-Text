import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { LiveScoreWidget } from "@/components/live-score-widget";
import { useLiveGames } from "@/hooks/use-live-games";

// Mock data for curiosities
const mockCuriosities = [
  {
    id: "1",
    title: "Primeiro Jogo do Corinthians",
    date: "1910",
    description: "O Corinthians foi fundado em 1910 e jogou seu primeiro jogo em 14 de maio de 1910.",
    category: "História",
  },
  {
    id: "2",
    title: "Ronaldo, o Fenômeno",
    date: "1994-1996",
    description: "Ronaldo Luís Nazário de Lima, conhecido como Ronaldo Fenômeno, jogou pelo Corinthians e se tornou uma lenda do futebol mundial.",
    category: "Jogadores",
  },
  {
    id: "3",
    title: "Títulos Conquistados",
    date: "Vários",
    description: "O Corinthians conquistou diversos títulos incluindo Campeonato Paulista, Brasileirão e Libertadores.",
    category: "Títulos",
  },
];

const categories = [
  { id: "1", name: "Jogadores", icon: "👤", color: "bg-blue-500" },
  { id: "2", name: "Técnicos", icon: "👨‍💼", color: "bg-purple-500" },
  { id: "3", name: "Jogos", icon: "⚽", color: "bg-green-500" },
  { id: "4", name: "Curiosidades", icon: "📚", color: "bg-orange-500" },
];

export default function HomeScreen() {
  const router = useRouter();
  const { currentGame, isLoading, refresh } = useLiveGames();
  const [dailyCuriosity, setDailyCuriosity] = useState(mockCuriosities[0]);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Ronaldo",
    "Libertadores 2012",
    "Cássio",
  ]);

  useEffect(() => {
    // Select a random curiosity for the day
    const randomIndex = Math.floor(Math.random() * mockCuriosities.length);
    setDailyCuriosity(mockCuriosities[randomIndex]);
  }, []);

  const handleCategoryPress = (categoryName: string) => {
    // Navigate to category screen (to be implemented)
    console.log(`Navigate to ${categoryName}`);
  };

  const handleSearchPress = (query: string) => {
    // Navigate to search screen with query (to be implemented)
    console.log(`Search for ${query}`);
  };

  const handleClearHistory = () => {
    setRecentSearches([]);
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1">
          {/* Header */}
          <View className="bg-black px-6 pt-6 pb-4">
            <Text className="text-3xl font-bold text-white">Timão</Text>
            <Text className="text-lg text-orange-400 font-semibold">Dados</Text>
          </View>

          {/* Live Score Widget */}
          {currentGame && (
            <View className="py-4">
              <LiveScoreWidget game={currentGame} isLoading={isLoading} onRefresh={refresh} />
            </View>
          )}

          {/* Daily Curiosity Section */}
          <View className="px-6 py-6 gap-3">
            <Text className="text-sm font-semibold text-muted uppercase tracking-wide">
              Curiosidade do Dia
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl p-6 gap-3 shadow-lg"
            >
              <Text className="text-white font-bold text-lg">{dailyCuriosity.title}</Text>
              <Text className="text-white text-sm leading-relaxed">
                {dailyCuriosity.description}
              </Text>
              <View className="flex-row justify-between items-center pt-2">
                <Text className="text-white text-xs font-semibold">{dailyCuriosity.date}</Text>
                <Text className="text-white text-xs font-semibold">→</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Quick Access Categories */}
          <View className="px-6 py-4 gap-3">
            <Text className="text-sm font-semibold text-muted uppercase tracking-wide">
              Explorar
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => handleCategoryPress(category.name)}
                  activeOpacity={0.7}
                  className="flex-1 min-w-[45%] bg-surface rounded-xl p-4 items-center gap-2 border border-border"
                >
                  <Text className="text-2xl">{category.icon}</Text>
                  <Text className="text-sm font-semibold text-foreground text-center">
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <View className="px-6 py-4 gap-3">
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
                    onPress={() => handleSearchPress(search)}
                    activeOpacity={0.7}
                    className="bg-surface rounded-lg p-3 flex-row items-center justify-between border border-border"
                  >
                    <Text className="text-foreground font-medium">{search}</Text>
                    <Text className="text-muted">→</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* About Section */}
          <View className="px-6 py-6 gap-2 border-t border-border mt-4">
            <Text className="text-xs text-muted text-center">
              Timão Dados - Guia Completo do Corinthians com dados em tempo real
            </Text>
            <Text className="text-xs text-muted text-center">
              Contém informações sobre 1.042 jogadores, 91 técnicos e 4.536 jogos
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
