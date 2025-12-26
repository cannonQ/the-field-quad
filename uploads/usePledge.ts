import { useState } from 'react';

export function usePledge() {
  // DUMMY - will be replaced with make_pledge() from walletUtils.js
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

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);

    // Simulate success
    const txId = 'dummy_tx_' + Date.now();
    console.log('DUMMY: Pledge successful, txId:', txId);
    
    return { success: true, txId };
  };

  return { submitPledge, isSubmitting, error };
}
