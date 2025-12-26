import React from 'react';
import { Market } from '../../../hooks/useMarkets';
import { Button } from '../../ui/button';

interface MarketCardProps {
  market: Market;
  onViewPool?: (market: Market) => void;
}

export function MarketCard({ market, onViewPool }: MarketCardProps) {
  // Extract top 3 options
  const topOptions = market.options.slice(0, 3);
  const icon = market.description.toLowerCase().includes('f1') || market.description.toLowerCase().includes('formula')
    ? '🏎️'
    : market.description.toLowerCase().includes('election') || market.description.toLowerCase().includes('president')
    ? '🗳️'
    : market.description.toLowerCase().includes('oscar')
    ? '🎬'
    : market.description.toLowerCase().includes('nfl') || market.description.toLowerCase().includes('football')
    ? '🏈'
    : market.description.toLowerCase().includes('nba') || market.description.toLowerCase().includes('basketball')
    ? '🏀'
    : '📅';

  return (
    <div className="min-w-[280px] bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col hover:bg-white/10 transition-colors">
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <h3 className="font-bold text-white text-sm leading-tight">{market.description}</h3>
        </div>
      </div>

      <div className="space-y-1 mb-4 flex-grow">
        {topOptions.map((opt, idx) => (
          <div key={idx} className="flex justify-between text-xs text-gray-400">
            <span className="truncate max-w-[150px]">
              {idx + 1}. {opt.name}
            </span>
            <span>{opt.percent}%</span>
          </div>
        ))}
      </div>

      <div className="text-xs text-gray-500 mb-3">
        <span>Pool: ${market.poolTotal.toLocaleString()}</span>
        <span className="mx-2">•</span>
        <span>{market.endsIn}</span>
      </div>

      <Button
        variant="outline"
        onClick={() => onViewPool?.(market)}
        className="w-full border-white/20 bg-transparent text-white hover:bg-white/10 text-xs h-8 uppercase"
      >
        [VIEW POOL]
      </Button>
    </div>
  );
}
