/**
 * Serviço para integração com YouTube Data API
 * Busca vídeos de gols, notícias e conteúdo do Corinthians
 */

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  publishedAt: Date;
  channelTitle: string;
  viewCount?: number;
}

/**
 * Busca vídeos de gols do Corinthians no YouTube
 */
export async function searchCorinthiansGoalVideos(
  limit: number = 10
): Promise<YouTubeVideo[]> {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      console.warn("YouTube API Key não configurada");
      return [];
    }

    const query = "Corinthians gol";
    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.append("part", "snippet");
    url.searchParams.append("q", query);
    url.searchParams.append("type", "video");
    url.searchParams.append("maxResults", limit.toString());
    url.searchParams.append("order", "date");
    url.searchParams.append("key", apiKey);

    const response = await fetch(url.toString());
    const data = (await response.json()) as {
      items?: Array<{
        id: { videoId: string };
        snippet: {
          title: string;
          description: string;
          thumbnails: { high: { url: string } };
          publishedAt: string;
          channelTitle: string;
        };
      }>;
    };

    if (!data.items) return [];

    return data.items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      publishedAt: new Date(item.snippet.publishedAt),
      channelTitle: item.snippet.channelTitle,
    }));
  } catch (error) {
    console.error("Erro ao buscar vídeos do YouTube:", error);
    return [];
  }
}

/**
 * Busca vídeos de notícias do Corinthians
 */
export async function searchCorinthiansNewsVideos(
  limit: number = 10
): Promise<YouTubeVideo[]> {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      console.warn("YouTube API Key não configurada");
      return [];
    }

    const query = "Corinthians notícias";
    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.append("part", "snippet");
    url.searchParams.append("q", query);
    url.searchParams.append("type", "video");
    url.searchParams.append("maxResults", limit.toString());
    url.searchParams.append("order", "date");
    url.searchParams.append("key", apiKey);

    const response = await fetch(url.toString());
    const data = (await response.json()) as {
      items?: Array<{
        id: { videoId: string };
        snippet: {
          title: string;
          description: string;
          thumbnails: { high: { url: string } };
          publishedAt: string;
          channelTitle: string;
        };
      }>;
    };

    if (!data.items) return [];

    return data.items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      publishedAt: new Date(item.snippet.publishedAt),
      channelTitle: item.snippet.channelTitle,
    }));
  } catch (error) {
    console.error("Erro ao buscar notícias do YouTube:", error);
    return [];
  }
}

/**
 * Busca vídeos de um canal específico
 */
export async function searchChannelVideos(
  channelId: string,
  limit: number = 10
): Promise<YouTubeVideo[]> {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      console.warn("YouTube API Key não configurada");
      return [];
    }

    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.append("part", "snippet");
    url.searchParams.append("channelId", channelId);
    url.searchParams.append("type", "video");
    url.searchParams.append("maxResults", limit.toString());
    url.searchParams.append("order", "date");
    url.searchParams.append("key", apiKey);

    const response = await fetch(url.toString());
    const data = (await response.json()) as {
      items?: Array<{
        id: { videoId: string };
        snippet: {
          title: string;
          description: string;
          thumbnails: { high: { url: string } };
          publishedAt: string;
          channelTitle: string;
        };
      }>;
    };

    if (!data.items) return [];

    return data.items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      publishedAt: new Date(item.snippet.publishedAt),
      channelTitle: item.snippet.channelTitle,
    }));
  } catch (error) {
    console.error("Erro ao buscar vídeos do canal:", error);
    return [];
  }
}

/**
 * Obtém estatísticas de um vídeo
 */
export async function getVideoStats(videoId: string): Promise<{
  viewCount: number;
  likeCount: number;
  commentCount: number;
} | null> {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      console.warn("YouTube API Key não configurada");
      return null;
    }

    const url = new URL("https://www.googleapis.com/youtube/v3/videos");
    url.searchParams.append("part", "statistics");
    url.searchParams.append("id", videoId);
    url.searchParams.append("key", apiKey);

    const response = await fetch(url.toString());
    const data = (await response.json()) as {
      items?: Array<{
        statistics: {
          viewCount: string;
          likeCount: string;
          commentCount: string;
        };
      }>;
    };

    if (!data.items || data.items.length === 0) return null;

    const stats = data.items[0].statistics;
    return {
      viewCount: parseInt(stats.viewCount, 10),
      likeCount: parseInt(stats.likeCount, 10),
      commentCount: parseInt(stats.commentCount, 10),
    };
  } catch (error) {
    console.error("Erro ao obter estatísticas do vídeo:", error);
    return null;
  }
}

/**
 * Gera URL de embed do YouTube
 */
export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}
