
import React, { useState, useCallback, useRef } from 'react';
import { GachaStats, Rarity, PullResult } from './types';
import { GachaEngine } from './GachaEngine';
import GachaItem from './GachaItem';
import StatsBoard from './StatsBoard';

const App: React.FC = () => {
  const [resetKey, setResetKey] = useState(0);
  const [stats, setStats] = useState<GachaStats>({
    totalPulls: 0,
    sixStarPity: 0,
    fiveStarPity: 0,
    featuredGuaranteedAt120: true,
    pullHistory: [],
    counts: {
      [Rarity.FOUR_STAR]: 0,
      [Rarity.FIVE_STAR]: 0,
      [Rarity.SIX_STAR]: 0,
    }
  });

  const [currentResults, setCurrentResults] = useState<PullResult[]>([]);
  const [isPulling, setIsPulling] = useState(false);
  const pullTimerRef = useRef<number | null>(null);

  const handlePull = useCallback((count: number) => {
    if (isPulling) return;
    setIsPulling(true);
    setCurrentResults([]);
    
    // Clear any existing timer to prevent race conditions
    if (pullTimerRef.current) window.clearTimeout(pullTimerRef.current);

    pullTimerRef.current = window.setTimeout(() => {
      setStats(prevStats => {
        const { results, nextStats } = GachaEngine.multiPull(prevStats, count);
        setCurrentResults(results);
        setIsPulling(false);
        return nextStats;
      });
    }, 150);
  }, [isPulling]);

  const resetSimulator = useCallback(() => {
    if (window.confirm("CRITICAL: Initialize system wipe? All headhunting history and pity will be erased.")) {
      if (pullTimerRef.current) window.clearTimeout(pullTimerRef.current);
      
      setStats({
        totalPulls: 0,
        sixStarPity: 0,
        fiveStarPity: 0,
        featuredGuaranteedAt120: true,
        pullHistory: [],
        counts: {
          [Rarity.FOUR_STAR]: 0,
          [Rarity.FIVE_STAR]: 0,
          [Rarity.SIX_STAR]: 0,
        }
      });
      setCurrentResults([]);
      setIsPulling(false);
      // Increment reset key to force a full re-render of results area
      setResetKey(prev => prev + 1);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-x-hidden" key={resetKey}>
      <div className="scanline" />
      
      {/* Header */}
      <header className="p-4 border-b border-yellow-400/20 flex flex-col sm:flex-row justify-between items-center gap-4 bg-black/80 backdrop-blur-xl z-30">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-400 flex items-center justify-center shrink-0">
            <span className="text-black font-black text-xl md:text-2xl font-orbitron">E</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-lg md:text-2xl font-black font-orbitron tracking-tighter text-yellow-400 uppercase truncate">Headhunting</h1>
            <p className="text-[7px] md:text-[9px] tracking-[0.2em] md:tracking-[0.3em] uppercase opacity-50 truncate">Personnel Acquisition Terminal</p>
          </div>
        </div>

        <button 
          onClick={resetSimulator}
          className="px-3 py-1.5 border border-red-500/50 text-red-500 text-[10px] font-bold hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest shrink-0"
        >
          Initialize Wipe
        </button>
      </header>

      <main className="flex-grow flex flex-col xl:flex-row p-4 md:p-6 gap-6 relative z-10 overflow-hidden">
        {/* Left Side: Simulation Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Stable Fixed-Height Container to prevent layout jumps */}
          <div className="flex-grow min-h-[400px] md:min-h-[550px] bg-[#080808] border border-yellow-400/10 relative overflow-hidden flex flex-col items-center justify-center p-4 rounded-sm shadow-inner">
            
            {/* Background Decoration */}
            <div className="absolute inset-0 opacity-[0.02] flex items-center justify-center pointer-events-none select-none overflow-hidden">
              <span className="text-[10rem] md:text-[20rem] font-black font-orbitron rotate-[-15deg] whitespace-nowrap">END-SYS</span>
            </div>

            {/* Results Grid - Stable area with unique key for reset */}
            <div className="relative z-10 w-full flex justify-center items-center h-full" key={resetKey + '_results'}>
              {currentResults.length > 0 ? (
                <div className="flex flex-row items-center justify-center gap-1.5 md:gap-3 lg:gap-4 py-8 overflow-x-auto no-scrollbar max-w-full px-4 scroll-smooth">
                  {currentResults.map((res, idx) => (
                    <GachaItem key={`${resetKey}-${idx}-${res.pullNumber}`} result={res} index={idx} />
                  ))}
                </div>
              ) : (
                <div className="text-center space-y-4 px-6 max-w-full">
                  <p className="font-orbitron text-yellow-400/30 text-[10px] md:text-sm tracking-[0.3em] md:tracking-[0.5em] uppercase break-words">
                    {isPulling ? "Decrypting Signals..." : "Awaiting Authorization"}
                  </p>
                  <div className={`h-0.5 bg-yellow-400/20 mx-auto transition-all duration-500 ${isPulling ? 'w-48' : 'w-24'}`} />
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 flex justify-center space-x-3 md:space-x-4 shrink-0">
            <button 
              disabled={isPulling}
              onClick={() => handlePull(1)}
              className="group relative flex-1 max-w-[180px] py-4 bg-transparent border-2 border-yellow-400/60 overflow-hidden transition-all hover:bg-yellow-400 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <span className="relative z-10 text-yellow-400 font-black group-hover:text-black transition-colors uppercase font-orbitron text-xs">Headhunt x1</span>
            </button>
            <button 
              disabled={isPulling}
              onClick={() => handlePull(10)}
              className="group relative flex-1 max-w-[240px] py-4 bg-yellow-400 border-2 border-yellow-400 overflow-hidden transition-all active:scale-95 disabled:opacity-30"
            >
              <div className="relative z-10 flex items-center justify-center space-x-2">
                <span className="text-black font-black uppercase font-orbitron text-xs">Headhunt x10</span>
              </div>
              <div className="absolute top-0 -right-4 w-12 h-full bg-white/40 skew-x-12 transform translate-x-full group-hover:translate-x-[-600%] transition-transform duration-1000" />
            </button>
          </div>
        </div>

        {/* Right Side: Stats & Sidebar */}
        <div className="w-full xl:w-[400px] flex flex-col gap-4 shrink-0 overflow-y-auto xl:max-h-[calc(100vh-140px)] thin-scrollbar min-w-0">
          <StatsBoard stats={stats} />
          
          <div className="bg-black/60 border border-yellow-400/10 p-4 font-orbitron text-[10px] backdrop-blur-md rounded-sm">
            <div className="flex items-center justify-between mb-4 border-b border-yellow-400/20 pb-2">
              <h3 className="text-yellow-400 tracking-widest uppercase text-[11px]">Acquisition Protocol</h3>
              <span className="text-[8px] px-1.5 py-0.5 bg-yellow-400/20 text-yellow-400 border border-yellow-400/20">LIVE_LINK</span>
            </div>
            
            <div className="space-y-5">
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-orange-500 font-black text-xs">TARGET: LAEVATAIN</span>
                  <span className="text-[9px] opacity-60">50% PROBABILITY</span>
                </div>
                <div className="w-full h-2 bg-white/5 relative overflow-hidden rounded-full">
                  <div className="absolute left-0 top-0 h-full bg-orange-500 w-1/2 shadow-[0_0_15px_rgba(234,88,12,0.6)] animate-pulse" />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <span className="opacity-40 text-[9px] uppercase tracking-tighter">Candidate Pool (6★ Standard):</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Pogranichnik', 'Ember', 'LiFeng', 'Last Rite', 'Ardelia', 'Yvonne', 'Gilberta'].map(n => (
                    <span key={n} className="bg-white/5 px-2 py-1 border border-white/5 hover:border-yellow-400/30 transition-all text-[9px] cursor-default">{n}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-yellow-400/10 text-[9px] leading-relaxed opacity-60">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <p className="text-yellow-400 font-bold opacity-100">RATE PARAMS</p>
                  <p>• 6★ Acquisition: 0.8%</p>
                  <p>• 5★ Acquisition: 8.0%</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-yellow-400 font-bold opacity-100">PITY LIMITS</p>
                  <p>• 6★ Hard: Cycle 80</p>
                  <p>• 5★ Hard: Cycle 10</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-3 text-[8px] md:text-[9px] uppercase tracking-[0.4em] opacity-20 text-center pointer-events-none z-0 mt-auto">
        ENDFIELD Headhunting Interface // Build 0x8F2A // Authorized Use Only
      </footer>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .thin-scrollbar::-webkit-scrollbar { width: 5px; }
        .thin-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.4); }
        .thin-scrollbar::-webkit-scrollbar-thumb { background: rgba(234, 179, 8, 0.15); border-radius: 10px; }
        .thin-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(234, 179, 8, 0.3); }
      `}</style>
    </div>
  );
};

export default App;
