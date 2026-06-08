import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useMemo, useState } from "react";

export interface PlayerStats {
  id: string;
  name: string;
  position: string;
  number: number;
  photo?: string;
  statistics: {
    matches: number;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
    minutesPlayed: number;
  };
}

interface PlayerComparisonProps {
  players: PlayerStats[];
  onPlayerSelect?: (player: PlayerStats) => void;
}

/**
 * Componente de comparação de jogadores
 */
export function PlayerComparison({ players, onPlayerSelect }: PlayerComparisonProps) {
  const [sortBy, setSortBy] = useState<"goals" | "assists" | "matches">("goals");
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);

  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => {
      switch (sortBy) {
        case "goals":
          return b.statistics.goals - a.statistics.goals;
        case "assists":
          return b.statistics.assists - a.statistics.assists;
        case "matches":
          return b.statistics.matches - a.statistics.matches;
        default:
          return 0;
      }
    });
  }, [players, sortBy]);

  const togglePlayerSelection = (playerId: string) => {
    setSelectedPlayers((prev) =>
      prev.includes(playerId) ? prev.filter((id) => id !== playerId) : [...prev, playerId]
    );
  };

  return (
    <View className="flex-1 gap-4">
      {/* Seletor de Ordenação */}
      <View className="px-6 py-4 gap-3">
        <Text className="text-foreground font-semibold">Ordenar por</Text>
        <View className="flex-row gap-2">
          <SortButton
            label="Gols"
            active={sortBy === "goals"}
            onPress={() => setSortBy("goals")}
          />
          <SortButton
            label="Assistências"
            active={sortBy === "assists"}
            onPress={() => setSortBy("assists")}
          />
          <SortButton
            label="Partidas"
            active={sortBy === "matches"}
            onPress={() => setSortBy("matches")}
          />
        </View>
      </View>

      {/* Lista de Jogadores */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-6 gap-3 pb-6">
          {sortedPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              isSelected={selectedPlayers.includes(player.id)}
              onPress={() => {
                togglePlayerSelection(player.id);
                onPlayerSelect?.(player);
              }}
            />
          ))}
        </View>
      </ScrollView>

      {/* Resumo de Comparação */}
      {selectedPlayers.length > 0 && (
        <View className="px-6 py-4 gap-3 border-t border-border">
          <Text className="text-foreground font-semibold">
            Comparando {selectedPlayers.length} jogador(es)
          </Text>
          <ComparisonSummary
            players={sortedPlayers.filter((p) => selectedPlayers.includes(p.id))}
          />
        </View>
      )}
    </View>
  );
}

interface PlayerCardProps {
  player: PlayerStats;
  isSelected: boolean;
  onPress: () => void;
}

function PlayerCard({ player, isSelected, onPress }: PlayerCardProps) {
  const goalsPerMatch = player.statistics.matches > 0
    ? (player.statistics.goals / player.statistics.matches).toFixed(2)
    : "0.00";

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`rounded-lg border p-4 flex-row items-center gap-3 ${
        isSelected ? "bg-primary border-primary" : "bg-surface border-border"
      }`}
    >
      {/* Número da Camisa */}
      <View
        className={`w-12 h-12 rounded-lg items-center justify-center ${
          isSelected ? "bg-white" : "bg-border"
        }`}
      >
        <Text className={`font-bold text-lg ${isSelected ? "text-primary" : "text-foreground"}`}>
          {player.number}
        </Text>
      </View>

      {/* Informações do Jogador */}
      <View className="flex-1">
        <Text className={`font-bold ${isSelected ? "text-white" : "text-foreground"}`}>
          {player.name}
        </Text>
        <Text className={`text-xs ${isSelected ? "text-white text-opacity-80" : "text-muted"}`}>
          {player.position}
        </Text>
      </View>

      {/* Estatísticas Rápidas */}
      <View className="flex-row gap-3 items-center">
        <StatBadge icon="⚽" value={player.statistics.goals.toString()} />
        <StatBadge icon="🎯" value={player.statistics.assists.toString()} />
        <StatBadge icon="🎮" value={player.statistics.matches.toString()} />
      </View>
    </TouchableOpacity>
  );
}

interface SortButtonProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

function SortButton({ label, active, onPress }: SortButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-1 py-2 px-3 rounded-lg border ${
        active ? "bg-primary border-primary" : "bg-surface border-border"
      }`}
    >
      <Text className={`text-center font-semibold text-sm ${active ? "text-white" : "text-foreground"}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

interface StatBadgeProps {
  icon: string;
  value: string;
}

function StatBadge({ icon, value }: StatBadgeProps) {
  return (
    <View className="items-center gap-1">
      <Text className="text-lg">{icon}</Text>
      <Text className="text-xs font-bold text-foreground">{value}</Text>
    </View>
  );
}

interface ComparisonSummaryProps {
  players: PlayerStats[];
}

function ComparisonSummary({ players }: ComparisonSummaryProps) {
  const totalGoals = players.reduce((sum, p) => sum + p.statistics.goals, 0);
  const totalAssists = players.reduce((sum, p) => sum + p.statistics.assists, 0);
  const avgMatches =
    players.length > 0
      ? (players.reduce((sum, p) => sum + p.statistics.matches, 0) / players.length).toFixed(1)
      : 0;

  return (
    <View className="bg-surface rounded-lg border border-border p-4 gap-3">
      <View className="flex-row justify-between">
        <ComparisonMetric label="Gols" value={totalGoals.toString()} icon="⚽" />
        <ComparisonMetric label="Assistências" value={totalAssists.toString()} icon="🎯" />
        <ComparisonMetric label="Média de Partidas" value={avgMatches.toString()} icon="🎮" />
      </View>
    </View>
  );
}

interface ComparisonMetricProps {
  label: string;
  value: string;
  icon: string;
}

function ComparisonMetric({ label, value, icon }: ComparisonMetricProps) {
  return (
    <View className="items-center gap-1">
      <Text className="text-2xl">{icon}</Text>
      <Text className="text-primary font-bold">{value}</Text>
      <Text className="text-muted text-xs">{label}</Text>
    </View>
  );
}
