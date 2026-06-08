import { router, publicProcedure } from "./trpc";
import { z } from "zod";
import {
  searchGoalVideos,
  searchRedCardVideos,
  searchLiveStreams,
  getGameGoalVideos,
  extractYouTubeId,
  extractTwitchId,
  getYouTubeEmbedUrl,
  getTwitchEmbedUrl,
  isValidVideoUrl,
  createGoalVideo,
} from "./video-service";

export const videoRouter = router({
  /**
   * Busca vídeos de gols
   */
  searchGoals: publicProcedure
    .input(z.object({ query: z.string(), limit: z.number().optional() }))
    .query(async ({ input }) => {
      const videos = await searchGoalVideos(input.query, input.limit);
      return { videos, count: videos.length };
    }),

  /**
   * Busca vídeos de expulsões
   */
  searchRedCards: publicProcedure
    .input(z.object({ playerName: z.string(), limit: z.number().optional() }))
    .query(async ({ input }) => {
      const videos = await searchRedCardVideos(input.playerName, input.limit);
      return { videos, count: videos.length };
    }),

  /**
   * Busca streams ao vivo
   */
  getLiveStreams: publicProcedure
    .input(z.object({ fixtureId: z.number() }))
    .query(async ({ input }) => {
      const streams = await searchLiveStreams(input.fixtureId);
      return { streams, count: streams.length };
    }),

  /**
   * Busca vídeos de gols de um jogo específico
   */
  getGameGoals: publicProcedure
    .input(z.object({ fixtureId: z.number() }))
    .query(async ({ input }) => {
      const videos = await getGameGoalVideos(input.fixtureId);
      return { videos, count: videos.length };
    }),

  /**
   * Extrai ID do YouTube
   */
  extractYouTubeId: publicProcedure
    .input(z.object({ url: z.string() }))
    .query(async ({ input }) => {
      const id = extractYouTubeId(input.url);
      return { id, embedUrl: id ? getYouTubeEmbedUrl(id) : null };
    }),

  /**
   * Extrai ID do Twitch
   */
  extractTwitchId: publicProcedure
    .input(z.object({ url: z.string() }))
    .query(async ({ input }) => {
      const id = extractTwitchId(input.url);
      return { id, embedUrl: id ? getTwitchEmbedUrl(id) : null };
    }),

  /**
   * Valida URL de vídeo
   */
  validateVideoUrl: publicProcedure
    .input(z.object({ url: z.string() }))
    .query(async ({ input }) => {
      const isValid = isValidVideoUrl(input.url);
      return { isValid };
    }),

  /**
   * Cria um vídeo de gol
   */
  createGoalVideo: publicProcedure
    .input(
      z.object({
        fixtureId: z.number(),
        goalId: z.string(),
        playerName: z.string(),
        minute: z.number(),
        videoUrl: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return createGoalVideo(
        input.fixtureId,
        input.goalId,
        input.playerName,
        input.minute,
        input.videoUrl
      );
    }),
});
