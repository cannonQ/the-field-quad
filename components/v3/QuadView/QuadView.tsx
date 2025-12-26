import React, { useState } from 'react';
import { QuadFrame } from './QuadFrame';
import { QuadCard } from './QuadCard';
import { Market } from '../../../hooks/useMarkets';
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

  // Ensure we have at least 4 options for the quad layout
  const options = market.options.slice(0, 4);
  const colors: Array<'blue' | 'yellow' | 'red' | 'green'> = ['blue', 'yellow', 'red', 'green'];

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
          {options.map((option, index) => (
            <QuadCard
              key={index}
              option={option}
              index={index}
              color={colors[index]}
              poolTotal={market.poolTotal}
              onSelect={() => handleSelect(index)}
              compact={compact}
            />
          ))}
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
