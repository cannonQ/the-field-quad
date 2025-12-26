'use client';

import React from 'react';
import { MarketCard } from './MarketCard';
import { Market } from '@/hooks/useMarkets';

interface MoreMarketsProps {
  markets: Market[];
}

const marketIcons: { [key: string]: string } = {
  '2': '🏎️',
  '3': '🗳️',
};

export const MoreMarkets: React.FC<MoreMarketsProps> = ({ markets }) => {
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-white mb-6 uppercase">
        More Markets
      </h2>

      <div className="relative">
        <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          <div className="flex gap-4 min-w-min">
            {markets.map((market) => (
              <MarketCard
                key={market.id}
                market={market}
                icon={marketIcons[market.id] || '🎯'}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
