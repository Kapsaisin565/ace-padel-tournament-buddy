
import { Match, PlayerStats, PlayerStanding, TournamentFormat } from '../types/tournament';

export const getPlayerNumber = (playerName: string, players: string[]): number => {
  return players.indexOf(playerName) + 1;
};

export const getCurrentStandings = (playerStats: Record<string, PlayerStats>, players: string[]): PlayerStanding[] => {
  const allPlayerStats = { ...playerStats };
  players.forEach(player => {
    if (!allPlayerStats[player]) {
      allPlayerStats[player] = { points: 0, played: 0, won: 0, lost: 0, roundDetails: [] };
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
    // Use current standings for better pairing
    const standings = getCurrentStandings(playerStats, players);
    const rankedPlayers = standings.map(s => s.player);
    
    // Create balanced teams based on current rankings
    for (let i = 0; i < rankedPlayers.length; i += 4) {
      if (i + 3 < rankedPlayers.length) {
        // Mix rankings: 1st + 4th vs 2nd + 3rd pattern
        const topPlayer = rankedPlayers[i];
        const secondPlayer = rankedPlayers[i + 1];
        const thirdPlayer = rankedPlayers[i + 2];
        const bottomPlayer = rankedPlayers[i + 3];
        
        pairings.push({
          id: pairings.length + 1,
          court: courtAssignment,
          team1: { player1: topPlayer, player2: bottomPlayer, score: 0 },
          team2: { player1: secondPlayer, player2: thirdPlayer, score: 0 },
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
  
  // Update points and games for all players with round details
  [match.team1.player1, match.team1.player2].forEach(player => {
    if (!newStats[player]) {
      newStats[player] = { points: 0, played: 0, won: 0, lost: 0, roundDetails: [] };
    }
    if (!newStats[player].roundDetails) newStats[player].roundDetails = [];
    newStats[player].points += match.team1.score;
    newStats[player].played += 1;
    newStats[player][team1Won ? 'won' : 'lost'] += 1;
    
    // Add round detail
    newStats[player].roundDetails.push({
      round: match.round,
      score: match.team1.score,
      opponentScore: match.team2.score,
      won: team1Won,
      partner: match.team1.player1 === player ? match.team1.player2 : match.team1.player1,
      opponents: [match.team2.player1, match.team2.player2]
    });
  });
  
  [match.team2.player1, match.team2.player2].forEach(player => {
    if (!newStats[player]) {
      newStats[player] = { points: 0, played: 0, won: 0, lost: 0, roundDetails: [] };
    }
    if (!newStats[player].roundDetails) newStats[player].roundDetails = [];
    newStats[player].points += match.team2.score;
    newStats[player].played += 1;
    newStats[player][team1Won ? 'lost' : 'won'] += 1;
    
    // Add round detail
    newStats[player].roundDetails.push({
      round: match.round,
      score: match.team2.score,
      opponentScore: match.team1.score,
      won: !team1Won,
      partner: match.team2.player1 === player ? match.team2.player2 : match.team2.player1,
      opponents: [match.team1.player1, match.team1.player2]
    });
  });
  
  return newStats;
};
