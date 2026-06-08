/**
 * Serviço de Cache Offline
 * Armazena dados localmente para acesso sem internet
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_KEYS = {
  PLAYERS: "cache_players",
  COACHES: "cache_coaches",
  GAMES: "cache_games",
  CURIOSITIES: "cache_curiosities",
  RIVALRIES: "cache_rivalries",
  UPCOMING_GAMES: "cache_upcoming_games",
  SEARCH_HISTORY: "cache_search_history",
  FAVORITES: "cache_favorites",
  LAST_SYNC: "cache_last_sync",
};

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl?: number; // Time to live em milissegundos
}

/**
 * Salvar dados no cache
 */
export async function setCacheData<T>(
  key: string,
  data: T,
  ttl?: number
): Promise<void> {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    await AsyncStorage.setItem(key, JSON.stringify(entry));
    console.log(`✅ Cache salvo: ${key}`);
  } catch (error) {
    console.error(`❌ Erro ao salvar cache ${key}:`, error);
  }
}

/**
 * Obter dados do cache
 */
export async function getCacheData<T>(key: string): Promise<T | null> {
  try {
    const item = await AsyncStorage.getItem(key);

    if (!item) {
      return null;
    }

    const entry: CacheEntry<T> = JSON.parse(item);

    // Verificar se o cache expirou
    if (entry.ttl) {
      const age = Date.now() - entry.timestamp;
      if (age > entry.ttl) {
        await AsyncStorage.removeItem(key);
        console.log(`⏰ Cache expirado: ${key}`);
        return null;
      }
    }

    console.log(`✅ Cache recuperado: ${key}`);
    return entry.data;
  } catch (error) {
    console.error(`❌ Erro ao recuperar cache ${key}:`, error);
    return null;
  }
}

/**
 * Limpar cache específico
 */
export async function clearCache(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`✅ Cache limpo: ${key}`);
  } catch (error) {
    console.error(`❌ Erro ao limpar cache ${key}:`, error);
  }
}

/**
 * Limpar todo o cache
 */
export async function clearAllCache(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(Object.values(CACHE_KEYS));
    console.log("✅ Todo o cache foi limpo");
  } catch (error) {
    console.error("❌ Erro ao limpar todo o cache:", error);
  }
}

/**
 * Obter tamanho do cache
 */
export async function getCacheSize(): Promise<number> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    let totalSize = 0;

    for (const key of keys) {
      const item = await AsyncStorage.getItem(key);
      if (item) {
        totalSize += item.length;
      }
    }

    return totalSize;
  } catch (error) {
    console.error("❌ Erro ao calcular tamanho do cache:", error);
    return 0;
  }
}

/**
 * Salvar jogadores no cache
 */
export async function cachePlayersData(data: any): Promise<void> {
  // Cache por 24 horas
  await setCacheData(CACHE_KEYS.PLAYERS, data, 24 * 60 * 60 * 1000);
}

/**
 * Obter jogadores do cache
 */
export async function getCachedPlayers(): Promise<any | null> {
  return getCacheData(CACHE_KEYS.PLAYERS);
}

/**
 * Salvar técnicos no cache
 */
export async function cacheCoachesData(data: any): Promise<void> {
  // Cache por 24 horas
  await setCacheData(CACHE_KEYS.COACHES, data, 24 * 60 * 60 * 1000);
}

/**
 * Obter técnicos do cache
 */
export async function getCachedCoaches(): Promise<any | null> {
  return getCacheData(CACHE_KEYS.COACHES);
}

/**
 * Salvar jogos no cache
 */
export async function cacheGamesData(data: any): Promise<void> {
  // Cache por 6 horas
  await setCacheData(CACHE_KEYS.GAMES, data, 6 * 60 * 60 * 1000);
}

/**
 * Obter jogos do cache
 */
export async function getCachedGames(): Promise<any | null> {
  return getCacheData(CACHE_KEYS.GAMES);
}

/**
 * Salvar curiosidades no cache
 */
export async function cacheCuriositiesData(data: any): Promise<void> {
  // Cache por 48 horas
  await setCacheData(CACHE_KEYS.CURIOSITIES, data, 48 * 60 * 60 * 1000);
}

/**
 * Obter curiosidades do cache
 */
export async function getCachedCuriosities(): Promise<any | null> {
  return getCacheData(CACHE_KEYS.CURIOSITIES);
}

/**
 * Salvar duelos no cache
 */
export async function cacheRivalriesData(data: any): Promise<void> {
  // Cache por 24 horas
  await setCacheData(CACHE_KEYS.RIVALRIES, data, 24 * 60 * 60 * 1000);
}

/**
 * Obter duelos do cache
 */
export async function getCachedRivalries(): Promise<any | null> {
  return getCacheData(CACHE_KEYS.RIVALRIES);
}

/**
 * Salvar próximos jogos no cache
 */
export async function cacheUpcomingGamesData(data: any): Promise<void> {
  // Cache por 2 horas
  await setCacheData(CACHE_KEYS.UPCOMING_GAMES, data, 2 * 60 * 60 * 1000);
}

/**
 * Obter próximos jogos do cache
 */
export async function getCachedUpcomingGames(): Promise<any | null> {
  return getCacheData(CACHE_KEYS.UPCOMING_GAMES);
}

/**
 * Adicionar item ao histórico de buscas
 */
export async function addSearchHistory(query: string): Promise<void> {
  try {
    const history = (await getCacheData<string[]>(CACHE_KEYS.SEARCH_HISTORY)) || [];

    // Remover duplicatas e adicionar no início
    const filtered = history.filter((item) => item !== query);
    const updated = [query, ...filtered].slice(0, 20); // Manter últimas 20 buscas

    await setCacheData(CACHE_KEYS.SEARCH_HISTORY, updated);
  } catch (error) {
    console.error("❌ Erro ao adicionar ao histórico:", error);
  }
}

/**
 * Obter histórico de buscas
 */
export async function getSearchHistory(): Promise<string[]> {
  const history = await getCacheData<string[]>(CACHE_KEYS.SEARCH_HISTORY);
  return history || [];
}

/**
 * Limpar histórico de buscas
 */
export async function clearSearchHistory(): Promise<void> {
  await clearCache(CACHE_KEYS.SEARCH_HISTORY);
}

/**
 * Salvar favoritos
 */
export async function saveFavorites(favorites: any[]): Promise<void> {
  await setCacheData(CACHE_KEYS.FAVORITES, favorites);
}

/**
 * Obter favoritos
 */
export async function getFavorites(): Promise<any[]> {
  const favorites = await getCacheData<any[]>(CACHE_KEYS.FAVORITES);
  return favorites || [];
}

/**
 * Adicionar favorito
 */
export async function addFavorite(item: any): Promise<void> {
  const favorites = await getFavorites();
  const exists = favorites.some((fav) => fav.id === item.id && fav.type === item.type);

  if (!exists) {
    favorites.push(item);
    await saveFavorites(favorites);
    console.log(`✅ Favorito adicionado: ${item.name}`);
  }
}

/**
 * Remover favorito
 */
export async function removeFavorite(itemId: number, itemType: string): Promise<void> {
  const favorites = await getFavorites();
  const filtered = favorites.filter((fav) => !(fav.id === itemId && fav.type === itemType));
  await saveFavorites(filtered);
  console.log(`✅ Favorito removido`);
}

/**
 * Salvar timestamp da última sincronização
 */
export async function setLastSyncTime(): Promise<void> {
  await setCacheData(CACHE_KEYS.LAST_SYNC, Date.now());
}

/**
 * Obter timestamp da última sincronização
 */
export async function getLastSyncTime(): Promise<number | null> {
  return getCacheData<number>(CACHE_KEYS.LAST_SYNC);
}

/**
 * Verificar se precisa sincronizar (intervalo de 6 horas)
 */
export async function shouldSync(): Promise<boolean> {
  const lastSync = await getLastSyncTime();

  if (!lastSync) {
    return true; // Primeira sincronização
  }

  const sixHours = 6 * 60 * 60 * 1000;
  const timeSinceLastSync = Date.now() - lastSync;

  return timeSinceLastSync > sixHours;
}
