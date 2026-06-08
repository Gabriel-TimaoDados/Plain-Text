import { View, Text, ScrollView } from "react-native";
import { useMemo } from "react";

export interface MonthlyStats {
  month: string;
  matches: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

interface PerformanceHistoryProps {
  monthlyData: MonthlyStats[];
}

/**
 * Componente de histórico de desempenho mensal
 */
export function PerformanceHistory({ monthlyData }: PerformanceHistoryProps) {
  const stats = useMemo(() => {
    return monthlyData.map((month) => {
      const total = month.matches || 1;
      const winRate = (month.wins / total) * 100;
      const pointsPerMatch = month.points / total;

      return {
        ...month,
        winRate,
        pointsPerMatch,
      };
    });
  }, [monthlyData]);

  const totalStats = useMemo(() => {
    return {
      totalMatches: stats.reduce((sum, m) => sum + m.matches, 0),
      totalWins: stats.reduce((sum, m) => sum + m.wins, 0),
      totalGoals: stats.reduce((sum, m) => sum + m.goalsFor, 0),
      totalPoints: stats.reduce((sum, m) => sum + m.points, 0),
    };
  }, [stats]);

  return (
    <View className="flex-1 gap-4">
      {/* Resumo Geral */}
      <View className="px-6 py-4 gap-3">
        <Text className="text-foreground font-semibold text-base">Resumo da Temporada</Text>

        <View className="grid grid-cols-2 gap-3">
          <SummaryCard
            label="Partidas"
            value={totalStats.totalMatches.toString()}
            icon="🎮"
          />
          <SummaryCard
            label="Vitórias"
            value={totalStats.totalWins.toString()}
            icon="🏆"
          />
          <SummaryCard
            label="Gols"
            value={totalStats.totalGoals.toString()}
            icon="⚽"
          />
          <SummaryCard
            label="Pontos"
            value={totalStats.totalPoints.toString()}
            icon="⭐"
          />
        </View>
      </View>

      {/* Histórico Mensal */}
      <View className="px-6 py-4 gap-3">
        <Text className="text-foreground font-semibold text-base">Desempenho Mensal</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingRight: 24 }}
        >
          {stats.map((month, index) => (
            <MonthCard key={index} month={month} />
          ))}
        </ScrollView>
      </View>

      {/* Tabela Detalhada */}
      <View className="px-6 py-4 gap-3">
        <Text className="text-foreground font-semibold text-base">Detalhes por Mês</Text>

        <View className="bg-surface rounded-lg border border-border overflow-hidden">
          <View className="flex-row bg-primary p-3 gap-2">
            <Text className="flex-1 text-white font-semibold text-xs">Mês</Text>
            <Text className="flex-1 text-white font-semibold text-xs text-right">V/E/D</Text>
            <Text className="flex-1 text-white font-semibold text-xs text-right">Gols</Text>
            <Text className="flex-1 text-white font-semibold text-xs text-right">Pts</Text>
          </View>

          {stats.map((month, index) => (
            <View
              key={index}
              className="flex-row p-3 gap-2 border-t border-border items-center"
            >
              <Text className="flex-1 text-foreground font-medium text-sm">{month.month}</Text>
              <Text className="flex-1 text-primary font-bold text-right text-sm">
                {month.wins}/{month.draws}/{month.losses}
              </Text>
              <Text className="flex-1 text-primary font-bold text-right text-sm">
                {month.goalsFor}
              </Text>
              <Text className="flex-1 text-primary font-bold text-right text-sm">
                {month.points}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Tendências */}
      <View className="px-6 py-4 gap-3 pb-6">
        <Text className="text-foreground font-semibold text-base">Tendências</Text>

        <View className="gap-2">
          <TrendCard
            label="Melhor Mês"
            value={
              stats.reduce((prev, current) =>
                prev.points > current.points ? prev : current
              ).month
            }
            metric="Maior pontuação"
            icon="📈"
          />
          <TrendCard
            label="Pior Mês"
            value={
              stats.reduce((prev, current) =>
                prev.points < current.points ? prev : current
              ).month
            }
            metric="Menor pontuação"
            icon="📉"
          />
          <TrendCard
            label="Média de Pontos"
            value={(totalStats.totalPoints / stats.length).toFixed(1)}
            metric="Por mês"
            icon="📊"
          />
        </View>
      </View>
    </View>
  );
}

interface SummaryCardProps {
  label: string;
  value: string;
  icon: string;
}

function SummaryCard({ label, value, icon }: SummaryCardProps) {
  return (
    <View className="bg-surface rounded-lg border border-border p-3 gap-1">
      <View className="flex-row items-center justify-between">
        <Text className="text-lg">{icon}</Text>
        <Text className="text-muted text-xs">{label}</Text>
      </View>
      <Text className="text-primary font-bold text-xl">{value}</Text>
    </View>
  );
}

interface MonthCardProps {
  month: MonthlyStats & { winRate: number; pointsPerMatch: number };
}

function MonthCard({ month }: MonthCardProps) {
  return (
    <View className="bg-surface rounded-lg border border-border p-4 w-32 gap-2">
      <Text className="text-foreground font-bold text-sm">{month.month}</Text>

      <View className="gap-1">
        <StatRow label="Partidas" value={month.matches.toString()} />
        <StatRow label="Vitórias" value={month.wins.toString()} />
        <StatRow label="Gols" value={month.goalsFor.toString()} />
        <StatRow label="Pontos" value={month.points.toString()} />
      </View>

      <View className="pt-2 border-t border-border">
        <Text className="text-primary font-bold text-xs">
          {month.winRate.toFixed(0)}% vitórias
        </Text>
      </View>
    </View>
  );
}

interface StatRowProps {
  label: string;
  value: string;
}

function StatRow({ label, value }: StatRowProps) {
  return (
    <View className="flex-row justify-between items-center">
      <Text className="text-muted text-xs">{label}</Text>
      <Text className="text-foreground font-bold text-xs">{value}</Text>
    </View>
  );
}

interface TrendCardProps {
  label: string;
  value: string;
  metric: string;
  icon: string;
}

function TrendCard({ label, value, metric, icon }: TrendCardProps) {
  return (
    <View className="bg-surface rounded-lg border border-border p-3 flex-row items-center gap-3">
      <View className="w-10 h-10 bg-primary rounded-lg items-center justify-center">
        <Text className="text-lg">{icon}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-foreground font-semibold text-sm">{label}</Text>
        <Text className="text-primary font-bold">{value}</Text>
        <Text className="text-muted text-xs">{metric}</Text>
      </View>
    </View>
  );
}
