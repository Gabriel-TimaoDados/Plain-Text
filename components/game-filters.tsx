import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { cn } from "@/lib/utils";
import { useColors } from "@/hooks/use-colors";

export interface GameFilters {
  competition?: string;
  result?: "win" | "loss" | "draw" | "all";
  location?: "home" | "away" | "all";
  period?: "all" | "decade" | "year" | "month";
  periodValue?: string;
  opponent?: string;
  minGoals?: number;
  maxGoals?: number;
  hasRedCard?: boolean;
  hasYellowCard?: boolean;
}

interface GameFiltersProps {
  filters: GameFilters;
  onFiltersChange: (filters: GameFilters) => void;
}

export function GameFilters({ filters, onFiltersChange }: GameFiltersProps) {
  const colors = useColors();
  const [expanded, setExpanded] = useState(false);

  const competitions = [
    "Campeonato Brasileiro",
    "Copa do Brasil",
    "Libertadores",
    "Sulamericana",
    "Amistoso",
  ];

  const handleFilterChange = (key: keyof GameFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleReset = () => {
    onFiltersChange({
      competition: undefined,
      result: "all",
      location: "all",
      period: "all",
      opponent: undefined,
      minGoals: undefined,
      maxGoals: undefined,
      hasRedCard: false,
      hasYellowCard: false,
    });
  };

  return (
    <View className="bg-surface rounded-lg p-4 mb-4">
      <Pressable
        onPress={() => setExpanded(!expanded)}
        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-foreground">Filtros Avançados</Text>
          <Text className="text-primary text-2xl">{expanded ? "−" : "+"}</Text>
        </View>
      </Pressable>

      {expanded && (
        <ScrollView className="mt-4" scrollEnabled={false}>
          {/* Competição */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">Competição</Text>
            <View className="flex-row flex-wrap gap-2">
              {competitions.map((comp) => (
                <TouchableOpacity
                  key={comp}
                  onPress={() =>
                    handleFilterChange(
                      "competition",
                      filters.competition === comp ? undefined : comp
                    )
                  }
                  className={cn(
                    "px-3 py-2 rounded-full border",
                    filters.competition === comp
                      ? "bg-primary border-primary"
                      : "bg-background border-border"
                  )}
                >
                  <Text
                    className={cn(
                      "text-xs font-medium",
                      filters.competition === comp ? "text-background" : "text-foreground"
                    )}
                  >
                    {comp}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Resultado */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">Resultado</Text>
            <View className="flex-row gap-2">
              {["all", "win", "loss", "draw"].map((result) => (
                <TouchableOpacity
                  key={result}
                  onPress={() => handleFilterChange("result", result as any)}
                  className={cn(
                    "flex-1 py-2 rounded-lg border items-center",
                    filters.result === result
                      ? "bg-primary border-primary"
                      : "bg-background border-border"
                  )}
                >
                  <Text
                    className={cn(
                      "text-xs font-semibold",
                      filters.result === result ? "text-background" : "text-foreground"
                    )}
                  >
                    {result === "all"
                      ? "Todos"
                      : result === "win"
                        ? "Vitórias"
                        : result === "loss"
                          ? "Derrotas"
                          : "Empates"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Mandante/Visitante */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">Local</Text>
            <View className="flex-row gap-2">
              {["all", "home", "away"].map((location) => (
                <TouchableOpacity
                  key={location}
                  onPress={() => handleFilterChange("location", location as any)}
                  className={cn(
                    "flex-1 py-2 rounded-lg border items-center",
                    filters.location === location
                      ? "bg-primary border-primary"
                      : "bg-background border-border"
                  )}
                >
                  <Text
                    className={cn(
                      "text-xs font-semibold",
                      filters.location === location ? "text-background" : "text-foreground"
                    )}
                  >
                    {location === "all"
                      ? "Todos"
                      : location === "home"
                        ? "Mandante"
                        : "Visitante"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Cartões */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">Cartões</Text>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => handleFilterChange("hasYellowCard", !filters.hasYellowCard)}
                className={cn(
                  "flex-1 py-2 rounded-lg border items-center",
                  filters.hasYellowCard
                    ? "bg-warning border-warning"
                    : "bg-background border-border"
                )}
              >
                <Text
                  className={cn(
                    "text-xs font-semibold",
                    filters.hasYellowCard ? "text-background" : "text-foreground"
                  )}
                >
                  Amarelo
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleFilterChange("hasRedCard", !filters.hasRedCard)}
                className={cn(
                  "flex-1 py-2 rounded-lg border items-center",
                  filters.hasRedCard ? "bg-error border-error" : "bg-background border-border"
                )}
              >
                <Text
                  className={cn(
                    "text-xs font-semibold",
                    filters.hasRedCard ? "text-background" : "text-foreground"
                  )}
                >
                  Vermelho
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Botão Limpar */}
          <TouchableOpacity
            onPress={handleReset}
            className="bg-muted rounded-lg py-2 items-center mt-4"
          >
            <Text className="text-foreground font-semibold text-sm">Limpar Filtros</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}
