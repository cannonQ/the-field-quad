import React, { Fragment } from "react";
import { FaCheckSquare } from "react-icons/fa";
import { copyToClipboard, friendlyToken } from "ergofunctions/helpers";
import Modal from "./Modal/Modal";

export default function TxSubmitted({ transactionId, onClose }) {
  function gotoTransaction() {
    window.open(
      `https://explorer.ergoplatform.com/en/transactions/${transactionId}`,
      "_blank"
    );
  }

  const SubmitDisplay = () => {
    return (
      <Fragment>
        <div className="transition-opacity" />
        <div className=" z-10">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className=" align-bottom rounded-lg text-left transform transition-all sm:align-middle sm:max-w-lg sm:w-full">
              <div className="p-2">
                <div className="">
                  <div className="flex flex-row items-center mb-4">
                    <FaCheckSquare className="h-6 w-6 text-green-600" />
                    <h3 className="text-lg leading-6 text-gray-100 dark:text-white ml-2 font-semibold">
                      Transaction Submitted
                    </h3>
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="">
                      <div className="text-white text-center cursor-pointer hover:opacity-70 transition-opacity mt-5 mb-6 outline outline-white/20 py-4 rounded"
                          onClick={() => copyToClipboard(transactionId)}
                          >
                        <p
                          className="text-green-500  break-words text-xl"
                        >
                          {friendlyToken(transactionId || "", 8)}
                        </p>
                        <p className="text-sm text-gray-300 mt-1">
                        Transaction ID (click to copy)
                        </p>
                      </div>
                      <p className="text-xs text-gray-300">
                        Now we wait until it is confirmed on the blockchain. It
                        should take about 2-10 minutes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="sm:flex sm:flex-row-reverse mt-4">
                <button
                  onClick={gotoTransaction}
                  type="button"
                  className="transition-colors w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  View Tx on Explorer
                </button>
                <button
                  onClick={onClose}
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  };

  return (
    <Modal open={!!transactionId} setOpen={onClose}>
      <SubmitDisplay />
    </Modal>
  );
}
