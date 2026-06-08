import { ScrollView, Text, View, TouchableOpacity, FlatList, Linking, Image } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useState, useEffect } from "react";

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  image: string;
  url: string;
  source: string;
  publishedAt: Date;
  category: "gol" | "lesão" | "mercado" | "técnico" | "geral";
}

export default function NewsScreen() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<NewsArticle["category"] | "all">("all");

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      // TODO: Integrar com API de notícias
      const mockArticles: NewsArticle[] = [
        {
          id: "1",
          title: "Corinthians vence clássico com gol de Romero",
          description: "Corinthians 2x1 Palmeiras no Morumbi",
          image: "https://via.placeholder.com/300x200",
          url: "https://example.com",
          source: "Globo Esporte",
          publishedAt: new Date(),
          category: "gol",
        },
        {
          id: "2",
          title: "Jogador sofre lesão e desfalca time",
          description: "Lesão afasta jogador por 4 semanas",
          image: "https://via.placeholder.com/300x200",
          url: "https://example.com",
          source: "ESPN",
          publishedAt: new Date(Date.now() - 3600000),
          category: "lesão",
        },
        {
          id: "3",
          title: "Corinthians acerta transferência de novo jogador",
          description: "Novo reforço chega para temporada",
          image: "https://via.placeholder.com/300x200",
          url: "https://example.com",
          source: "Globo Esporte",
          publishedAt: new Date(Date.now() - 7200000),
          category: "mercado",
        },
      ];
      setArticles(mockArticles);
    } catch (error) {
      console.error("Erro ao carregar notícias:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles =
    filter === "all" ? articles : articles.filter((a) => a.category === filter);

  const getCategoryColor = (category: NewsArticle["category"]): string => {
    switch (category) {
      case "gol":
        return "bg-success";
      case "lesão":
        return "bg-warning";
      case "mercado":
        return "bg-primary";
      case "técnico":
        return "bg-error";
      default:
        return "bg-muted";
    }
  };

  const getCategoryLabel = (category: NewsArticle["category"]): string => {
    switch (category) {
      case "gol":
        return "⚽ Gol";
      case "lesão":
        return "🏥 Lesão";
      case "mercado":
        return "💼 Mercado";
      case "técnico":
        return "👨‍💼 Técnico";
      default:
        return "📰 Geral";
    }
  };

  const renderNewsCard = ({ item }: { item: NewsArticle }) => (
    <TouchableOpacity
      className="bg-surface rounded-lg overflow-hidden mb-3 border border-border"
      onPress={() => Linking.openURL(item.url)}
    >
      {item.image && (
        <Image
          source={{ uri: item.image }}
          className="w-full h-40 bg-muted"
          defaultSource={{ uri: "https://via.placeholder.com/300x200" }}
        />
      )}
      <View className="p-4 gap-2">
        <View className="flex-row justify-between items-start gap-2">
          <Text className="text-sm font-semibold text-foreground flex-1">{item.title}</Text>
          <View className={`px-2 py-1 rounded ${getCategoryColor(item.category)}`}>
            <Text className="text-xs font-semibold text-white">
              {getCategoryLabel(item.category)}
            </Text>
          </View>
        </View>
        <Text className="text-sm text-muted">{item.description}</Text>
        <View className="flex-row justify-between items-center pt-2 border-t border-border">
          <Text className="text-xs text-muted">{item.source}</Text>
          <Text className="text-xs text-muted">
            {new Date(item.publishedAt).toLocaleDateString("pt-BR")}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">Notícias</Text>
          <Text className="text-sm text-muted">Últimas notícias do Corinthians</Text>
        </View>

        {/* Filter Buttons */}
        <View className="flex-row gap-2 mb-6 flex-wrap">
          {(["all", "gol", "lesão", "mercado", "técnico"] as const).map((f) => (
            <TouchableOpacity
              key={f}
              className={`px-4 py-2 rounded-full ${
                filter === f ? "bg-primary" : "bg-surface border border-border"
              }`}
              onPress={() => setFilter(f)}
            >
              <Text
                className={`text-sm font-semibold ${
                  filter === f ? "text-white" : "text-foreground"
                }`}
              >
                {f === "all"
                  ? "Todas"
                  : f === "gol"
                    ? "⚽ Gols"
                    : f === "lesão"
                      ? "🏥 Lesões"
                      : f === "mercado"
                        ? "💼 Mercado"
                        : "👨‍💼 Técnico"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* News List */}
        {loading ? (
          <View className="items-center justify-center py-12">
            <Text className="text-muted">Carregando notícias...</Text>
          </View>
        ) : filteredArticles.length > 0 ? (
          <FlatList
            data={filteredArticles}
            renderItem={renderNewsCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        ) : (
          <View className="items-center justify-center py-12">
            <Text className="text-muted">Nenhuma notícia encontrada</Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
