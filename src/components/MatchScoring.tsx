
import React from 'react';
import { ChevronLeft, X, Check } from 'lucide-react';
import { Match } from '../types/tournament';
import PadelIcon from './PadelIcon';

interface MatchScoringProps {
  selectedMatch: number;
  matches: Match[];
  players: string[];
  scoreLimit: number;
  currentRound: number;
  tournamentName: string;
  setMatches: (matches: Match[]) => void;
  setSelectedMatch: (id: number | null) => void;
  setShowScorePicker: (picker: number | null) => void;
  showScorePicker: number | null;
  finishMatch: (match: Match) => void;
}

const MatchScoring: React.FC<MatchScoringProps> = ({
  selectedMatch,
  matches,
  scoreLimit,
  currentRound,
  tournamentName,
  setMatches,
  setSelectedMatch,
  setShowScorePicker,
  showScorePicker,
  finishMatch
}) => {
  const match = matches.find(m => m.id === selectedMatch);
  if (!match) return null;

  const currentRoundMatches = matches.filter(m => m.round === currentRound);

  const setScore = (team: number, score: number) => {
    setMatches(matches.map(m => {
      if (m.id === selectedMatch) {
        const newMatch = { ...m };
        
        if (team === 1) {
          newMatch.team1.score = score;
          newMatch.team2.score = scoreLimit - score;
        } else {
          newMatch.team2.score = score;
          newMatch.team1.score = scoreLimit - score;
        }
        
        if (newMatch.status === 'waiting' && (newMatch.team1.score > 0 || newMatch.team2.score > 0)) {
          newMatch.status = 'playing';
        }
        
        return newMatch;
      }
      return m;
    }));
    setShowScorePicker(null);
  };

  const NumberGrid = ({ team }: { team: number }) => {
    const numbers = Array.from({ length: scoreLimit + 1 }, (_, i) => i);
    
    return (
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-sm w-full border border-white/20 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-white">
              Score for {team === 1 ? `${match.team1.player1} & ${match.team1.player2}` : `${match.team2.player1} & ${match.team2.player2}`}
            </h3>
            <button 
              onClick={() => setShowScorePicker(null)}
              className="text-slate-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="grid grid-cols-6 gap-2">
            {numbers.map(num => (
              <button
                key={num}
                onClick={() => setScore(team, num)}
                className={`p-4 rounded-2xl font-bold transition-all duration-200 ${
                  (team === 1 ? match.team1.score : match.team2.score) === num
                    ? 'bg-gradient-to-r from-lime-400 to-green-500 text-slate-900 shadow-xl'
                    : 'bg-white/10 hover:bg-white/15 text-white border border-white/20'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-60 h-60 bg-lime-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-60 h-60 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="bg-white/10 backdrop-blur-lg p-4 flex items-center justify-between border-b border-white/20 relative z-10">
        <button 
          onClick={() => {
            setSelectedMatch(null);
            setShowScorePicker(null);
          }}
          className="p-2 hover:bg-white/10 rounded-xl transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-lime-400">
            {match.team1.player1} & {match.team1.player2} vs {match.team2.player1} & {match.team2.player2}
          </h2>
          <p className="text-sm text-slate-400 mt-1">Round {currentRound} • {tournamentName}</p>
        </div>
        <button 
          onClick={() => {
            setMatches(matches.map(m => 
              m.id === selectedMatch 
                ? { ...m, team1: { ...m.team1, score: 0 }, team2: { ...m.team2, score: 0 }, status: 'waiting' as const }
                : m
            ));
          }}
          className="p-2 hover:bg-white/10 rounded-xl transition-colors"
        >
          <span className="text-sm font-medium text-slate-400">Reset</span>
        </button>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6 relative z-10">
        <div className="w-full max-w-lg">
          {/* Court Info */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <PadelIcon size={80} className="text-slate-600" />
            </div>
            <span className="text-slate-300 text-lg font-bold bg-white/10 backdrop-blur-lg px-8 py-3 rounded-full border border-white/20">Court {match.court}</span>
            
            {/* Court Navigation */}
            {currentRoundMatches.length > 1 && (
              <div className="mt-6 flex justify-center gap-3">
                <span className="text-slate-500 text-sm mr-2">Go to court:</span>
                {currentRoundMatches.map((m, idx) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedMatch(m.id);
                      setShowScorePicker(null);
                    }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      m.id === selectedMatch 
                        ? 'bg-gradient-to-r from-lime-400 to-green-500 text-slate-900' 
                        : 'bg-white/10 text-slate-400 hover:bg-white/15 border border-white/20'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Score Display */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 mb-8 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-center gap-10">
              {/* Team 1 */}
              <div className="text-center">
                <div className="mb-6">
                  <p className="text-white font-medium text-sm mb-1">
                    {match.team1.player1}
                  </p>
                  <p className="text-white font-medium text-sm">
                    {match.team1.player2}
                  </p>
                </div>
                <button
                  onClick={() => setShowScorePicker(1)}
                  className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-3xl w-40 h-32 flex items-center justify-center transition-all duration-200 shadow-2xl transform hover:scale-105"
                >
                  <span className="text-8xl font-bold">{match.team1.score}</span>
                </button>
              </div>

              <div className="text-slate-500 font-bold text-3xl">vs</div>

              {/* Team 2 */}
              <div className="text-center">
                <div className="mb-6">
                  <p className="text-white font-medium text-sm mb-1">
                    {match.team2.player1}
                  </p>
                  <p className="text-white font-medium text-sm">
                    {match.team2.player2}
                  </p>
                </div>
                <button
                  onClick={() => setShowScorePicker(2)}
                  className="bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-3xl w-40 h-32 flex items-center justify-center transition-all duration-200 shadow-2xl transform hover:scale-105"
                >
                  <span className="text-8xl font-bold">{match.team2.score}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Status Display and Action Buttons */}
          {match.status === 'playing' && (
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-3 px-8 py-4 bg-lime-400/10 backdrop-blur-lg text-lime-400 rounded-full text-sm font-medium border border-lime-400/20 mb-6">
                <span className="w-3 h-3 bg-lime-400 rounded-full animate-pulse"></span>
                Match in Progress
              </span>
              
              {/* Finish Match Button */}
              <button 
                onClick={() => finishMatch(match)}
                className="w-full px-10 py-4 bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-slate-900 rounded-2xl font-bold transition-all duration-200 shadow-xl flex items-center justify-center gap-3"
              >
                <Check size={20} />
                Finish Match
              </button>
            </div>
          )}

          {match.status === 'waiting' && (match.team1.score > 0 || match.team2.score > 0) && (
            <div className="text-center mb-6">
              <button 
                onClick={() => finishMatch(match)}
                className="w-full px-10 py-4 bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-slate-900 rounded-2xl font-bold transition-all duration-200 shadow-xl flex items-center justify-center gap-3"
              >
                <Check size={20} />
                Finish Match
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Score Picker Modal */}
      {showScorePicker && <NumberGrid team={showScorePicker} />}
    </div>
  );
};

export default MatchScoring;
