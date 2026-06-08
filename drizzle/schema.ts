import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, tinyint } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Tabelas do Almanaque do Timão

export const players = mysqlTable("players", {
  id: int("id").autoincrement().primaryKey(),
  apiFootballId: int("apiFootballId"),
  name: varchar("name", { length: 255 }).notNull(),
  number: int("number"),
  position: varchar("position", { length: 100 }),
  nationality: varchar("nationality", { length: 100 }),
  startDate: varchar("startDate", { length: 50 }),
  endDate: varchar("endDate", { length: 50 }),
  biography: text("biography"),
  games: int("games").default(0),
  goals: int("goals").default(0),
  assists: int("assists").default(0),
  yellowCards: int("yellowCards").default(0),
  redCards: int("redCards").default(0),
  minutesPlayed: int("minutesPlayed").default(0),
  photoUrl: text("photoUrl"),
  cardHistory: text("cardHistory"),
  goalHistory: text("goalHistory"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Player = typeof players.$inferSelect;
export type InsertPlayer = typeof players.$inferInsert;

export const coaches = mysqlTable("coaches", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  startDate: varchar("startDate", { length: 50 }),
  endDate: varchar("endDate", { length: 50 }),
  titles: text("titles"), // JSON array as string
  games: int("games").default(0),
  wins: int("wins").default(0),
  losses: int("losses").default(0),
  draws: int("draws").default(0),
  biography: text("biography"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Coach = typeof coaches.$inferSelect;
export type InsertCoach = typeof coaches.$inferInsert;

export const games = mysqlTable("games", {
  id: int("id").autoincrement().primaryKey(),
  apiFootballId: int("apiFootballId"),
  gameDate: varchar("gameDate", { length: 50 }).notNull(),
  gameTime: varchar("gameTime", { length: 50 }),
  location: varchar("location", { length: 255 }),
  stadium: varchar("stadium", { length: 255 }),
  competition: varchar("competition", { length: 100 }),
  round: varchar("round", { length: 100 }),
  opponent: varchar("opponent", { length: 255 }).notNull(),
  isHome: tinyint("isHome"),
  corinthiansScore: int("corinthiansScore"),
  opponentScore: int("opponentScore"),
  attendance: int("attendance"),
  referee: varchar("referee", { length: 255 }),
  lineup: text("lineup"),
  substitutions: text("substitutions"),
  goals: text("goals"),
  yellowCards: text("yellowCards"),
  redCards: text("redCards"),
  playerStats: text("playerStats"),
  gameStats: text("gameStats"),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Game = typeof games.$inferSelect;
export type InsertGame = typeof games.$inferInsert;

export const curiosities = mysqlTable("curiosities", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }),
  date: varchar("date", { length: 50 }),
  relatedIds: text("relatedIds"), // JSON array as string
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Curiosity = typeof curiosities.$inferSelect;
export type InsertCuriosity = typeof curiosities.$inferInsert;

export const favorites = mysqlTable("favorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  itemType: mysqlEnum("itemType", ["player", "coach", "game", "curiosity"]).notNull(),
  itemId: int("itemId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;

// Tabela de Duelos (Corinthians x outros times)
export const rivalries = mysqlTable("rivalries", {
  id: int("id").autoincrement().primaryKey(),
  opponent: varchar("opponent", { length: 255 }).notNull(),
  totalGames: int("totalGames").default(0),
  corinthiansWins: int("corinthiansWins").default(0),
  corinthiansDraws: int("corinthiansDraws").default(0),
  corinthiansLosses: int("corinthiansLosses").default(0),
  corinthiansGoals: int("corinthiansGoals").default(0),
  opponentGoals: int("opponentGoals").default(0),
  homeGames: int("homeGames").default(0),
  homeWins: int("homeWins").default(0),
  homeDraws: int("homeDraws").default(0),
  homeLosses: int("homeLosses").default(0),
  homeCorinthiansGoals: int("homeCorinthiansGoals").default(0),
  homeOpponentGoals: int("homeOpponentGoals").default(0),
  awayGames: int("awayGames").default(0),
  awayWins: int("awayWins").default(0),
  awayDraws: int("awayDraws").default(0),
  awayLosses: int("awayLosses").default(0),
  awayCorinthiansGoals: int("awayCorinthiansGoals").default(0),
  awayOpponentGoals: int("awayOpponentGoals").default(0),
  lastMeeting: varchar("lastMeeting", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Rivalry = typeof rivalries.$inferSelect;
export type InsertRivalry = typeof rivalries.$inferInsert;

// Tabela de Próximos Jogos
export const upcomingGames = mysqlTable("upcomingGames", {
  id: int("id").autoincrement().primaryKey(),
  gameDate: varchar("gameDate", { length: 50 }).notNull(),
  gameTime: varchar("gameTime", { length: 50 }),
  location: varchar("location", { length: 255 }),
  stadium: varchar("stadium", { length: 255 }),
  competition: varchar("competition", { length: 100 }),
  opponent: varchar("opponent", { length: 255 }).notNull(),
  homeTeam: varchar("homeTeam", { length: 255 }),
  awayTeam: varchar("awayTeam", { length: 255 }),
  status: mysqlEnum("status", ["scheduled", "postponed", "cancelled"]).default("scheduled"),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UpcomingGame = typeof upcomingGames.$inferSelect;
export type InsertUpcomingGame = typeof upcomingGames.$inferInsert;

// Expandir tabela de games com mais campos
export const gameStats = mysqlTable("gameStats", {
  id: int("id").autoincrement().primaryKey(),
  gameId: int("gameId").notNull(),
  isHome: int("isHome").notNull(), // 1 para mandante, 0 para visitante
  possession: int("possession"), // percentual
  shots: int("shots"),
  shotsOnTarget: int("shotsOnTarget"),
  passes: int("passes"),
  passAccuracy: int("passAccuracy"), // percentual
  fouls: int("fouls"),
  yellowCards: int("yellowCards"),
  redCards: int("redCards"),
  corners: int("corners"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GameStat = typeof gameStats.$inferSelect;
export type InsertGameStat = typeof gameStats.$inferInsert;
