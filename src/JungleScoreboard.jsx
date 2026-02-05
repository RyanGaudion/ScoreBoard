import React, { useState } from 'react';
import { Plus, Minus, RotateCcw } from 'lucide-react';

export default function JungleScoreboard() {
  const [scores, setScores] = useState({
    blue: 0,
    yellow: 0,
    red: 0,
    green: 0
  });

  const [animations, setAnimations] = useState({
    blue: [],
    yellow: [],
    red: [],
    green: []
  });

  const teams = [
    { 
      id: 'blue', 
      name: 'Blue Team', 
      color: 'bg-blue-500', 
      darkColor: 'bg-blue-700',
      lightColor: 'bg-blue-100',
      textColor: 'text-blue-900',
      animal: '🐘',
      emoji: '💧'
    },
    { 
      id: 'yellow', 
      name: 'Yellow Team', 
      color: 'bg-yellow-400', 
      darkColor: 'bg-yellow-600',
      lightColor: 'bg-yellow-50',
      textColor: 'text-yellow-900',
      animal: '🐵',
      emoji: '🍌'
    },
    { 
      id: 'red', 
      name: 'Red Team', 
      color: 'bg-red-500', 
      darkColor: 'bg-red-700',
      lightColor: 'bg-red-50',
      textColor: 'text-red-900',
      animal: '🦁',
      emoji: '👑'
    },
    { 
      id: 'green', 
      name: 'Green Team', 
      color: 'bg-green-500', 
      darkColor: 'bg-green-700',
      lightColor: 'bg-green-50',
      textColor: 'text-green-900',
      animal: '🐊',
      emoji: '🌿'
    }
  ];

  const addPoints = (teamId, points) => {
    setScores(prev => ({
      ...prev,
      [teamId]: prev[teamId] + points
    }));

    // Trigger animation
    const animId = Date.now();
    setAnimations(prev => ({
      ...prev,
      [teamId]: [...prev[teamId], { id: animId, points }]
    }));

    // Remove animation after it completes
    setTimeout(() => {
      setAnimations(prev => ({
        ...prev,
        [teamId]: prev[teamId].filter(anim => anim.id !== animId)
      }));
    }, 2500);
  };

  const resetScores = () => {
    if (window.confirm('Reset all scores to 0?')) {
      setScores({ blue: 0, yellow: 0, red: 0, green: 0 });
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 relative overflow-hidden">
      {/* Jungle background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 text-9xl">🌴</div>
        <div className="absolute top-0 right-0 text-9xl">🌴</div>
        <div className="absolute bottom-0 left-0 text-9xl">🌿</div>
        <div className="absolute bottom-0 right-0 text-9xl">🌿</div>
      </div>

      {/* Reset button */}
      <button
        onClick={resetScores}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 font-semibold text-sm transition-all hover:scale-105"
      >
        <RotateCcw size={16} />
        Reset All
      </button>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-2 grid-rows-2 h-full gap-2 p-2">
        {teams.map((team, index) => (
          <div
            key={team.id}
            className={`${team.lightColor} rounded-3xl shadow-2xl relative overflow-hidden border-4 border-white group`}
          >
            {/* Team header */}
            <div className={`${team.color} py-6 relative`}>
              <h2 className="text-4xl font-bold text-white text-center drop-shadow-lg">
                {team.animal} {team.name} {team.emoji}
              </h2>
            </div>

            {/* Score display - fills entire space */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className={`font-black ${team.textColor} drop-shadow-md relative z-10 leading-none pointer-events-none`}
                style={{ 
                  fontSize: Math.abs(scores[team.id]) >= 100 
                    ? 'clamp(10rem, 18vw, 18rem)' 
                    : Math.abs(scores[team.id]) >= 10 
                    ? 'clamp(14rem, 24vw, 24rem)' 
                    : 'clamp(16rem, 28vw, 28rem)'
                }}
              >
                {scores[team.id]}
              </div>

              {/* Floating animations */}
              {animations[team.id].map(anim => (
                <div
                  key={anim.id}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
                  style={{
                    animation: 'floatUp 2.5s ease-out forwards'
                  }}
                >
                  <div className={`text-8xl font-bold ${anim.points > 0 ? 'text-green-600' : 'text-red-600'} drop-shadow-lg`}>
                    {anim.points > 0 ? '+' : ''}{anim.points}
                  </div>
                  <div className="text-7xl text-center">
                    {anim.points > 0 ? '🎉' : '💨'}
                  </div>
                </div>
              ))}
            </div>

            {/* Control buttons - shown on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 flex items-end justify-center pb-8">
              <div className="w-11/12">
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <button
                    onClick={() => addPoints(team.id, 1)}
                    className={`${team.color} hover:${team.darkColor} text-white py-8 px-6 rounded-2xl font-bold text-3xl transition-all hover:scale-110 shadow-2xl flex items-center justify-center backdrop-blur-sm bg-opacity-95`}
                  >
                    <Plus size={36} className="mr-2" /> 1
                  </button>
                  <button
                    onClick={() => addPoints(team.id, 5)}
                    className={`${team.color} hover:${team.darkColor} text-white py-8 px-6 rounded-2xl font-bold text-3xl transition-all hover:scale-110 shadow-2xl flex items-center justify-center backdrop-blur-sm bg-opacity-95`}
                  >
                    <Plus size={36} className="mr-2" /> 5
                  </button>
                  <button
                    onClick={() => addPoints(team.id, 10)}
                    className={`${team.color} hover:${team.darkColor} text-white py-8 px-6 rounded-2xl font-bold text-3xl transition-all hover:scale-110 shadow-2xl flex items-center justify-center backdrop-blur-sm bg-opacity-95`}
                  >
                    <Plus size={36} className="mr-2" /> 10
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => addPoints(team.id, -1)}
                    className={`${team.darkColor} hover:opacity-90 text-white py-3 px-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-xl flex items-center justify-center backdrop-blur-sm bg-opacity-90`}
                  >
                    <Minus size={20} className="mr-1" /> 1
                  </button>
                  <button
                    onClick={() => addPoints(team.id, -5)}
                    className={`${team.darkColor} hover:opacity-90 text-white py-3 px-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-xl flex items-center justify-center backdrop-blur-sm bg-opacity-90`}
                  >
                    <Minus size={20} className="mr-1" /> 5
                  </button>
                </div>
              </div>
            </div>

            {/* Decorative jungle elements */}
            <div className="absolute bottom-0 left-0 text-6xl opacity-20">🍃</div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes floatUp {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) translateY(0) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-80px) scale(1.3);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) translateY(-160px) scale(0.8);
          }
        }
      `}</style>
    </div>
  );
}