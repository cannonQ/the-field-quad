import React from 'react';

const QUAD_COLORS = {
  1: { bg: 'linear-gradient(to bottom, #2563eb, #1e40af)', border: '#60a5fa', glow: 'rgba(37, 99, 235, 0.3)' },
  2: { bg: 'linear-gradient(to bottom, #f59e0b, #d97706)', border: '#fbbf24', glow: 'rgba(245, 158, 11, 0.3)' },
  3: { bg: 'linear-gradient(to bottom, #ef4444, #dc2626)', border: '#f87171', glow: 'rgba(239, 68, 68, 0.3)' },
  4: { bg: 'linear-gradient(to bottom, #10b981, #059669)', border: '#34d399', glow: 'rgba(16, 185, 129, 0.3)' },
} as const;

interface OutcomeCardProps {
  position: 1 | 2 | 3 | 4;
  optionName: string;
  poolPercent: number;
  estimatedPayout: number;
  isTheField?: boolean;
  onSelect: () => void;
  isSelected?: boolean;
  disabled?: boolean;
}

const ShieldIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export const OutcomeCard: React.FC<OutcomeCardProps> = ({
  position,
  optionName,
  poolPercent,
  estimatedPayout,
  isTheField = false,
  onSelect,
  isSelected = false,
  disabled = false,
}) => {
  const colors = QUAD_COLORS[position];

  return (
    <div
      onClick={disabled ? undefined : onSelect}
      className={`
        relative p-4 md:p-5 rounded-xl transition-all duration-300
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1'}
        ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''}
      `}
      style={{
        background: colors.bg,
        border: `2px solid ${colors.border}`,
        boxShadow: `0 0 20px ${colors.glow}`,
      }}
    >
      {isTheField && (
        <div className="absolute top-3 right-3 text-white/80">
          <ShieldIcon />
        </div>
      )}

      <div className="text-white/70 text-xs md:text-sm font-medium mb-1">
        Option {position}:
      </div>

      <div className="text-white text-xl md:text-2xl font-bold mb-4 pr-8">
        {optionName}
      </div>

      <div className="space-y-1 mb-4">
        <div className="text-white text-lg font-semibold">
          Est. Payout: {estimatedPayout > 0 ? `${estimatedPayout.toFixed(1)}x` : '—'}
        </div>
        <div className="text-white/70 text-sm">
          (Pool: {poolPercent}%)
        </div>
      </div>

      <button
        disabled={disabled}
        className={`
          w-full py-2.5 px-4 rounded-lg
          bg-white/20 border border-white/40
          text-white font-semibold text-sm
          transition-all duration-200
          ${disabled ? 'opacity-50' : 'hover:bg-white/30 active:scale-95'}
        `}
      >
        [ SELECT ]
      </button>
    </div>
  );
};

export default OutcomeCard;