import React, { useState } from 'react';
import { Market } from '@/hooks/useMarkets';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MoreMarketsProps {
  categories: string[];
  marketsByCategory: Record<string, Market[]>;
}

export function MoreMarkets({ categories, marketsByCategory }: MoreMarketsProps) {
  // Start with the first category that has markets
  const firstCategoryWithMarkets = categories.find(cat => marketsByCategory[cat].length > 0) || categories[0];
  const [selectedCategory, setSelectedCategory] = useState(firstCategoryWithMarkets);
  const [marketIndex, setMarketIndex] = useState(0);

  const currentMarkets = marketsByCategory[selectedCategory] || [];
  const currentMarket = currentMarkets[marketIndex];

  const handlePrevMarket = () => {
    setMarketIndex(prev => (prev - 1 + currentMarkets.length) % currentMarkets.length);
  };

  const handleNextMarket = () => {
    setMarketIndex(prev => (prev + 1) % currentMarkets.length);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setMarketIndex(0);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mt-12 pb-12">
      <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-6">
        More Markets
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Market Display with Navigation */}
        <div className="lg:col-span-3 flex items-center gap-4">
          <Button
            onClick={handlePrevMarket}
            disabled={currentMarkets.length <= 1}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            variant="outline"
            size="sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {currentMarket ? (
            <div className="flex-grow bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <h4 className="text-sm font-bold text-white mb-3">{currentMarket.description}</h4>
              <div className="space-y-2 mb-4">
                <p className="text-xs text-gray-400">Pool: ${currentMarket.poolTotal.toLocaleString()}</p>
                <p className="text-xs text-gray-400">Ends in: {currentMarket.endsIn}</p>
              </div>
              <div className="space-y-1">
                {currentMarket.options.slice(0, 3).map((opt, idx) => (
                  <div key={idx} className="text-xs text-gray-300">
                    {idx + 1}. {opt.name} ({opt.percent}%)
                  </div>
                ))}
              </div>
              <div className="mt-4 text-xs text-gray-500">
                {marketIndex + 1} / {currentMarkets.length}
              </div>
            </div>
          ) : (
            <div className="flex-grow bg-white/5 border border-white/10 rounded-xl p-6 text-center text-gray-400">
              No markets in this category
            </div>
          )}

          <Button
            onClick={handleNextMarket}
            disabled={currentMarkets.length <= 1}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            variant="outline"
            size="sm"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-1 flex flex-col gap-2 max-h-96 overflow-y-auto">
          {categories.map((category) => {
            const hasMarkets = marketsByCategory[category].length > 0;
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
                  <span className="text-[10px] ml-1 opacity-75">
                    ({marketsByCategory[category].length})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
