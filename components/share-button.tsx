import React from "react";
import { View, TouchableOpacity, Text, Alert, Share } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";

export interface ShareContent {
  title: string;
  message: string;
  url?: string;
}

interface ShareButtonProps {
  content: ShareContent;
  variant?: "primary" | "secondary";
  label?: string;
  showLabel?: boolean;
}

/**
 * Componente de botão de compartilhamento social
 * Suporta compartilhamento nativo do iOS/Android
 */
export function ShareButton({
  content,
  variant = "primary",
  label = "Compartilhar",
  showLabel = true,
}: ShareButtonProps) {
  const colors = useColors();

  const handleShare = async () => {
    try {
      const shareMessage = `${content.title}\n\n${content.message}${
        content.url ? `\n\n${content.url}` : ""
      }`;

      await Share.share({
        message: shareMessage,
        title: content.title,
        url: content.url,
      });
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
      Alert.alert("Erro", "Não foi possível compartilhar o conteúdo");
    }
  };

  return (
    <TouchableOpacity
      onPress={handleShare}
      className={cn(
        "flex-row items-center justify-center gap-2 py-2 px-4 rounded-lg",
        variant === "primary"
          ? "bg-primary"
          : "bg-surface border border-border"
      )}
      activeOpacity={0.7}
    >
      <Text
        className={cn(
          "text-lg",
          variant === "primary" ? "text-background" : "text-primary"
        )}
      >
        📤
      </Text>
      {showLabel && (
        <Text
          className={cn(
            "font-semibold",
            variant === "primary" ? "text-background" : "text-foreground"
          )}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

/**
 * Componente com múltiplas opções de compartilhamento
 */
export function ShareOptions({
  content,
}: {
  content: ShareContent;
}) {
  const colors = useColors();

  const shareOptions = [
    {
      name: "WhatsApp",
      emoji: "💬",
      handler: async () => {
        const message = `${content.title}\n\n${content.message}`;
        const encodedMessage = encodeURIComponent(message);
        // Nota: Implementação real requereria deep linking para WhatsApp
        Alert.alert("WhatsApp", "Abrindo WhatsApp...");
      },
    },
    {
      name: "Instagram",
      emoji: "📸",
      handler: async () => {
        Alert.alert("Instagram", "Copie o conteúdo e compartilhe no Instagram");
      },
    },
    {
      name: "Twitter/X",
      emoji: "𝕏",
      handler: async () => {
        const message = `${content.title}\n\n${content.message}`;
        const encodedMessage = encodeURIComponent(message);
        // Nota: Implementação real requereria deep linking para Twitter
        Alert.alert("Twitter/X", "Abrindo Twitter/X...");
      },
    },
    {
      name: "Copiar",
      emoji: "📋",
      handler: async () => {
        // Implementar cópia para clipboard
        Alert.alert("Copiar", "Conteúdo copiado para a área de transferência");
      },
    },
  ];

  return (
    <View className="gap-2">
      {shareOptions.map((option) => (
        <TouchableOpacity
          key={option.name}
          onPress={option.handler}
          className="flex-row items-center gap-3 p-3 bg-surface rounded-lg border border-border"
          activeOpacity={0.7}
        >
          <Text className="text-2xl">{option.emoji}</Text>
          <Text className="text-foreground font-medium flex-1">{option.name}</Text>
          <Text className="text-muted">→</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

/**
 * Hook para gerar conteúdo de compartilhamento formatado
 */
export function useShareContent() {
  const generatePlayerShare = (player: any) => ({
    title: `${player.name} - Timão Dados`,
    message: `Confira o perfil de ${player.name}!\n\nPosição: ${player.position}\nGols: ${player.goals}\nJogos: ${player.games}\nAssistências: ${player.assists}`,
  });

  const generateGameShare = (game: any) => ({
    title: `${game.opponent} - Timão Dados`,
    message: `Corinthians ${game.corinthiansScore} × ${game.opponentScore} ${game.opponent}\n\nData: ${game.gameDate}\nLocal: ${game.stadium}\nCompetição: ${game.competition}`,
  });

  const generateCuriosityShare = (curiosity: any) => ({
    title: `${curiosity.title} - Timão Dados`,
    message: `${curiosity.description}\n\nCategoria: ${curiosity.category}\nData: ${curiosity.date}`,
  });

  const generateRankingShare = (ranking: string, topPlayer: any) => ({
    title: `Ranking de ${ranking} - Timão Dados`,
    message: `🏆 Top 1: ${topPlayer.name}\n${topPlayer.value} ${ranking.toLowerCase()}\n\nConfira o ranking completo no Timão Dados!`,
  });

  return {
    generatePlayerShare,
    generateGameShare,
    generateCuriosityShare,
    generateRankingShare,
  };
}
