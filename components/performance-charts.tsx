import { View, Text, ScrollView, Dimensions } from "react-native";
import { useMemo } from "react";

interface SeasonStats {
  matches: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

interface PerformanceChartsProps {
  seasonStats: SeasonStats;
}

/**
 * Componente de gráficos de desempenho da temporada
 */
export function PerformanceCharts({ seasonStats }: PerformanceChartsProps) {
  const screenWidth = Dimensions.get("window").width;

  // Calcular estatísticas derivadas
  const stats = useMemo(() => {
    const total = seasonStats.matches || 1;
    const winPercentage = (seasonStats.wins / total) * 100;
    const drawPercentage = (seasonStats.draws / total) * 100;
    const lossPercentage = (seasonStats.losses / total) * 100;
    const pointsPerMatch = seasonStats.points / total;
    const goalsPerMatch = seasonStats.goalsFor / total;
    const goalsConcededPerMatch = seasonStats.goalsAgainst / total;

    return {
      winPercentage,
      drawPercentage,
      lossPercentage,
      pointsPerMatch,
      goalsPerMatch,
      goalsConcededPerMatch,
    };
  }, [seasonStats]);

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      className="gap-4"
    >
      {/* Estatísticas Gerais */}
      <View className="gap-4 px-6 py-4">
        <Text className="text-lg font-bold text-foreground">Desempenho da Temporada</Text>

        {/* Cards de Estatísticas */}
        <View className="grid grid-cols-2 gap-3">
          <StatCard
            label="Partidas"
            value={seasonStats.matches.toString()}
            icon="🎮"
          />
          <StatCard
            label="Vitórias"
            value={seasonStats.wins.toString()}
            icon="🏆"
            color="bg-green-100"
          />
          <StatCard
            label="Empates"
            value={seasonStats.draws.toString()}
            icon="🤝"
            color="bg-yellow-100"
          />
          <StatCard
            label="Derrotas"
            value={seasonStats.losses.toString()}
            icon="😢"
            color="bg-red-100"
          />
          <StatCard
            label="Gols Marcados"
            value={seasonStats.goalsFor.toString()}
            icon="⚽"
            color="bg-blue-100"
          />
          <StatCard
            label="Gols Sofridos"
            value={seasonStats.goalsAgainst.toString()}
            icon="🚨"
            color="bg-orange-100"
          />
          <StatCard
            label="Saldo de Gols"
            value={seasonStats.goalDifference.toString()}
            icon="📊"
            color={seasonStats.goalDifference >= 0 ? "bg-green-100" : "bg-red-100"}
          />
          <StatCard
            label="Pontos"
            value={seasonStats.points.toString()}
            icon="⭐"
            color="bg-purple-100"
          />
        </View>
      </View>

      {/* Gráfico de Vitórias/Empates/Derrotas */}
      <View className="px-6 py-4 gap-3">
        <Text className="text-base font-semibold text-foreground">Distribuição de Resultados</Text>

        <View className="gap-3">
          <ProgressBar
            label="Vitórias"
            percentage={stats.winPercentage}
            color="bg-green-500"
            value={seasonStats.wins}
          />
          <ProgressBar
            label="Empates"
            percentage={stats.drawPercentage}
            color="bg-yellow-500"
            value={seasonStats.draws}
          />
          <ProgressBar
            label="Derrotas"
            percentage={stats.lossPercentage}
            color="bg-red-500"
            value={seasonStats.losses}
          />
        </View>
      </View>

      {/* Gráfico de Gols */}
      <View className="px-6 py-4 gap-3">
        <Text className="text-base font-semibold text-foreground">Gols por Partida</Text>

        <View className="gap-4">
          <ComparisonBar
            label="Marcados"
            value={stats.goalsPerMatch}
            maxValue={3}
            color="bg-blue-500"
            icon="⚽"
          />
          <ComparisonBar
            label="Sofridos"
            value={stats.goalsConcededPerMatch}
            maxValue={3}
            color="bg-red-500"
            icon="🚨"
          />
        </View>
      </View>

      {/* Média de Pontos */}
      <View className="px-6 py-4 gap-3">
        <Text className="text-base font-semibold text-foreground">Média de Pontos por Partida</Text>

        <View className="bg-surface rounded-lg p-4 border border-border">
          <View className="flex-row items-end justify-center gap-4 h-32">
            <BarChart
              value={stats.pointsPerMatch}
              maxValue={3}
              label="Pontos"
              color="bg-purple-500"
            />
          </View>

          <View className="flex-row justify-between mt-4">
            <View className="items-center">
              <Text className="text-2xl font-bold text-primary">
                {stats.pointsPerMatch.toFixed(2)}
              </Text>
              <Text className="text-xs text-muted">Média</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-primary">
                {(stats.pointsPerMatch * 38).toFixed(0)}
              </Text>
              <Text className="text-xs text-muted">Projeção (38 jogos)</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Tabela de Resumo */}
      <View className="px-6 py-4 gap-3">
        <Text className="text-base font-semibold text-foreground">Resumo da Temporada</Text>

        <View className="bg-surface rounded-lg border border-border overflow-hidden">
          <View className="flex-row bg-primary p-3 gap-2">
            <Text className="flex-1 text-white font-semibold text-xs">Métrica</Text>
            <Text className="flex-1 text-white font-semibold text-xs text-right">Valor</Text>
          </View>

          <SummaryRow label="Taxa de Vitória" value={`${stats.winPercentage.toFixed(1)}%`} />
          <SummaryRow label="Taxa de Empate" value={`${stats.drawPercentage.toFixed(1)}%`} />
          <SummaryRow label="Taxa de Derrota" value={`${stats.lossPercentage.toFixed(1)}%`} />
          <SummaryRow label="Gols/Partida" value={stats.goalsPerMatch.toFixed(2)} />
          <SummaryRow label="Gols Sofridos/Partida" value={stats.goalsConcededPerMatch.toFixed(2)} />
          <SummaryRow label="Saldo de Gols" value={seasonStats.goalDifference.toString()} />
        </View>
      </View>
    </ScrollView>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  icon: string;
  color?: string;
}

function StatCard({ label, value, icon, color = "bg-surface" }: StatCardProps) {
  return (
    <View className={`${color} rounded-lg p-4 border border-border items-center gap-2`}>
      <Text className="text-2xl">{icon}</Text>
      <Text className="text-foreground font-bold text-xl">{value}</Text>
      <Text className="text-muted text-xs text-center">{label}</Text>
    </View>
  );
}

interface ProgressBarProps {
  label: string;
  percentage: number;
  color: string;
  value: number;
}

function ProgressBar({ label, percentage, color, value }: ProgressBarProps) {
  return (
    <View className="gap-2">
      <View className="flex-row justify-between items-center">
        <Text className="text-foreground font-medium">{label}</Text>
        <Text className="text-muted text-sm">
          {value} ({percentage.toFixed(1)}%)
        </Text>
      </View>
      <View className="h-2 bg-border rounded-full overflow-hidden">
        <View style={{ width: `${percentage}%` }} className={`${color} h-full`} />
      </View>
    </View>
  );
}

interface ComparisonBarProps {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  icon: string;
}

function ComparisonBar({ label, value, maxValue, color, icon }: ComparisonBarProps) {
  const percentage = (value / maxValue) * 100;

  return (
    <View className="gap-2">
      <View className="flex-row items-center gap-2">
        <Text className="text-xl">{icon}</Text>
        <Text className="flex-1 text-foreground font-medium">{label}</Text>
        <Text className="text-primary font-bold">{value.toFixed(2)}</Text>
      </View>
      <View className="h-3 bg-border rounded-full overflow-hidden">
        <View style={{ width: `${Math.min(percentage, 100)}%` }} className={`${color} h-full`} />
      </View>
    </View>
  );
}

interface BarChartProps {
  value: number;
  maxValue: number;
  label: string;
  color: string;
}

function BarChart({ value, maxValue, label, color }: BarChartProps) {
  const height = (value / maxValue) * 100;

  return (
    <View className="items-center gap-2">
      <View className="flex-col-reverse items-center">
        <View
          style={{ height: `${Math.max(height, 10)}%` }}
          className={`${color} w-12 rounded-t-lg`}
        />
      </View>
      <Text className="text-foreground font-bold">{value.toFixed(2)}</Text>
      <Text className="text-muted text-xs">{label}</Text>
    </View>
  );
}

interface SummaryRowProps {
  label: string;
  value: string;
}

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <View className="flex-row p-3 gap-2 border-t border-border">
      <Text className="flex-1 text-foreground">{label}</Text>
      <Text className="flex-1 text-primary font-semibold text-right">{value}</Text>
    </View>
  );
}
