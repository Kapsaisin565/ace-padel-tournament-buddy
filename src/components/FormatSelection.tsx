
import React from 'react';
import { ChevronLeft, Activity, Users } from 'lucide-react';
import { TournamentFormat } from '../types/tournament';

interface FormatSelectionProps {
  onBack: () => void;
  onFormatSelect: (format: TournamentFormat) => void;
}

const FormatSelection: React.FC<FormatSelectionProps> = ({ onBack, onFormatSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-60 h-60 bg-lime-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-60 h-60 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <button 
        onClick={onBack} 
        className="mb-8 text-slate-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10 relative z-10"
      >
        <ChevronLeft size={24} />
      </button>
      
      <div className="max-w-md mx-auto relative z-10">
        <h2 className="text-4xl font-bold text-white mb-3">Choose Format</h2>
        <p className="text-slate-400 mb-10">Select your tournament style</p>
        
        <div className="space-y-6">
          <button
            onClick={() => onFormatSelect('mexicano')}
            className="w-full bg-white/10 backdrop-blur-lg hover:bg-white/15 p-8 rounded-3xl text-left transition-all duration-200 border border-white/20 hover:border-lime-400/50 group transform hover:scale-[1.02] shadow-xl"
          >
            <div className="flex items-center gap-5 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-lime-400/20 to-green-500/20 rounded-2xl flex items-center justify-center group-hover:from-lime-400/30 group-hover:to-green-500/30 transition-all duration-200">
                <Activity className="w-7 h-7 text-lime-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Mexicano</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">Dynamic pairing based on performance. Winners play with winners, creating competitive balance.</p>
          </button>
          
          <button
            onClick={() => onFormatSelect('americano')}
            className="w-full bg-white/10 backdrop-blur-lg hover:bg-white/15 p-8 rounded-3xl text-left transition-all duration-200 border border-white/20 hover:border-lime-400/50 group transform hover:scale-[1.02] shadow-xl"
          >
            <div className="flex items-center gap-5 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-2xl flex items-center justify-center group-hover:from-blue-400/30 group-hover:to-purple-500/30 transition-all duration-200">
                <Users className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Americano</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">Everyone plays with everyone. Fair rotation system ensuring all players partner together.</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormatSelection;
