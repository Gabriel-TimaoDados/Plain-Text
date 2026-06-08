import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useMemo, useState } from "react";

export interface CoachStats {
  id: string;
  name: string;
  nationality: string;
  startDate: string;
  endDate?: string;
  matches: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  trophies: string[];
  style: string;
}

interface CoachComparisonProps {
  coaches: CoachStats[];
  onCoachSelect?: (coach: CoachStats) => void;
}

/**
 * Componente de comparação de técnicos
 */
export function CoachComparison({ coaches, onCoachSelect }: CoachComparisonProps) {
  const [sortBy, setSortBy] = useState<"wins" | "points" | "matches">("wins");
  const [selectedCoaches, setSelectedCoaches] = useState<string[]>([]);

  const sortedCoaches = useMemo(() => {
    return [...coaches].sort((a, b) => {
      switch (sortBy) {
        case "wins":
          return b.wins - a.wins;
        case "points":
          return b.points - a.points;
        case "matches":
          return b.matches - a.matches;
        default:
          return 0;
      }
    });
  }, [coaches, sortBy]);

  const toggleCoachSelection = (coachId: string) => {
    setSelectedCoaches((prev) =>
      prev.includes(coachId) ? prev.filter((id) => id !== coachId) : [...prev, coachId]
    );
  };

  return (
    <View className="flex-1 gap-4">
      {/* Seletor de Ordenação */}
      <View className="px-6 py-4 gap-3">
        <Text className="text-foreground font-semibold">Ordenar por</Text>
        <View className="flex-row gap-2">
          <SortButton
            label="Vitórias"
            active={sortBy === "wins"}
            onPress={() => setSortBy("wins")}
          />
          <SortButton
            label="Pontos"
            active={sortBy === "points"}
            onPress={() => setSortBy("points")}
          />
          <SortButton
            label="Partidas"
            active={sortBy === "matches"}
            onPress={() => setSortBy("matches")}
          />
        </View>
      </View>

      {/* Lista de Técnicos */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-6 gap-3 pb-6">
          {sortedCoaches.map((coach) => (
            <CoachCard
              key={coach.id}
              coach={coach}
              isSelected={selectedCoaches.includes(coach.id)}
              onPress={() => {
                toggleCoachSelection(coach.id);
                onCoachSelect?.(coach);
              }}
            />
          ))}
        </View>
      </ScrollView>

      {/* Resumo de Comparação */}
      {selectedCoaches.length > 0 && (
        <View className="px-6 py-4 gap-3 border-t border-border">
          <Text className="text-foreground font-semibold">
            Comparando {selectedCoaches.length} técnico(s)
          </Text>
          <ComparisonSummary
            coaches={sortedCoaches.filter((c) => selectedCoaches.includes(c.id))}
          />
        </View>
      )}
    </View>
  );
}

interface CoachCardProps {
  coach: CoachStats;
  isSelected: boolean;
  onPress: () => void;
}

function CoachCard({ coach, isSelected, onPress }: CoachCardProps) {
  const winRate = coach.matches > 0 ? (coach.wins / coach.matches) * 100 : 0;
  const pointsPerMatch = coach.matches > 0 ? (coach.points / coach.matches).toFixed(2) : "0.00";

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`rounded-lg border p-4 gap-3 ${
        isSelected ? "bg-primary border-primary" : "bg-surface border-border"
      }`}
    >
      {/* Cabeçalho */}
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className={`font-bold text-lg ${isSelected ? "text-white" : "text-foreground"}`}>
            {coach.name}
          </Text>
          <Text className={`text-xs ${isSelected ? "text-white text-opacity-80" : "text-muted"}`}>
            {coach.nationality}
          </Text>
        </View>
        <View className="items-center">
          <Text className={`text-2xl font-bold ${isSelected ? "text-white" : "text-primary"}`}>
            {winRate.toFixed(0)}%
          </Text>
          <Text className={`text-xs ${isSelected ? "text-white text-opacity-80" : "text-muted"}`}>
            Aproveitamento
          </Text>
        </View>
      </View>

      {/* Período */}
      <View className={`text-xs ${isSelected ? "text-white text-opacity-70" : "text-muted"}`}>
        <Text className={`text-xs ${isSelected ? "text-white text-opacity-70" : "text-muted"}`}>
          {coach.startDate} {coach.endDate ? `- ${coach.endDate}` : "- Presente"}
        </Text>
      </View>

      {/* Estatísticas */}
      <View className="flex-row gap-2 pt-2 border-t border-opacity-20 border-white">
        <StatBadge icon="🎮" value={coach.matches.toString()} label="Partidas" />
        <StatBadge icon="🏆" value={coach.wins.toString()} label="Vitórias" />
        <StatBadge icon="⭐" value={pointsPerMatch} label="Pts/Jogo" />
      </View>

      {/* Troféus */}
      {coach.trophies.length > 0 && (
        <View className="gap-1">
          <Text className={`text-xs font-semibold ${isSelected ? "text-white" : "text-foreground"}`}>
            Troféus: {coach.trophies.join(", ")}
          </Text>
        </View>
      )}
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
  label: string;
}

function StatBadge({ icon, value, label }: StatBadgeProps) {
  return (
    <View className="flex-1 items-center gap-1">
      <Text className="text-lg">{icon}</Text>
      <Text className="text-xs font-bold text-white">{value}</Text>
      <Text className="text-xs text-white text-opacity-70">{label}</Text>
    </View>
  );
}

interface ComparisonSummaryProps {
  coaches: CoachStats[];
}

function ComparisonSummary({ coaches }: ComparisonSummaryProps) {
  const totalWins = coaches.reduce((sum, c) => sum + c.wins, 0);
  const totalMatches = coaches.reduce((sum, c) => sum + c.matches, 0);
  const totalTrophies = coaches.reduce((sum, c) => sum + c.trophies.length, 0);
  const avgWinRate = totalMatches > 0 ? (totalWins / totalMatches) * 100 : 0;

  return (
    <View className="bg-surface rounded-lg border border-border p-4 gap-3">
      <View className="flex-row justify-between">
        <ComparisonMetric label="Vitórias" value={totalWins.toString()} icon="🏆" />
        <ComparisonMetric label="Aproveitamento" value={`${avgWinRate.toFixed(0)}%`} icon="📊" />
        <ComparisonMetric label="Troféus" value={totalTrophies.toString()} icon="🏅" />
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
