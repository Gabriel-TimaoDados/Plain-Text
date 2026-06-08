import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { almanaquRouter } from "./almanaque-routers";
import { autoSyncRouter } from "./_core/auto-sync-router";
import { liveGoalsRouter } from "./_core/live-goals-router";
import { redCardRouter } from "./_core/red-card-router";
import { goalReplayRouter } from "./_core/goal-replay-router";
import { liveChatRouter } from "./_core/live-chat-router";
import { authRouter } from "./_core/auth-router";
import { videoRouter } from "./_core/video-router";
import { youtubeNewsRouter } from "./_core/youtube-news-router";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  session: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Almanaque do Timão routes
  almanaque: almanaquRouter,

  // Auto Sync routes
  autoSync: autoSyncRouter,

  // Live Goals Monitoring routes
  liveGoals: liveGoalsRouter,

  // Red Card Monitoring routes
  redCards: redCardRouter,

  // Goal Replay routes
  goalReplays: goalReplayRouter,

  // Live Chat routes
  liveChat: liveChatRouter,

  // Auth routes (login, register, etc)
  authentication: authRouter,

  // Video routes
  videos: videoRouter,

  // YouTube and News routes
  youtubeNews: youtubeNewsRouter,
});

export type AppRouter = typeof appRouter;

// Iniciar sincronização automática ao iniciar servidor
if (process.env.NODE_ENV === "production") {
  const apiKey = process.env.EXPO_PUBLIC_API_FOOTBALL_KEY;
  if (apiKey) {
    import("./_core/auto-sync-service").then(({ startAutoSync }) => {
      startAutoSync(apiKey, 360); // 6 horas
    });
  }
}
