import { View, Text, ScrollView, Dimensions } from "react-native";
import { useMemo } from "react";

interface GameStats {
  possession: number; // Posse de bola em %
  shots: number; // Total de chutes
  shotsOnTarget: number; // Chutes no alvo
  corners: number; // Escanteios
  fouls: number; // Faltas
  yellowCards: number; // Cartões amarelos
  redCards: number; // Cartões vermelhos
  passes: number; // Passes completados
  passAccuracy: number; // Precisão de passes em %
  tackles: number; // Roubadas de bola
  interceptions: number; // Interceptações
}

interface GameStatisticsProps {
  corinthiansStats: GameStats;
  opponentStats: GameStats;
  opponentName: string;
}

/**
 * Componente de estatísticas do jogo em tempo real
 * Exibe comparação lado a lado com cards deslizáveis
 */
export function GameStatistics({
  corinthiansStats,
  opponentStats,
  opponentName,
}: GameStatisticsProps) {
  const screenWidth = Dimensions.get("window").width;

  // Organizar estatísticas em grupos
  const statGroups = useMemo(
    () => [
      {
        title: "Posse de Bola",
        icon: "⚽",
        corinthians: corinthiansStats.possession,
        opponent: opponentStats.possession,
        unit: "%",
      },
      {
        title: "Chutes",
        icon: "🎯",
        corinthians: corinthiansStats.shots,
        opponent: opponentStats.shots,
        unit: "",
      },
      {
        title: "Chutes no Alvo",
        icon: "🔴",
        corinthians: corinthiansStats.shotsOnTarget,
        opponent: opponentStats.shotsOnTarget,
        unit: "",
      },
      {
        title: "Escanteios",
        icon: "🚩",
        corinthians: corinthiansStats.corners,
        opponent: opponentStats.corners,
        unit: "",
      },
      {
        title: "Faltas",
        icon: "⚠️",
        corinthians: corinthiansStats.fouls,
        opponent: opponentStats.fouls,
        unit: "",
      },
      {
        title: "Cartões Amarelos",
        icon: "🟨",
        corinthians: corinthiansStats.yellowCards,
        opponent: opponentStats.yellowCards,
        unit: "",
      },
      {
        title: "Cartões Vermelhos",
        icon: "🟥",
        corinthians: corinthiansStats.redCards,
        opponent: opponentStats.redCards,
        unit: "",
      },
      {
        title: "Passes",
        icon: "📍",
        corinthians: corinthiansStats.passes,
        opponent: opponentStats.passes,
        unit: "",
      },
      {
        title: "Precisão de Passes",
        icon: "✅",
        corinthians: corinthiansStats.passAccuracy,
        opponent: opponentStats.passAccuracy,
        unit: "%",
      },
      {
        title: "Roubadas",
        icon: "🏃",
        corinthians: corinthiansStats.tackles,
        opponent: opponentStats.tackles,
        unit: "",
      },
      {
        title: "Interceptações",
        icon: "🛡️",
        corinthians: corinthiansStats.interceptions,
        opponent: opponentStats.interceptions,
        unit: "",
      },
    ],
    [corinthiansStats, opponentStats]
  );

  return (
    <View className="gap-4 py-4">
      <Text className="text-sm font-semibold text-muted uppercase tracking-wide px-6">
        Estatísticas do Jogo
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
      >
        {statGroups.map((stat, index) => (
          <StatCard
            key={index}
            stat={stat}
            opponentName={opponentName}
            width={screenWidth - 48}
          />
        ))}
      </ScrollView>
    </View>
  );
}

interface StatCardProps {
  stat: {
    title: string;
    icon: string;
    corinthians: number;
    opponent: number;
    unit: string;
  };
  opponentName: string;
  width: number;
}

/**
 * Card individual de estatística
 */
function StatCard({ stat, opponentName, width }: StatCardProps) {
  const total = stat.corinthians + stat.opponent;
  const corinthiansPercentage = total > 0 ? (stat.corinthians / total) * 100 : 50;
  const opponentPercentage = total > 0 ? (stat.opponent / total) * 100 : 50;

  return (
    <View
      style={{ width: width * 0.8 }}
      className="bg-surface rounded-2xl p-6 border border-border gap-4"
    >
      {/* Título */}
      <View className="flex-row items-center gap-2">
        <Text className="text-2xl">{stat.icon}</Text>
        <Text className="text-foreground font-semibold flex-1">{stat.title}</Text>
      </View>

      {/* Valores */}
      <View className="flex-row items-center justify-between gap-4">
        <View className="flex-1 items-center gap-2">
          <Text className="text-primary font-bold text-2xl">
            {stat.corinthians}
            {stat.unit}
          </Text>
          <Text className="text-muted text-xs">Corinthians</Text>
        </View>

        <View className="w-1 h-12 bg-border rounded-full" />

        <View className="flex-1 items-center gap-2">
          <Text className="text-primary font-bold text-2xl">
            {stat.opponent}
            {stat.unit}
          </Text>
          <Text className="text-muted text-xs">{opponentName}</Text>
        </View>
      </View>

      {/* Barra de comparação */}
      <View className="h-2 bg-border rounded-full overflow-hidden flex-row">
        <View
          style={{ width: `${corinthiansPercentage}%` }}
          className="bg-primary"
        />
        <View
          style={{ width: `${opponentPercentage}%` }}
          className="bg-orange-400"
        />
      </View>

      {/* Percentuais */}
      <View className="flex-row justify-between">
        <Text className="text-muted text-xs">{corinthiansPercentage.toFixed(0)}%</Text>
        <Text className="text-muted text-xs">{opponentPercentage.toFixed(0)}%</Text>
      </View>
    </View>
  );
}

/**
 * Componente para exibir substituições
 */
export function SubstitutionsDisplay({
  substitutions,
}: {
  substitutions: Array<{
    minute: number;
    playerOut: string;
    playerIn: string;
    team: "Corinthians" | "Opponent";
  }>;
}) {
  return (
    <View className="gap-3">
      <Text className="text-sm font-semibold text-muted uppercase tracking-wide">
        Substituições
      </Text>

      {substitutions.length === 0 ? (
        <Text className="text-muted text-sm">Nenhuma substituição ainda</Text>
      ) : (
        substitutions.map((sub, index) => (
          <View
            key={index}
            className="bg-surface rounded-lg p-4 border border-border flex-row items-center gap-3"
          >
            <Text className="text-muted text-sm font-semibold">{sub.minute}'</Text>
            <View className="flex-1 gap-1">
              <View className="flex-row items-center gap-2">
                <Text className="text-red-500 font-semibold">🔴</Text>
                <Text className="text-foreground font-medium">{sub.playerOut}</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Text className="text-green-500 font-semibold">🟢</Text>
                <Text className="text-foreground font-medium">{sub.playerIn}</Text>
              </View>
            </View>
            <Text className="text-muted text-xs">{sub.team}</Text>
          </View>
        ))
      )}
    </View>
  );
}

/**
 * Componente para exibir eventos do jogo (gols, cartões)
 */
export function GameEvents({
  events,
}: {
  events: Array<{
    minute: number;
    type: "goal" | "yellow_card" | "red_card";
    player: string;
    team: "Corinthians" | "Opponent";
  }>;
}) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case "goal":
        return "⚽";
      case "yellow_card":
        return "🟨";
      case "red_card":
        return "🟥";
      default:
        return "📌";
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "goal":
        return "bg-green-100";
      case "yellow_card":
        return "bg-yellow-100";
      case "red_card":
        return "bg-red-100";
      default:
        return "bg-surface";
    }
  };

  return (
    <View className="gap-3">
      <Text className="text-sm font-semibold text-muted uppercase tracking-wide">
        Eventos do Jogo
      </Text>

      {events.length === 0 ? (
        <Text className="text-muted text-sm">Aguardando eventos...</Text>
      ) : (
        events.map((event, index) => (
          <View
            key={index}
            className={`${getEventColor(event.type)} rounded-lg p-4 border border-border flex-row items-center gap-3`}
          >
            <Text className="text-2xl">{getEventIcon(event.type)}</Text>
            <View className="flex-1">
              <Text className="text-foreground font-semibold">{event.player}</Text>
              <Text className="text-muted text-xs">{event.team}</Text>
            </View>
            <Text className="text-muted text-sm font-semibold">{event.minute}'</Text>
          </View>
        ))
      )}
    </View>
  );
}
