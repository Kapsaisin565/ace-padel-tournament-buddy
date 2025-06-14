import React, { useState, useEffect } from 'react';
import { Trophy, Plus, Minus, X, ChevronLeft, ChevronRight, Play, Check, ArrowRight, Users, Activity } from 'lucide-react';

const Index = () => {
  // Padel Icon Component
  const PadelIcon = ({ size = 80, className = "text-current" }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g className={className}>
        {/* Left Racket */}
        <circle cx="30" cy="30" r="16" stroke="currentColor" strokeWidth="3" fill="none"/>
        <circle cx="30" cy="30" r="2" fill="currentColor"/>
        <circle cx="25" cy="25" r="2" fill="currentColor"/>
        <circle cx="35" cy="25" r="2" fill="currentColor"/>
        <circle cx="25" cy="35" r="2" fill="currentColor"/>
        <circle cx="35" cy="35" r="2" fill="currentColor"/>
        <circle cx="30" cy="20" r="2" fill="currentColor"/>
        <circle cx="30" cy="40" r="2" fill="currentColor"/>
        <rect x="28" y="43" width="4" height="18" fill="currentColor" rx="2"/>
        
        {/* Right Racket */}
        <circle cx="70" cy="30" r="16" stroke="currentColor" strokeWidth="3" fill="none"/>
        <circle cx="70" cy="30" r="2" fill="currentColor"/>
        <circle cx="65" cy="25" r="2" fill="currentColor"/>
        <circle cx="75" cy="25" r="2" fill="currentColor"/>
        <circle cx="65" cy="35" r="2" fill="currentColor"/>
        <circle cx="75" cy="35" r="2" fill="currentColor"/>
        <circle cx="70" cy="20" r="2" fill="currentColor"/>
        <circle cx="70" cy="40" r="2" fill="currentColor"/>
        <rect x="68" y="43" width="4" height="18" fill="currentColor" rx="2"/>
      </g>
    </svg>
  );

  // Tournament setup states
  const [currentStep, setCurrentStep] = useState('welcome');
  const [tournamentName, setTournamentName] = useState('');
  const [format, setFormat] = useState('');
  const [scoreLimit, setScoreLimit] = useState(0);
  const [courtCount, setCourtCount] = useState(0);
  const [players, setPlayers] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  
  // Tournament play states
  const [currentRound, setCurrentRound] = useState(1);
  const [matches, setMatches] = useState([]);
  const [playerStats, setPlayerStats] = useState({});
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showStandings, setShowStandings] = useState(false);
  const [showScorePicker, setShowScorePicker] = useState(null);

  // Helper function to get player number
  const getPlayerNumber = (playerName) => {
    return players.indexOf(playerName) + 1;
  };

  // Initialize player stats when players are added
  useEffect(() => {
    const stats = {};
    players.forEach(player => {
      stats[player] = { points: 0, played: 0, won: 0, lost: 0 };
    });
    setPlayerStats(stats);
  }, [players]);

  // Generate pairings based on format
  const generatePairings = (round) => {
    if (format === 'americano') {
      return generateAmericanoPairings(round);
    } else {
      return generateMexicanoPairings(round);
    }
  };

  // Americano pairing - fixed rotation
  const generateAmericanoPairings = (round) => {
    const n = players.length;
    const pairings = [];
    let courtAssignment = 1;
    
    // Simple rotation algorithm for Americano
    for (let i = 0; i < n; i += 4) {
      if (i + 3 < n) {
        const offset = (round - 1) * 2;
        const p1 = players[(i + offset) % n];
        const p2 = players[(i + 1 + offset) % n];
        const p3 = players[(i + 2 + offset) % n];
        const p4 = players[(i + 3 + offset) % n];
        
        pairings.push({
          id: pairings.length + 1,
          court: courtAssignment,
          team1: { player1: p1, player2: p2, score: 0 },
          team2: { player1: p3, player2: p4, score: 0 },
          status: 'waiting',
          round: round
        });
        
        courtAssignment = (courtAssignment % courtCount) + 1;
      }
    }
    
    return pairings;
  };

  // Mexicano pairing - based on performance
  const generateMexicanoPairings = (round) => {
    const pairings = [];
    let courtAssignment = 1;
    
    if (round === 1) {
      // First round is random
      const shuffled = [...players].sort(() => Math.random() - 0.5);
      for (let i = 0; i < shuffled.length; i += 4) {
        if (i + 3 < shuffled.length) {
          pairings.push({
            id: pairings.length + 1,
            court: courtAssignment,
            team1: { player1: shuffled[i], player2: shuffled[i + 1], score: 0 },
            team2: { player1: shuffled[i + 2], player2: shuffled[i + 3], score: 0 },
            status: 'waiting',
            round: round
          });
          
          courtAssignment = (courtAssignment % courtCount) + 1;
        }
      }
    } else {
      // Sort players by points
      const sortedPlayers = [...players].sort((a, b) => 
        (playerStats[b]?.points || 0) - (playerStats[a]?.points || 0)
      );
      
      // Pair by ranking
      for (let i = 0; i < sortedPlayers.length; i += 4) {
        if (i + 3 < sortedPlayers.length) {
          pairings.push({
            id: pairings.length + 1,
            court: courtAssignment,
            team1: { player1: sortedPlayers[i], player2: sortedPlayers[i + 3], score: 0 },
            team2: { player1: sortedPlayers[i + 1], player2: sortedPlayers[i + 2], score: 0 },
            status: 'waiting',
            round: round
          });
          
          courtAssignment = (courtAssignment % courtCount) + 1;
        }
      }
    }
    
    return pairings;
  };

  // Start tournament
  const startTournament = () => {
    const firstRoundMatches = generatePairings(1);
    setMatches(firstRoundMatches);
    setCurrentStep('tournament');
  };

  // Update player statistics
  const updatePlayerStats = (match) => {
    const newStats = { ...playerStats };
    const team1Won = match.team1.score > match.team2.score;
    
    // Update points and games for all players
    [match.team1.player1, match.team1.player2].forEach(player => {
      newStats[player].points += match.team1.score;
      newStats[player].played += 1;
      newStats[player][team1Won ? 'won' : 'lost'] += 1;
    });
    
    [match.team2.player1, match.team2.player2].forEach(player => {
      newStats[player].points += match.team2.score;
      newStats[player].played += 1;
      newStats[player][team1Won ? 'lost' : 'won'] += 1;
    });
    
    setPlayerStats(newStats);
  };

  // Proceed to next round
  const nextRound = () => {
    const currentRoundMatches = matches.filter(m => m.round === currentRound);
    const allFinished = currentRoundMatches.length > 0 && currentRoundMatches.every(m => m.status === 'finished');
    
    if (allFinished) {
      const nextRoundNumber = currentRound + 1;
      setCurrentRound(nextRoundNumber);
      const nextMatches = generatePairings(nextRoundNumber);
      setMatches([...matches, ...nextMatches]); // Keep all matches for history
      setShowStandings(false);
    }
  };

  // Welcome Screen
  if (currentStep === 'welcome') {
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
              onClick={() => tournamentName && setCurrentStep('format')}
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
  }

  // Format Selection
  if (currentStep === 'format') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-60 h-60 bg-lime-400/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-60 h-60 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <button 
          onClick={() => setCurrentStep('welcome')} 
          className="mb-8 text-slate-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10 relative z-10"
        >
          <ChevronLeft size={24} />
        </button>
        
        <div className="max-w-md mx-auto relative z-10">
          <h2 className="text-4xl font-bold text-white mb-3">Choose Format</h2>
          <p className="text-slate-400 mb-10">Select your tournament style</p>
          
          <div className="space-y-6">
            <button
              onClick={() => { setFormat('mexicano'); setCurrentStep('score'); }}
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
              onClick={() => { setFormat('americano'); setCurrentStep('score'); }}
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
  }

  // Score Limit Selection
  if (currentStep === 'score') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-lime-400/5 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <button 
          onClick={() => setCurrentStep('format')} 
          className="mb-8 text-slate-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10 relative z-10"
        >
          <ChevronLeft size={24} />
        </button>
        
        <div className="max-w-md mx-auto relative z-10">
          <h2 className="text-4xl font-bold text-white mb-3">Score Limit</h2>
          <p className="text-slate-400 mb-10">Points needed to win a match</p>
          
          <div className="grid grid-cols-2 gap-6">
            <button
              onClick={() => { setScoreLimit(21); setCurrentStep('courts'); }}
              className="bg-white/10 backdrop-blur-lg hover:bg-white/15 p-10 rounded-3xl transition-all duration-200 border border-white/20 hover:border-lime-400/50 group transform hover:scale-[1.05] shadow-xl"
            >
              <span className="text-6xl font-bold text-lime-400 block mb-3 group-hover:scale-110 transition-transform duration-200">21</span>
              <p className="text-slate-300 font-medium">Standard</p>
            </button>
            
            <button
              onClick={() => { setScoreLimit(24); setCurrentStep('courts'); }}
              className="bg-white/10 backdrop-blur-lg hover:bg-white/15 p-10 rounded-3xl transition-all duration-200 border border-white/20 hover:border-lime-400/50 group transform hover:scale-[1.05] shadow-xl"
            >
              <span className="text-6xl font-bold text-lime-400 block mb-3 group-hover:scale-110 transition-transform duration-200">24</span>
              <p className="text-slate-300 font-medium">Extended</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Court Count Selection
  if (currentStep === 'courts') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-purple-400/5 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <button 
          onClick={() => setCurrentStep('score')} 
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
                onClick={() => { setCourtCount(num); setCurrentStep('players'); }}
                className="bg-white/10 backdrop-blur-lg hover:bg-white/15 p-8 rounded-3xl transition-all duration-200 border border-white/20 hover:border-lime-400/50 group transform hover:scale-[1.05] shadow-xl"
              >
                <span className="text-4xl font-bold text-lime-400 group-hover:scale-110 transition-transform duration-200 block">{num}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Player Input
  if (currentStep === 'players') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-lime-400/5 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <button 
          onClick={() => setCurrentStep('courts')} 
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
                  if (e.key === 'Enter' && newPlayerName.trim()) {
                    setPlayers([...players, newPlayerName.trim()]);
                    setNewPlayerName('');
                  }
                }}
                className="flex-1 bg-white/10 backdrop-blur-sm text-white rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-lime-400 border border-white/20 placeholder-slate-400 transition-all duration-200"
                placeholder="Enter player name"
              />
              <button
                onClick={() => {
                  if (newPlayerName.trim()) {
                    setPlayers([...players, newPlayerName.trim()]);
                    setNewPlayerName('');
                  }
                }}
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
                  onClick={() => setPlayers(players.filter((_, i) => i !== index))}
                  className="text-red-400 hover:text-red-300 p-2 rounded-xl hover:bg-red-400/10 transition-all duration-200"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
          
          {players.length >= 4 && (
            <button
              onClick={startTournament}
              className="w-full bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-slate-900 font-bold py-5 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 shadow-2xl"
            >
              <Play size={20} strokeWidth={3} />
              Start Tournament
            </button>
          )}
        </div>
      </div>
    );
  }

  // Match Scoring View with automatic complementary scoring
  if (selectedMatch) {
    const match = matches.find(m => m.id === selectedMatch);
    if (!match) return null;

    const currentRoundMatches = matches.filter(m => m.round === currentRound);

    const setScore = (team, score) => {
      setMatches(prev => prev.map(m => {
        if (m.id === selectedMatch) {
          const newMatch = { ...m };
          
          if (team === 1) {
            newMatch.team1.score = score;
            // Automatically calculate the complementary score for team 2
            newMatch.team2.score = scoreLimit - score;
          } else {
            newMatch.team2.score = score;
            // Automatically calculate the complementary score for team 1
            newMatch.team1.score = scoreLimit - score;
          }
          
          // Mark match as finished when any team reaches the score limit
          if (newMatch.team1.score === scoreLimit || newMatch.team2.score === scoreLimit) {
            newMatch.status = 'finished';
            updatePlayerStats(newMatch);
          } else if (newMatch.status === 'waiting' && (newMatch.team1.score > 0 || newMatch.team2.score > 0)) {
            newMatch.status = 'playing';
          }
          
          return newMatch;
        }
        return m;
      }));
      setShowScorePicker(null);
    };

    const NumberGrid = ({ team }) => {
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
            <h2 className="text-2xl font-bold text-lime-400">Round {currentRound}</h2>
            <p className="text-sm text-slate-400">{tournamentName}</p>
          </div>
          <button 
            onClick={() => {
              if (match.status === 'finished') {
                setSelectedMatch(null);
                setShowScorePicker(null);
              } else {
                setMatches(prev => prev.map(m => 
                  m.id === selectedMatch 
                    ? { ...m, team1: { ...m.team1, score: 0 }, team2: { ...m.team2, score: 0 }, status: 'waiting' }
                    : m
                ));
              }
            }}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            {match.status === 'finished' ? <Check size={24} className="text-lime-400" /> : <span className="text-sm font-medium text-slate-400">Reset</span>}
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
                    disabled={match.status === 'finished'}
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
                    disabled={match.status === 'finished'}
                  >
                    <span className="text-8xl font-bold">{match.team2.score}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Status Display */}
            {match.status === 'playing' && (
              <div className="text-center mb-6">
                <span className="inline-flex items-center gap-3 px-8 py-4 bg-lime-400/10 backdrop-blur-lg text-lime-400 rounded-full text-sm font-medium border border-lime-400/20">
                  <span className="w-3 h-3 bg-lime-400 rounded-full animate-pulse"></span>
                  Match in Progress
                </span>
              </div>
            )}

            {match.status === 'finished' && (
              <div className="text-center bg-white/10 backdrop-blur-lg rounded-3xl p-10 border border-white/20 shadow-2xl">
                <div className="w-20 h-20 bg-gradient-to-r from-lime-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-10 h-10 text-slate-900" />
                </div>
                <p className="text-3xl font-bold mb-3 text-white">
                  {match.team1.score > match.team2.score ? 
                    `${match.team1.player1} & ${match.team1.player2}` : 
                    `${match.team2.player1} & ${match.team2.player2}`} Win!
                </p>
                <p className="text-slate-400 mb-8 text-lg">
                  Final Score: {match.team1.score} - {match.team2.score}
                </p>
                <button 
                  onClick={() => {
                    setSelectedMatch(null);
                    setShowScorePicker(null);
                  }}
                  className="px-10 py-4 bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-slate-900 rounded-2xl font-bold transition-all duration-200 shadow-xl"
                >
                  Back to Matches
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Score Picker Modal */}
        {showScorePicker && <NumberGrid team={showScorePicker} />}
      </div>
    );
  }

  // Tournament Main View
  if (currentStep === 'tournament') {
    const currentMatches = matches.filter(m => m.round === currentRound);
    const finishedMatches = currentMatches.filter(m => m.status === 'finished').length;
    const allFinished = currentMatches.length > 0 && currentMatches.every(m => m.status === 'finished');

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-10 w-40 h-40 bg-lime-400/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg p-4 border-b border-white/20 relative z-10">
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

          <div className="space-y-6 mb-8">
            {currentMatches.map((match, index) => (
              <div key={match.id} className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl overflow-hidden">
                <button
                  onClick={() => {
                    setSelectedMatch(match.id);
                    setShowScorePicker(null);
                  }}
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

          {allFinished ? (
            <button
              onClick={() => setShowStandings(true)}
              className="w-full py-5 bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-slate-900 rounded-2xl font-bold transition-all duration-200 flex items-center justify-center gap-3 animate-pulse shadow-2xl transform hover:scale-[1.02]"
            >
              View Standings & Continue
              <Trophy size={20} />
            </button>
          ) : (
            <button
              onClick={() => setShowStandings(true)}
              className="w-full py-5 bg-white/10 hover:bg-white/15 text-slate-300 rounded-2xl font-medium transition-all duration-200 flex items-center justify-center gap-3 border border-white/20 backdrop-blur-lg"
            >
              View Current Standings
              <Trophy size={20} />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Standings View - Fixed TypeScript errors and functionality
  if (showStandings) {
    const allPlayerStats = { ...playerStats };
    players.forEach(player => {
      if (!allPlayerStats[player]) {
        allPlayerStats[player] = { points: 0, played: 0, won: 0, lost: 0 };
      }
    });

    const sortedPlayers = Object.entries(allPlayerStats)
      .sort(([,a], [,b]) => {
        const aStats = a as { points: number; played: number; won: number; lost: number };
        const bStats = b as { points: number; played: number; won: number; lost: number };
        return bStats.points - aStats.points;
      })
      .map(([player, stats]) => ({ 
        player, 
        ...(stats as { points: number; played: number; won: number; lost: number })
      }));

    const currentRoundMatches = matches.filter(m => m.round === currentRound);
    const allMatchesFinished = currentRoundMatches.length > 0 && currentRoundMatches.every(m => m.status === 'finished');

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-60 h-60 bg-lime-400/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-60 h-60 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg p-4 flex items-center justify-between border-b border-white/20 relative z-10">
          <button 
            onClick={() => {
              setShowStandings(false);
              setShowScorePicker(null);
            }}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-lime-400">Round {currentRound}</h2>
            <p className="text-sm text-slate-400">Tournament Standings</p>
          </div>
          <div className="w-10" />
        </div>

        <div className="p-6 relative z-10">
          <div className="space-y-4">
            {sortedPlayers.map((item, index) => (
              <div key={item.player} className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 flex items-center justify-between border border-white/20 shadow-xl transform hover:scale-[1.02] transition-all duration-200">
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl ${
                    index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-slate-900 shadow-xl' :
                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-slate-900 shadow-xl' :
                    index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-slate-900 shadow-xl' :
                    'bg-white/10 text-slate-400 border border-white/20'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-white font-bold text-xl">
                      <span className="text-lime-400 mr-2">{getPlayerNumber(item.player)}.</span>
                      {item.player}
                    </p>
                    <p className="text-slate-400 text-sm font-medium">
                      {item.won}W - {item.lost}L ({item.played} played)
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-lime-400">{item.points || 0}</p>
                  <p className="text-slate-400 text-sm font-medium">points</p>
                </div>
              </div>
            ))}
          </div>

          {allMatchesFinished ? (
            <button
              onClick={nextRound}
              className="w-full mt-8 py-5 bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-slate-900 rounded-2xl font-bold transition-all duration-200 flex items-center justify-center gap-3 shadow-2xl transform hover:scale-[1.02]"
            >
              Start Round {currentRound + 1}
              <ArrowRight size={20} />
            </button>
          ) : (
            <div className="mt-8 text-center">
              <p className="text-slate-400 mb-6 text-lg">Complete all matches to proceed to next round</p>
              <button
                onClick={() => {
                  setShowStandings(false);
                  setShowScorePicker(null);
                }}
                className="px-8 py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl font-medium transition-all duration-200 border border-white/20 backdrop-blur-lg"
              >
                Back to Matches
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default Index;
