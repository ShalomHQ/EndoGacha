
import React from 'react';
import { Rarity, PullResult } from './types';

interface GachaItemProps {
  result: PullResult;
  index: number;
}

const GachaItem: React.FC<GachaItemProps> = ({ result, index }) => {
  const rarityColors = {
    [Rarity.FOUR_STAR]: 'bg-purple-600',
    [Rarity.FIVE_STAR]: 'bg-yellow-400',
    [Rarity.SIX_STAR]: 'bg-orange-600'
  };

  const rarityShadows = {
    [Rarity.FOUR_STAR]: 'shadow-[0_0_20px_rgba(147,51,234,0.3)]',
    [Rarity.FIVE_STAR]: 'shadow-[0_0_20px_rgba(250,204,21,0.3)]',
    [Rarity.SIX_STAR]: 'shadow-[0_0_25px_rgba(234,88,12,0.4)]'
  };

  const delay = index * 120;

  return (
    <div 
      className="relative flex flex-col items-center shrink-0 perspective-1000"
      style={{ 
        animation: `pullIn 0.6s ease-out forwards`,
        animationDelay: `${delay}ms`,
        opacity: 0 
      }}
    >
      {/* 3D Flip Container */}
      <div className="relative w-10 h-44 md:w-16 md:h-80 group preserve-3d">
        <div 
          className="relative w-full h-full duration-1000 preserve-3d"
          style={{ 
            animation: `flipCard 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
            animationDelay: `${delay + 1000}ms`
          }}
        >
          {/* Card Back: Initial Visible Colored Block (Dropped State) */}
          <div className={`
            absolute inset-0 backface-hidden rounded-sm border-t border-x border-white/20
            ${rarityColors[result.character.rarity]} ${rarityShadows[result.character.rarity]}
            flex items-center justify-center
          `}>
             <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20 pointer-events-none" />
             {/* Industrial Pattern for the back */}
             <div className="w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }}></div>
          </div>

          {/* Card Front: The Revealed Face (Flipped State) */}
          <div className={`
            absolute inset-0 backface-hidden rotate-y-180 rounded-sm border-t border-x border-white/30 overflow-hidden
            ${rarityColors[result.character.rarity]} ${rarityShadows[result.character.rarity]}
            flex items-end justify-center
          `}>
            {/* Subtle top gradient transparency */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent pointer-events-none" />
            
            {/* Stylized Vertical Name Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
              <span className="font-orbitron font-black text-black/20 text-5xl md:text-8xl uppercase whitespace-nowrap rotate-90 transform origin-center tracking-tighter leading-none block">
                {result.character.name}
              </span>
            </div>

            {/* Content Area */}
            <div className="relative z-10 w-full p-1.5 bg-black/60 backdrop-blur-md border-t border-white/10">
              <p className="text-[8px] md:text-[11px] font-black text-white uppercase text-center leading-tight truncate mb-1">
                {result.character.name}
              </p>
              <div className="flex justify-center space-x-0.5 text-[8px] md:text-[10px]">
                {Array.from({ length: result.character.rarity }).map((_, i) => (
                  <span key={i} className={
                    result.character.rarity === 6 ? 'text-orange-400' : result.character.rarity === 5 ? 'text-yellow-400' : 'text-purple-300'
                  }>★</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ground Reflection */}
      <div className="h-1 md:h-3" />
      <div className={`
        w-10 h-20 md:w-16 md:h-40 
        ${rarityColors[result.character.rarity]}
        opacity-20 gacha-reflection
        transform scale-y-[-1]
        transition-all duration-700
      `}>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }

        @keyframes pullIn {
          0% { 
            opacity: 0; 
            transform: translateY(-120px) scale(0.8);
            filter: brightness(5) blur(8px);
          }
          60% {
            opacity: 1;
            transform: translateY(10px) scale(1.05);
            filter: brightness(1.2) blur(0px);
          }
          100% { 
            opacity: 1; 
            transform: translateY(0) scale(1);
            filter: brightness(1);
          }
        }

        @keyframes flipCard {
          0% { transform: rotateY(0); }
          100% { transform: rotateY(180deg); }
        }
      `}</style>
    </div>
  );
};

export default GachaItem;
