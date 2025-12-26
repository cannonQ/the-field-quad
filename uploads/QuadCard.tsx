'use client';

import React from 'react';
import { ShieldIcon } from '../Icons/ShieldIcon';

interface QuadCardProps {
  optionNumber: number;
  name: string;
  multiplier: number;
  poolPercent: number;
  color: 'blue' | 'yellow' | 'red' | 'green';
  isField?: boolean;
  onSelect: () => void;
}

const colorStyles = {
  blue: {
    bg: 'bg-blue-500',
    border: 'border-blue-800',
    text: 'text-white',
  },
  yellow: {
    bg: 'bg-amber-500',
    border: 'border-amber-800',
    text: 'text-white',
  },
  red: {
    bg: 'bg-red-500',
    border: 'border-red-800',
    text: 'text-white',
  },
  green: {
    bg: 'bg-emerald-500',
    border: 'border-emerald-800',
    text: 'text-white',
  },
};

export const QuadCard: React.FC<QuadCardProps> = ({
  optionNumber,
  name,
  multiplier,
  poolPercent,
  color,
  isField = false,
  onSelect,
}) => {
  const styles = colorStyles[color];

  return (
    <div
      className={`${styles.bg} ${styles.border} border-4 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 min-h-[200px] relative overflow-hidden`}
    >
      <div className={`text-center ${styles.text}`}>
        <div className="text-sm font-semibold opacity-90 mb-1">
          Option {optionNumber}:
        </div>
        <div className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          {name}
          {isField && <ShieldIcon size={28} className="text-white" />}
        </div>
        <div className="text-base font-medium opacity-90">
          Est. Payout: {multiplier.toFixed(1)}x
        </div>
        <div className="text-sm opacity-80">(Pool: {poolPercent}%)</div>
      </div>

      <button
        onClick={onSelect}
        className="mt-2 px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors text-sm"
      >
        [ SELECT ]
      </button>
    </div>
  );
};
