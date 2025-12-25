import { LockClosedIcon, CogIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { friendlyAddress, showMsg } from "../../ergofunctions/helpers";
import { setWalletSelectOpen, setIsKyaOpen } from "../../redux/appSlice";

const ConnectButton = ({ isFullWidth = false }) => {
  const dispatch = useDispatch();
  const poolState = useSelector((state) => state.app);

  const addressLength = 3; // Adjust this value based on your design

  function handleConnectButton() {
    if (!poolState.kyaAccepted) {
      dispatch(setIsKyaOpen(true));
      showMsg("You must accept KYA", false, true);
      return;
    }

    dispatch(setWalletSelectOpen(true));
  }

  return (
    <div className="flex">
      {poolState.walletState !== "Configure" ? (
        <div className="flex">
          <button
            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={
              poolState.walletState !== "Configure" && !poolState.userAddress
            }
          >
            <span className="truncate">
              {poolState.userAddress &&
                friendlyAddress(poolState.userAddress, addressLength)}
            </span>
          </button>
          <button
            onClick={() => dispatch(setWalletSelectOpen(true))}
            className="p-2 ml-2  border rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Cog6ToothIcon className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnectButton}
          className={`flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md ${poolState.kyaAccepted ? 'text-white bg-blue-600 hover:bg-blue-700' : 'text-blue-700 bg-blue-100 hover:bg-blue-200'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          style={{ width: isFullWidth ? "100%" : "auto" }}
        >
          {!poolState.kyaAccepted && <LockClosedIcon className="w-5 h-5 mr-2" />}
          Connect
        </button>
      )}
    </div>
  );
};

export default ConnectButton;

