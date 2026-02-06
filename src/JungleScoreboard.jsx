import React, { useState, useEffect } from 'react';
import { Plus, Minus, RotateCcw } from 'lucide-react';
import { supabase } from './supabaseClient';

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

  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load initial scores from Supabase
  useEffect(() => {
    loadScores();
  }, []);

  // Subscribe to real-time changes
  useEffect(() => {
    // First, make sure we have initial scores
    if (loading) return;

    const channel = supabase
      .channel('db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'scores'
        },
        (payload) => {
          console.log('Change received!', payload);
          
          if (payload.eventType === 'UPDATE') {
            setScores(prev => ({
              ...prev,
              [payload.new.team_id]: payload.new.score
            }));
          }
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Realtime connected!');
        }
        if (err) {
          console.error('❌ Realtime error:', err);
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [loading]);

  const loadScores = async () => {
    try {
      const { data, error } = await supabase
        .from('scores')
        .select('team_id, score');

      if (error) throw error;

      // Convert array to object
      const scoresObj = {};
      data.forEach(item => {
        scoresObj[item.team_id] = item.score;
      });

      setScores(scoresObj);
      setLoading(false);
    } catch (error) {
      console.error('Error loading scores:', error);
      setLoading(false);
    }
  };

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

  const addPoints = async (teamId, points) => {
    const newScore = scores[teamId] + points;

    // Optimistically update UI
    setScores(prev => ({
      ...prev,
      [teamId]: newScore
    }));

    // Trigger animation with random position
    const animId = Date.now() + Math.random(); // Ensure unique ID
    const randomX = (Math.random() - 0.5) * 200; // Random X offset: -100px to +100px
    const randomY = (Math.random() - 0.5) * 100; // Random Y offset: -50px to +50px
    
    setAnimations(prev => ({
      ...prev,
      [teamId]: [...prev[teamId], { id: animId, points, randomX, randomY }]
    }));

    // Remove animation after it completes
    setTimeout(() => {
      setAnimations(prev => ({
        ...prev,
        [teamId]: prev[teamId].filter(anim => anim.id !== animId)
      }));
    }, 2500);

    // Update Supabase
    try {
      const { error } = await supabase
        .from('scores')
        .update({ score: newScore, updated_at: new Date().toISOString() })
        .eq('team_id', teamId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating score:', error);
      // Revert on error
      loadScores();
    }
  };

  const resetScores = async () => {
    if (window.confirm('Reset all scores to 0?')) {
      // Optimistically update UI
      setScores({ blue: 0, yellow: 0, red: 0, green: 0 });

      // Update Supabase
      try {
        const updates = ['blue', 'yellow', 'red', 'green'].map(teamId => 
          supabase
            .from('scores')
            .update({ score: 0, updated_at: new Date().toISOString() })
            .eq('team_id', teamId)
        );

        await Promise.all(updates);
      } catch (error) {
        console.error('Error resetting scores:', error);
        // Reload on error
        loadScores();
      }
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 relative overflow-hidden">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-4xl font-bold">Loading scores... 🌴</div>
        </div>
      )}

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
            <div className={`${team.color} ${isMobile ? 'py-2' : 'py-6'} relative`}>
              <h2 className={`${isMobile ? 'text-xl' : 'text-4xl'} font-bold text-white text-center drop-shadow-lg`}>
                {team.animal} {team.name} {team.emoji}
              </h2>
            </div>

            {/* Score display - fills entire space */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className={`font-black ${team.textColor} drop-shadow-md relative z-10 leading-none pointer-events-none`}
                style={{ 
                  fontSize: isMobile 
                    ? (Math.abs(scores[team.id]) >= 100 
                        ? 'clamp(4rem, 12vw, 8rem)' 
                        : Math.abs(scores[team.id]) >= 10 
                        ? 'clamp(5rem, 15vw, 10rem)' 
                        : 'clamp(6rem, 18vw, 12rem)')
                    : (Math.abs(scores[team.id]) >= 100 
                        ? 'clamp(10rem, 18vw, 18rem)' 
                        : Math.abs(scores[team.id]) >= 10 
                        ? 'clamp(14rem, 24vw, 24rem)' 
                        : 'clamp(16rem, 28vw, 28rem)')
                }}
              >
                {scores[team.id]}
              </div>

              {/* Floating animations with random positions */}
              {animations[team.id].map(anim => (
                <div
                  key={anim.id}
                  className="absolute top-1/2 left-1/2 pointer-events-none z-20"
                  style={{
                    animation: 'floatUp 2.5s ease-out forwards',
                    transform: `translate(calc(-50% + ${anim.randomX}px), calc(-50% + ${anim.randomY}px))`
                  }}
                >
                  <div className={`${isMobile ? 'text-4xl' : 'text-8xl'} font-bold ${anim.points > 0 ? 'text-green-600' : 'text-red-600'} drop-shadow-lg`}>
                    {anim.points > 0 ? '+' : ''}{anim.points}
                  </div>
                  <div className={`${isMobile ? 'text-3xl' : 'text-7xl'} text-center`}>
                    {anim.points > 0 ? '🎉' : '💨'}
                  </div>
                </div>
              ))}
            </div>

            {/* Control buttons - always visible on mobile, hover on desktop */}
            <div className={`absolute inset-0 ${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-300 z-30 flex items-end justify-center ${isMobile ? 'pb-2' : 'pb-8'}`}>
              <div className={`${isMobile ? 'w-full px-2' : 'w-11/12'}`}>
                <div className={`grid grid-cols-3 ${isMobile ? 'gap-1 mb-1' : 'gap-4 mb-3'}`}>
                  <button
                    onClick={() => addPoints(team.id, 1)}
                    className={`${team.color} hover:${team.darkColor} text-white ${isMobile ? 'py-3 px-2 rounded-lg text-lg' : 'py-8 px-6 rounded-2xl text-3xl'} font-bold transition-all hover:scale-110 shadow-2xl flex items-center justify-center backdrop-blur-sm bg-opacity-95`}
                  >
                    <Plus size={isMobile ? 20 : 36} className={isMobile ? 'mr-1' : 'mr-2'} /> 1
                  </button>
                  <button
                    onClick={() => addPoints(team.id, 5)}
                    className={`${team.color} hover:${team.darkColor} text-white ${isMobile ? 'py-3 px-2 rounded-lg text-lg' : 'py-8 px-6 rounded-2xl text-3xl'} font-bold transition-all hover:scale-110 shadow-2xl flex items-center justify-center backdrop-blur-sm bg-opacity-95`}
                  >
                    <Plus size={isMobile ? 20 : 36} className={isMobile ? 'mr-1' : 'mr-2'} /> 5
                  </button>
                  <button
                    onClick={() => addPoints(team.id, 10)}
                    className={`${team.color} hover:${team.darkColor} text-white ${isMobile ? 'py-3 px-2 rounded-lg text-lg' : 'py-8 px-6 rounded-2xl text-3xl'} font-bold transition-all hover:scale-110 shadow-2xl flex items-center justify-center backdrop-blur-sm bg-opacity-95`}
                  >
                    <Plus size={isMobile ? 20 : 36} className={isMobile ? 'mr-1' : 'mr-2'} /> 10
                  </button>
                </div>
                <div className={`grid grid-cols-2 ${isMobile ? 'gap-1' : 'gap-3'}`}>
                  <button
                    onClick={() => addPoints(team.id, -1)}
                    className={`${team.darkColor} hover:opacity-90 text-white ${isMobile ? 'py-2 px-2 rounded-md text-sm' : 'py-3 px-4 rounded-xl text-lg'} font-semibold transition-all hover:scale-105 shadow-xl flex items-center justify-center backdrop-blur-sm bg-opacity-90`}
                  >
                    <Minus size={isMobile ? 16 : 20} className="mr-1" /> 1
                  </button>
                  <button
                    onClick={() => addPoints(team.id, -5)}
                    className={`${team.darkColor} hover:opacity-90 text-white ${isMobile ? 'py-2 px-2 rounded-md text-sm' : 'py-3 px-4 rounded-xl text-lg'} font-semibold transition-all hover:scale-105 shadow-xl flex items-center justify-center backdrop-blur-sm bg-opacity-90`}
                  >
                    <Minus size={isMobile ? 16 : 20} className="mr-1" /> 5
                  </button>
                </div>
              </div>
            </div>

            {/* Decorative jungle elements */}
            <div className={`absolute bottom-0 left-0 ${isMobile ? 'text-3xl' : 'text-6xl'} opacity-20`}>🍃</div>
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