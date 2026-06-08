import { router, publicProcedure } from "./trpc";
import { z } from "zod";
import {
  searchCorinthiansGoalVideos,
  searchCorinthiansNewsVideos,
  searchChannelVideos,
  getVideoStats,
  getYouTubeEmbedUrl,
} from "./youtube-service";
import {
  searchCorinthiansNews,
  searchInjuryNews,
  searchTransferNews,
  filterNewsByCategory,
  sortNewsByDate,
} from "./news-service";

export const youtubeNewsRouter = router({
  /**
   * Busca vídeos de gols do Corinthians
   */
  searchGoalVideos: publicProcedure
    .input(z.object({ limit: z.number().optional() }))
    .query(async ({ input }) => {
      const videos = await searchCorinthiansGoalVideos(input.limit);
      return { videos, count: videos.length };
    }),

  /**
   * Busca vídeos de notícias do Corinthians
   */
  searchNewsVideos: publicProcedure
    .input(z.object({ limit: z.number().optional() }))
    .query(async ({ input }) => {
      const videos = await searchCorinthiansNewsVideos(input.limit);
      return { videos, count: videos.length };
    }),

  /**
   * Busca vídeos de um canal específico
   */
  searchChannelVideos: publicProcedure
    .input(z.object({ channelId: z.string(), limit: z.number().optional() }))
    .query(async ({ input }) => {
      const videos = await searchChannelVideos(input.channelId, input.limit);
      return { videos, count: videos.length };
    }),

  /**
   * Obtém estatísticas de um vídeo
   */
  getVideoStats: publicProcedure
    .input(z.object({ videoId: z.string() }))
    .query(async ({ input }) => {
      const stats = await getVideoStats(input.videoId);
      return stats;
    }),

  /**
   * Gera URL de embed do YouTube
   */
  getEmbedUrl: publicProcedure
    .input(z.object({ videoId: z.string() }))
    .query(async ({ input }) => {
      const url = getYouTubeEmbedUrl(input.videoId);
      return { url };
    }),

  /**
   * Busca notícias sobre Corinthians
   */
  searchNews: publicProcedure
    .input(z.object({ limit: z.number().optional() }))
    .query(async ({ input }) => {
      const articles = await searchCorinthiansNews(input.limit);
      return { articles, count: articles.length };
    }),

  /**
   * Busca notícias de lesões
   */
  searchInjuryNews: publicProcedure
    .input(z.object({ limit: z.number().optional() }))
    .query(async ({ input }) => {
      const articles = await searchInjuryNews(input.limit);
      return { articles, count: articles.length };
    }),

  /**
   * Busca notícias de transferências
   */
  searchTransferNews: publicProcedure
    .input(z.object({ limit: z.number().optional() }))
    .query(async ({ input }) => {
      const articles = await searchTransferNews(input.limit);
      return { articles, count: articles.length };
    }),

  /**
   * Filtra notícias por categoria
   */
  filterByCategory: publicProcedure
    .input(
      z.object({
        category: z.enum(["gol", "lesão", "mercado", "técnico", "geral"]),
      })
    )
    .query(async ({ input }) => {
      const articles = await searchCorinthiansNews(50);
      const filtered = filterNewsByCategory(articles, input.category);
      return { articles: filtered, count: filtered.length };
    }),

  /**
   * Ordena notícias por data
   */
  sortByDate: publicProcedure
    .input(z.object({ order: z.enum(["asc", "desc"]).optional() }))
    .query(async ({ input }) => {
      const articles = await searchCorinthiansNews(50);
      const sorted = sortNewsByDate(articles, input.order);
      return { articles: sorted, count: sorted.length };
    }),
});
