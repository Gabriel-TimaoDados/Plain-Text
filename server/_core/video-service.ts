/**
 * Serviço para gerenciar vídeos de gols, expulsões e streams ao vivo
 */

interface VideoSource {
  id: string;
  title: string;
  url: string;
  type: "youtube" | "twitch";
  duration?: number;
  thumbnail?: string;
  uploadedAt?: Date;
}

interface LiveStream {
  id: string;
  fixtureId: number;
  title: string;
  url: string;
  platform: "youtube" | "twitch";
  isLive: boolean;
  startTime?: Date;
  endTime?: Date;
  viewers?: number;
}

interface GoalVideo {
  id: string;
  fixtureId: number;
  goalId: string;
  playerName: string;
  minute: number;
  videoUrl: string;
  platform: "youtube" | "twitch";
  thumbnail?: string;
}

/**
 * Busca vídeos de gols do Corinthians no YouTube
 */
export async function searchGoalVideos(
  query: string,
  limit: number = 10
): Promise<VideoSource[]> {
  try {
    // Simular busca no YouTube (quando integrar YouTube Data API)
    const mockVideos: VideoSource[] = [
      {
        id: "yt_1",
        title: `${query} - Gol do Corinthians`,
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        type: "youtube",
        duration: 120,
        uploadedAt: new Date(),
      },
      {
        id: "yt_2",
        title: `${query} - Melhores Momentos`,
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        type: "youtube",
        duration: 300,
        uploadedAt: new Date(),
      },
    ];

    console.log(`🎥 Buscando vídeos: ${query}`);
    return mockVideos.slice(0, limit);
  } catch (error) {
    console.error("Erro ao buscar vídeos:", error);
    return [];
  }
}

/**
 * Busca vídeos de expulsões do Corinthians
 */
export async function searchRedCardVideos(
  playerName: string,
  limit: number = 5
): Promise<VideoSource[]> {
  try {
    const mockVideos: VideoSource[] = [
      {
        id: `yt_rc_${playerName}`,
        title: `${playerName} - Cartão Vermelho`,
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        type: "youtube",
        duration: 60,
        uploadedAt: new Date(),
      },
    ];

    console.log(`🔴 Buscando vídeos de expulsão: ${playerName}`);
    return mockVideos.slice(0, limit);
  } catch (error) {
    console.error("Erro ao buscar vídeos de expulsão:", error);
    return [];
  }
}

/**
 * Busca streams ao vivo do Corinthians
 */
export async function searchLiveStreams(
  fixtureId: number
): Promise<LiveStream[]> {
  try {
    const mockStreams: LiveStream[] = [
      {
        id: `stream_1`,
        fixtureId,
        title: "Corinthians vs Palmeiras - AO VIVO",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        platform: "youtube",
        isLive: true,
        viewers: 50000,
      },
      {
        id: `stream_2`,
        fixtureId,
        title: "Corinthians vs Palmeiras - Transmissão Oficial",
        url: "https://www.twitch.tv/embed/corinthians",
        platform: "twitch",
        isLive: true,
        viewers: 30000,
      },
    ];

    console.log(`📺 Buscando streams ao vivo para fixture ${fixtureId}`);
    return mockStreams;
  } catch (error) {
    console.error("Erro ao buscar streams:", error);
    return [];
  }
}

/**
 * Busca vídeos de gols específicos de um jogo
 */
export async function getGameGoalVideos(fixtureId: number): Promise<GoalVideo[]> {
  try {
    const mockGoalVideos: GoalVideo[] = [
      {
        id: `goal_1`,
        fixtureId,
        goalId: "g1",
        playerName: "Romero",
        minute: 23,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        platform: "youtube",
      },
      {
        id: `goal_2`,
        fixtureId,
        goalId: "g2",
        playerName: "Cássio (contra)",
        minute: 45,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        platform: "youtube",
      },
    ];

    console.log(`⚽ Buscando vídeos de gols para fixture ${fixtureId}`);
    return mockGoalVideos;
  } catch (error) {
    console.error("Erro ao buscar vídeos de gols:", error);
    return [];
  }
}

/**
 * Extrai ID do vídeo YouTube de uma URL
 */
export function extractYouTubeId(url: string): string | null {
  const regexes = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
  ];

  for (const regex of regexes) {
    const match = url.match(regex);
    if (match) return match[1];
  }

  return null;
}

/**
 * Extrai ID do vídeo Twitch de uma URL
 */
export function extractTwitchId(url: string): string | null {
  const regex = /twitch\.tv\/videos\/(\d+)|twitch\.tv\/([^/]+)/;
  const match = url.match(regex);
  return match ? match[1] || match[2] : null;
}

/**
 * Gera URL de embed do YouTube
 */
export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Gera URL de embed do Twitch
 */
export function getTwitchEmbedUrl(channelOrVideoId: string): string {
  // Verificar se é um vídeo ou um canal
  if (channelOrVideoId.match(/^\d+$/)) {
    // É um vídeo
    return `https://www.twitch.tv/embed?video=${channelOrVideoId}`;
  } else {
    // É um canal
    return `https://www.twitch.tv/embed/${channelOrVideoId}`;
  }
}

/**
 * Valida se uma URL é um vídeo válido
 */
export function isValidVideoUrl(url: string): boolean {
  return (
    url.includes("youtube.com") ||
    url.includes("youtu.be") ||
    url.includes("twitch.tv")
  );
}

/**
 * Cria um vídeo de gol
 */
export async function createGoalVideo(
  fixtureId: number,
  goalId: string,
  playerName: string,
  minute: number,
  videoUrl: string
): Promise<{ success: boolean; video?: GoalVideo; error?: string }> {
  try {
    if (!isValidVideoUrl(videoUrl)) {
      return { success: false, error: "URL de vídeo inválida" };
    }

    const video: GoalVideo = {
      id: `goal_${Date.now()}`,
      fixtureId,
      goalId,
      playerName,
      minute,
      videoUrl,
      platform: videoUrl.includes("twitch") ? "twitch" : "youtube",
    };

    console.log(`✅ Vídeo de gol criado: ${playerName} (${minute}')`);

    return { success: true, video };
  } catch (error) {
    console.error("Erro ao criar vídeo de gol:", error);
    return { success: false, error: "Erro ao criar vídeo de gol" };
  }
}
