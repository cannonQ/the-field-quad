'use client';

import React, { useState, useEffect } from 'react';
import { ShieldIcon } from '../Icons/ShieldIcon';
import { Market } from '@/hooks/useMarkets';
import { useWallet } from '@/hooks/useWallet';
import { usePledge } from '@/hooks/usePledge';
import { X } from 'lucide-react';

interface PledgeTicketProps {
  market: Market;
  optionIndex: number;
  optionName: string;
  currentMultiplier: number;
  isField: boolean;
  fieldCount: number;
  onClose: () => void;
}

export const PledgeTicket: React.FC<PledgeTicketProps> = ({
  market,
  optionIndex,
  optionName,
  currentMultiplier,
  isField,
  fieldCount,
  onClose,
}) => {
  const [amount, setAmount] = useState<string>('100');
  const [applyCredits, setApplyCredits] = useState(false);
  const { credits } = useWallet();
  const { submitPledge, isSubmitting } = usePledge();

  const numericAmount = parseFloat(amount) || 0;
  const creditDiscount = applyCredits ? Math.min(credits, numericAmount * 0.5) : 0;
  const estimatedReturn = numericAmount * currentMultiplier;
  const rebateIfLoss = numericAmount * 0.5;

  const handlePledge = async () => {
    if (numericAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    console.log('DUMMY: Submitting pledge', {
      marketId: market.id,
      optionIndex,
      amount: numericAmount,
      applyCredits,
    });

    const result = await submitPledge(
      market.id,
      optionIndex,
      numericAmount,
      applyCredits
    );

    if (result.success) {
      alert(`Pledge successful! Transaction ID: ${result.txId}`);
      onClose();
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-2xl border-2 border-gray-700 p-8 max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-white mb-6 uppercase">
          PLEDGE: {market.description}
        </h2>

        <div className="flex flex-col items-center mb-6">
          <ShieldIcon size={80} className="text-white mb-4" />
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {optionName}
            </div>
            {isField && (
              <div className="text-sm text-gray-400">
                (All other {fieldCount} Teams)
              </div>
            )}
          </div>
        </div>

        <div className="mb-6 text-center">
          <div className="text-lg text-white">
            Current Multiplier:{' '}
            <span className="font-bold">{currentMultiplier.toFixed(2)}x</span>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-white font-semibold mb-2 text-sm">
              YOU PAY:
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-lg font-mono focus:outline-none focus:border-blue-500"
              placeholder="100 $USE"
              min="0"
              step="0.01"
            />
          </div>

          {credits > 0 && (
            <label className="flex items-center gap-3 cursor-pointer text-white">
              <input
                type="checkbox"
                checked={applyCredits}
                onChange={(e) => setApplyCredits(e.target.checked)}
                className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-900"
              />
              <span className="text-sm">
                Apply ${creditDiscount.toFixed(2)} Credit Discount
              </span>
            </label>
          )}

          <div className="bg-gray-800 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between text-green-400">
              <span>~ {estimatedReturn.toFixed(0)} $USE</span>
              <span className="text-gray-400">(Estimated Return)</span>
            </div>
            <div className="flex justify-between text-blue-400">
              <span>- ${rebateIfLoss.toFixed(2)} Credits</span>
              <span className="text-gray-400">(if {optionName} loses)</span>
            </div>
          </div>
        </div>

        <button
          onClick={handlePledge}
          disabled={isSubmitting || numericAmount <= 0}
          className="w-full py-4 bg-white text-black font-bold text-lg rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase"
        >
          {isSubmitting ? 'Processing...' : '[ PLEDGE NOW ]'}
        </button>
      </div>
    </div>
  );
};
