'use client';

import { useState } from 'react';

export function usePledge() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitPledge = async (
    marketId: string,
    optionIndex: number,
    amount: number,
    applyCredits: boolean
  ) => {
    console.log('DUMMY: Submit pledge', { marketId, optionIndex, amount, applyCredits });

    setIsSubmitting(true);
    setError(null);

    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);

    const txId = 'dummy_tx_' + Date.now();
    console.log('DUMMY: Pledge successful, txId:', txId);

    return { success: true, txId };
  };

  return { submitPledge, isSubmitting, error };
}
