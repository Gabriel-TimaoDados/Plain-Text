import { ScrollView, Text, View } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { PlayerComparison, PlayerStats } from "@/components/player-comparison";

/**
 * Tela de estatísticas de jogadores do Corinthians
 */
export default function JogadoresScreen() {
  const [selectedPlayers, setSelectedPlayers] = useState<PlayerStats[]>([]);

  // Mock data - em produção, isso viria da API-Football
  const mockPlayers: PlayerStats[] = [
    {
      id: "1",
      name: "Róger Guedes",
      position: "Atacante",
      number: 7,
      statistics: {
        matches: 28,
        goals: 12,
        assists: 3,
        yellowCards: 2,
        redCards: 0,
        minutesPlayed: 2240,
      },
    },
    {
      id: "2",
      name: "Yuri Alberto",
      position: "Atacante",
      number: 9,
      statistics: {
        matches: 26,
        goals: 10,
        assists: 2,
        yellowCards: 3,
        redCards: 0,
        minutesPlayed: 2080,
      },
    },
    {
      id: "3",
      name: "Matheus Araújo",
      position: "Meia",
      number: 18,
      statistics: {
        matches: 25,
        goals: 3,
        assists: 6,
        yellowCards: 1,
        redCards: 0,
        minutesPlayed: 1800,
      },
    },
    {
      id: "4",
      name: "Fábio Santos",
      position: "Lateral",
      number: 16,
      statistics: {
        matches: 28,
        goals: 1,
        assists: 2,
        yellowCards: 4,
        redCards: 0,
        minutesPlayed: 2520,
      },
    },
    {
      id: "5",
      name: "Cássio",
      position: "Goleiro",
      number: 12,
      statistics: {
        matches: 28,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
        minutesPlayed: 2520,
      },
    },
    {
      id: "6",
      name: "Raniel",
      position: "Zagueiro",
      number: 4,
      statistics: {
        matches: 27,
        goals: 2,
        assists: 0,
        yellowCards: 5,
        redCards: 0,
        minutesPlayed: 2430,
      },
    },
    {
      id: "7",
      name: "Otero",
      position: "Atacante",
      number: 11,
      statistics: {
        matches: 20,
        goals: 5,
        assists: 1,
        yellowCards: 2,
        redCards: 0,
        minutesPlayed: 1200,
      },
    },
    {
      id: "8",
      name: "Breno Bidon",
      position: "Meia",
      number: 5,
      statistics: {
        matches: 24,
        goals: 1,
        assists: 4,
        yellowCards: 3,
        redCards: 0,
        minutesPlayed: 1920,
      },
    },
  ];

  const handlePlayerSelect = (player: PlayerStats) => {
    setSelectedPlayers((prev) => {
      const isSelected = prev.some((p) => p.id === player.id);
      if (isSelected) {
        return prev.filter((p) => p.id !== player.id);
      } else {
        return [...prev, player];
      }
    });
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-black px-6 pt-6 pb-4 gap-4">
          <Text className="text-white font-bold text-2xl">Jogadores</Text>
          <Text className="text-orange-400 text-sm">Estatísticas do Corinthians 2024</Text>
        </View>

        {/* Estatísticas Gerais */}
        <View className="px-6 py-4 gap-3">
          <Text className="text-foreground font-semibold">Destaques da Temporada</Text>

          <View className="flex-row gap-2">
            <StatCard
              label="Artilheiro"
              value="Róger Guedes"
              subtitle="12 gols"
              icon="⚽"
            />
            <StatCard
              label="Mais Assistências"
              value="Matheus Araújo"
              subtitle="6 assistências"
              icon="🎯"
            />
          </View>
        </View>

        {/* Comparação de Jogadores */}
        <View className="flex-1 px-6 py-4">
          <Text className="text-foreground font-semibold mb-3">Todos os Jogadores</Text>
          <PlayerComparison players={mockPlayers} onPlayerSelect={handlePlayerSelect} />
        </View>

        {/* Detalhes dos Jogadores Selecionados */}
        {selectedPlayers.length > 0 && (
          <View className="px-6 py-4 gap-3 border-t border-border">
            <Text className="text-foreground font-semibold">Detalhes Comparativos</Text>

            <View className="bg-surface rounded-lg border border-border overflow-hidden">
              <View className="flex-row bg-primary p-3 gap-2">
                <Text className="flex-1 text-white font-semibold text-xs">Jogador</Text>
                <Text className="flex-1 text-white font-semibold text-xs text-right">Gols</Text>
                <Text className="flex-1 text-white font-semibold text-xs text-right">Assist</Text>
              </View>

              {selectedPlayers.map((player) => (
                <View key={player.id} className="flex-row p-3 gap-2 border-t border-border">
                  <Text className="flex-1 text-foreground font-medium">{player.name}</Text>
                  <Text className="flex-1 text-primary font-bold text-right">
                    {player.statistics.goals}
                  </Text>
                  <Text className="flex-1 text-primary font-bold text-right">
                    {player.statistics.assists}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  subtitle: string;
  icon: string;
}

function StatCard({ label, value, subtitle, icon }: StatCardProps) {
  return (
    <View className="flex-1 bg-surface rounded-lg border border-border p-3 gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl">{icon}</Text>
        <Text className="text-muted text-xs">{label}</Text>
      </View>
      <Text className="text-foreground font-bold text-sm">{value}</Text>
      <Text className="text-primary text-xs font-semibold">{subtitle}</Text>
    </View>
  );
}
