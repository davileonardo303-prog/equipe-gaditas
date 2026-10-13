import React from 'react';
import { useGaditas } from '../../context/GaditasContext';
import { Shield } from 'lucide-react';

interface TeamBadgeProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const TeamBadge: React.FC<TeamBadgeProps> = ({ size = 'md', showText = true }) => {
  const { siteConfig } = useGaditas();

  const dimensions = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl'
  };

  return (
    <div className="flex items-center gap-3">
      {siteConfig.logoUrl ? (
        <img 
          src={siteConfig.logoUrl} 
          alt={siteConfig.teamName} 
          className={`${dimensions[size]} rounded-lg object-contain bg-neutral-900 border border-red-500/40 p-1`} 
        />
      ) : (
        <div 
          className={`relative ${dimensions[size]} rounded-xl flex items-center justify-center font-serif font-black shadow-lg transition-transform hover:scale-105 border-2 border-white/80`}
          style={{
            background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
          }}
        >
          <Shield className="absolute inset-0 m-auto text-white/30 w-4/5 h-4/5" />
          <span 
            className="relative font-black tracking-tighter text-white drop-shadow-md text-base"
          >
            G
          </span>
        </div>
      )}

      {showText && (
        <div className="flex flex-col">
          <span className="font-extrabold text-white tracking-tight leading-tight uppercase font-cinzel text-sm sm:text-base">
            {siteConfig.teamName}
          </span>
          <span className="text-[10px] sm:text-xs text-red-400 font-semibold tracking-wide">
            {siteConfig.slogan}
          </span>
        </div>
      )}
    </div>
  );
};
