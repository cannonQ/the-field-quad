import React from 'react';
import { Market } from '@/hooks/useMarkets';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function MarketCard({ market }: { market: Market }) {
  // Extract top 3 options
  const topOptions = market.options.slice(0, 3);
  const icon = market.description.includes('F 1') ? '🏎️' : 
               market.description.includes('Election') ? '🗳️' : 
               market.description.includes('Oscars') ? '🎬' : '📅';

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
                <span className="truncate max-w-[150px]">{idx + 1}. {opt.name}</span>
             </div>
          ))}
       </div>

       <Button variant="outline" className="w-full border-white/20 bg-transparent text-white hover:bg-white/10 text-xs h-8 uppercase">
         [VIEW POOL]
       </Button>
    </div>
  );
}
