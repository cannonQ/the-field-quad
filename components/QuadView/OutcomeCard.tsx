import React from 'react';

const QUAD_COLORS = {
  1: { bg: '#3B82F6', border: '#1e40af', glow: 'rgba(59, 130, 246, 0.3)' },  // Blue
  2: { bg: '#F59E0B', border: '#b45309', glow: 'rgba(245, 158, 11, 0.3)' },  // Yellow
  3: { bg: '#EF4444', border: '#b91c1c', glow: 'rgba(239, 68, 68, 0.3)' },   // Red
  4: { bg: '#10B981', border: '#047857', glow: 'rgba(16, 185, 129, 0.3)' },  // Green
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
  <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
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
        relative p-2.5 md:p-3 rounded-lg transition-all duration-200
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'}
        ${isSelected ? 'ring-2 ring-white ring-offset-1 ring-offset-black' : ''}
      `}
      style={{
        background: colors.bg,
        border: `3px solid ${colors.border}`,
        boxShadow: `0 4px 12px ${colors.glow}`,
        borderRadius: '12px',
      }}
    >
      {isTheField && (
        <div className="absolute top-2 right-2 text-white/70">
          <ShieldIcon />
        </div>
      )}

      <div className="text-white/60 text-[10px] md:text-xs font-medium">
        Option {position}
      </div>

      <div className="text-white text-sm md:text-base font-bold leading-tight mt-0.5 mb-2 pr-6">
        {optionName}
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-white text-base md:text-lg font-bold">
          {estimatedPayout > 0 ? `${estimatedPayout.toFixed(1)}x` : '—'}
        </span>
        <span className="text-white/50 text-[10px] md:text-xs">
          ({poolPercent}% pool)
        </span>
      </div>

      <button
        disabled={disabled}
        className={`
          w-full py-1.5 md:py-2 px-2 rounded
          bg-white/15 border border-white/30
          text-white font-semibold text-xs md:text-sm
          transition-all duration-150
          ${disabled ? '' : 'hover:bg-white/25 active:bg-white/20'}
        `}
      >
        SELECT
      </button>
    </div>
  );
};

export default OutcomeCard;
