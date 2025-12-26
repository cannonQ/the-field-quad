import { useState } from 'react';
import { make_pledge } from '../ergofunctions/walletUtils';
import { Market } from './useMarkets';

interface PledgeResult {
  success: boolean;
  txId?: string;
  error?: string;
}

export function usePledge() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Submit a pledge to a market
   * @param market - The Market object (contains _field reference)
   * @param optionIndex - Index of the selected option (0-based)
   * @param amount - Amount in ERG to pledge
   */
  const submitPledge = async (
    market: Market,
    optionIndex: number,
    amount: number
  ): Promise<PledgeResult> => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Get the original field's market_box from the _field reference
      const marketBox = market._field?.market_box;

      if (!marketBox) {
        throw new Error('Market box not found. Please refresh and try again.');
      }

      // Call make_pledge with (field.market_box, optionIndex, amount)
      // Amount is in ERG, make_pledge expects ERG (converts to nanoERG internally)
      const result = await make_pledge(marketBox, optionIndex, amount);

      if (result) {
        setIsSubmitting(false);
        return {
          success: true,
          txId: typeof result === 'string' ? result : 'Transaction submitted'
        };
      } else {
        throw new Error('Transaction failed or was cancelled');
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to submit pledge';
      setError(errorMessage);
      setIsSubmitting(false);
      return { success: false, error: errorMessage };
    }
  };

  return { submitPledge, isSubmitting, error };
}
