
import React from 'react';
import { useTournament } from '../hooks/useTournament';
import WelcomeScreen from '../components/WelcomeScreen';
import FormatSelection from '../components/FormatSelection';
import ScoreSelection from '../components/ScoreSelection';
import CourtSelection from '../components/CourtSelection';
import PlayerInput from '../components/PlayerInput';
import MatchScoring from '../components/MatchScoring';
import TournamentMain from '../components/TournamentMain';
import StandingsView from '../components/StandingsView';

const Index = () => {
  const tournament = useTournament();

  // Welcome Screen
  if (tournament.currentStep === 'welcome') {
    return (
      <WelcomeScreen
        tournamentName={tournament.tournamentName}
        setTournamentName={tournament.setTournamentName}
        onNext={() => tournament.setCurrentStep('format')}
      />
    );
  }

  // Format Selection
  if (tournament.currentStep === 'format') {
    return (
      <FormatSelection
        onBack={() => tournament.setCurrentStep('welcome')}
        onFormatSelect={(format) => {
          tournament.setFormat(format);
          tournament.setCurrentStep('score');
        }}
      />
    );
  }

  // Score Limit Selection
  if (tournament.currentStep === 'score') {
    return (
      <ScoreSelection
        onBack={() => tournament.setCurrentStep('format')}
        onScoreSelect={(score) => {
          tournament.setScoreLimit(score);
          tournament.setCurrentStep('courts');
        }}
      />
    );
  }

  // Court Count Selection
  if (tournament.currentStep === 'courts') {
    return (
      <CourtSelection
        onBack={() => tournament.setCurrentStep('score')}
        onCourtSelect={(count) => {
          tournament.setCourtCount(count);
          tournament.setCurrentStep('players');
        }}
      />
    );
  }

  // Player Input
  if (tournament.currentStep === 'players') {
    return (
      <PlayerInput
        players={tournament.players}
        setPlayers={tournament.setPlayers}
        newPlayerName={tournament.newPlayerName}
        setNewPlayerName={tournament.setNewPlayerName}
        onBack={() => tournament.setCurrentStep('courts')}
        onStartTournament={tournament.startTournament}
      />
    );
  }

  // Match Scoring View
  if (tournament.selectedMatch) {
    return (
      <MatchScoring
        selectedMatch={tournament.selectedMatch}
        matches={tournament.matches}
        players={tournament.players}
        scoreLimit={tournament.scoreLimit}
        currentRound={tournament.currentRound}
        tournamentName={tournament.tournamentName}
        setMatches={tournament.setMatches}
        setSelectedMatch={tournament.setSelectedMatch}
        setShowScorePicker={tournament.setShowScorePicker}
        showScorePicker={tournament.showScorePicker}
        finishMatch={tournament.finishMatch}
      />
    );
  }

  // Standings View
  if (tournament.showStandings) {
    return (
      <StandingsView
        playerStats={tournament.playerStats}
        players={tournament.players}
        format={tournament.format}
        currentRound={tournament.currentRound}
        tournamentName={tournament.tournamentName}
        onBack={() => tournament.setShowStandings(false)}
        onNextRound={tournament.nextRound}
      />
    );
  }

  // Tournament Main View
  if (tournament.currentStep === 'tournament') {
    return (
      <TournamentMain
        matches={tournament.matches}
        currentRound={tournament.currentRound}
        tournamentName={tournament.tournamentName}
        setSelectedMatch={tournament.setSelectedMatch}
        setShowStandings={tournament.setShowStandings}
        onNextRound={tournament.nextRound}
      />
    );
  }

  return null;
};

export default Index;
