
import React from 'react';
import { Trophy, ArrowRight } from 'lucide-react';
import { Match } from '../types/tournament';

interface TournamentMainProps {
  matches: Match[];
  currentRound: number;
  tournamentName: string;
  setSelectedMatch: (id: number) => void;
  setShowStandings: (show: boolean) => void;
  onNextRound: () => void;
}

const TournamentMain: React.FC<TournamentMainProps> = ({
  matches,
  currentRound,
  tournamentName,
  setSelectedMatch,
  setShowStandings,
  onNextRound
}) => {
  const currentMatches = matches.filter(m => m.round === currentRound);
  const finishedMatches = currentMatches.filter(m => m.status === 'finished').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-40 h-40 bg-lime-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="bg-white/10 backdrop-blur-lg p-4 flex items-center justify-between border-b border-white/20 relative z-10">
        <div className="flex justify-between items-center">
          <div className="w-24"></div>
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-lime-400">Round {currentRound}</h1>
            <p className="text-slate-400 text-sm mt-1">{tournamentName}</p>
          </div>
          <button 
            onClick={() => setShowStandings(true)}
            className="bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-slate-900 px-6 py-3 rounded-2xl font-bold transition-all duration-200 flex items-center gap-2 transform hover:scale-105 shadow-xl"
          >
            <Trophy size={18} />
            Standings
          </button>
        </div>
      </div>

      <div className="p-6 relative z-10">
        {/* Progress Indicator */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-300 text-sm font-medium">Match Progress</span>
            <span className="text-lime-400 font-bold text-lg">{finishedMatches}/{currentMatches.length}</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-lime-400 to-green-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${currentMatches.length > 0 ? (finishedMatches / currentMatches.length) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Match List */}
        <div className="space-y-6 mb-8">
          {currentMatches.map((match) => (
            <div key={match.id} className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl overflow-hidden">
              <button
                onClick={() => setSelectedMatch(match.id)}
                className="w-full p-8 hover:bg-white/15 transition-all duration-200 rounded-3xl"
              >
                <div className="mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm font-medium">Court {match.court}</span>
                    <span className={`w-3 h-3 rounded-full ${
                      match.status === 'playing' ? 'bg-lime-400 animate-pulse' : 
                      match.status === 'finished' ? 'bg-green-500' : 
                      'bg-slate-700'
                    }`} />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-6">
                  {/* Team 1 */}
                  <div className="flex-1 text-left">
                    <p className="text-white font-medium text-lg">
                      {match.team1.player1} & {match.team1.player2}
                    </p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm text-white min-w-[60px] h-14 rounded-2xl flex items-center justify-center border border-white/20">
                    <span className="text-2xl font-bold">{match.team1.score}</span>
                  </div>

                  <div className="text-slate-500 text-sm font-medium">vs</div>

                  <div className="bg-white/10 backdrop-blur-sm text-white min-w-[60px] h-14 rounded-2xl flex items-center justify-center border border-white/20">
                    <span className="text-2xl font-bold">{match.team2.score}</span>
                  </div>

                  {/* Team 2 */}
                  <div className="flex-1 text-right">
                    <p className="text-white font-medium text-lg">
                      {match.team2.player1} & {match.team2.player2}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Only Next Round Button */}
        <button
          onClick={onNextRound}
          className="w-full py-5 bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-slate-900 rounded-2xl font-bold transition-all duration-200 flex items-center justify-center gap-3 shadow-2xl transform hover:scale-[1.02]"
        >
          Next Round ({currentRound + 1})
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default TournamentMain;
