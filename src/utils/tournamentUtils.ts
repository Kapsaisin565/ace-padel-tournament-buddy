import { Match, PlayerStats, PlayerStanding, TournamentFormat } from '../types/tournament';

export const getPlayerNumber = (playerName: string, players: string[]): number => {
  return players.indexOf(playerName) + 1;
};

export const getCurrentStandings = (playerStats: Record<string, PlayerStats>, players: string[]): PlayerStanding[] => {
  const allPlayerStats = { ...playerStats };
  players.forEach(player => {
    if (!allPlayerStats[player]) {
      allPlayerStats[player] = { points: 0, played: 0, won: 0, lost: 0, tied: 0, roundDetails: [] };
    }
  });

  return Object.entries(allPlayerStats)
    .sort(([,a], [,b]) => {
      const aStats = a as PlayerStats;
      const bStats = b as PlayerStats;
      
      // Primary sort: total points
      const aPoints = aStats?.points || 0;
      const bPoints = bStats?.points || 0;
      if (bPoints !== aPoints) return bPoints - aPoints;
      
      // Secondary sort: win percentage
      const aWinRate = (aStats?.played || 0) > 0 ? (aStats?.won || 0) / (aStats?.played || 0) : 0;
      const bWinRate = (bStats?.played || 0) > 0 ? (bStats?.won || 0) / (bStats?.played || 0) : 0;
      if (bWinRate !== aWinRate) return bWinRate - aWinRate;
      
      // Tertiary sort: games played (more games = lower rank if tied)
      return (aStats?.played || 0) - (bStats?.played || 0);
    })
    .map(([player, stats], index) => ({ 
      player,
      rank: index + 1,
      ...(stats as PlayerStats)
    }));
};

export const generatePairings = (
  round: number, 
  format: TournamentFormat, 
  players: string[], 
  courtCount: number, 
  playerStats: Record<string, PlayerStats>
): Match[] => {
  if (format === 'americano') {
    return generateAmericanoPairings(round, players, courtCount);
  } else {
    return generateMexicanoPairings(round, players, courtCount, playerStats);
  }
};

const generateAmericanoPairings = (round: number, players: string[], courtCount: number): Match[] => {
  const n = players.length;
  const pairings: Match[] = [];
  let courtAssignment = 1;
  
  // Create a rotation matrix for better pairing distribution
  for (let i = 0; i < n; i += 4) {
    if (i + 3 < n) {
      const roundOffset = ((round - 1) % n) * 2;
      const p1Index = (i + roundOffset) % n;
      const p2Index = (i + 1 + roundOffset) % n;
      const p3Index = (i + 2 + roundOffset) % n;
      const p4Index = (i + 3 + roundOffset) % n;
      
      // Ensure different pairing each round
      const team1p1 = players[p1Index];
      const team1p2 = players[p3Index]; // Cross pairing for variety
      const team2p1 = players[p2Index];
      const team2p2 = players[p4Index];
      
      pairings.push({
        id: pairings.length + 1,
        court: courtAssignment,
        team1: { player1: team1p1, player2: team1p2, score: 0 },
        team2: { player1: team2p1, player2: team2p2, score: 0 },
        status: 'waiting',
        round: round
      });
      
      courtAssignment = (courtAssignment % courtCount) + 1;
    }
  }
  
  return pairings;
};

const generateMexicanoPairings = (
  round: number, 
  players: string[], 
  courtCount: number, 
  playerStats: Record<string, PlayerStats>
): Match[] => {
  const pairings: Match[] = [];
  let courtAssignment = 1;
  
  if (round === 1) {
    // First round is random but organized
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    for (let i = 0; i < shuffled.length; i += 4) {
      if (i + 3 < shuffled.length) {
        pairings.push({
          id: pairings.length + 1,
          court: courtAssignment,
          team1: { player1: shuffled[i], player2: shuffled[i + 1], score: 0 },
          team2: { player1: shuffled[i + 2], player2: shuffled[i + 3], score: 0 },
          status: 'waiting',
          round: round
        });
        
        courtAssignment = (courtAssignment % courtCount) + 1;
      }
    }
  } else {
    // For Mexicano format, create proper rotation where players change partners and opponents
    // Use a systematic rotation pattern based on round number
    const n = players.length;
    
    for (let i = 0; i < n; i += 4) {
      if (i + 3 < n) {
        // Create rotation based on round - this ensures different partnerships each round
        const rotationOffset = (round - 1) % 3; // For 4 players, there are 3 possible unique pairings
        
        let team1p1, team1p2, team2p1, team2p2;
        
        switch (rotationOffset) {
          case 0: // Round 1 pattern: (0,1) vs (2,3)
            team1p1 = players[i];
            team1p2 = players[i + 1];
            team2p1 = players[i + 2];
            team2p2 = players[i + 3];
            break;
          case 1: // Round 2 pattern: (2,0) vs (1,3) - fixed to get h & n vs b & m
            team1p1 = players[i + 2]; // h (3rd player)
            team1p2 = players[i]; // n (1st player)  
            team2p1 = players[i + 1]; // b (2nd player)
            team2p2 = players[i + 3]; // m (4th player)
            break;
          case 2: // Round 3 pattern: (0,3) vs (1,2)
            team1p1 = players[i];
            team1p2 = players[i + 3];
            team2p1 = players[i + 1];
            team2p2 = players[i + 2];
            break;
          default:
            team1p1 = players[i];
            team1p2 = players[i + 1];
            team2p1 = players[i + 2];
            team2p2 = players[i + 3];
        }
        
        pairings.push({
          id: pairings.length + 1,
          court: courtAssignment,
          team1: { player1: team1p1, player2: team1p2, score: 0 },
          team2: { player1: team2p1, player2: team2p2, score: 0 },
          status: 'waiting',
          round: round
        });
        
        courtAssignment = (courtAssignment % courtCount) + 1;
      }
    }
  }
  
  return pairings;
};

export const updatePlayerStats = (match: Match, playerStats: Record<string, PlayerStats>): Record<string, PlayerStats> => {
  const newStats = { ...playerStats };
  const team1Won = match.team1.score > match.team2.score;
  const isTie = match.team1.score === match.team2.score;
  
  // Update points and games for all players with round details
  [match.team1.player1, match.team1.player2].forEach(player => {
    if (!newStats[player]) {
      newStats[player] = { points: 0, played: 0, won: 0, lost: 0, tied: 0, roundDetails: [] };
    }
    if (!newStats[player].roundDetails) newStats[player].roundDetails = [];
    newStats[player].points += match.team1.score;
    newStats[player].played += 1;
    
    if (isTie) {
      newStats[player].tied += 1;
    } else {
      newStats[player][team1Won ? 'won' : 'lost'] += 1;
    }
    
    // Add round detail
    newStats[player].roundDetails.push({
      round: match.round,
      score: match.team1.score,
      opponentScore: match.team2.score,
      won: team1Won && !isTie,
      tied: isTie,
      partner: match.team1.player1 === player ? match.team1.player2 : match.team1.player1,
      opponents: [match.team2.player1, match.team2.player2]
    });
  });
  
  [match.team2.player1, match.team2.player2].forEach(player => {
    if (!newStats[player]) {
      newStats[player] = { points: 0, played: 0, won: 0, lost: 0, tied: 0, roundDetails: [] };
    }
    if (!newStats[player].roundDetails) newStats[player].roundDetails = [];
    newStats[player].points += match.team2.score;
    newStats[player].played += 1;
    
    if (isTie) {
      newStats[player].tied += 1;
    } else {
      newStats[player][team1Won ? 'lost' : 'won'] += 1;
    }
    
    // Add round detail
    newStats[player].roundDetails.push({
      round: match.round,
      score: match.team2.score,
      opponentScore: match.team1.score,
      won: !team1Won && !isTie,
      tied: isTie,
      partner: match.team2.player1 === player ? match.team2.player2 : match.team2.player1,
      opponents: [match.team1.player1, match.team1.player2]
    });
  });
  
  return newStats;
};
