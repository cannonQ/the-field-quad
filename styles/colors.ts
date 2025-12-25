export const QUAD_COLORS = {
  1: { // Blue - Top Left
    bg: 'linear-gradient(to bottom, #2563eb, #1e40af)',
    border: '#60a5fa',
    glow: 'rgba(37, 99, 235, 0.3)',
  },
  2: { // Yellow - Top Right
    bg: 'linear-gradient(to bottom, #f59e0b, #d97706)',
    border: '#fbbf24',
    glow: 'rgba(245, 158, 11, 0.3)',
  },
  3: { // Red - Bottom Left
    bg: 'linear-gradient(to bottom, #ef4444, #dc2626)',
    border: '#f87171',
    glow: 'rgba(239, 68, 68, 0.3)',
  },
  4: { // Green - Bottom Right (THE FIELD)
    bg: 'linear-gradient(to bottom, #10b981, #059669)',
    border: '#34d399',
    glow: 'rgba(16, 185, 129, 0.3)',
  },
} as const;

export const COLORS = {
  bgPrimary: '#0a0a0a',
  bgSecondary: '#1a1a1a',
  border: '#2a2a2a',
  textPrimary: '#ffffff',
  textSecondary: '#a0a0a0',
  textDim: '#808080',
} as const;