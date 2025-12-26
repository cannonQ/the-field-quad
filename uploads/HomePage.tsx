import React from 'react';
import { Header } from '@/components/Header/Header';
import { QuadView } from '@/components/QuadView/QuadView';
import { MoreMarkets } from '@/components/MoreMarkets/MoreMarkets';
import { useMarkets } from '@/hooks/useMarkets';

export default function Home() {
  const { markets, loading, categories, marketsByCategory } = useMarkets();

  if (loading || !markets.length) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen pt-20 pb-10 bg-gradient-to-b from-[#0a0a0a] to-[#111]">
      <Header />
      
      <main className="container mx-auto px-4 flex flex-col items-center">
        {/* Featured Markets Grid */}
        <div className="w-full mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            <QuadView market={markets[0]} compact={false} />
            <QuadView market={markets[1]} compact={false} />
          </div>
        </div>

        {/* More Markets */}
        <MoreMarkets categories={categories} marketsByCategory={marketsByCategory} />
      </main>
    </div>
  );
}
