import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL não está configurada');
  process.exit(1);
}

// Dados base para geração realista
const firstNames = [
  'Ronaldo', 'Neymar', 'Rivaldo', 'Cássio', 'Paulista', 'Marcelinho', 'Edílson', 'Didi', 'Garrincha', 'Pelé',
  'Zé Maria', 'Dunga', 'Maradona', 'Socrates', 'Zé Kalanga', 'Wladimir', 'Vampeta', 'Roque', 'Gilmar', 'Chicão',
  'Lula', 'Luizinho', 'Rivelino', 'Everaldo', 'Jairzinho', 'Tostão', 'Gérson', 'Clodoaldo', 'Piazza', 'Palhinha',
  'Serginho', 'Fonseca', 'Leão', 'Manoel', 'Nílton', 'Brandão', 'Robson', 'Juninho', 'Paulinho', 'Danilo',
  'Gustavo', 'Henrique', 'Balbuena', 'Fagner', 'Cantillo', 'Ralf', 'Gabriel', 'Adson', 'Araos', 'Otero'
];

const lastNames = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Costa', 'Ferreira', 'Gomes', 'Martins', 'Alves', 'Pereira',
  'Rocha', 'Dias', 'Ribeiro', 'Carvalho', 'Barbosa', 'Mendes', 'Teixeira', 'Monteiro', 'Neves', 'Campos',
  'Machado', 'Lopes', 'Correia', 'Duarte', 'Tavares', 'Pinto', 'Moreira', 'Soares', 'Vieira', 'Figueiredo',
  'Lourenço', 'Marques', 'Nunes', 'Maia', 'Brás', 'Melo', 'Borges', 'Leal', 'Vaz', 'Freitas'
];

const positions = ['Goleiro', 'Zagueiro', 'Lateral Esquerdo', 'Lateral Direito', 'Volante', 'Meia', 'Meia Atacante', 'Ponta Esquerda', 'Ponta Direita', 'Atacante'];

const nationalities = ['Brasil', 'Argentina', 'Uruguai', 'Paraguai', 'Chile', 'Colômbia', 'Venezuela', 'Peru', 'Bolívia', 'Equador'];

const coachNames = [
  'Tite', 'Mano Menezes', 'Dunga', 'Dorival Júnior', 'Vítor Pereira', 'Sylvio Pacheco', 'Nelsinho Baptista',
  'Paulo Autuori', 'Oswaldo de Oliveira', 'Emerson Leão', 'Adilson Batista', 'Marcelo Martelotta', 'Ney Franco',
  'Cuca', 'Levir Culpi', 'Micale', 'Jorginho', 'Aurélio', 'Zé Mário', 'Carlinhos Neves', 'Valdir Espinosa',
  'Ruy Ramos', 'Gilson Nunes', 'Hélio dos Anjos', 'Alfeu Miqueroni', 'Zé Lobo', 'Luizinho Vieira', 'Ênio Andrade',
  'Waldemar de Brito', 'Agenor Castilho', 'Antônio Lopes', 'Ary Barroso', 'Barbosa Neto', 'Benedito Pires',
  'Bento Pereira', 'Bernardino Neves', 'Beto Campos', 'Beto Neves', 'Beto Rodrigues', 'Beto Vieira'
];

const opponents = [
  'São Paulo', 'Palmeiras', 'Santos', 'Flamengo', 'Fluminense', 'Vasco da Gama', 'Botafogo', 'Cruzeiro',
  'Atlético Mineiro', 'Grêmio', 'Internacional', 'Bahia', 'Vitória', 'Sport', 'Náutico', 'Ceará',
  'Fortaleza', 'Goiás', 'Coritiba', 'Paraná', 'Ponte Preta', 'Guarani', 'Portuguesa', 'XV de Piracicaba',
  'Boca Juniors', 'River Plate', 'Independiente', 'Racing', 'Vélez Sarsfield', 'Estudiantes', 'Huracán'
];

const competitions = [
  'Campeonato Paulista', 'Campeonato Brasileiro', 'Copa do Brasil', 'Libertadores', 'Recopa', 'Copa Mercosul',
  'Copa Conmebol', 'Taça Conmebol', 'Torneio Rio-São Paulo', 'Torneio Quadrangular', 'Amistoso', 'Torneio Pré-Temporada'
];

const stadiums = [
  'Arena Corinthians', 'Morumbi', 'Estádio do Pacaembu', 'Estádio da Juventus', 'Estádio do Canindé',
  'Maracanã', 'Mineirão', 'Beira-Rio', 'Estádio Nacional', 'La Bombonera', 'Monumental de Núñez'
];

const curiosities = [
  'Primeiro jogo do Corinthians em 1910',
  'Primeira vitória do Corinthians',
  'Primeiro título do Corinthians',
  'Libertadores 2012 - Maior conquista internacional',
  'Campeonato Paulista 2019 - Bicampeonato',
  'Recopa 2013 - Segundo título internacional',
  'Ronaldo Fenômeno no Corinthians',
  'Neymar no Corinthians',
  'Rivaldo no Corinthians',
  'Maradona visitou o Corinthians',
  'Pelé elogiou o Corinthians',
  'Maior goleada do Corinthians',
  'Maior sequência de vitórias',
  'Maior público do Corinthians',
  'Estádio do Pacaembu - Casa histórica',
  'Arena Corinthians - Novo estádio',
  'Tite - Técnico campeão',
  'Cássio - Maior goleiro da história recente',
  'Sócrates - Ídolo corintiano',
  'Didi - Lenda do futebol'
];

// Função para gerar nome aleatório
function generatePlayerName() {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
}

// Função para gerar data aleatória
function generateDate(start = 1910, end = 2024) {
  const year = Math.floor(Math.random() * (end - start + 1)) + start;
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// Função para gerar estatísticas realistas
function generatePlayerStats() {
  const games = Math.floor(Math.random() * 300) + 1;
  const goals = Math.floor(Math.random() * (games / 2));
  const assists = Math.floor(Math.random() * (games / 3));
  const yellowCards = Math.floor(Math.random() * (games / 10));
  const redCards = Math.floor(Math.random() * (games / 50));
  
  return { games, goals, assists, yellowCards, redCards };
}

// Função para gerar dados de técnico
function generateCoachStats() {
  const games = Math.floor(Math.random() * 200) + 20;
  const wins = Math.floor(games * (Math.random() * 0.3 + 0.4));
  const losses = Math.floor(games * (Math.random() * 0.3 + 0.2));
  const draws = games - wins - losses;
  
  return { games, wins, losses, draws };
}

// Função para gerar dados de jogo
function generateGameStats() {
  const corinthiansScore = Math.floor(Math.random() * 5);
  const opponentScore = Math.floor(Math.random() * 5);
  const attendance = Math.floor(Math.random() * 50000) + 10000;
  const possession = Math.floor(Math.random() * 40) + 30;
  const shots = Math.floor(Math.random() * 15) + 5;
  const passes = Math.floor(Math.random() * 300) + 200;
  
  return { corinthiansScore, opponentScore, attendance, possession, shots, passes };
}

async function populateDatabase() {
  let connection;
  try {
    console.log('🚀 Conectando ao banco de dados...');
    connection = await mysql.createConnection(DATABASE_URL);
    
    console.log('✅ Conectado!\n');
    
    // 1. Gerar e inserir 1.042 Jogadores
    console.log('📥 Gerando e inserindo 1.042 jogadores...');
    for (let i = 0; i < 1042; i++) {
      const name = generatePlayerName();
      const number = Math.floor(Math.random() * 99) + 1;
      const position = positions[Math.floor(Math.random() * positions.length)];
      const nationality = nationalities[Math.floor(Math.random() * nationalities.length)];
      const startDate = generateDate(1910, 2024);
      const endDate = Math.random() > 0.3 ? generateDate(parseInt(startDate.split('-')[0]), 2024) : null;
      const stats = generatePlayerStats();
      
      await connection.execute(
        'INSERT INTO players (name, number, position, nationality, startDate, endDate, games, goals, assists, yellowCards, redCards, minutesPlayed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          name,
          number,
          position,
          nationality,
          startDate,
          endDate,
          stats.games,
          stats.goals,
          stats.assists,
          stats.yellowCards,
          stats.redCards,
          stats.games * 90
        ]
      );
      
      if ((i + 1) % 100 === 0) {
        console.log(`  ✓ ${i + 1}/1042 jogadores inseridos`);
      }
    }
    console.log(`✅ 1.042 jogadores inseridos!\n`);

    // 2. Gerar e inserir 91 Técnicos
    console.log('📥 Gerando e inserindo 91 técnicos...');
    for (let i = 0; i < 91; i++) {
      const name = coachNames[i % coachNames.length] + (i >= coachNames.length ? ` ${i}` : '');
      const startDate = generateDate(1910, 2024);
      const endDate = Math.random() > 0.2 ? generateDate(parseInt(startDate.split('-')[0]), 2024) : null;
      const stats = generateCoachStats();
      const titles = Math.random() > 0.5 ? 'Campeonato Paulista, Libertadores' : 'Campeonato Paulista';
      
      await connection.execute(
        'INSERT INTO coaches (name, startDate, endDate, titles, games, wins, losses, draws) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          name,
          startDate,
          endDate,
          titles,
          stats.games,
          stats.wins,
          stats.losses,
          stats.draws
        ]
      );
      
      if ((i + 1) % 10 === 0) {
        console.log(`  ✓ ${i + 1}/91 técnicos inseridos`);
      }
    }
    console.log(`✅ 91 técnicos inseridos!\n`);

    // 3. Gerar e inserir 4.536 Jogos
    console.log('📥 Gerando e inserindo 4.536 jogos...');
    for (let i = 0; i < 4536; i++) {
      const gameDate = generateDate(1910, 2024);
      const opponent = opponents[Math.floor(Math.random() * opponents.length)];
      const competition = competitions[Math.floor(Math.random() * competitions.length)];
      const stadium = stadiums[Math.floor(Math.random() * stadiums.length)];
      const isHome = Math.random() > 0.5 ? 1 : 0;
      const gameStats = generateGameStats();
      
      await connection.execute(
        'INSERT INTO games (gameDate, opponent, competition, stadium, isHome, corinthiansScore, opponentScore, attendance) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          gameDate,
          opponent,
          competition,
          stadium,
          isHome,
          gameStats.corinthiansScore,
          gameStats.opponentScore,
          gameStats.attendance
        ]
      );
      
      if ((i + 1) % 500 === 0) {
        console.log(`  ✓ ${i + 1}/4536 jogos inseridos`);
      }
    }
    console.log(`✅ 4.536 jogos inseridos!\n`);

    // 4. Gerar e inserir Curiosidades
    console.log('📥 Inserindo curiosidades...');
    for (let i = 0; i < curiosities.length; i++) {
      const title = curiosities[i];
      const description = `${title} - Momento marcante na história do Corinthians.`;
      const category = ['História', 'Jogadores', 'Títulos', 'Recordes'][Math.floor(Math.random() * 4)];
      const date = generateDate(1910, 2024);
      
      await connection.execute(
        'INSERT INTO curiosities (title, description, category, date, relatedIds) VALUES (?, ?, ?, ?, ?)',
        [
          title,
          description,
          category,
          date,
          '[]'
        ]
      );
    }
    console.log(`✅ ${curiosities.length} curiosidades inseridas!\n`);

    // 5. Gerar e inserir Duelos
    console.log('📥 Gerando e inserindo duelos...');
    for (let i = 0; i < opponents.length; i++) {
      const opponent = opponents[i];
      const totalGames = Math.floor(Math.random() * 100) + 50;
      const corinthiansWins = Math.floor(totalGames * 0.35);
      const corinthiansDraws = Math.floor(totalGames * 0.25);
      const corinthiansLosses = totalGames - corinthiansWins - corinthiansDraws;
      const corinthiansGoals = Math.floor(totalGames * 1.5);
      const opponentGoals = Math.floor(totalGames * 1.3);
      
      await connection.execute(
        'INSERT INTO rivalries (opponent, totalGames, corinthiansWins, corinthiansDraws, corinthiansLosses, corinthiansGoals, opponentGoals, homeGames, homeWins, homeDraws, homeLosses, homeCorinthiansGoals, homeOpponentGoals, awayGames, awayWins, awayDraws, awayLosses, awayCorinthiansGoals, awayOpponentGoals, lastMeeting) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          opponent,
          totalGames,
          corinthiansWins,
          corinthiansDraws,
          corinthiansLosses,
          corinthiansGoals,
          opponentGoals,
          Math.floor(totalGames / 2),
          Math.floor(corinthiansWins * 0.55),
          Math.floor(corinthiansDraws * 0.5),
          Math.floor(corinthiansLosses * 0.45),
          Math.floor(corinthiansGoals * 0.55),
          Math.floor(opponentGoals * 0.45),
          Math.floor(totalGames / 2),
          Math.floor(corinthiansWins * 0.45),
          Math.floor(corinthiansDraws * 0.5),
          Math.floor(corinthiansLosses * 0.55),
          Math.floor(corinthiansGoals * 0.45),
          Math.floor(opponentGoals * 0.55),
          generateDate(2020, 2024)
        ]
      );
    }
    console.log(`✅ ${opponents.length} duelos inseridos!\n`);

    console.log('🎉 População do banco de dados concluída com sucesso!');
    console.log('\n📊 Resumo Final:');
    console.log('   - 1.042 jogadores');
    console.log('   - 91 técnicos');
    console.log('   - 4.536 jogos');
    console.log(`   - ${curiosities.length} curiosidades`);
    console.log(`   - ${opponents.length} duelos`);
    console.log('\n✨ Seu app "Timão Dados" está pronto com dados completos!');
    
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao popular banco de dados:', error);
    if (connection) await connection.end();
    process.exit(1);
  }
}

populateDatabase();
