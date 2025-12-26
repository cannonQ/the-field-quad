import React, { useState } from 'react';
import { Market } from '../../../hooks/useMarkets';
import { MarketCard } from './MarketCard';

interface MoreMarketsProps {
  categories: string[];
  marketsByCategory: Record<string, Market[]>;
  onViewPool?: (market: Market) => void;
}

export function MoreMarkets({ categories, marketsByCategory, onViewPool }: MoreMarketsProps) {
  // Start with the first category that has markets
  const firstCategoryWithMarkets = categories.find((cat) => marketsByCategory[cat]?.length > 0) || categories[0];
  const [selectedCategory, setSelectedCategory] = useState(firstCategoryWithMarkets);

  const currentMarkets = marketsByCategory[selectedCategory] || [];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mt-12 pb-12">
      <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-6">More Markets</h3>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Markets Display */}
        <div className="lg:col-span-3">
          {currentMarkets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {currentMarkets.map((market) => (
                <MarketCard key={market.id} market={market} onViewPool={onViewPool} />
              ))}
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center text-gray-400">
              No markets in this category
            </div>
          )}
        </div>

        {/* Categories List */}
        <div className="lg:col-span-1 flex flex-col gap-2 max-h-96 overflow-y-auto">
          {categories.map((category) => {
            const hasMarkets = marketsByCategory[category]?.length > 0;
            return (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                disabled={!hasMarkets}
                className={`px-4 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                  selectedCategory === category
                    ? 'bg-white text-black'
                    : hasMarkets
                    ? 'bg-white/10 text-white hover:bg-white/20'
                    : 'bg-white/5 text-gray-600 cursor-not-allowed'
                }`}
              >
                {category}
                {hasMarkets && (
                  <span className="text-[10px] ml-1 opacity-75">({marketsByCategory[category].length})</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
