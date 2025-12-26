import React, { useState } from 'react';
import { Header } from '../components/v2/Header/Header';
import { QuadView } from '../components/v2/QuadView/QuadView';
import { MoreMarkets } from '../components/v2/MoreMarkets/MoreMarkets';
import { useMarkets, Market } from '../hooks/useMarkets';

export default function V2Page() {
  const { featuredMarket, otherMarkets, loading, error } = useMarkets();
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);

  // Use selected market or featured market for the QuadView
  const activeMarket = selectedMarket || featuredMarket;

  const handleViewPool = (market: Market) => {
    setSelectedMarket(market);
    // Scroll to top to show the selected market
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading markets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500 text-xl">Error loading markets: {error}</div>
      </div>
    );
  }

  if (!activeMarket) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">No markets available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {selectedMarket && (
          <button
            onClick={() => setSelectedMarket(null)}
            className="mb-4 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            ← Back to Featured
          </button>
        )}

        <QuadView market={activeMarket} />

        {otherMarkets.length > 0 && (
          <MoreMarkets markets={otherMarkets} onViewPool={handleViewPool} />
        )}
      </main>
    </div>
  );
}
