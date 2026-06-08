import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";

interface RankingItem {
  position: number;
  name: string;
  value: number;
  period?: string;
}

export default function RankingsScreen() {
  const colors = useColors();
  const [selectedRanking, setSelectedRanking] = useState<"gols" | "assistencias" | "cartoes" | "jogos">("gols");

  const rankings = {
    gols: [
      { position: 1, name: "Yuri Alberto", value: 48, period: "2021-2026" },
      { position: 2, name: "Romero", value: 42, period: "2022-2026" },
      { position: 3, name: "Gustavo Silva", value: 38, period: "2020-2026" },
      { position: 4, name: "Matheus Araújo", value: 35, period: "2019-2026" },
      { position: 5, name: "Adson", value: 32, period: "2021-2026" },
      { position: 6, name: "Fábio Santos", value: 28, period: "2018-2026" },
      { position: 7, name: "Garro", value: 25, period: "2023-2026" },
      { position: 8, name: "Matheuzinho", value: 22, period: "2020-2026" },
      { position: 9, name: "Cássio", value: 0, period: "2012-2026" },
      { position: 10, name: "Ruan Oliveira", value: 18, period: "2022-2026" },
    ],
    assistencias: [
      { position: 1, name: "Garro", value: 15, period: "2023-2026" },
      { position: 2, name: "Yuri Alberto", value: 12, period: "2021-2026" },
      { position: 3, name: "Matheuzinho", value: 11, period: "2020-2026" },
      { position: 4, name: "Matheus Araújo", value: 10, period: "2019-2026" },
      { position: 5, name: "Adson", value: 9, period: "2021-2026" },
      { position: 6, name: "Gustavo Silva", value: 8, period: "2020-2026" },
      { position: 7, name: "Romero", value: 7, period: "2022-2026" },
      { position: 8, name: "Fábio Santos", value: 6, period: "2018-2026" },
      { position: 9, name: "Ruan Oliveira", value: 5, period: "2022-2026" },
      { position: 10, name: "Du Queiroz", value: 4, period: "2021-2026" },
    ],
    cartoes: [
      { position: 1, name: "Fábio Santos", value: 28, period: "2018-2026" },
      { position: 2, name: "Gustavo Silva", value: 24, period: "2020-2026" },
      { position: 3, name: "Matheus Araújo", value: 22, period: "2019-2026" },
      { position: 4, name: "Yuri Alberto", value: 18, period: "2021-2026" },
      { position: 5, name: "Ruan Oliveira", value: 16, period: "2022-2026" },
      { position: 6, name: "Adson", value: 14, period: "2021-2026" },
      { position: 7, name: "Matheuzinho", value: 12, period: "2020-2026" },
      { position: 8, name: "Romero", value: 11, period: "2022-2026" },
      { position: 9, name: "Garro", value: 9, period: "2023-2026" },
      { position: 10, name: "Du Queiroz", value: 8, period: "2021-2026" },
    ],
    jogos: [
      { position: 1, name: "Cássio", value: 356, period: "2012-2026" },
      { position: 2, name: "Fábio Santos", value: 298, period: "2018-2026" },
      { position: 3, name: "Gustavo Silva", value: 276, period: "2020-2026" },
      { position: 4, name: "Matheus Araújo", value: 254, period: "2019-2026" },
      { position: 5, name: "Yuri Alberto", value: 156, period: "2021-2026" },
      { position: 6, name: "Ruan Oliveira", value: 142, period: "2022-2026" },
      { position: 7, name: "Adson", value: 138, period: "2021-2026" },
      { position: 8, name: "Matheuzinho", value: 132, period: "2020-2026" },
      { position: 9, name: "Romero", value: 128, period: "2022-2026" },
      { position: 10, name: "Garro", value: 98, period: "2023-2026" },
    ],
  };

  const currentRanking = rankings[selectedRanking];

  const getRankingTitle = () => {
    switch (selectedRanking) {
      case "gols":
        return "Maiores Artilheiros";
      case "assistencias":
        return "Maiores Assistentes";
      case "cartoes":
        return "Mais Cartões";
      case "jogos":
        return "Mais Jogos";
      default:
        return "";
    }
  };

  const getRankingUnit = () => {
    switch (selectedRanking) {
      case "gols":
        return "gols";
      case "assistencias":
        return "assistências";
      case "cartoes":
        return "cartões";
      case "jogos":
        return "jogos";
      default:
        return "";
    }
  };

  const getMedalColor = (position: number) => {
    switch (position) {
      case 1:
        return "bg-yellow-500";
      case 2:
        return "bg-gray-400";
      case 3:
        return "bg-orange-600";
      default:
        return "bg-muted";
    }
  };

  const renderRankingItem = ({ item }: { item: RankingItem }) => (
    <TouchableOpacity
      className="flex-row items-center gap-3 p-3 bg-surface rounded-lg mb-2 border border-border"
      activeOpacity={0.7}
    >
      <View className={cn("w-10 h-10 rounded-full items-center justify-center", getMedalColor(item.position))}>
        <Text className={cn("font-bold text-sm", item.position <= 3 ? "text-background" : "text-foreground")}>
          {item.position}
        </Text>
      </View>

      <View className="flex-1">
        <Text className="text-foreground font-semibold">{item.name}</Text>
        <Text className="text-muted text-xs">{item.period}</Text>
      </View>

      <View className="items-center">
        <Text className="text-primary font-bold text-lg">{item.value}</Text>
        <Text className="text-muted text-xs">{getRankingUnit()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">Rankings</Text>
          <Text className="text-muted">Histórico completo do Corinthians</Text>
        </View>

        {/* Seletor de Rankings */}
        <View className="mb-6 gap-2">
          {[
            { key: "gols", label: "Gols" },
            { key: "assistencias", label: "Assistências" },
            { key: "cartoes", label: "Cartões" },
            { key: "jogos", label: "Jogos" },
          ].map((item) => (
            <TouchableOpacity
              key={item.key}
              onPress={() => setSelectedRanking(item.key as any)}
              className={cn(
                "py-3 px-4 rounded-lg border",
                selectedRanking === item.key
                  ? "bg-primary border-primary"
                  : "bg-surface border-border"
              )}
            >
              <Text
                className={cn(
                  "font-semibold text-center",
                  selectedRanking === item.key
                    ? "text-background"
                    : "text-foreground"
                )}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Título do Ranking */}
        <View className="mb-4">
          <Text className="text-2xl font-bold text-foreground">{getRankingTitle()}</Text>
        </View>

        {/* Lista de Rankings */}
        <FlatList
          data={currentRanking}
          renderItem={renderRankingItem}
          keyExtractor={(item) => item.position.toString()}
          scrollEnabled={false}
        />
      </ScrollView>
    </ScreenContainer>
  );
}
