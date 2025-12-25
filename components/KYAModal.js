import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsKyaOpen, setKyaAccepted } from "../redux/appSlice";
import Modal from "../components/Modal/Modal";
import Button from "../components/Button/Button";
import { XMarkIcon } from "@heroicons/react/24/outline";
const kyaStorageName = "kya";

export default function KYAModal() {
  const [isOpen, setOpen] = useState(false);

  // redux
  const { isKyaOpen } = useSelector((state) => state.app);
  const dispatch = useDispatch();

  function acceptKYA() {
    localStorage.setItem(
      kyaStorageName,
      JSON.stringify({
        accepted: true,
        version: "1.0",
      })
    );
    dispatch(setIsKyaOpen(false));
    dispatch(setKyaAccepted(true));
    return;
  }

  function denyKYA() {
    localStorage.setItem(
      kyaStorageName,
      JSON.stringify({
        accepted: false,
        version: "1.0",
      })
    );
    dispatch(setIsKyaOpen(false));
    return;
  }

  useEffect(() => {
    const hasAccepted = JSON.parse(localStorage.getItem(kyaStorageName));

    if (!hasAccepted || !hasAccepted.accepted) {
      // onOpen();
      dispatch(setIsKyaOpen(true));
    } else {
      dispatch(setKyaAccepted(true));
    }
  }, []);

  return (
    <Fragment>
      <Modal
        open={isKyaOpen}
        setOpen={() => setOpen(true)}
        key={"kyamodal"}
        size="max-w-2xl"
      >
        <div className="">
          <div className="p-4 relative">
            <div className="justify-right text-right w-full absolute right-0 top-3">
              <Button onClick={denyKYA} className="ml-auto">
                <XMarkIcon className="w-4 h-4" />
              </Button>
            </div>

            <p className="text-xl mb-2">Know Your Assumptions (KYA)</p>
            <div>
              <p mb="4">
                This website provides the means for users to interact with the
                The Field protocol. <br />
              </p>

              <p className="mb-4 mt-2">
                <span fontWeight={"semibold"}>
                  By Accepting these KYA, you agree that:
                </span>

                <ol type="1">
                  <li>1. You will use TheField.io at your own risk;</li>
                  <li>2. Only YOU are responsible for your own assets;</li>
                  <li>
                    3. The Field and its smart contracts meet your expectations
                  </li>
                </ol>
              </p>

              <p className="mb-4">
                <p className="font-semibold">Notice that:</p>
                <ul>
                  <li>
                    TheField.io operates on a live blockchain, thus all
                    transactions are final and irreversible.
                  </li>
                  <li>Every transaction can be viewed via Ergo Explorer</li>
                  <li>
                    By creating an order you send your funds to a specific
                    smart-contract, all such contracts are wired into the user
                    interface. Thus, orders are created entirely in your browser
                    (on your machine).
                  </li>
                </ul>
              </p>

              <p className="mb-4">
                <p className="mb-1 font-semibold">
                  The TheField.io team doesn{"'"}t guarantee the absence of bugs
                  and errors.
                </p>
                TheField.io is without a Know Your Customer (KYC) process and
                can offer NO assistance if a user is hacked or cheated out of
                passwords, currency or private wallet keys.
              </p>
            </div>
            <div className="mt-4">
              <Button
                className="w-full"
                colorScheme={"brand"}
                onClick={acceptKYA}
              >
                I understand the risks and accept KYA
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
}
