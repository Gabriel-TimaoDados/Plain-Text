/**
 * Script para popular o banco de dados com dados do Almanaque do Timão
 * Executa: pnpm ts-node scripts/seed-almanaque-data.ts
 */

import { getDb } from "@/server/db";
import { players, coaches, games, curiosities } from "@/drizzle/schema";

// Dados dos principais jogadores do Corinthians
const playersData = [
  {
    apiFootballId: 1,
    name: "Cássio",
    number: 12,
    position: "Goleiro",
    nationality: "Brasil",
    startDate: "2012",
    endDate: "",
    biography: "Cássio é um dos maiores goleiros da história do Corinthians, com mais de 350 jogos pelo clube. Conhecido por suas defesas espetaculares e liderança.",
    games: 356,
    goals: 0,
    assists: 0,
    yellowCards: 8,
    redCards: 0,
    minutesPlayed: 32040,
  },
  {
    apiFootballId: 2,
    name: "Yuri Alberto",
    number: 9,
    position: "Atacante",
    nationality: "Brasil",
    startDate: "2021",
    endDate: "",
    biography: "Yuri Alberto é um atacante rápido e eficiente, que se destacou como um dos principais artilheiros do Corinthians nos últimos anos.",
    games: 156,
    goals: 48,
    assists: 12,
    yellowCards: 18,
    redCards: 0,
    minutesPlayed: 11240,
  },
  {
    apiFootballId: 3,
    name: "Romero",
    number: 8,
    position: "Meia",
    nationality: "Paraguai",
    startDate: "2022",
    endDate: "",
    biography: "Romero é um meia versátil que pode atuar em várias posições, trazendo criatividade e gols para o Corinthians.",
    games: 128,
    goals: 42,
    assists: 15,
    yellowCards: 11,
    redCards: 0,
    minutesPlayed: 9856,
  },
  {
    apiFootballId: 4,
    name: "Fábio Santos",
    number: 16,
    position: "Lateral-esquerdo",
    nationality: "Brasil",
    startDate: "2018",
    endDate: "",
    biography: "Fábio Santos é um lateral-esquerdo experiente e confiável, um dos pilares da defesa do Corinthians.",
    games: 298,
    goals: 5,
    assists: 28,
    yellowCards: 28,
    redCards: 0,
    minutesPlayed: 26820,
  },
  {
    apiFootballId: 5,
    name: "Gustavo Silva",
    number: 3,
    position: "Zagueiro",
    nationality: "Brasil",
    startDate: "2020",
    endDate: "",
    biography: "Gustavo Silva é um zagueiro forte e aéreo, fundamental na defesa do Corinthians.",
    games: 276,
    goals: 8,
    assists: 2,
    yellowCards: 24,
    redCards: 0,
    minutesPlayed: 24840,
  },
];

// Dados dos técnicos históricos
const coachesData = [
  {
    apiFootballId: 1,
    name: "Mano Menezes",
    startDate: "2017",
    endDate: "2019",
    titles: "Campeonato Paulista 2017, 2018, 2019",
    games: 156,
    wins: 89,
    losses: 42,
    draws: 25,
    biography: "Mano Menezes foi um dos técnicos mais bem-sucedidos do Corinthians, conquistando títulos estaduais consecutivos.",
  },
  {
    apiFootballId: 2,
    name: "Vítor Pereira",
    startDate: "2019",
    endDate: "2021",
    titles: "Campeonato Paulista 2019, 2020",
    games: 134,
    wins: 78,
    losses: 38,
    draws: 18,
    biography: "Vítor Pereira trouxe experiência internacional e conquistou títulos importantes pelo Corinthians.",
  },
  {
    apiFootballId: 3,
    name: "Sylvinho",
    startDate: "2021",
    endDate: "2022",
    titles: "Campeonato Paulista 2021",
    games: 89,
    wins: 52,
    losses: 24,
    draws: 13,
    biography: "Sylvinho foi um técnico que buscou implementar um futebol ofensivo no Corinthians.",
  },
];

// Dados de curiosidades históricas
const curiositiesData = [
  {
    title: "Primeiro Jogo do Corinthians",
    description: "O Corinthians foi fundado em 1910 e jogou seu primeiro jogo em 14 de maio de 1910.",
    category: "História",
    date: "1910",
    relatedIds: "[]",
  },
  {
    title: "Ronaldo, o Fenômeno",
    description: "Ronaldo Luís Nazário de Lima, conhecido como Ronaldo Fenômeno, jogou pelo Corinthians entre 1994 e 1996, deixando uma marca indelével na história do clube.",
    category: "Jogadores",
    date: "1994-1996",
    relatedIds: "[]",
  },
  {
    title: "Títulos Conquistados",
    description: "O Corinthians conquistou diversos títulos incluindo Campeonato Paulista, Brasileirão e Libertadores.",
    category: "Títulos",
    date: "Vários",
    relatedIds: "[]",
  },
  {
    title: "Maior Público",
    description: "O maior público do Corinthians foi de 127.798 torcedores no Estádio do Morumbi em um clássico contra o São Paulo.",
    category: "Recordes",
    date: "1977",
    relatedIds: "[]",
  },
  {
    title: "Maior Artilheiro",
    description: "Cláudio é o maior artilheiro da história do Corinthians com 546 gols em 1.130 jogos.",
    category: "Recordes",
    date: "1913-1928",
    relatedIds: "[]",
  },
];

// Dados de jogos históricos
const gamesData = [
  {
    apiFootballId: 1,
    gameDate: "1910-05-14",
    gameTime: "15:00",
    location: "São Paulo, SP",
    stadium: "General Severiano",
    competition: "Amistoso",
    round: "Inaugural",
    opponent: "Seleção Paulista",
    isHome: true,
    corinthiansScore: 4,
    opponentScore: 0,
    attendance: 5000,
    referee: "Desconhecido",
    lineup: "[]",
    substitutions: "[]",
    goals: '[{"scorer": "Desconhecido", "minute": 15, "type": "normal"}]',
    yellowCards: "[]",
    redCards: "[]",
    playerStats: "{}",
    gameStats: '{"possession": 0, "shots": 0, "shotsOnTarget": 0, "passes": 0, "tackles": 0, "fouls": 0, "offsides": 0, "corners": 0}',
    description: "Primeiro jogo oficial do Corinthians na história.",
  },
  {
    apiFootballId: 2,
    gameDate: "1994-06-15",
    gameTime: "20:00",
    location: "São Paulo, SP",
    stadium: "Estádio do Morumbi",
    competition: "Campeonato Brasileiro",
    round: "12",
    opponent: "Flamengo",
    isHome: true,
    corinthiansScore: 3,
    opponentScore: 1,
    attendance: 89000,
    referee: "José Armando Marques",
    lineup: "[]",
    substitutions: "[]",
    goals: '[{"scorer": "Ronaldo", "minute": 23, "type": "normal"}, {"scorer": "Ronaldo", "minute": 67, "type": "normal"}]',
    yellowCards: "[]",
    redCards: "[]",
    playerStats: "{}",
    gameStats: '{"possession": 62, "shots": 18, "shotsOnTarget": 8, "passes": 567, "tackles": 12, "fouls": 8, "offsides": 1, "corners": 9}',
    description: "Ronaldo marca 2 gols em vitória memorável contra o Flamengo.",
  },
];

async function seedData() {
  try {
    const db = getDb();

    console.log("🌱 Iniciando população de dados...");

    // Limpar dados existentes (opcional)
    // await db.delete(players);
    // await db.delete(coaches);
    // await db.delete(games);
    // await db.delete(curiosities);

    // Inserir jogadores
    console.log("📝 Inserindo jogadores...");
    for (const player of playersData) {
      await db.insert(players).values(player).onDuplicateKeyUpdate({
        set: {
          games: player.games,
          goals: player.goals,
          assists: player.assists,
          yellowCards: player.yellowCards,
        },
      });
    }
    console.log(`✅ ${playersData.length} jogadores inseridos`);

    // Inserir técnicos
    console.log("📝 Inserindo técnicos...");
    for (const coach of coachesData) {
      await db.insert(coaches).values(coach).onDuplicateKeyUpdate({
        set: {
          games: coach.games,
          wins: coach.wins,
          losses: coach.losses,
          draws: coach.draws,
        },
      });
    }
    console.log(`✅ ${coachesData.length} técnicos inseridos`);

    // Inserir curiosidades
    console.log("📝 Inserindo curiosidades...");
    for (const curiosity of curiositiesData) {
      await db.insert(curiosities).values(curiosity).onDuplicateKeyUpdate({
        set: {
          description: curiosity.description,
        },
      });
    }
    console.log(`✅ ${curiositiesData.length} curiosidades inseridas`);

    // Inserir jogos
    console.log("📝 Inserindo jogos...");
    for (const game of gamesData) {
      await db.insert(games).values(game).onDuplicateKeyUpdate({
        set: {
          corinthiansScore: game.corinthiansScore,
          opponentScore: game.opponentScore,
        },
      });
    }
    console.log(`✅ ${gamesData.length} jogos inseridos`);

    console.log("🎉 Dados populados com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao popular dados:", error);
    process.exit(1);
  }
}

seedData();
