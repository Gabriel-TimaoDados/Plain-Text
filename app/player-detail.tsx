import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";

interface PlayerDetail {
  id: number;
  name: string;
  number: number;
  position: string;
  nationality: string;
  startDate: string;
  endDate: string;
  biography: string;
  games: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
  photoUrl?: string;
}

export default function PlayerDetailScreen() {
  const router = useRouter();
  const colors = useColors();
  const { playerId } = useLocalSearchParams();
  const [selectedTab, setSelectedTab] = useState<"perfil" | "stats" | "historico">("perfil");

  // Mock data - será substituído por dados reais da API
  const player: PlayerDetail = {
    id: parseInt(playerId as string) || 1,
    name: "Yuri Alberto",
    number: 9,
    position: "Atacante",
    nationality: "Brasil",
    startDate: "2021",
    endDate: "",
    biography: "Yuri Alberto é um atacante brasileiro que se destaca pela velocidade e capacidade de finalização. Chegou ao Corinthians em 2021 e se tornou um dos principais artilheiros do time.",
    games: 156,
    goals: 48,
    assists: 12,
    yellowCards: 18,
    redCards: 0,
    minutesPlayed: 11240,
  };

  const handleBack = () => {
    router.back();
  };

  const averageGoalsPerGame = (player.goals / player.games).toFixed(2);
  const averageMinutesPerGame = Math.round(player.minutesPlayed / player.games);

  return (
    <ScreenContainer className="p-0">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-primary p-6">
          <Pressable onPress={handleBack} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
            <Text className="text-background text-lg mb-4">← Voltar</Text>
          </Pressable>

          <View className="items-center gap-3">
            <View className="w-24 h-24 bg-background rounded-full items-center justify-center">
              <Text className="text-4xl font-bold text-primary">{player.number}</Text>
            </View>
            <Text className="text-background text-2xl font-bold">{player.name}</Text>
            <Text className="text-background text-sm opacity-80">{player.position}</Text>
          </View>
        </View>

        {/* Info Rápida */}
        <View className="bg-surface p-4 flex-row justify-around border-b border-border">
          <View className="items-center">
            <Text className="text-muted text-xs mb-1">Jogos</Text>
            <Text className="text-foreground text-xl font-bold">{player.games}</Text>
          </View>
          <View className="items-center">
            <Text className="text-muted text-xs mb-1">Gols</Text>
            <Text className="text-success text-xl font-bold">{player.goals}</Text>
          </View>
          <View className="items-center">
            <Text className="text-muted text-xs mb-1">Assistências</Text>
            <Text className="text-foreground text-xl font-bold">{player.assists}</Text>
          </View>
          <View className="items-center">
            <Text className="text-muted text-xs mb-1">Cartões</Text>
            <Text className="text-warning text-xl font-bold">{player.yellowCards}</Text>
          </View>
        </View>

        {/* Abas */}
        <View className="flex-row bg-background border-b border-border">
          {["perfil", "stats", "historico"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setSelectedTab(tab as any)}
              className={cn(
                "flex-1 py-3 items-center border-b-2",
                selectedTab === tab
                  ? "border-primary"
                  : "border-transparent"
              )}
            >
              <Text
                className={cn(
                  "text-xs font-semibold",
                  selectedTab === tab
                    ? "text-primary"
                    : "text-muted"
                )}
              >
                {tab === "perfil"
                  ? "Perfil"
                  : tab === "stats"
                    ? "Estatísticas"
                    : "Histórico"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Conteúdo das Abas */}
        <View className="p-4">
          {selectedTab === "perfil" && (
            <View className="gap-4">
              <View className="bg-surface rounded-lg p-4">
                <Text className="text-foreground font-semibold mb-3">Informações Pessoais</Text>
                <View className="gap-3">
                  <View className="flex-row justify-between">
                    <Text className="text-muted">Nacionalidade:</Text>
                    <Text className="text-foreground font-medium">{player.nationality}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-muted">Posição:</Text>
                    <Text className="text-foreground font-medium">{player.position}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-muted">Número:</Text>
                    <Text className="text-foreground font-medium">{player.number}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-muted">No Corinthians desde:</Text>
                    <Text className="text-foreground font-medium">{player.startDate}</Text>
                  </View>
                </View>
              </View>

              <View className="bg-surface rounded-lg p-4">
                <Text className="text-foreground font-semibold mb-2">Biografia</Text>
                <Text className="text-muted text-sm leading-relaxed">{player.biography}</Text>
              </View>
            </View>
          )}

          {selectedTab === "stats" && (
            <View className="gap-4">
              <View className="bg-surface rounded-lg p-4">
                <Text className="text-foreground font-semibold mb-4">Estatísticas Gerais</Text>
                {[
                  { label: "Jogos", value: player.games, color: "text-foreground" },
                  { label: "Gols", value: player.goals, color: "text-success" },
                  { label: "Assistências", value: player.assists, color: "text-foreground" },
                  { label: "Cartões Amarelos", value: player.yellowCards, color: "text-warning" },
                  { label: "Cartões Vermelhos", value: player.redCards, color: "text-error" },
                  { label: "Minutos Jogados", value: player.minutesPlayed, color: "text-foreground" },
                ].map((stat, idx) => (
                  <View key={idx} className="flex-row justify-between py-2 border-b border-border last:border-b-0">
                    <Text className="text-muted">{stat.label}</Text>
                    <Text className={cn("font-semibold", stat.color)}>{stat.value}</Text>
                  </View>
                ))}
              </View>

              <View className="bg-surface rounded-lg p-4">
                <Text className="text-foreground font-semibold mb-4">Médias por Jogo</Text>
                {[
                  { label: "Gols por Jogo", value: averageGoalsPerGame },
                  { label: "Minutos por Jogo", value: averageMinutesPerGame },
                ].map((stat, idx) => (
                  <View key={idx} className="flex-row justify-between py-2 border-b border-border last:border-b-0">
                    <Text className="text-muted">{stat.label}</Text>
                    <Text className="text-foreground font-semibold">{stat.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {selectedTab === "historico" && (
            <View className="gap-3">
              <View className="bg-surface rounded-lg p-4">
                <Text className="text-foreground font-semibold mb-3">Últimos Jogos</Text>
                {[1, 2, 3, 4, 5].map((idx) => (
                  <TouchableOpacity
                    key={idx}
                    className="flex-row justify-between items-center py-2 border-b border-border last:border-b-0"
                  >
                    <View>
                      <Text className="text-foreground font-medium">Corinthians 2 × 1 São Paulo</Text>
                      <Text className="text-muted text-xs">2026-05-{31 - idx}</Text>
                    </View>
                    <Text className="text-success font-bold">1 gol</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
