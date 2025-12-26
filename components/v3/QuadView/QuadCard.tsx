import React from 'react';
import { Button } from '../../ui/button';
import { cn } from '../../../lib/utils';
import { MarketOption } from '../../../hooks/useMarkets';

// Use public folder path for static export
const shieldWhitePath = '/assets/images/field_shield_white.png';

interface QuadCardProps {
  option: MarketOption;
  index: number;
  color: 'blue' | 'yellow' | 'red' | 'green';
  poolTotal: number;
  onSelect: () => void;
  compact?: boolean;
}

export function QuadCard({ option, index, color, poolTotal, onSelect, compact = false }: QuadCardProps) {
  const estPayout = option.amount > 0 ? (poolTotal / option.amount).toFixed(1) : '---';

  const colorStyles = {
    blue: 'bg-[#3B82F6] border-[#1e40af] text-white',
    yellow: 'bg-[#F59E0B] border-[#b45309] text-white',
    red: 'bg-[#EF4444] border-[#b91c1c] text-white',
    green: 'bg-[#10B981] border-[#047857] text-white',
  };

  const isField = option.name === 'THE FIELD';

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center text-center h-full border-4 shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]',
        compact ? 'rounded-xl p-3 min-h-[140px]' : 'rounded-2xl p-6 min-h-[220px]',
        colorStyles[color]
      )}
    >
      <div className={`text-white/80 ${compact ? 'text-[10px]' : 'text-xs'} font-medium mb-1 tracking-wider uppercase`}>
        Option {index + 1}:
      </div>

      <div className={`flex items-center gap-1 mb-2 ${compact ? 'flex-col' : ''}`}>
        <h3 className={`${compact ? 'text-lg' : 'text-3xl'} font-bold leading-tight break-words max-w-full`}>
          {option.name}
        </h3>
        {isField && (
          <img
            src={shieldWhitePath}
            alt="Shield"
            className={`${compact ? 'w-4 h-4' : 'w-6 h-6'} object-contain opacity-90`}
          />
        )}
      </div>

      <div className={`space-y-1 ${compact ? 'mb-3' : 'mb-6'}`}>
        <p className={`${compact ? 'text-[10px]' : 'text-sm'} font-medium`}>Est. Payout: {estPayout}x</p>
        <p className={`${compact ? 'text-[8px]' : 'text-xs'} opacity-80`}>(Pool: {option.percent}%)</p>
      </div>

      <Button
        onClick={onSelect}
        className={`${compact ? 'text-xs px-4 py-0 h-auto' : 'text-base px-8 py-1 h-auto'} bg-white text-black hover:bg-white/90 font-bold tracking-wide uppercase rounded-md shadow-sm border-b-2 border-black/20`}
      >
        [ Select ]
      </Button>
    </div>
  );
}
