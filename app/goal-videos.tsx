import { ScrollView, Text, View, TouchableOpacity, FlatList, Linking } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";

interface GoalVideo {
  id: string;
  playerName: string;
  minute: number;
  videoUrl: string;
  platform: "youtube" | "twitch";
  thumbnail?: string;
}

export default function GoalVideosScreen() {
  const [videos, setVideos] = useState<GoalVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "youtube" | "twitch">("all");

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      // TODO: Integrar com API de vídeos
      const mockVideos: GoalVideo[] = [
        {
          id: "1",
          playerName: "Romero",
          minute: 23,
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          platform: "youtube",
        },
        {
          id: "2",
          playerName: "Garro",
          minute: 45,
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          platform: "youtube",
        },
        {
          id: "3",
          playerName: "Carrillo",
          minute: 67,
          videoUrl: "https://www.twitch.tv/corinthians",
          platform: "twitch",
        },
      ];
      setVideos(mockVideos);
    } catch (error) {
      console.error("Erro ao carregar vídeos:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVideos = videos.filter((v) => filter === "all" || v.platform === filter);

  const renderVideoCard = ({ item }: { item: GoalVideo }) => (
    <TouchableOpacity
      className="bg-surface rounded-lg p-4 mb-3 border border-border"
      onPress={() => Linking.openURL(item.videoUrl)}
    >
      <View className="gap-2">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-lg font-semibold text-foreground">{item.playerName}</Text>
            <Text className="text-sm text-muted">Minuto {item.minute}</Text>
          </View>
          <View
            className={`px-3 py-1 rounded-full ${
              item.platform === "youtube" ? "bg-error" : "bg-primary"
            }`}
          >
            <Text className="text-xs font-semibold text-white uppercase">
              {item.platform}
            </Text>
          </View>
        </View>
        <Text className="text-xs text-muted">Toque para assistir</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">Gols</Text>
          <Text className="text-sm text-muted">Vídeos de gols do Corinthians</Text>
        </View>

        {/* Filter Buttons */}
        <View className="flex-row gap-2 mb-6">
          {(["all", "youtube", "twitch"] as const).map((f) => (
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
                {f === "all" ? "Todos" : f === "youtube" ? "YouTube" : "Twitch"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Videos List */}
        {loading ? (
          <View className="items-center justify-center py-12">
            <Text className="text-muted">Carregando vídeos...</Text>
          </View>
        ) : filteredVideos.length > 0 ? (
          <FlatList
            data={filteredVideos}
            renderItem={renderVideoCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        ) : (
          <View className="items-center justify-center py-12">
            <Text className="text-muted">Nenhum vídeo encontrado</Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
