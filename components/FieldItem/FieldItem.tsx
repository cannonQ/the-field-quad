import { Field } from "ergofunctions/fields";
import {
  addNumberCommas,
  blockToDate,
  formatValueWithDP,
} from "ergofunctions/frontend_helpers";
import React, { useState } from "react";
import Button from "../Button/Button";
import PledgeModal from "./PledgeModal/PledgeModal";
import TxSubmitted from "../TxSubmitted";
import { claim_winnings, make_pledge } from "../../ergofunctions/walletUtils";
import { useSelector } from "react-redux";
import { SelectorAppState } from "interfaces/AppStateInterface";
import { Tooltip } from "@chakra-ui/react";
import { showMsg } from "ergofunctions/helpers";
 
interface FieldProps {
  data: Field;
}

const FieldItem = ({ data }: FieldProps) => {
  const { blockHeight, userTokens } = useSelector(
    (state: SelectorAppState) => state.app
  );

  // Creating transaction state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [openPledgeModal, setOpenPledgeModal] = useState<boolean>(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const handleMakePledge = async () => {
    console.log("Making pledge");
    setOpenPledgeModal(true);
  };

  const isWinner =
    data?.winner_token && userTokens
      ? userTokens[data.winner_token]
        ? userTokens[data.winner_token]
        : null
      : null;

  const submitPledge = async (optionSelected: number, pledgeSize: number) => {
    setIsSubmitting(true);
    const txId = await make_pledge(
      data?.market_box,
      optionSelected,
      pledgeSize
    );
    setIsSubmitting(false);

    if (txId) {
      setTransactionId(txId);
      setOpenPledgeModal(false);
    } else {
      // Create a toast to notify the user of the error
    }
    return;
  };

  const handleClaim = () => {
    if (!data?.collection_nft || !data?.winner_token || !isWinner) {
      showMsg("An error occurred getting field info", true);
      return;
    }
    claim_winnings(data?.collection_nft, data?.winner_token, isWinner?.amount);
  };

  const closedField = data.marketState === "past";
  return (
    <div
      className={`transition-all w-full  p-4 text-white hover:shadow-lg duration-200 rounded ${
        closedField ? "bg-black/40" : "bg-black"
      }`}
    >
      <div className="flex flex-col justify-between h-full">
        <div>
          <p className="font-bold">Field #1 {closedField && "- closed"}</p>
          <p className="text-sm">{data.description}</p>
          <div className="mt-6">
            {data.pledgesOnEachOption.map((tp, index) => {
              return (
                <div
                  key={`${tp.option}-${index}`}
                  className="flex flex-row items-center space-x-3 justify-between"
                >
                  <p>{tp.option || "-"}</p>
                  <p className="font-semibold">
                    {formatValueWithDP(tp.Amount, 4)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        {data.marketState !== "past" ? (
          <div className="mt-6">
            <div className="flex mt-5 justify-end text-sm relative">
              <Button disabled={!data.ableToPledge} onClick={handleMakePledge}>
                Make Pledge
              </Button>
              {!data.ableToPledge && (
                <Tooltip label="Pending" placement="top">
                  <div className="absolute flex h-full w-full"></div>
                </Tooltip>
              )}
            </div>
            <div>
              <p className="text-sm text-right mt-2">
                {/* Closes on block {addNumberCommas(data.pledge_closure_block)} */}
                Ends in{" "}
                {blockHeight &&
                  blockToDate(data.pledge_closure_block, blockHeight)}
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="mt-3 text-right">Winner: {data.winner}</div>
            {!!isWinner && (
              <div className="flex mt-2 justify-end text-sm relative">
                <Button onClick={handleClaim}>Claim Winnings</Button>
              </div>
            )}
          </div>
        )}
      </div>

      <PledgeModal
        isOpen={openPledgeModal}
        setOpen={() => setOpenPledgeModal(!openPledgeModal)}
        submitPledge={submitPledge}
        submitting={isSubmitting}
        fieldOptions={data.pledgesOnEachOption}
      />
      <TxSubmitted
        transactionId={transactionId}
        onClose={() => setTransactionId(null)}
      />
    </div>
  );
};

export default FieldItem;
