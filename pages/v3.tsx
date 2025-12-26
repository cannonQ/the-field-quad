import React, { useState } from 'react';
import Head from 'next/head';
import { Header } from '../components/v3/Header/Header';
import { QuadView } from '../components/v3/QuadView/QuadView';
import { MoreMarkets } from '../components/v3/MoreMarkets/MoreMarkets';
import { useMarkets, Market } from '../hooks/useMarkets';

export default function V3Page() {
  const { markets, loading, error, categories, marketsByCategory } = useMarkets();
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);

  const handleViewPool = (market: Market) => {
    setSelectedMarket(market);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToFeatured = () => {
    setSelectedMarket(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#111] flex items-center justify-center">
        <div className="text-white text-xl">Loading markets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#111] flex items-center justify-center">
        <div className="text-red-500 text-xl">Error loading markets: {error}</div>
      </div>
    );
  }

  if (!markets.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#111] flex items-center justify-center">
        <div className="text-white text-xl">No markets available</div>
      </div>
    );
  }

  // If a market is selected from MoreMarkets, show it in a single QuadView
  if (selectedMarket) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#111]">
        <Head>
          <title>The Field - {selectedMarket.description}</title>
          <meta name="description" content="Parimutuel prediction markets on Ergo" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header />

        <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <button
            onClick={handleBackToFeatured}
            className="mb-6 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            ← Back to Featured Events
          </button>

          <div className="flex justify-center">
            <QuadView market={selectedMarket} />
          </div>
        </main>
      </div>
    );
  }

  // Default view: Two featured events side by side
  const featuredMarkets = markets.slice(0, 2);
  const hasSecondFeatured = featuredMarkets.length > 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#111]">
      <Head>
        <title>The Field - Prediction Markets</title>
        <meta name="description" content="Parimutuel prediction markets on Ergo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="pt-20 pb-10 container mx-auto px-4 flex flex-col items-center">
        {/* Featured Markets Grid - Two side by side on desktop */}
        <div className="w-full mb-8">
          <div
            className={`grid gap-6 max-w-6xl mx-auto ${
              hasSecondFeatured ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
            }`}
          >
            <QuadView market={featuredMarkets[0]} compact={hasSecondFeatured} />
            {hasSecondFeatured && (
              <QuadView market={featuredMarkets[1]} compact={true} />
            )}
          </div>
        </div>

        {/* More Markets Section */}
        <MoreMarkets
          categories={categories}
          marketsByCategory={marketsByCategory}
          onViewPool={handleViewPool}
        />
      </main>
    </div>
  );
}
