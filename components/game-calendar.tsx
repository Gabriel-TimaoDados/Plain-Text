import { View, Text, ScrollView, TouchableOpacity, FlatList } from "react-native";
import { useState, useMemo } from "react";

export interface CalendarGame {
  id: string;
  date: string;
  opponent: string;
  result?: "win" | "draw" | "loss";
  score?: {
    corinthians: number;
    opponent: number;
  };
  prediction?: {
    result: "win" | "draw" | "loss";
    confidence: number;
  };
  status: "played" | "upcoming" | "today";
}

interface GameCalendarProps {
  games: CalendarGame[];
  onGameSelect?: (game: CalendarGame) => void;
}

/**
 * Componente de calendário interativo de jogos
 */
export function GameCalendar({ games, onGameSelect }: GameCalendarProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const gameDate = new Date(game.date);
      return gameDate.getMonth() === selectedMonth && gameDate.getFullYear() === selectedYear;
    });
  }, [games, selectedMonth, selectedYear]);

  const stats = useMemo(() => {
    const played = filteredGames.filter((g) => g.status === "played");
    const wins = played.filter((g) => g.result === "win").length;
    const draws = played.filter((g) => g.result === "draw").length;
    const losses = played.filter((g) => g.result === "loss").length;

    return { wins, draws, losses, total: played.length };
  }, [filteredGames]);

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  return (
    <View className="flex-1 gap-4">
      {/* Seletor de Mês */}
      <View className="px-6 py-4 gap-3">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={handlePrevMonth} className="p-2">
            <Text className="text-primary text-2xl">‹</Text>
          </TouchableOpacity>

          <View className="items-center">
            <Text className="text-foreground font-bold text-lg">
              {monthNames[selectedMonth]} {selectedYear}
            </Text>
          </View>

          <TouchableOpacity onPress={handleNextMonth} className="p-2">
            <Text className="text-primary text-2xl">›</Text>
          </TouchableOpacity>
        </View>

        {/* Estatísticas do Mês */}
        {stats.total > 0 && (
          <View className="flex-row gap-2 bg-surface rounded-lg p-3">
            <StatItem icon="🏆" label="Vitórias" value={stats.wins} />
            <StatItem icon="🤝" label="Empates" value={stats.draws} />
            <StatItem icon="😔" label="Derrotas" value={stats.losses} />
          </View>
        )}
      </View>

      {/* Lista de Jogos */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-6 gap-2 pb-6">
          {filteredGames.length > 0 ? (
            filteredGames.map((game) => (
              <GameCalendarCard
                key={game.id}
                game={game}
                onPress={() => onGameSelect?.(game)}
              />
            ))
          ) : (
            <View className="py-8 items-center">
              <Text className="text-muted text-center">Nenhum jogo neste mês</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

interface GameCalendarCardProps {
  game: CalendarGame;
  onPress: () => void;
}

function GameCalendarCard({ game, onPress }: GameCalendarCardProps) {
  const gameDate = new Date(game.date);
  const dayOfWeek = gameDate.toLocaleDateString("pt-BR", { weekday: "short" });
  const day = gameDate.getDate();

  const getStatusColor = () => {
    if (game.status === "today") return "bg-orange-500";
    if (game.status === "played") {
      if (game.result === "win") return "bg-success";
      if (game.result === "draw") return "bg-warning";
      return "bg-error";
    }
    return "bg-primary";
  };

  const getResultEmoji = () => {
    if (!game.result && game.prediction) {
      if (game.prediction.result === "win") return "🏆";
      if (game.prediction.result === "draw") return "🤝";
      return "😔";
    }
    if (game.result === "win") return "✅";
    if (game.result === "draw") return "🤝";
    if (game.result === "loss") return "❌";
    return "⏳";
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`rounded-lg border border-border p-3 flex-row items-center gap-3 ${getStatusColor()} bg-opacity-10`}
    >
      {/* Data */}
      <View className={`w-12 h-12 rounded-lg items-center justify-center ${getStatusColor()}`}>
        <Text className="text-white font-bold text-xs">{dayOfWeek}</Text>
        <Text className="text-white font-bold text-lg">{day}</Text>
      </View>

      {/* Informações do Jogo */}
      <View className="flex-1 gap-1">
        <Text className="text-foreground font-bold">vs {game.opponent}</Text>
        <Text className="text-muted text-xs">
          {game.status === "played"
            ? `${game.score?.corinthians} x ${game.score?.opponent}`
            : game.status === "today"
              ? "Hoje"
              : "Próximo"}
        </Text>
      </View>

      {/* Resultado/Previsão */}
      <View className="items-center gap-1">
        <Text className="text-2xl">{getResultEmoji()}</Text>
        {game.prediction && !game.result && (
          <Text className="text-primary text-xs font-bold">
            {(game.prediction.confidence * 100).toFixed(0)}%
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

interface StatItemProps {
  icon: string;
  label: string;
  value: number;
}

function StatItem({ icon, label, value }: StatItemProps) {
  return (
    <View className="flex-1 items-center gap-1">
      <Text className="text-lg">{icon}</Text>
      <Text className="text-foreground font-bold">{value}</Text>
      <Text className="text-muted text-xs">{label}</Text>
    </View>
  );
}
