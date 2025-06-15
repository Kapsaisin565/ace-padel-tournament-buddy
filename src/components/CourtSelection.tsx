
import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface CourtSelectionProps {
  onBack: () => void;
  onCourtSelect: (count: number) => void;
}

const CourtSelection: React.FC<CourtSelectionProps> = ({ onBack, onCourtSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-purple-400/5 rounded-full blur-3xl animate-pulse"></div>
      </div>
      
      <button 
        onClick={onBack} 
        className="mb-8 text-slate-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10 relative z-10"
      >
        <ChevronLeft size={24} />
      </button>
      
      <div className="max-w-md mx-auto relative z-10">
        <h2 className="text-4xl font-bold text-white mb-3">Available Courts</h2>
        <p className="text-slate-400 mb-10">How many courts can be used?</p>
        
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5].map(num => (
            <button
              key={num}
              onClick={() => onCourtSelect(num)}
              className="bg-white/10 backdrop-blur-lg hover:bg-white/15 p-8 rounded-3xl transition-all duration-200 border border-white/20 hover:border-lime-400/50 group transform hover:scale-[1.05] shadow-xl"
            >
              <span className="text-4xl font-bold text-lime-400 group-hover:scale-110 transition-transform duration-200 block">{num}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourtSelection;
