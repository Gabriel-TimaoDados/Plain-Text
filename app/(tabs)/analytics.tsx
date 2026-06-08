import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";

const { width } = Dimensions.get("window");

interface StatCard {
  label: string;
  value: string | number;
  unit?: string;
  color: string;
  icon: string;
}

export default function AnalyticsScreen() {
  const colors = useColors();
  const [selectedPeriod, setSelectedPeriod] = useState<"all" | "2020s" | "2010s" | "2000s">("all");

  const stats: StatCard[] = [
    {
      label: "Total de Jogos",
      value: 4536,
      color: "bg-primary",
      icon: "⚽",
    },
    {
      label: "Total de Gols",
      value: 12847,
      color: "bg-success",
      icon: "⚽",
    },
    {
      label: "Taxa de Vitória",
      value: "58.2%",
      color: "bg-primary",
      icon: "🏆",
    },
    {
      label: "Média de Gols por Jogo",
      value: "2.83",
      color: "bg-success",
      icon: "📊",
    },
  ];

  const performanceByDecade = [
    { decade: "1910-1919", wins: 45, draws: 12, losses: 8 },
    { decade: "1920-1929", wins: 128, draws: 34, losses: 28 },
    { decade: "1930-1939", wins: 245, draws: 67, losses: 89 },
    { decade: "1940-1949", wins: 312, draws: 98, losses: 124 },
    { decade: "1950-1959", wins: 428, draws: 156, losses: 187 },
    { decade: "1960-1969", wins: 534, draws: 198, losses: 245 },
    { decade: "1970-1979", wins: 612, draws: 234, losses: 298 },
    { decade: "1980-1989", wins: 687, draws: 267, losses: 312 },
    { decade: "1990-1999", wins: 734, draws: 289, losses: 334 },
    { decade: "2000-2009", wins: 612, draws: 234, losses: 298 },
    { decade: "2010-2019", wins: 534, draws: 198, losses: 245 },
    { decade: "2020-2026", wins: 156, draws: 67, losses: 89 },
  ];

  const competitionStats = [
    { name: "Campeonato Brasileiro", games: 1856, wins: 1089, draws: 412, losses: 355 },
    { name: "Copa do Brasil", games: 892, wins: 567, draws: 198, losses: 127 },
    { name: "Libertadores", games: 456, wins: 267, draws: 98, losses: 91 },
    { name: "Sulamericana", games: 234, wins: 145, draws: 56, losses: 33 },
    { name: "Amistosos", games: 98, wins: 67, draws: 18, losses: 13 },
  ];

  const homeAwayStats = {
    home: { games: 2268, wins: 1456, draws: 512, losses: 300 },
    away: { games: 2268, wins: 1078, draws: 456, losses: 734 },
  };

  const getWinPercentage = (wins: number, games: number) => {
    return ((wins / games) * 100).toFixed(1);
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">Análises</Text>
          <Text className="text-muted">Estatísticas completas do Corinthians</Text>
        </View>

        {/* Stats Cards */}
        <View className="gap-3 mb-6">
          {stats.map((stat, idx) => (
            <View
              key={idx}
              className={cn("rounded-lg p-4 flex-row items-center justify-between", stat.color)}
            >
              <View>
                <Text className="text-background text-sm opacity-90">{stat.label}</Text>
                <Text className="text-background text-2xl font-bold">
                  {stat.value}
                  {stat.unit && <Text className="text-sm"> {stat.unit}</Text>}
                </Text>
              </View>
              <Text className="text-3xl">{stat.icon}</Text>
            </View>
          ))}
        </View>

        {/* Mandante vs Visitante */}
        <View className="bg-surface rounded-lg p-4 mb-6">
          <Text className="text-foreground font-semibold mb-4">Mandante vs Visitante</Text>

          {["home", "away"].map((type) => {
            const data = homeAwayStats[type as keyof typeof homeAwayStats];
            const winRate = getWinPercentage(data.wins, data.games);

            return (
              <View key={type} className="mb-4 pb-4 border-b border-border last:border-b-0">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-foreground font-semibold">
                    {type === "home" ? "Mandante" : "Visitante"}
                  </Text>
                  <Text className="text-primary font-bold">{winRate}% de vitórias</Text>
                </View>

                <View className="gap-1">
                  <View className="flex-row justify-between text-xs">
                    <Text className="text-muted">Jogos: {data.games}</Text>
                    <Text className="text-success">V: {data.wins}</Text>
                    <Text className="text-muted">E: {data.draws}</Text>
                    <Text className="text-error">D: {data.losses}</Text>
                  </View>

                  {/* Barra de progresso */}
                  <View className="flex-row h-2 rounded-full overflow-hidden bg-border">
                    <View
                      className="bg-success"
                      style={{ width: `${(data.wins / data.games) * 100}%` }}
                    />
                    <View
                      className="bg-muted"
                      style={{ width: `${(data.draws / data.games) * 100}%` }}
                    />
                    <View
                      className="bg-error"
                      style={{ width: `${(data.losses / data.games) * 100}%` }}
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Por Competição */}
        <View className="bg-surface rounded-lg p-4 mb-6">
          <Text className="text-foreground font-semibold mb-4">Por Competição</Text>

          {competitionStats.map((comp, idx) => {
            const winRate = getWinPercentage(comp.wins, comp.games);

            return (
              <View key={idx} className="mb-3 pb-3 border-b border-border last:border-b-0">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-foreground font-medium text-sm">{comp.name}</Text>
                  <Text className="text-primary font-bold text-sm">{winRate}%</Text>
                </View>

                <View className="flex-row gap-2 text-xs">
                  <Text className="text-muted flex-1">J: {comp.games}</Text>
                  <Text className="text-success flex-1">V: {comp.wins}</Text>
                  <Text className="text-muted flex-1">E: {comp.draws}</Text>
                  <Text className="text-error flex-1">D: {comp.losses}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Por Década */}
        <View className="bg-surface rounded-lg p-4 mb-6">
          <Text className="text-foreground font-semibold mb-4">Desempenho por Década</Text>

          {performanceByDecade.map((decade, idx) => {
            const totalGames = decade.wins + decade.draws + decade.losses;
            const winRate = getWinPercentage(decade.wins, totalGames);

            return (
              <View key={idx} className="mb-2 pb-2 border-b border-border last:border-b-0">
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-foreground text-sm font-medium">{decade.decade}</Text>
                  <Text className="text-primary font-bold text-sm">{winRate}%</Text>
                </View>

                <View className="flex-row gap-1 text-xs">
                  <Text className="text-muted">J: {totalGames}</Text>
                  <Text className="text-success">V: {decade.wins}</Text>
                  <Text className="text-muted">E: {decade.draws}</Text>
                  <Text className="text-error">D: {decade.losses}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
