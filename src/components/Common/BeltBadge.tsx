import React from 'react';
import { BeltType } from '../../types';

interface BeltBadgeProps {
  belt: BeltType;
  stripes?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const BeltBadge: React.FC<BeltBadgeProps> = ({ belt, stripes = 0, size = 'md' }) => {
  const getBeltBg = () => {
    switch (belt) {
      case 'Branca':
        return 'bg-neutral-100 text-neutral-900 border-neutral-300';
      case 'Cinza':
        return 'bg-neutral-400 text-neutral-950 border-neutral-500';
      case 'Amarela':
        return 'bg-amber-400 text-neutral-950 border-amber-500';
      case 'Laranja':
        return 'bg-orange-500 text-white border-orange-600';
      case 'Verde':
        return 'bg-emerald-600 text-white border-emerald-700';
      case 'Azul':
        return 'bg-blue-600 text-white border-blue-700';
      case 'Roxa':
        return 'bg-purple-700 text-white border-purple-800';
      case 'Marrom':
        return 'bg-amber-900 text-amber-100 border-amber-950';
      case 'Preta':
        return 'bg-neutral-900 text-amber-400 border-neutral-800';
      case 'Coral':
        return 'bg-gradient-to-r from-red-600 via-neutral-100 to-red-600 text-neutral-950 border-red-700';
      case 'Vermelha':
        return 'bg-red-600 text-white border-red-700';
      default:
        return 'bg-neutral-800 text-neutral-200 border-neutral-700';
    }
  };

  const isBlackBelt = belt === 'Preta' || belt === 'Coral' || belt === 'Vermelha';
  const barColor = isBlackBelt ? 'bg-red-600' : 'bg-neutral-900';

  const heights = {
    sm: 'h-4 text-[10px] px-1.5',
    md: 'h-6 text-xs px-2.5',
    lg: 'h-8 text-sm px-3.5 font-semibold'
  };

  return (
    <div className={`inline-flex items-center gap-1.5 rounded font-mono border tracking-tight shadow-sm select-none ${getBeltBg()} ${heights[size]}`}>
      <span className="font-bold uppercase tracking-wider">{belt}</span>
      {/* Black bar with stripes */}
      <div className={`flex items-center gap-0.5 px-1 py-0.5 rounded-xs ${barColor}`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`w-1 rounded-full ${size === 'lg' ? 'h-4' : size === 'md' ? 'h-3' : 'h-2'} ${
              i < stripes ? 'bg-white shadow-xs' : 'bg-transparent border border-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
