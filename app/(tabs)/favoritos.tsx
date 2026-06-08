import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useState, useMemo } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useFavorites } from "@/hooks/use-favorites";

/**
 * Tela de favoritos
 */
export default function FavoritosScreen() {
  const { favorites, removeFavorite, loading } = useFavorites();
  const [selectedType, setSelectedType] = useState<"all" | "player" | "game" | "prediction" | "coach">("all");

  const filteredFavorites = useMemo(() => {
    if (selectedType === "all") {
      return favorites;
    }
    return favorites.filter((f) => f.type === selectedType);
  }, [favorites, selectedType]);

  const stats = useMemo(() => {
    return {
      total: favorites.length,
      players: favorites.filter((f) => f.type === "player").length,
      games: favorites.filter((f) => f.type === "game").length,
      predictions: favorites.filter((f) => f.type === "prediction").length,
      coaches: favorites.filter((f) => f.type === "coach").length,
    };
  }, [favorites]);

  const typeLabels = {
    player: "Jogador",
    game: "Jogo",
    prediction: "Previsão",
    coach: "Técnico",
  };

  const typeEmojis = {
    player: "⚽",
    game: "🎮",
    prediction: "🔮",
    coach: "👨‍💼",
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-black px-6 pt-6 pb-4 gap-4">
          <Text className="text-white font-bold text-2xl">Favoritos</Text>
          <Text className="text-orange-400 text-sm">Seus itens salvos</Text>
        </View>

        {/* Estatísticas */}
        <View className="px-6 py-4 gap-3">
          <View className="flex-row gap-2">
            <StatCard icon="⭐" label="Total" value={stats.total.toString()} />
            <StatCard icon="⚽" label="Jogadores" value={stats.players.toString()} />
            <StatCard icon="🎮" label="Jogos" value={stats.games.toString()} />
          </View>
          <View className="flex-row gap-2">
            <StatCard icon="🔮" label="Previsões" value={stats.predictions.toString()} />
            <StatCard icon="👨‍💼" label="Técnicos" value={stats.coaches.toString()} />
          </View>
        </View>

        {/* Filtros */}
        <View className="px-6 py-3 gap-2">
          <Text className="text-foreground font-semibold text-sm">Filtrar por</Text>
          <View className="flex-row gap-2">
            <FilterButton
              label="Todos"
              active={selectedType === "all"}
              onPress={() => setSelectedType("all")}
            />
            <FilterButton
              label="Jogadores"
              active={selectedType === "player"}
              onPress={() => setSelectedType("player")}
            />
            <FilterButton
              label="Jogos"
              active={selectedType === "game"}
              onPress={() => setSelectedType("game")}
            />
            <FilterButton
              label="Previsões"
              active={selectedType === "prediction"}
              onPress={() => setSelectedType("prediction")}
            />
          </View>
        </View>

        {/* Lista de Favoritos */}
        <View className="flex-1 px-6 py-3">
          {loading ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-muted">Carregando favoritos...</Text>
            </View>
          ) : filteredFavorites.length > 0 ? (
            <FlatList
              data={filteredFavorites}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={{ gap: 8 }}
              renderItem={({ item }) => (
                <FavoriteCard
                  favorite={item}
                  onRemove={() => removeFavorite(item.id)}
                  emoji={typeEmojis[item.type]}
                  typeLabel={typeLabels[item.type]}
                />
              )}
            />
          ) : (
            <View className="flex-1 items-center justify-center gap-3">
              <Text className="text-3xl">⭐</Text>
              <Text className="text-foreground font-bold">Nenhum favorito</Text>
              <Text className="text-muted text-center text-sm">
                {selectedType === "all"
                  ? "Adicione itens aos seus favoritos para vê-los aqui"
                  : `Nenhum ${typeLabels[selectedType]?.toLowerCase()} nos favoritos`}
              </Text>
            </View>
          )}
        </View>

        {/* Ações */}
        {favorites.length > 0 && (
          <View className="px-6 py-4 gap-2 border-t border-border pb-6">
            <TouchableOpacity className="bg-primary rounded-lg py-3 items-center">
              <Text className="text-white font-bold">Compartilhar Favoritos</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-error bg-opacity-10 rounded-lg py-3 items-center border border-error">
              <Text className="text-error font-bold">Limpar Tudo</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <View className="flex-1 bg-surface rounded-lg border border-border p-3 items-center gap-1">
      <Text className="text-2xl">{icon}</Text>
      <Text className="text-primary font-bold">{value}</Text>
      <Text className="text-muted text-xs">{label}</Text>
    </View>
  );
}

interface FilterButtonProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

function FilterButton({ label, active, onPress }: FilterButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-1 py-2 px-3 rounded-lg border ${
        active ? "bg-primary border-primary" : "bg-surface border-border"
      }`}
    >
      <Text className={`text-center font-semibold text-xs ${active ? "text-white" : "text-foreground"}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

interface FavoriteCardProps {
  favorite: any;
  onRemove: () => void;
  emoji: string;
  typeLabel: string;
}

function FavoriteCard({ favorite, onRemove, emoji, typeLabel }: FavoriteCardProps) {
  return (
    <View className="bg-surface rounded-lg border border-border p-3 flex-row items-center justify-between">
      <View className="flex-1 flex-row items-center gap-3">
        <Text className="text-2xl">{emoji}</Text>
        <View className="flex-1">
          <Text className="text-foreground font-bold">{favorite.name}</Text>
          <Text className="text-muted text-xs">{typeLabel}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={onRemove} className="p-2">
        <Text className="text-error text-lg">✕</Text>
      </TouchableOpacity>
    </View>
  );
}
