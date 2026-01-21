
import React, { useState, useMemo } from 'react';
import { GachaStats, Rarity, PullResult } from './types';

interface StatsBoardProps {
  stats: GachaStats;
}

const StatsBoard: React.FC<StatsBoardProps> = ({ stats }) => {
  const [filter, setFilter] = useState<'all' | Rarity>('all');

  const filteredHistory = useMemo(() => {
    if (filter === 'all') return stats.pullHistory;
    return stats.pullHistory.filter(h => h.character.rarity === filter);
  }, [stats.pullHistory, filter]);

  const getRarityClass = (rarity: Rarity) => {
    switch (rarity) {
      case Rarity.SIX_STAR: return 'text-orange-500 font-black';
      case Rarity.FIVE_STAR: return 'text-yellow-400 font-bold';
      case Rarity.FOUR_STAR: return 'text-purple-400 font-semibold';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-black/80 border border-yellow-400/30 p-4 font-orbitron text-[10px] md:text-xs grid grid-cols-2 md:grid-cols-4 gap-4 uppercase tracking-widest backdrop-blur-md">
      <div className="space-y-1">
        <p className="text-yellow-400 opacity-60">Total Operations</p>
        <p className="text-xl font-bold">{stats.totalPulls}</p>
      </div>
      <div className="space-y-1">
        <p className="text-yellow-400 opacity-60">6★ Protocol</p>
        <p className="text-xl font-bold text-orange-500">{stats.sixStarPity} / 80</p>
      </div>
      <div className="space-y-1">
        <p className="text-yellow-400 opacity-60">5★ Protocol</p>
        <p className="text-xl font-bold text-yellow-400">{stats.fiveStarPity} / 10</p>
      </div>
      <div className="space-y-1">
        <p className="text-yellow-400 opacity-60">120-Cap Status</p>
        <p className={`text-xl font-bold ${stats.featuredGuaranteedAt120 ? 'text-green-500' : 'text-red-500'}`}>
          {stats.featuredGuaranteedAt120 ? 'STANDBY' : 'DEPLETED'}
        </p>
      </div>
      
      <div className="col-span-full border-t border-yellow-400/20 pt-4 mt-2">
        <div className="flex justify-between items-center mb-3">
          <p className="text-yellow-400 opacity-60">Operational Logs</p>
          <div className="flex space-x-2 text-[8px] md:text-[9px]">
            {(['all', Rarity.SIX_STAR, Rarity.FIVE_STAR, Rarity.FOUR_STAR] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2 py-0.5 border ${
                  filter === f 
                    ? 'bg-yellow-400 text-black border-yellow-400' 
                    : 'border-yellow-400/20 text-yellow-400/60 hover:border-yellow-400/50'
                } transition-all`}
              >
                {f === 'all' ? 'ALL' : `${f}★`}
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-48 overflow-y-auto space-y-1 pr-2 thin-scrollbar">
          {filteredHistory.length === 0 ? (
            <p className="opacity-30 italic normal-case text-center py-4">No records found for current frequency filter.</p>
          ) : (
            filteredHistory.map((h, i) => (
              <div key={i} className="flex justify-between items-center bg-white/5 px-2 py-1.5 border-l-2 border-transparent hover:border-yellow-400 transition-all">
                <div className="flex items-center space-x-2">
                  <span className={`w-4 text-center opacity-30`}>{h.pullNumber}</span>
                  <span className={getRarityClass(h.character.rarity)}>{h.character.name}</span>
                </div>
                <div className="flex space-x-1">
                  {Array.from({ length: h.character.rarity }).map((_, starIdx) => (
                    <span key={starIdx} className={`text-[10px] ${
                      h.character.rarity === 6 ? 'text-orange-500' : h.character.rarity === 5 ? 'text-yellow-400' : 'text-purple-400'
                    }`}>★</span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsBoard;
