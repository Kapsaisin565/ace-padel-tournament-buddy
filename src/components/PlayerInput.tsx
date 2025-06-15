
import React from 'react';
import { ChevronLeft, Plus, X, Play } from 'lucide-react';

interface PlayerInputProps {
  players: string[];
  setPlayers: (players: string[]) => void;
  newPlayerName: string;
  setNewPlayerName: (name: string) => void;
  onBack: () => void;
  onStartTournament: () => void;
}

const PlayerInput: React.FC<PlayerInputProps> = ({
  players,
  setPlayers,
  newPlayerName,
  setNewPlayerName,
  onBack,
  onStartTournament
}) => {
  const addPlayer = () => {
    if (newPlayerName.trim()) {
      setPlayers([...players, newPlayerName.trim()]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-lime-400/5 rounded-full blur-3xl animate-pulse"></div>
      </div>
      
      <button 
        onClick={onBack} 
        className="mb-8 text-slate-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10 relative z-10"
      >
        <ChevronLeft size={24} />
      </button>
      
      <div className="max-w-md mx-auto relative z-10">
        <h2 className="text-4xl font-bold text-white mb-2">Add Players</h2>
        <p className="text-slate-400 mb-8">Minimum 4 players required</p>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-5 mb-6 border border-white/20 shadow-xl">
          <div className="flex gap-3">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addPlayer();
                }
              }}
              className="flex-1 bg-white/10 backdrop-blur-sm text-white rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-lime-400 border border-white/20 placeholder-slate-400 transition-all duration-200"
              placeholder="Enter player name"
            />
            <button
              onClick={addPlayer}
              className="bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-slate-900 p-4 rounded-2xl transition-all duration-200 transform hover:scale-[1.05] shadow-xl"
            >
              <Plus size={20} strokeWidth={3} />
            </button>
          </div>
        </div>
        
        <div className="space-y-3 mb-8 max-h-64 overflow-y-auto">
          {players.map((player, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 flex items-center justify-between border border-white/20 shadow-xl transform hover:scale-[1.02] transition-all duration-200">
              <span className="text-white font-medium">
                <span className="text-lime-400 mr-3 font-bold">{index + 1}.</span>
                {player}
              </span>
              <button
                onClick={() => removePlayer(index)}
                className="text-red-400 hover:text-red-300 p-2 rounded-xl hover:bg-red-400/10 transition-all duration-200"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
        
        {players.length >= 4 && (
          <button
            onClick={onStartTournament}
            className="w-full bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-slate-900 font-bold py-5 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 shadow-2xl"
          >
            <Play size={20} strokeWidth={3} />
            Start Tournament
          </button>
        )}
      </div>
    </div>
  );
};

export default PlayerInput;
