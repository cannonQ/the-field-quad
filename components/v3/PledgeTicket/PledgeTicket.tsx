import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Checkbox } from '../../ui/checkbox';
import { Market } from '../../../hooks/useMarkets';
import { usePledge } from '../../../hooks/usePledge';
import { useWallet } from '../../../hooks/useWallet';
import { ShieldIcon } from '../Icons/ShieldIcon';

// Use public folder path for static export
const shieldWhitePath = '/assets/images/field_shield_white.png';

interface PledgeTicketProps {
  isOpen: boolean;
  onClose: () => void;
  market: Market;
  optionIndex: number;
}

export function PledgeTicket({ isOpen, onClose, market, optionIndex }: PledgeTicketProps) {
  const option = market.options[optionIndex];
  const { credits } = useWallet();
  const { submitPledge, isSubmitting } = usePledge();

  const [amount, setAmount] = useState<string>('100');
  const [applyCredits, setApplyCredits] = useState(true);

  const numAmount = parseFloat(amount) || 0;
  const currentMultiplier = option.amount > 0 ? (market.poolTotal / option.amount).toFixed(1) : '1.0';
  const estReturn = (numAmount * parseFloat(currentMultiplier)).toFixed(0);
  const creditDiscount = credits > 0 && applyCredits ? Math.min(credits, numAmount) : 0;
  const youPay = numAmount - creditDiscount;

  // Rebate calculation: ~50% of pledge if that option loses (simplified)
  const rebate = (numAmount * 0.5 * 0.07).toFixed(2);

  const handlePledge = async () => {
    // submitPledge expects (market, optionIndex, amount) - uses market._field internally
    await submitPledge(market, optionIndex, numAmount);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-[#0f1115] border-white/10 text-white p-0 overflow-hidden rounded-2xl">
        <div className="p-6 flex flex-col items-center text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-white"
          >
            ✕
          </button>

          <DialogHeader className="mb-6 w-full">
            <DialogTitle className="text-center text-sm font-medium tracking-wide uppercase text-gray-300">
              PLEDGE: {market.description.split('(')[0]}
            </DialogTitle>
          </DialogHeader>

          <div className="mb-6">
            {option.name === 'THE FIELD' ? (
              <img src={shieldWhitePath} alt="Shield" className="w-16 h-16 mx-auto mb-4 object-contain" />
            ) : (
              <ShieldIcon className="w-16 h-16 mx-auto mb-4 text-white" />
            )}

            <h2 className="text-2xl font-bold mb-1 flex flex-col">
              {option.name === 'THE FIELD' && <span className="mr-2">🛡️</span>}
              {option.name}
            </h2>
            {option.name === 'THE FIELD' && (
              <p className="text-gray-400 text-sm">(All other 61 Teams)</p>
            )}

            <p className="text-blue-400 mt-2 text-sm">Current Multiplier: {currentMultiplier}x</p>
          </div>

          <div className="w-full space-y-4 mb-8">
            <div className="text-left">
              <label className="text-xs font-bold text-gray-400 mb-1 block uppercase">YOU PAY:</label>
              <div className="relative">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-white/5 border-white/10 text-white h-12 pl-4 pr-12 text-lg"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-mono">ERG</span>
              </div>
            </div>

            {credits > 0 && (
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Checkbox
                  id="credits"
                  checked={applyCredits}
                  onCheckedChange={(c) => setApplyCredits(c === true)}
                  className="border-white/20 data-[state=checked]:bg-blue-500"
                />
                <label
                  htmlFor="credits"
                  className="text-sm font-medium leading-none"
                >
                  Apply ${credits.toFixed(2)} Credit Discount
                </label>
              </div>
            )}

            <div className="border-t border-white/10 pt-4 space-y-1 text-right font-mono text-sm">
              <div className="text-gray-300">~ {estReturn} ERG (Estimated)</div>
              <div className="text-gray-500">
                - {rebate} Credits (if {option.name === 'THE FIELD' ? 'Field' : option.name} loses)
              </div>
            </div>
          </div>

          <Button
            onClick={handlePledge}
            disabled={isSubmitting || numAmount <= 0}
            className="w-full h-12 text-lg font-bold bg-white text-black hover:bg-white/90 uppercase tracking-widest"
          >
            {isSubmitting ? 'Pledging...' : '[ PLEDGE NOW ]'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
