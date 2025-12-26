import React, { useState } from 'react';
import { QuadFrame } from './QuadFrame';
import { QuadCard } from './QuadCard';
import { Market } from '@/hooks/useMarkets';
import { PledgeTicket } from '../PledgeTicket/PledgeTicket';

interface QuadViewProps {
  market: Market;
  compact?: boolean;
}

export function QuadView({ market, compact = false }: QuadViewProps) {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    setSelectedOptionIndex(index);
  };

  const handleClosePledge = () => {
    setSelectedOptionIndex(null);
  };

  return (
    <div className={`w-full ${compact ? 'max-w-xs' : 'max-w-3xl'} mx-auto`}>
      <div className={`mb-4 text-left px-4 ${compact ? 'mb-3' : 'mb-6'}`}>
        <h2 className={`${compact ? 'text-base' : 'text-xl md:text-2xl'} font-bold text-white mb-1`}>
          FEATURED EVENT : {market.description}
        </h2>
        <div className={`text-gray-400 ${compact ? 'text-xs' : 'text-sm'} font-mono`}>
          <p>Pool Total: ${market.poolTotal.toLocaleString()}</p>
          <p>Ends in: {market.endsIn}</p>
        </div>
      </div>

      <QuadFrame compact={compact}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-1">
            {/* 
              Mapping order: 
              0: Top Left (Blue)
              1: Top Right (Yellow)
              2: Bottom Left (Red) (Usually 3rd in array, but visual placement matters)
              3: Bottom Right (Green - Field)
             */}
             
          <QuadCard 
            option={market.options[0]} 
            index={0} 
            color="blue" 
            poolTotal={market.poolTotal}
            onSelect={() => handleSelect(0)}
            compact={compact}
          />
          <QuadCard 
            option={market.options[1]} 
            index={1} 
            color="yellow" 
            poolTotal={market.poolTotal}
            onSelect={() => handleSelect(1)}
            compact={compact}
          />
          <QuadCard 
            option={market.options[2]} 
            index={2} 
            color="red" 
            poolTotal={market.poolTotal}
            onSelect={() => handleSelect(2)}
            compact={compact}
          />
          <QuadCard 
            option={market.options[3]} 
            index={3} 
            color="green" 
            poolTotal={market.poolTotal}
            onSelect={() => handleSelect(3)}
            compact={compact}
          />
        </div>
      </QuadFrame>

      {selectedOptionIndex !== null && (
        <PledgeTicket 
            isOpen={true}
            onClose={handleClosePledge}
            market={market}
            optionIndex={selectedOptionIndex}
        />
      )}
    </div>
  );
}
