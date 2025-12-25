import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { QuadGrid } from './QuadGrid';
import { Field } from '../../ergofunctions/fields';
import { SelectorAppState } from '../../interfaces/AppStateInterface';
import { blockToDate } from '../../ergofunctions/frontend_helpers';
import PledgeModal from '../FieldItem/PledgeModal/PledgeModal';
import TxSubmitted from '../TxSubmitted';
import { make_pledge } from '../../ergofunctions/walletUtils';

interface QuadViewProps {
  field: Field;
}

export const QuadView: React.FC<QuadViewProps> = ({ field }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showPledgeModal, setShowPledgeModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  
  const { blockHeight } = useSelector((state: SelectorAppState) => state.app);

  const totalPool = field.pledgesOnEachOption.reduce((sum, opt) => sum + opt.Amount, 0);
  const isPledgingEnabled = field.ableToPledge && field.marketState !== 'past';

  const handleSelectOption = (index: number) => {
    setSelectedOption(index);
    setShowPledgeModal(true);
  };

  const submitPledge = async (optionSelected: number, pledgeSize: number) => {
    setIsSubmitting(true);
    const txId = await make_pledge(field.market_box, optionSelected, pledgeSize);
    setIsSubmitting(false);

    if (txId) {
      setTransactionId(txId);
      setShowPledgeModal(false);
    }
  };

  return (
    <div className="w-full mb-8">
      {/* Event Header */}
      <div className="mb-6">
        <div className="text-white/50 text-xs md:text-sm uppercase tracking-widest font-medium mb-1">
          Featured Event
        </div>
        
        <h2 className="text-white text-2xl md:text-3xl font-bold mb-3">
          {field.description}
        </h2>
        
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-white/60 text-sm">
          <span>Pool Total: <span className="text-white font-medium">{totalPool.toFixed(2)} ERG</span></span>
          <span className="text-white/30">•</span>
          <span>Ends: {blockHeight ? blockToDate(field.pledge_closure_block, blockHeight) : '...'}</span>
          <span className="text-white/30">•</span>
          <span>6% fee</span>
          <span className="text-white/30">•</span>
          <span className="text-green-400">Instant settle</span>
        </div>
      </div>

      {/* Status Banner */}
      {!isPledgingEnabled && (
        <div className="mb-4 px-4 py-2 bg-yellow-600/20 border border-yellow-600/40 rounded-lg">
          <span className="text-yellow-400 text-sm font-medium">
            {field.marketState === 'past' ? `Winner: ${field.winner}` : 'Pledging not yet active'}
          </span>
        </div>
      )}

      {/* Quad Grid */}
      <QuadGrid
        options={field.pledgesOnEachOption}
        onSelectOption={handleSelectOption}
        selectedOption={selectedOption}
        totalPool={totalPool}
        disabled={!isPledgingEnabled}
      />

      {/* Field Footnote */}
      {field.pledgesOnEachOption.length >= 4 && (
        <p className="mt-4 text-white/40 text-sm italic">
          * The Field includes all other outcomes not listed above
        </p>
      )}

      {/* Reuse existing PledgeModal */}
      <PledgeModal
        isOpen={showPledgeModal}
        setOpen={() => setShowPledgeModal(!showPledgeModal)}
        submitPledge={submitPledge}
        submitting={isSubmitting}
        fieldOptions={field.pledgesOnEachOption}
      />

      <TxSubmitted
        transactionId={transactionId}
        onClose={() => setTransactionId(null)}
      />
    </div>
  );
};

export default QuadView;