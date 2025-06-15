
import React from 'react';
import { ChevronRight } from 'lucide-react';
import PadelIcon from './PadelIcon';

interface WelcomeScreenProps {
  tournamentName: string;
  setTournamentName: (name: string) => void;
  onNext: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  tournamentName,
  setTournamentName,
  onNext
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-lime-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-lime-400 to-green-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-lime-400/25 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
            <PadelIcon size={60} className="text-slate-900 relative z-10" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-3 bg-gradient-to-r from-lime-400 to-green-400 bg-clip-text text-transparent">
            Padel Pro
          </h1>
          <p className="text-slate-300 text-lg">Tournament Manager</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          <label className="block text-slate-300 text-sm font-medium mb-4">Tournament Name</label>
          <input
            type="text"
            value={tournamentName}
            onChange={(e) => setTournamentName(e.target.value)}
            className="w-full bg-white/10 backdrop-blur-sm text-white rounded-2xl px-6 py-4 mb-8 focus:outline-none focus:ring-2 focus:ring-lime-400 border border-white/20 placeholder-slate-400 transition-all duration-200"
            placeholder="Summer Championship 2024"
          />
          
          <button
            onClick={() => tournamentName && onNext()}
            disabled={!tournamentName}
            className="w-full bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 text-slate-900 font-bold py-4 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-xl"
          >
            Get Started
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
