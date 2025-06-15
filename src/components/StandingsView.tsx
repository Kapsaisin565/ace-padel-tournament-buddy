
import React from 'react';
import { ChevronLeft, ArrowRight } from 'lucide-react';
import { PlayerStats, TournamentFormat } from '../types/tournament';
import { getCurrentStandings, getPlayerNumber } from '../utils/tournamentUtils';

interface StandingsViewProps {
  playerStats: Record<string, PlayerStats>;
  players: string[];
  format: TournamentFormat;
  currentRound: number;
  tournamentName: string;
  onBack: () => void;
  onNextRound: () => void;
}

const StandingsView: React.FC<StandingsViewProps> = ({
  playerStats,
  players,
  format,
  currentRound,
  tournamentName,
  onBack,
  onNextRound
}) => {
  const standings = getCurrentStandings(playerStats, players);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-60 h-60 bg-lime-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-60 h-60 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="bg-white/10 backdrop-blur-lg p-4 flex items-center justify-between border-b border-white/20 relative z-10">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-xl transition-colors"
        >
          <ChevronLeft size={24} className="text-white" />
        </button>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-lime-400">Tournament Standings</h2>
          <p className="text-sm text-slate-400">After Round {currentRound} • {format.charAt(0).toUpperCase() + format.slice(1)} Format</p>
        </div>
        <div className="w-10" />
      </div>

      <div className="p-6 relative z-10">
        {/* Rankings Summary for Mexicano */}
        {format === 'mexicano' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20 shadow-xl">
            <h3 className="text-lg font-bold text-lime-400 mb-4">Performance Tiers</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-300 font-medium mb-2">Top Performers:</p>
                <div className="space-y-1">
                  {standings.slice(0, Math.ceil(standings.length / 2)).map((player, idx) => (
                    <p key={player.player} className="text-lime-400">
                      {idx + 1}. {player.player} ({player.points} pts)
                    </p>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-slate-300 font-medium mb-2">Bottom Half:</p>
                <div className="space-y-1">
                  {standings.slice(Math.ceil(standings.length / 2)).map((player, idx) => (
                    <p key={player.player} className="text-slate-400">
                      {Math.ceil(standings.length / 2) + idx + 1}. {player.player} ({player.points} pts)
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {standings.map((item, index) => (
            <div key={item.player} className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl transform hover:scale-[1.02] transition-all duration-200">
              <div className="p-8 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl ${
                    index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-slate-900 shadow-xl' :
                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-slate-900 shadow-xl' :
                    index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-slate-900 shadow-xl' :
                    'bg-white/10 text-slate-400 border border-white/20'
                  }`}>
                    {item.rank}
                  </div>
                  <div>
                    <p className="text-white font-bold text-xl">
                      <span className="text-lime-400 mr-2">{getPlayerNumber(item.player, players)}.</span>
                      {item.player}
                    </p>
                    <div className="flex gap-4 text-slate-400 text-sm font-medium">
                      <span>{item.won}W - {item.lost}L</span>
                      <span>•</span>
                      <span>{item.played} played</span>
                      {item.played > 0 && (
                        <>
                          <span>•</span>
                          <span>{((item.won / item.played) * 100).toFixed(0)}% win rate</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-lime-400">{item.points || 0}</p>
                  <p className="text-slate-400 text-sm font-medium">points</p>
                </div>
              </div>
              
              {/* Round Details */}
              {item.roundDetails && item.roundDetails.length > 0 && (
                <div className="px-8 pb-8">
                  <div className="bg-white/5 rounded-2xl p-4">
                    <h4 className="text-slate-300 text-sm font-medium mb-3">Round History</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {item.roundDetails.map((detail, idx) => (
                        <div key={idx} className={`p-3 rounded-xl text-xs ${
                          detail.won ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                        }`}>
                          <div className="font-medium">R{detail.round}: {detail.score}-{detail.opponentScore}</div>
                          <div className="text-xs opacity-75">vs {detail.opponents.join(' & ')}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={onNextRound}
            className="w-full py-5 bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-slate-900 rounded-2xl font-bold transition-all duration-200 flex items-center justify-center gap-3 shadow-2xl transform hover:scale-[1.02]"
          >
            Start Round {currentRound + 1}
            {format === 'mexicano' && <span className="text-sm opacity-75">(Mexicano Pairing)</span>}
            <ArrowRight size={20} />
          </button>
          
          <button
            onClick={onBack}
            className="w-full px-8 py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl font-medium transition-all duration-200 border border-white/20 backdrop-blur-lg"
          >
            Back to Current Round
          </button>
        </div>
      </div>
    </div>
  );
};

export default StandingsView;
