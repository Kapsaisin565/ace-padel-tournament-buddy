
import { useState, useEffect } from 'react';
import { TournamentStep, TournamentFormat, Match, PlayerStats, RoundResult } from '../types/tournament';
import { generatePairings, updatePlayerStats } from '../utils/tournamentUtils';

export const useTournament = () => {
  // Tournament setup states
  const [currentStep, setCurrentStep] = useState<TournamentStep>('welcome');
  const [tournamentName, setTournamentName] = useState('');
  const [format, setFormat] = useState<TournamentFormat>('mexicano');
  const [scoreLimit, setScoreLimit] = useState(0);
  const [courtCount, setCourtCount] = useState(0);
  const [players, setPlayers] = useState<string[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  
  // Tournament play states
  const [currentRound, setCurrentRound] = useState(1);
  const [matches, setMatches] = useState<Match[]>([]);
  const [playerStats, setPlayerStats] = useState<Record<string, PlayerStats>>({});
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  const [showStandings, setShowStandings] = useState(false);
  const [showScorePicker, setShowScorePicker] = useState<number | null>(null);
  const [roundHistory, setRoundHistory] = useState<RoundResult[]>([]);

  // Initialize player stats when players are added
  useEffect(() => {
    const stats: Record<string, PlayerStats> = {};
    players.forEach(player => {
      stats[player] = { points: 0, played: 0, won: 0, lost: 0, roundDetails: [] };
    });
    setPlayerStats(stats);
  }, [players]);

  const startTournament = () => {
    const firstRoundMatches = generatePairings(1, format, players, courtCount, playerStats);
    setMatches(firstRoundMatches);
    setCurrentStep('tournament');
  };

  const finishMatch = (match: Match) => {
    const updatedMatch = { ...match, status: 'finished' as const };
    const newStats = updatePlayerStats(updatedMatch, playerStats);
    setPlayerStats(newStats);
    
    setMatches(prev => prev.map(m => 
      m.id === selectedMatch ? updatedMatch : m
    ));
    
    setSelectedMatch(null);
    setShowScorePicker(null);
  };

  const nextRound = () => {
    // Save current round results
    const currentRoundMatches = matches.filter(m => m.round === currentRound);
    const roundResults: RoundResult = {
      round: currentRound,
      matches: currentRoundMatches,
      playerStats: { ...playerStats }
    };
    setRoundHistory(prev => [...prev, roundResults]);
    
    const nextRoundNumber = currentRound + 1;
    setCurrentRound(nextRoundNumber);
    const nextMatches = generatePairings(nextRoundNumber, format, players, courtCount, playerStats);
    setMatches([...matches, ...nextMatches]); // Keep all matches for history
    setShowStandings(false);
  };

  return {
    // Setup states
    currentStep,
    setCurrentStep,
    tournamentName,
    setTournamentName,
    format,
    setFormat,
    scoreLimit,
    setScoreLimit,
    courtCount,
    setCourtCount,
    players,
    setPlayers,
    newPlayerName,
    setNewPlayerName,
    
    // Play states
    currentRound,
    setCurrentRound,
    matches,
    setMatches,
    playerStats,
    setPlayerStats,
    selectedMatch,
    setSelectedMatch,
    showStandings,
    setShowStandings,
    showScorePicker,
    setShowScorePicker,
    roundHistory,
    setRoundHistory,
    
    // Actions
    startTournament,
    finishMatch,
    nextRound
  };
};
