import React from 'react';
import { Market } from '../../../hooks/useMarkets';

interface MarketCardProps {
  market: Market;
  icon: string;
  onViewPool?: (market: Market) => void;
}

export const MarketCard: React.FC<MarketCardProps> = ({ market, icon, onViewPool }) => {
  const handleViewPool = () => {
    if (onViewPool) {
      onViewPool(market);
    }
  };

  return (
    <div className="flex-shrink-0 w-[280px] bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-3xl">{icon}</div>
        <h3 className="text-white font-semibold text-base leading-tight">
          {market.description}
        </h3>
      </div>

      <div className="space-y-2 mb-4">
        {market.options.slice(0, 3).map((option, index) => (
          <div
            key={index}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-gray-300">
              {index + 1}. {option.name}
            </span>
          </div>
        ))}
        {market.options.length > 3 && (
          <div className="text-sm text-gray-500">
            4. {market.options[3].name}
          </div>
        )}
      </div>

      <button
        onClick={handleViewPool}
        className="w-full py-2 px-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors text-sm border border-gray-700"
      >
        [ VIEW POOL ]
      </button>
    </div>
  );
};
