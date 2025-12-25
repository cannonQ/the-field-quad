import React from 'react';
import { OutcomeCard } from './OutcomeCard';

interface PledgesOnEachOption {
  option: string;
  Amount: number;
}

interface QuadGridProps {
  options: PledgesOnEachOption[];
  onSelectOption: (index: number) => void;
  selectedOption: number | null;
  totalPool: number;
  disabled?: boolean;
}

export const QuadGrid: React.FC<QuadGridProps> = ({
  options,
  onSelectOption,
  selectedOption,
  totalPool,
  disabled = false,
}) => {
  const optionsWithStats = options.map((opt, index) => {
    const poolPercent = totalPool > 0 ? Math.round((opt.Amount / totalPool) * 100) : 0;
    const estimatedPayout = opt.Amount > 0 ? totalPool / opt.Amount : 0;
    return { ...opt, poolPercent, estimatedPayout };
  });

  // Ensure exactly 4 options
  while (optionsWithStats.length < 4) {
    const isFieldSlot = optionsWithStats.length === 3;
    optionsWithStats.push({
      option: isFieldSlot ? 'THE FIELD' : `Option ${optionsWithStats.length + 1}`,
      Amount: 0,
      poolPercent: 0,
      estimatedPayout: 0,
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
      {optionsWithStats.slice(0, 4).map((opt, index) => (
        <OutcomeCard
          key={`${opt.option}-${index}`}
          position={(index + 1) as 1 | 2 | 3 | 4}
          optionName={opt.option}
          poolPercent={opt.poolPercent}
          estimatedPayout={opt.estimatedPayout}
          isTheField={index === 3}
          onSelect={() => onSelectOption(index)}
          isSelected={selectedOption === index}
          disabled={disabled}
        />
      ))}
    </div>
  );
};

export default QuadGrid;