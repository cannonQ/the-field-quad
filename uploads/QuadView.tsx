'use client';

import React, { useState } from 'react';
import { QuadFrame } from './QuadFrame';
import { QuadCard } from './QuadCard';
import { PledgeTicket } from '../PledgeTicket/PledgeTicket';
import { Market, MarketOption } from '@/hooks/useMarkets';

interface QuadViewProps {
  market: Market;
}

export const QuadView: React.FC<QuadViewProps> = ({ market }) => {
  const [selectedOption, setSelectedOption] = useState<{
    index: number;
    option: MarketOption;
  } | null>(null);

  const handleSelect = (index: number, option: MarketOption) => {
    console.log('DUMMY: Selected option', { index, option });
    setSelectedOption({ index, option });
  };

  const handleClose = () => {
    setSelectedOption(null);
  };

  const colors: Array<'blue' | 'yellow' | 'red' | 'green'> = [
    'blue',
    'yellow',
    'red',
    'green',
  ];

  const fieldTeams = market.options.length === 4 ? 61 : 0;

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          FEATURED EVENT: {market.description.toUpperCase()}
        </h2>
        <div className="flex gap-4 text-white text-lg">
          <span>Pool Total: ${market.poolTotal.toLocaleString()}</span>
          <span>Ends in: {market.endsIn}</span>
        </div>
      </div>

      <QuadFrame>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {market.options.map((option, index) => (
            <QuadCard
              key={index}
              optionNumber={index + 1}
              name={option.name}
              multiplier={market.poolTotal / option.amount}
              poolPercent={option.percent}
              color={colors[index]}
              isField={option.name === 'THE FIELD'}
              onSelect={() => handleSelect(index, option)}
            />
          ))}
        </div>

        {market.options[3]?.name === 'THE FIELD' && (
          <div className="mt-4 text-center text-white text-sm opacity-80">
            *The Field includes: UNC, Arizona, Tennessee + {fieldTeams} others
          </div>
        )}
      </QuadFrame>

      {selectedOption && (
        <PledgeTicket
          market={market}
          optionIndex={selectedOption.index}
          optionName={selectedOption.option.name}
          currentMultiplier={market.poolTotal / selectedOption.option.amount}
          isField={selectedOption.option.name === 'THE FIELD'}
          fieldCount={fieldTeams}
          onClose={handleClose}
        />
      )}
    </>
  );
};
