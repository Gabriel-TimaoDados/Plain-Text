import { useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Favorite {
  id: string;
  type: "player" | "game" | "prediction" | "coach";
  name: string;
  data: Record<string, any>;
  addedAt: string;
}

const FAVORITES_KEY = "@timao-dados/favorites";

/**
 * Hook para gerenciar favoritos com AsyncStorage
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar favoritos ao montar
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar favoritos";
      setError(errorMessage);
      console.error("Erro ao carregar favoritos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addFavorite = useCallback(
    async (favorite: Omit<Favorite, "addedAt">) => {
      try {
        const newFavorite: Favorite = {
          ...favorite,
          addedAt: new Date().toISOString(),
        };

        const updated = [...favorites, newFavorite];
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
        setFavorites(updated);
        return newFavorite;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao adicionar favorito";
        setError(errorMessage);
        console.error("Erro ao adicionar favorito:", err);
        return null;
      }
    },
    [favorites]
  );

  const removeFavorite = useCallback(
    async (id: string) => {
      try {
        const updated = favorites.filter((f) => f.id !== id);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
        setFavorites(updated);
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao remover favorito";
        setError(errorMessage);
        console.error("Erro ao remover favorito:", err);
        return false;
      }
    },
    [favorites]
  );

  const isFavorite = useCallback(
    (id: string) => {
      return favorites.some((f) => f.id === id);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (favorite: Omit<Favorite, "addedAt">) => {
      if (isFavorite(favorite.id)) {
        return await removeFavorite(favorite.id);
      } else {
        return await addFavorite(favorite);
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  const getFavoritesByType = useCallback(
    (type: Favorite["type"]) => {
      return favorites.filter((f) => f.type === type);
    },
    [favorites]
  );

  const clearAllFavorites = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(FAVORITES_KEY);
      setFavorites([]);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao limpar favoritos";
      setError(errorMessage);
      console.error("Erro ao limpar favoritos:", err);
      return false;
    }
  }, []);

  return {
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    getFavoritesByType,
    clearAllFavorites,
    reload: loadFavorites,
  };
}

/**
 * Hook para gerenciar notificações de favoritos
 */
export function useFavoriteNotifications() {
  const [notificationSettings, setNotificationSettings] = useState({
    playerGoals: true,
    gameResults: true,
    predictions: true,
    coachNews: true,
  });

  const toggleNotification = useCallback((key: keyof typeof notificationSettings) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const shouldNotify = useCallback(
    (type: Favorite["type"]) => {
      switch (type) {
        case "player":
          return notificationSettings.playerGoals;
        case "game":
          return notificationSettings.gameResults;
        case "prediction":
          return notificationSettings.predictions;
        case "coach":
          return notificationSettings.coachNews;
        default:
          return false;
      }
    },
    [notificationSettings]
  );

  return {
    notificationSettings,
    toggleNotification,
    shouldNotify,
  };
}
