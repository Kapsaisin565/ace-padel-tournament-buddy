
import React from 'react';
import { ChevronLeft, ArrowRight, Trophy, Medal, Award } from 'lucide-react';
import { PlayerStats, TournamentFormat } from '../types/tournament';
import { getCurrentStandings, getPlayerNumber } from '../utils/tournamentUtils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

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

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-500" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-slate-400 font-bold">{rank}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-60 h-60 bg-lime-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-60 h-60 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg p-4 flex items-center justify-between border-b border-white/20 relative z-10">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-xl transition-colors"
        >
          <ChevronLeft size={24} className="text-white" />
        </button>
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-lime-400">Tournament Leaderboard</h2>
          <p className="text-sm text-slate-400">After Round {currentRound} • {format.charAt(0).toUpperCase() + format.slice(1)} Format</p>
        </div>
        <div className="w-10" />
      </div>

      <div className="p-4 md:p-6 relative z-10">
        {/* Leaderboard Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
          <div className="p-4 md:p-6 border-b border-white/20">
            <h3 className="text-lg md:text-xl font-bold text-lime-400 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Current Standings
            </h3>
          </div>
          
          {/* Mobile View */}
          <div className="block md:hidden">
            <div className="space-y-2 p-4">
              {standings.map((item, index) => (
                <div key={item.player} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getRankIcon(item.rank)}
                      <div>
                        <p className="text-white font-bold text-sm">
                          <span className="text-lime-400 mr-1">{getPlayerNumber(item.player, players)}.</span>
                          {item.player}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-lime-400">{item.points || 0}</p>
                      <p className="text-xs text-slate-400">points</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">
                      {item.won}W - {item.lost}L - {item.tied || 0}T
                    </span>
                    <span className="text-slate-400">
                      {item.played} played
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="border-white/20 hover:bg-white/5">
                  <TableHead className="text-lime-400 font-bold w-16">Rank</TableHead>
                  <TableHead className="text-lime-400 font-bold">Player Name</TableHead>
                  <TableHead className="text-lime-400 font-bold text-center">Win-Lose-Tie</TableHead>
                  <TableHead className="text-lime-400 font-bold text-center">Games</TableHead>
                  <TableHead className="text-lime-400 font-bold text-center">Points</TableHead>
                  <TableHead className="text-lime-400 font-bold text-center">Win Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {standings.map((item, index) => (
                  <TableRow 
                    key={item.player} 
                    className={`border-white/10 hover:bg-white/5 transition-colors ${
                      index < 3 ? 'bg-white/5' : ''
                    }`}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center justify-center">
                        {getRankIcon(item.rank)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span className="text-lime-400 font-bold">
                          {getPlayerNumber(item.player, players)}.
                        </span>
                        <span className="text-white font-medium">{item.player}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-white font-mono">
                        {item.won}W - {item.lost}L - {item.tied || 0}T
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-slate-300">
                      {item.played}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-lime-400 font-bold text-lg">
                        {item.points || 0}
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-slate-300">
                      {item.played > 0 ? `${((item.won / item.played) * 100).toFixed(0)}%` : '0%'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Performance Summary for Mexicano */}
        {format === 'mexicano' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-6 mt-6 border border-white/20 shadow-xl">
            <h3 className="text-lg font-bold text-lime-400 mb-4">Performance Tiers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-300 font-medium mb-2">Top Performers:</p>
                <div className="space-y-1">
                  {standings.slice(0, Math.ceil(standings.length / 2)).map((player, idx) => (
                    <p key={player.player} className="text-lime-400">
                      {idx + 1}. {player.player} ({player.points} pts, {player.won}W-{player.lost}L-{player.tied || 0}T)
                    </p>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-slate-300 font-medium mb-2">Bottom Half:</p>
                <div className="space-y-1">
                  {standings.slice(Math.ceil(standings.length / 2)).map((player, idx) => (
                    <p key={player.player} className="text-slate-400">
                      {Math.ceil(standings.length / 2) + idx + 1}. {player.player} ({player.points} pts, {player.won}W-{player.lost}L-{player.tied || 0}T)
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 space-y-4">
          <button
            onClick={onNextRound}
            className="w-full py-4 md:py-5 bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-slate-900 rounded-2xl font-bold transition-all duration-200 flex items-center justify-center gap-3 shadow-2xl transform hover:scale-[1.02]"
          >
            Start Round {currentRound + 1}
            {format === 'mexicano' && <span className="text-sm opacity-75 hidden md:inline">(Mexicano Pairing)</span>}
            <ArrowRight size={20} />
          </button>
          
          <button
            onClick={onBack}
            className="w-full px-6 md:px-8 py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl font-medium transition-all duration-200 border border-white/20 backdrop-blur-lg"
          >
            Back to Current Round
          </button>
        </div>
      </div>
    </div>
  );
};

export default StandingsView;
