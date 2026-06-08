import { View, Text, TouchableOpacity } from "react-native";
import { SocialShareButton, ShareContent } from "./social-share";
import { useFavorites } from "@/hooks/use-favorites";

interface ShareIntegrationProps {
  itemId: string;
  itemName: string;
  itemType: "player" | "game" | "prediction" | "coach";
  description: string;
  hashtags?: string[];
}

/**
 * Componente de integração de compartilhamento e favoritos
 */
export function ShareIntegration({
  itemId,
  itemName,
  itemType,
  description,
  hashtags = [],
}: ShareIntegrationProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isLiked = isFavorite(itemId);

  const shareContent: ShareContent = {
    title: itemName,
    description: description,
    hashtags: ["#TimaoDados", "#Corinthians", ...hashtags],
  };

  const handleToggleFavorite = async () => {
    await toggleFavorite({
      id: itemId,
      type: itemType,
      name: itemName,
      data: { description, hashtags },
    });
  };

  return (
    <View className="gap-3">
      <View className="flex-row gap-2">
        <TouchableOpacity
          onPress={handleToggleFavorite}
          className={`flex-1 py-2 px-3 rounded-lg border flex-row items-center justify-center gap-2 ${
            isLiked ? "bg-primary border-primary" : "bg-surface border-border"
          }`}
        >
          <Text className="text-lg">{isLiked ? "❤️" : "🤍"}</Text>
          <Text className={`font-bold ${isLiked ? "text-white" : "text-foreground"}`}>
            {isLiked ? "Favoritado" : "Favoritar"}
          </Text>
        </TouchableOpacity>

        <SocialShareButton
          content={shareContent}
          label="Compartilhar"
          onShare={(platform) => {
            console.log(`Compartilhado em ${platform}`);
          }}
        />
      </View>
    </View>
  );
}
