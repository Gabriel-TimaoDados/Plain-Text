import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { players, coaches, games, curiosities, favorites, rivalries, upcomingGames } from "../drizzle/schema";
import { eq, like, desc, and } from "drizzle-orm";

export const almanaquRouter = router({
  // Players routes
  players: router({
    list: publicProcedure
      .input(
        z.object({
          limit: z.number().default(20),
          offset: z.number().default(0),
          position: z.string().optional(),
          search: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        let query: any = db.select().from(players);

        if (input.search) {
          query = query.where(like(players.name, `%${input.search}%`));
        }

        if (input.position) {
          query = query.where(eq(players.position, input.position));
        }

        const result = await query.limit(input.limit).offset(input.offset);
        return result;
      }),

    detail: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db.select().from(players).where(eq(players.id, input.id));
        return result[0] || null;
      }),

    search: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db
          .select()
          .from(players)
          .where(like(players.name, `%${input.query}%`))
          .limit(10);
        return result;
      }),
  }),

  // Coaches routes
  coaches: router({
    list: publicProcedure
      .input(
        z.object({
          limit: z.number().default(20),
          offset: z.number().default(0),
          search: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        let query: any = db.select().from(coaches);

        if (input.search) {
          query = query.where(like(coaches.name, `%${input.search}%`));
        }

        const result = await query.limit(input.limit).offset(input.offset);
        return result;
      }),

    detail: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db.select().from(coaches).where(eq(coaches.id, input.id));
        return result[0] || null;
      }),

    search: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db
          .select()
          .from(coaches)
          .where(like(coaches.name, `%${input.query}%`))
          .limit(10);
        return result;
      }),
  }),

  // Games routes
  games: router({
    list: publicProcedure
      .input(
        z.object({
          limit: z.number().default(20),
          offset: z.number().default(0),
          competition: z.string().optional(),
          search: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        let query: any = db.select().from(games);

        if (input.search) {
          query = query.where(like(games.opponent, `%${input.search}%`));
        }

        if (input.competition) {
          query = query.where(eq(games.competition, input.competition));
        }

        const result = await query
          .orderBy(desc(games.gameDate))
          .limit(input.limit)
          .offset(input.offset);
        return result;
      }),

    detail: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db.select().from(games).where(eq(games.id, input.id));
        return result[0] || null;
      }),

    search: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db
          .select()
          .from(games)
          .where(like(games.opponent, `%${input.query}%`))
          .orderBy(desc(games.gameDate))
          .limit(10);
        return result;
      }),

    byFilters: publicProcedure
      .input(
        z.object({
          limit: z.number().default(20),
          offset: z.number().default(0),
          location: z.string().optional(),
          competition: z.string().optional(),
          result: z.enum(["win", "draw", "loss"]).optional(),
        })
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        let query: any = db.select().from(games);
        const conditions: any[] = [];

        if (input.location) {
          conditions.push(like(games.location, `%${input.location}%`));
        }

        if (input.competition) {
          conditions.push(eq(games.competition, input.competition));
        }

        if (conditions.length > 0) {
          query = query.where(and(...conditions));
        }

        const result = await query
          .orderBy(desc(games.gameDate))
          .limit(input.limit)
          .offset(input.offset);
        return result;
      }),
  }),

  // Curiosities routes
  curiosities: router({
    list: publicProcedure
      .input(
        z.object({
          limit: z.number().default(20),
          offset: z.number().default(0),
          category: z.string().optional(),
          search: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        let query: any = db.select().from(curiosities);

        if (input.search) {
          query = query.where(like(curiosities.title, `%${input.search}%`));
        }

        if (input.category) {
          query = query.where(eq(curiosities.category, input.category));
        }

        const result = await query.limit(input.limit).offset(input.offset);
        return result;
      }),

    detail: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db
          .select()
          .from(curiosities)
          .where(eq(curiosities.id, input.id));
        return result[0] || null;
      }),

    random: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db.select().from(curiosities).limit(1);
      return result[0] || null;
    }),

    search: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db
          .select()
          .from(curiosities)
          .where(like(curiosities.title, `%${input.query}%`))
          .limit(10);
        return result;
      }),
  }),

  // Rivalries (Duelos) routes
  rivalries: router({
    list: publicProcedure
      .input(
        z.object({
          limit: z.number().default(20),
          offset: z.number().default(0),
          search: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        let query: any = db.select().from(rivalries);

        if (input.search) {
          query = query.where(like(rivalries.opponent, `%${input.search}%`));
        }

        const result = await query
          .orderBy(desc(rivalries.totalGames))
          .limit(input.limit)
          .offset(input.offset);
        return result;
      }),

    detail: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db.select().from(rivalries).where(eq(rivalries.id, input.id));
        return result[0] || null;
      }),

    byOpponent: publicProcedure
      .input(z.object({ opponent: z.string() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db
          .select()
          .from(rivalries)
          .where(eq(rivalries.opponent, input.opponent));
        return result[0] || null;
      }),
  }),

  // Upcoming Games routes
  upcomingGames: router({
    list: publicProcedure
      .input(
        z.object({
          limit: z.number().default(10),
          offset: z.number().default(0),
          status: z.enum(["scheduled", "postponed", "cancelled"]).optional(),
        })
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        let query: any = db.select().from(upcomingGames);

        if (input.status) {
          query = query.where(eq(upcomingGames.status, input.status));
        }

        const result = await query
          .orderBy(upcomingGames.gameDate)
          .limit(input.limit)
          .offset(input.offset);
        return result;
      }),

    detail: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db
          .select()
          .from(upcomingGames)
          .where(eq(upcomingGames.id, input.id));
        return result[0] || null;
      }),
  }),

  // Sync with API-Football
  sync: publicProcedure
    .input(z.object({ apiKey: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const { getCorinthiansFixtures, getCorinthiansSquad } = await import(
          "./_core/api-football"
        );

        const currentYear = new Date().getFullYear();
        const [fixtures, squad] = await Promise.all([
          getCorinthiansFixtures(input.apiKey, currentYear, 50),
          getCorinthiansSquad(input.apiKey),
        ]);

        return {
          success: true,
          fixturesCount: fixtures.length,
          playersCount: squad.players.length,
          lastSync: new Date().toISOString(),
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }),

  // Global search
  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const searchPattern = `%${input.query}%`;

      const [playerResults, coachResults, gameResults, curiosityResults] = await Promise.all([
        db
          .select()
          .from(players)
          .where(like(players.name, searchPattern))
          .limit(5),
        db
          .select()
          .from(coaches)
          .where(like(coaches.name, searchPattern))
          .limit(5),
        db
          .select()
          .from(games)
          .where(like(games.opponent, searchPattern))
          .limit(5),
        db
          .select()
          .from(curiosities)
          .where(like(curiosities.title, searchPattern))
          .limit(5),
      ]);

      return {
        players: playerResults,
        coaches: coachResults,
        games: gameResults,
        curiosities: curiosityResults,
      };
    }),
});

export type AlmanaquRouter = typeof almanaquRouter;
