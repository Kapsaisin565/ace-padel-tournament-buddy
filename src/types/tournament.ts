
export interface Player {
  name: string;
}

export interface TeamScore {
  player1: string;
  player2: string;
  score: number;
}

export interface Match {
  id: number;
  court: number;
  team1: TeamScore;
  team2: TeamScore;
  status: 'waiting' | 'playing' | 'finished';
  round: number;
}

export interface PlayerStats {
  points: number;
  played: number;
  won: number;
  lost: number;
  roundDetails: RoundDetail[];
}

export interface RoundDetail {
  round: number;
  score: number;
  opponentScore: number;
  won: boolean;
  partner: string;
  opponents: string[];
}

export interface PlayerStanding {
  player: string;
  rank: number;
  points: number;
  played: number;
  won: number;
  lost: number;
  roundDetails: RoundDetail[];
}

export interface RoundResult {
  round: number;
  matches: Match[];
  playerStats: Record<string, PlayerStats>;
}

export type TournamentFormat = 'mexicano' | 'americano';
export type TournamentStep = 'welcome' | 'format' | 'score' | 'courts' | 'players' | 'tournament';
