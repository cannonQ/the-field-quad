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
    <div className="w-full mb-4 md:mb-6">
      {/* Event Header */}
      <div className="mb-3 md:mb-4">
        <h2 className="text-white text-lg md:text-2xl font-bold mb-1">
          {field.description}
        </h2>
        
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-white/50 text-xs md:text-sm">
          <span>Pool: <span className="text-white/80">{totalPool.toFixed(2)} ERG</span></span>
          <span>•</span>
          <span>{blockHeight ? blockToDate(field.pledge_closure_block, blockHeight) : '...'}</span>
          <span>•</span>
          <span>6% fee</span>
        </div>
      </div>

      {/* Status Banner */}
      {!isPledgingEnabled && (
        <div className="mb-2 md:mb-3 px-2.5 py-1.5 bg-yellow-600/20 border border-yellow-600/30 rounded">
          <span className="text-yellow-400 text-xs md:text-sm font-medium">
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
        <p className="mt-2 text-white/30 text-[10px] md:text-xs italic">
          * The Field includes all other outcomes not listed
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
