import { getDb } from "../server/db";
import {
  players,
  coaches,
  games,
  curiosities,
  rivalries,
} from "../drizzle/schema";

/**
 * Script para popular o banco de dados com dados do Almanaque do Timão
 * Executa: pnpm ts-node scripts/populate-database.ts
 */

// Dados de exemplo do Almanaque do Timão
const almanacPlayers = [
  {
    name: "Ronaldo Fenômeno",
    number: 9,
    position: "Atacante",
    nationality: "Brasil",
    startDate: "1994-01-01",
    endDate: "1996-12-31",
    biography:
      "Ronaldo Luís Nazário de Lima, conhecido como Ronaldo Fenômeno, jogou pelo Corinthians e se tornou uma lenda do futebol mundial.",
    games: 47,
    goals: 30,
    assists: 8,
  },
  {
    name: "Cássio",
    number: 12,
    position: "Goleiro",
    nationality: "Brasil",
    startDate: "2012-01-01",
    endDate: null,
    biography:
      "Cássio é um dos goleiros mais importantes da história recente do Corinthians, com diversas conquistas e títulos.",
    games: 500,
    goals: 0,
    assists: 0,
  },
  {
    name: "Neymar",
    number: 11,
    position: "Atacante",
    nationality: "Brasil",
    startDate: "2009-01-01",
    endDate: "2013-12-31",
    biography:
      "Neymar jogou pelo Corinthians antes de sua transferência para o Santos e depois para o exterior.",
    games: 103,
    goals: 54,
    assists: 25,
  },
  {
    name: "Rivaldo",
    number: 10,
    position: "Meia",
    nationality: "Brasil",
    startDate: "1992-01-01",
    endDate: "1993-12-31",
    biography:
      "Rivaldo jogou pelo Corinthians no início de sua carreira, antes de se tornar um dos maiores jogadores do mundo.",
    games: 61,
    goals: 35,
    assists: 15,
  },
];

const almanacCoaches = [
  {
    name: "Tite",
    startDate: "2007-01-01",
    endDate: "2012-12-31",
    titles: "Libertadores 2012, Recopa 2013",
    games: 200,
    wins: 120,
    losses: 40,
    draws: 40,
    biography:
      "Tite foi o técnico que conquistou a Libertadores 2012 com o Corinthians, marcando época.",
  },
  {
    name: "Mano Menezes",
    startDate: "2001-01-01",
    endDate: "2006-12-31",
    titles: "Campeonato Paulista 2003",
    games: 180,
    wins: 100,
    losses: 50,
    draws: 30,
    biography:
      "Mano Menezes foi um dos técnicos mais importantes do Corinthians na década de 2000.",
  },
];

const almanacCuriosities = [
  {
    title: "Primeiro Jogo do Corinthians",
    description:
      "O Corinthians foi fundado em 1910 e jogou seu primeiro jogo em 14 de maio de 1910.",
    category: "História",
    date: "1910-05-14",
    relatedIds: "[]",
  },
  {
    title: "Ronaldo, o Fenômeno",
    description:
      "Ronaldo Luís Nazário de Lima, conhecido como Ronaldo Fenômeno, jogou pelo Corinthians e se tornou uma lenda do futebol mundial.",
    category: "Jogadores",
    date: "1994-01-01",
    relatedIds: "[]",
  },
  {
    title: "Libertadores 2012",
    description:
      "O Corinthians conquistou a Libertadores em 2012, sob o comando de Tite, derrotando o Boca Juniors na final.",
    category: "Títulos",
    date: "2012-05-30",
    relatedIds: "[]",
  },
  {
    title: "Neymar no Corinthians",
    description:
      "Neymar jogou pelo Corinthians antes de sua transferência para o Santos, marcando 54 gols em 103 jogos.",
    category: "Jogadores",
    date: "2009-01-01",
    relatedIds: "[]",
  },
];

const almanacRivalries = [
  {
    opponent: "São Paulo",
    totalGames: 180,
    corinthiansWins: 65,
    corinthiansDraws: 50,
    corinthiansLosses: 65,
    corinthiansGoals: 220,
    opponentGoals: 220,
    homeGames: 90,
    homeWins: 35,
    homeDraws: 25,
    homeLosses: 30,
    homeCorinthiansGoals: 115,
    homeOpponentGoals: 105,
    awayGames: 90,
    awayWins: 30,
    awayDraws: 25,
    awayLosses: 35,
    awayCorinthiansGoals: 105,
    awayOpponentGoals: 115,
    lastMeeting: "2024-05-15",
  },
  {
    opponent: "Palmeiras",
    totalGames: 160,
    corinthiansWins: 60,
    corinthiansDraws: 45,
    corinthiansLosses: 55,
    corinthiansGoals: 200,
    opponentGoals: 190,
    homeGames: 80,
    homeWins: 32,
    homeDraws: 23,
    homeLosses: 25,
    homeCorinthiansGoals: 108,
    homeOpponentGoals: 92,
    awayGames: 80,
    awayWins: 28,
    awayDraws: 22,
    awayLosses: 30,
    awayCorinthiansGoals: 92,
    awayOpponentGoals: 98,
    lastMeeting: "2024-05-10",
  },
  {
    opponent: "Santos",
    totalGames: 140,
    corinthiansWins: 55,
    corinthiansDraws: 40,
    corinthiansLosses: 45,
    corinthiansGoals: 180,
    opponentGoals: 160,
    homeGames: 70,
    homeWins: 30,
    homeDraws: 20,
    homeLosses: 20,
    homeCorinthiansGoals: 98,
    homeOpponentGoals: 75,
    awayGames: 70,
    awayWins: 25,
    awayDraws: 20,
    awayLosses: 25,
    awayCorinthiansGoals: 82,
    awayOpponentGoals: 85,
    lastMeeting: "2024-04-20",
  },
];

/**
 * Função para popular o banco de dados
 */
async function populateDatabase() {
  try {
    const db = await getDb();
    
    if (!db) {
      console.error("❌ Erro: Banco de dados não disponível");
      process.exit(1);
    }

    console.log("🚀 Iniciando população do banco de dados...\n");

    // 1. Inserir Jogadores
    console.log("📥 Inserindo jogadores...");
    for (const player of almanacPlayers) {
      await db.insert(players).values({
        name: player.name,
        number: player.number,
        position: player.position,
        nationality: player.nationality,
        startDate: player.startDate,
        endDate: player.endDate,
        biography: player.biography,
        games: player.games,
        goals: player.goals,
        assists: player.assists,
        yellowCards: 0,
        redCards: 0,
        minutesPlayed: 0,
      });
    }
    console.log(`✅ ${almanacPlayers.length} jogadores inseridos\n`);

    // 2. Inserir Técnicos
    console.log("📥 Inserindo técnicos...");
    for (const coach of almanacCoaches) {
      await db.insert(coaches).values({
        name: coach.name,
        startDate: coach.startDate,
        endDate: coach.endDate,
        titles: coach.titles,
        games: coach.games,
        wins: coach.wins,
        losses: coach.losses,
        draws: coach.draws,
        biography: coach.biography,
      });
    }
    console.log(`✅ ${almanacCoaches.length} técnicos inseridos\n`);

    // 3. Inserir Curiosidades
    console.log("📥 Inserindo curiosidades...");
    for (const curiosity of almanacCuriosities) {
      await db.insert(curiosities).values({
        title: curiosity.title,
        description: curiosity.description,
        category: curiosity.category,
        date: curiosity.date,
        relatedIds: curiosity.relatedIds,
      });
    }
    console.log(`✅ ${almanacCuriosities.length} curiosidades inseridas\n`);

    // 4. Inserir Duelos
    console.log("📥 Inserindo duelos...");
    for (const rivalry of almanacRivalries) {
      await db.insert(rivalries).values({
        opponent: rivalry.opponent,
        totalGames: rivalry.totalGames,
        corinthiansWins: rivalry.corinthiansWins,
        corinthiansDraws: rivalry.corinthiansDraws,
        corinthiansLosses: rivalry.corinthiansLosses,
        corinthiansGoals: rivalry.corinthiansGoals,
        opponentGoals: rivalry.opponentGoals,
        homeGames: rivalry.homeGames,
        homeWins: rivalry.homeWins,
        homeDraws: rivalry.homeDraws,
        homeLosses: rivalry.homeLosses,
        homeCorinthiansGoals: rivalry.homeCorinthiansGoals,
        homeOpponentGoals: rivalry.homeOpponentGoals,
        awayGames: rivalry.awayGames,
        awayWins: rivalry.awayWins,
        awayDraws: rivalry.awayDraws,
        awayLosses: rivalry.awayLosses,
        awayCorinthiansGoals: rivalry.awayCorinthiansGoals,
        awayOpponentGoals: rivalry.awayOpponentGoals,
        lastMeeting: rivalry.lastMeeting,
      });
    }
    console.log(`✅ ${almanacRivalries.length} duelos inseridos\n`);

    console.log("🎉 População do banco de dados concluída com sucesso!");
    console.log(
      "\n📊 Resumo:"
    );
    console.log(`   - ${almanacPlayers.length} jogadores`);
    console.log(`   - ${almanacCoaches.length} técnicos`);
    console.log(`   - ${almanacCuriosities.length} curiosidades`);
    console.log(`   - ${almanacRivalries.length} duelos`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao popular banco de dados:", error);
    process.exit(1);
  }
}

// Executar
populateDatabase();
