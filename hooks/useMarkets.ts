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
  // Reference to the original Field object for make_pledge
  _field: Field;
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

  return {
    markets,
    loading,
    error,
    featuredMarket,
    otherMarkets
  };
}
