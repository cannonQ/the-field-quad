import { useSelector } from 'react-redux';
import { SelectorAppState } from '../interfaces/AppStateInterface';
import { Field, PledgesOnEachOption } from '../ergofunctions/fields';

export interface MarketOption {
  name: string;
  amount: number;
  percent: number;
}

export interface Market {
  id: string;
  description: string;
  poolTotal: number;
  endsIn: string;
  options: MarketOption[];
  ableToPledge: boolean;
  isPast: boolean;
  winner?: string;
  category: string;
  // Reference to the original Field object for make_pledge
  _field: Field;
}

// Default categories for the v3 UI
const DEFAULT_CATEGORIES = [
  'NCAA',
  'NFL',
  'NBA',
  'MLB',
  'POLITICS',
  'ENTERTAINMENT',
  'CRYPTO',
  'OTHER',
];

/**
 * Infer category from market description
 */
function inferCategory(description: string): string {
  const desc = description.toLowerCase();

  if (desc.includes('ncaa') || desc.includes('march madness') || desc.includes('college')) {
    return 'NCAA';
  }
  if (desc.includes('nfl') || desc.includes('super bowl') || desc.includes('football')) {
    return 'NFL';
  }
  if (desc.includes('nba') || desc.includes('basketball')) {
    return 'NBA';
  }
  if (desc.includes('mlb') || desc.includes('baseball') || desc.includes('world series')) {
    return 'MLB';
  }
  if (desc.includes('election') || desc.includes('president') || desc.includes('congress') || desc.includes('vote')) {
    return 'POLITICS';
  }
  if (desc.includes('oscar') || desc.includes('grammy') || desc.includes('emmy') || desc.includes('movie')) {
    return 'ENTERTAINMENT';
  }
  if (desc.includes('bitcoin') || desc.includes('btc') || desc.includes('eth') || desc.includes('crypto')) {
    return 'CRYPTO';
  }

  return 'OTHER';
}

/**
 * Convert a Field from Redux to a Market for the v2 UI
 */
function fieldToMarket(field: Field, index: number): Market {
  // Calculate total pool from all pledges
  const totalPledges = field.pledgesOnEachOption.reduce(
    (sum, pledge) => sum + pledge.Amount,
    0
  );

  // Convert pledges to market options with percentages
  const options: MarketOption[] = field.pledgesOnEachOption.map(
    (pledge: PledgesOnEachOption) => ({
      name: pledge.option,
      amount: pledge.Amount || 1, // Avoid division by zero
      percent: totalPledges > 0 ? Math.round((pledge.Amount / totalPledges) * 100) : 0,
    })
  );

  // Calculate time remaining based on pledge_closure_block
  // This is a simplified version - in production you'd use actual block times
  const blocksRemaining = field.pledge_closure_block - Date.now() / 120000;
  const endsIn = blocksRemaining > 0
    ? `${Math.floor(blocksRemaining / 60)}h ${Math.floor(blocksRemaining % 60)}m`
    : 'Ended';

  return {
    id: String(index),
    description: field.description,
    poolTotal: totalPledges / 1_000_000_000, // Convert nanoERG to ERG
    endsIn,
    options,
    ableToPledge: field.ableToPledge,
    isPast: !field.ableToPledge || field.marketState !== 'active',
    winner: field.winner !== -1 ? String(field.winner) : undefined,
    category: inferCategory(field.description),
    _field: field, // Keep reference for make_pledge
  };
}

export function useMarkets() {
  const fields = useSelector((state: SelectorAppState) => state.app.fields);
  const loading = useSelector((state: SelectorAppState) => state.app.loadingFields);
  const error = useSelector((state: SelectorAppState) => state.app.errorFields);

  // Convert fields to markets
  const markets: Market[] = fields.map(fieldToMarket);

  // First market is featured, rest are "other markets"
  const featuredMarket = markets[0] || null;
  const otherMarkets = markets.slice(1);

  // Group markets by category for v3 UI
  const marketsByCategory: Record<string, Market[]> = {};
  DEFAULT_CATEGORIES.forEach((cat) => {
    marketsByCategory[cat] = [];
  });
  markets.forEach((market) => {
    if (marketsByCategory[market.category]) {
      marketsByCategory[market.category].push(market);
    } else {
      marketsByCategory['OTHER'].push(market);
    }
  });

  // Get categories that have markets (for display)
  const categories = DEFAULT_CATEGORIES;

  return {
    markets,
    loading,
    error,
    featuredMarket,
    otherMarkets,
    categories,
    marketsByCategory,
  };
}
