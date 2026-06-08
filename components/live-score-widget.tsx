import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { GoalCelebration } from "./goal-celebration";
import { useGoalCelebration } from "@/hooks/use-goal-celebration";

interface LiveGame {
  id: number;
  opponent: string;
  corinthiansScore: number;
  opponentScore: number;
  status: "live" | "upcoming" | "finished";
  minute?: number;
  stadium?: string;
  competition?: string;
  isHome: boolean;
}

interface LiveScoreWidgetProps {
  game: LiveGame | null;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function LiveScoreWidget({ game, isLoading = false, onRefresh }: LiveScoreWidgetProps) {
  const router = useRouter();
  const [displayMinute, setDisplayMinute] = useState<number | null>(null);
  const [showGoalAnimation, setShowGoalAnimation] = useState(false);
  const [previousScore, setPreviousScore] = useState({ corinthians: 0, opponent: 0 });
  const { celebrate } = useGoalCelebration();

  useEffect(() => {
    if (game?.status === "live" && game?.minute) {
      setDisplayMinute(game.minute);
    }
  }, [game]);

  // Detectar gols e ativar animação
  useEffect(() => {
    if (!game) return;

    if (game.corinthiansScore > previousScore.corinthians) {
      // Novo gol do Corinthians!
      setShowGoalAnimation(true);
      celebrate();
      setPreviousScore({
        corinthians: game.corinthiansScore,
        opponent: game.opponentScore,
      });
    } else if (game.corinthiansScore !== previousScore.corinthians || game.opponentScore !== previousScore.opponent) {
      // Atualizar placar sem animação
      setPreviousScore({
        corinthians: game.corinthiansScore,
        opponent: game.opponentScore,
      });
    }
  }, [game, previousScore, celebrate]);

  if (!game) {
    return null;
  }

  const getStatusColor = () => {
    switch (game.status) {
      case "live":
        return "bg-red-500";
      case "upcoming":
        return "bg-blue-500";
      case "finished":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = () => {
    switch (game.status) {
      case "live":
        return `AO VIVO - ${displayMinute || "?"}\'`;
      case "upcoming":
        return "PRÓXIMO";
      case "finished":
        return "ENCERRADO";
      default:
        return "---";
    }
  };

  const handlePress = () => {
    router.push(`/game/${game.id}`);
  };

  return (
    <View className="mx-6 mb-6 rounded-2xl overflow-hidden shadow-lg relative">
      {/* Animação de gol */}
      <GoalCelebration
        visible={showGoalAnimation}
        playerName="Corinthians"
        onAnimationComplete={() => setShowGoalAnimation(false)}
      />

      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        className="rounded-2xl overflow-hidden"
      >
      {/* Status Bar */}
      <View className={`${getStatusColor()} px-4 py-2 flex-row items-center justify-between`}>
        <View className="flex-row items-center gap-2">
          {game.status === "live" && (
            <View className="w-2 h-2 bg-white rounded-full animate-pulse" />
          )}
          <Text className="text-white font-bold text-sm">{getStatusText()}</Text>
        </View>
        <Text className="text-white text-xs font-semibold">{game.competition}</Text>
      </View>

      {/* Score Card */}
      <View className="bg-surface border border-border p-6">
        {/* Teams and Score */}
        <View className="flex-row items-center justify-between gap-4 mb-4">
          {/* Corinthians */}
          <View className="flex-1 items-center gap-2">
            <Text className="text-foreground font-bold text-lg">Corinthians</Text>
            <Text className="text-primary font-bold text-4xl">{game.corinthiansScore}</Text>
            <Text className="text-muted text-xs">
              {game.isHome ? "Mandante" : "Visitante"}
            </Text>
          </View>

          {/* VS */}
          <View className="items-center gap-2">
            <Text className="text-muted font-bold text-sm">VS</Text>
            <View className="w-8 h-8 bg-primary rounded-full items-center justify-center">
              <Text className="text-white font-bold">⚽</Text>
            </View>
          </View>

          {/* Opponent */}
          <View className="flex-1 items-center gap-2">
            <Text className="text-foreground font-bold text-lg">{game.opponent}</Text>
            <Text className="text-primary font-bold text-4xl">{game.opponentScore}</Text>
            <Text className="text-muted text-xs">
              {game.isHome ? "Visitante" : "Mandante"}
            </Text>
          </View>
        </View>

        {/* Stadium Info */}
        {game.stadium && (
          <View className="border-t border-border pt-4 gap-2">
            <Text className="text-muted text-xs font-semibold">LOCAL</Text>
            <Text className="text-foreground font-medium">{game.stadium}</Text>
          </View>
        )}

        {/* Refresh Button */}
        {game.status === "live" && onRefresh && (
          <TouchableOpacity
            onPress={onRefresh}
            disabled={isLoading}
            className="mt-4 flex-row items-center justify-center gap-2 bg-primary rounded-lg py-2"
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Text className="text-white font-semibold">🔄 Atualizar</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
    </View>
  );
}
