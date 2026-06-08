import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";

export default function FavoritesScreen() {
  const colors = useColors();
  const user = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);

  if (!user) {
    return (
      <ScreenContainer className="p-0">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="bg-black px-6 pt-6 pb-4">
            <Text className="text-2xl font-bold text-white">Favoritos</Text>
          </View>

          {/* Not Logged In */}
          <View className="flex-1 items-center justify-center px-6 py-8 gap-4">
            <Text className="text-4xl">❤️</Text>
            <Text className="text-lg font-bold text-foreground text-center">
              Faça login para salvar favoritos
            </Text>
            <Text className="text-sm text-muted text-center">
              Você pode salvar seus jogadores, técnicos e curiosidades favoritas para acessá-los
              rapidamente
            </Text>
            <TouchableOpacity className="bg-primary rounded-lg px-6 py-3 mt-4">
              <Text className="text-white font-semibold">Fazer Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-black px-6 pt-6 pb-4">
          <Text className="text-2xl font-bold text-white">Favoritos</Text>
        </View>

        {/* Empty State */}
        {favorites.length === 0 ? (
          <View className="flex-1 items-center justify-center px-6 py-8 gap-4">
            <Text className="text-4xl">📚</Text>
            <Text className="text-lg font-bold text-foreground text-center">
              Nenhum favorito salvo
            </Text>
            <Text className="text-sm text-muted text-center">
              Explore o app e salve seus itens favoritos tocando no ícone de coração
            </Text>
          </View>
        ) : (
          <View className="px-6 py-4 gap-3">
            {favorites.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="bg-surface rounded-lg p-4 border border-border flex-row items-center justify-between"
              >
                <View className="flex-1">
                  <Text className="font-bold text-foreground">{item.name || item.title}</Text>
                  <Text className="text-xs text-muted mt-1">{item.category || item.type}</Text>
                </View>
                <TouchableOpacity className="text-2xl">❤️</TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
