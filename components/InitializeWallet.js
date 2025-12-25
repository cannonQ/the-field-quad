import React, {
  useState,
  useEffect,
  Fragment,
  useContext,
  useRef,
  useLayoutEffect,
} from "react";
import { useRouter } from "next/router";
//import Image from "next/image";
// import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import {
  setBlockHeight,
  setErgPrice,
  setIsKyaOpen,
  setUserAddress as setReduxUserAddress,
  setUserAddressList,
  setUserTokens,
  setWalletSelectOpen,
  setWalletState,
} from "../redux/appSlice";

import {
  Box,
  // Modal,
  // ModalContent,
  // ModalOverlay,
  // ModalBody,
  // ModalFooter,
  useDisclosure,
  Text,
  Icon,
  useColorMode,
  // ModalHeader,
  ButtonGroup,
  IconButton,
  OrderedList,
  ListItem,
  Show,
  useBreakpointValue,
  Stack,
  SimpleGrid,
  useDimensions,
} from "@chakra-ui/react";
// import { LockIcon, SettingsIcon } from "@chakra-ui/icons";
import { FaWallet } from "react-icons/fa";
import { GiSubmarine } from "react-icons/gi";
import { useToast } from "@chakra-ui/react";
import QRCode from "react-qr-code";
import { v4 as uuidv4 } from "uuid";

import Button from "./Button/Button";

// import logoImage from '/assets/images/Ergosaurslogo.png'
// import yoroiWallet from '/assets/images/yoroi-logo-shape-blue.inline.svg';

import {
  getWalletAddress,
  getWalletType,
  isAddressValid,
  isAssembler,
  isWalletNode,
  isWalletSaved,
  isWalletYoroi,
  showMsg,
  friendlyERG,
  friendlyAddress,
  getWholeWallet,
} from "../ergofunctions/helpers";
import {
  getWalletAddresses,
  getWalletErgs,
  getConnectorAddress,
  getUtilityTokens,
  setupWallet,
  checkIfConnected,
  getTokens,
} from "../ergofunctions/walletUtils";
import { longToCurrency } from "../ergofunctions/serializer";
import { MdPhoneAndroid } from "react-icons/md";
import { apiRoot, pools } from "../ergofunctions/consts";
import Modal from "./Modal/Modal";
import { currentHeight } from "ergofunctions/explorer";

export default function InitializeWallet() {
  const basePath = process.env.NODE_ENV === 'production' ? '/the-field-quad' : '';
  const { colorMode, toggleColorMode } = useColorMode();
  // const addressLength = useBreakpointValue({ base: 3, lg: 5 }, { ssr: true });

  const poolState = useSelector((state) => state.app);

  const dispatch = useDispatch();

  const toast = useToast();

  const qrRef = useRef(null);

  let type = "yoroi";
  let walletSt = "Configure";
  let userAddr = "";

  //For Modal
  const finalRef = React.useRef();

  // const [walletState, setWalletState] = useState(walletSt);

  const [processing, setProcessing] = useState(false); // not sure i need this
  const [ergopayUUID, setErgopayUUID] = useState(null);
  const [qrWidth, setQrWidth] = useState(148);

  const [modalPage, setModalPage] = useState("main");

  function handleConnectButton() {
    if (!poolState.kyaAccepted) {
      // poolState.isKyaOpen;
      dispatch(setIsKyaOpen(true));
      showMsg("You must accept KYA", false, true);
      return;
    }
  }

  function handleClearButton() {
    setModalPage("clear");
  }

  function toggle() {
    let type = "yoroi";
    if (isWalletSaved()) type = getWalletType();

    setProcessing(false);

    setModalPage("main");

    dispatch(setWalletSelectOpen(false));
  }

  function clearWallet(message = true) {
    sessionStorage.removeItem("wallet");
    localStorage.removeItem("wallet");

    dispatch(setWalletState("Configure"));
    dispatch(setReduxUserAddress(""));
    dispatch(setUserAddressList(undefined));

    if (message) {
      showMsg("Successfully cleared wallet info from local storage.");
    }

    // OR walletState !== "ergopay"
    if (
      poolState.walletState === "safew" ||
      poolState.walletState === "nautilus"
    ) {
      ergoConnector[poolState.walletState].disconnect();
      window.location.reload(false);
    }
    setErgopayUUID(uuidv4());
    toggle();

    // setModalPage("main")
  }

  // Used when they manually disconnect their wallet
  function resetWallet() {
    sessionStorage.removeItem("wallet");
    localStorage.removeItem("wallet");

    dispatch(setWalletState("Configure"));
    dispatch(setReduxUserAddress(""));
    dispatch(setUserAddressList(undefined));

    setErgopayUUID(uuidv4());
  }

  async function handleWalletConnect(wallet) {
    //wallet can equal = ["safew", "nautilus"]
    let address;
    let addresses;
    let res = await setupWallet(true, wallet);
    // If Nautilus is denied
    if (res === "denied") {
      localStorage.removeItem("wallet");
      dispatch(setReduxUserAddress(undefined));
      dispatch(setUserAddressList(undefined));
      dispatch(setWalletState("Configure"));

      return;
    }
    if (res) {
      address = await getConnectorAddress();
      addresses = await getWalletAddresses();
      localStorage.setItem(
        "wallet",
        JSON.stringify({
          type: wallet,
          address: address,
          addresses: addresses,
        })
      );
    }
    if (res && address) {
      dispatch(setUserAddressList(addresses));
      dispatch(setReduxUserAddress(address));
      // Get total ERGs in wallet
      // getWalletErgs().then(res => {
      //     setWalletBalance((Math.round(friendlyERG(res) * 1000) / 1000));
      // });
      setWalletState(wallet);
      dispatch(setWalletState(wallet));
    }
    setProcessing(false);
    toggle();
    return;
  }

  // ERGOPAY
  async function connectErgopay() {
    // return
    // setWalletState("ergopay");
    setModalPage("ergopay");
  }

  async function getWalletInfo() {
    // console.log("**** Wallet Info is being called ****")
    if (!poolState.kyaAccepted) {
      return;
    }

    // Check if wallet is stored in localstorage
    if (isWalletSaved()) {
      const walletType = getWalletType();

      // get user addresses to input into redux
      let addresses = undefined;

      // if nautilus or safew
      if (walletType === "nautilus" || walletType === "safew") {
        // If stored, check if dapp connector is still connected, if not then remove all info
        // const isConnected = await checkIfConnected(walletType);

        // if (!isConnected) {
        //   console.log("ASDKASKDN", isConnected);
        //   // resetWallet();
        //   return;
        // }

        addresses = await getWalletAddresses();

        if (addresses === "error" || !addresses) {
          dispatch(setUserAddressList(undefined));

          clearWallet(false);
          return;
        }
        // Set their default address as main address
        let changeAddress = await getConnectorAddress(false);
        dispatch(setReduxUserAddress(changeAddress));
        dispatch(setUserAddressList(addresses));

        dispatch(setWalletState("nautilus"));
      } else if (walletType === "ergopay") {
        // Get wallet address of ergopay

        const wholeWallet = await getWholeWallet();
        const walletUUID = wholeWallet?.uuid;
        if (!walletUUID) {
          console.error("No UUID found.");
        }

        setErgopayState(wholeWallet.address, walletUUID);
      }


      // Set all wallet addresses
      // dispatch(setUserAddressList(addresses));
      // dispatch(setWalletState(walletType));

      // Get all tokens
      const userTokens = await getTokens(addresses);
      dispatch(setUserTokens(userTokens));

      // Get wallet balance
      // const ergRes = await getWalletErgs();
      // if(!ergRes) {
      //     // setWalletState('Configure');
      //     return
      // }
      // setWalletBalance(friendlyERG(ergRes));

      return;
    } else {
      setErgopayUUID(uuidv4());
      clearWallet(false);
    }
  }

  function setErgopayState(ergopayAddress, epayUUI) {
    // Set default user address
    dispatch(setReduxUserAddress(ergopayAddress));

    // Set all user addresses
    dispatch(setUserAddressList([ergopayAddress]));

    setErgopayUUID(epayUUI);
    dispatch(setWalletState("ergopay"));
  }

  function openErgoPay() {
    window.open(
      `ergopay://${apiRoot}/api/ergopay/setAddr/${ergopayUUID}/#P2PK_ADDRESS#`,
      "_blank" // <- This is what makes it open in a new window.
    );
  }

  function copyErgoPay() {
    navigator.clipboard
      .writeText(
        `ergopay://${apiRoot}/api/ergopay/setAddr/${ergopayUUID}/#P2PK_ADDRESS#`
      )
      .then(() =>
        toast({
          title: "Copied",
          variant: "subtle",
          // description: "We've created your account for you.",
          position: "bottom",
          status: "info",
          duration: 2000,
          isClosable: true,
        })
      );
  }

  useEffect(() => {
    // if (navButton) {
    // window.addEventListener("storage", () => {
    //   // When storage changes refetch
    //   getWalletInfo();
    //   // console.log(window.localStorage.getItem('wallet'));
    // });

    getWalletInfo();

    return () => {
      // When the component unmounts remove the event listener
      // window.removeEventListener("storage", null);
    };
  }, [poolState.kyaAccepted]);

  const getBlockHeight = async () => {
    const h = await currentHeight();
    dispatch(setBlockHeight(h));
  };

  // Update blockheight every 2 minutes
  useEffect(() => {
    getBlockHeight();
    const interval = setInterval(() => {
      getBlockHeight();
    }, 120000);

    return () => clearInterval(interval);
  }, []);

  const modalCurrentPage = () => {
    if (modalPage === "main") {
      return (
        <div className="">
          <div className="mb-4">
            <p className="text-xl font-semibold mb-1">
              {modalPage === "main"
                ? "Select your wallet"
                : "How To Disconnect"}
            </p>
            <p className="text-sm text-gray-200">
              Connect your Nautilus wallet to interact with The Field. If you
              don&apos;t have a wallet, you can get one <span>here</span>.
            </p>
          </div>

          <div className="">
            <div className="space-y-3">
              <Button
                className={`w-full border border-white/30 text-white hover:bg-blue-600 hover:text-white ${
                  poolState.walletState !== "Configure" && poolState.userAddress
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }  border-blue-500`}
                onClick={() => handleWalletConnect("nautilus")}
                // colorScheme=""
                variant="outline"
              >
                <div className="relative flex flex-row items-center w-full  space-x-3">
                  {/* <div className="absolute left-0 top-0 flex h-full items-center"> */}
                  <div className="flex h-full items-center">
                    <div className="relative w-8 h-8">
                      <img
                        className="w-full h-full object-contain"
                        src={`${basePath}/assets/images/nautiluswallet.png`}
                        alt="Nautilus Wallet"
                      />
                    </div>
                  </div>
                  {/* <div className="h-14">
                  </div> */}

                  <p className="text-lg font-bold items-center">Nautilus</p>
                </div>
                {/* {poolState.walletState === "nautilus" &&
                  poolState.userAddress ? (
                    <p className="ml-1">(Connected)</p>
                  ) : null} */}
              </Button>

              {/* <Button
                className={`w-full h-12 ${
                  poolState.walletState !== "Configure" && poolState.userAddress
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                } border-purple-500`}
                onClick={connectErgopay}
                colorScheme="purple"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div>
                      <MdPhoneAndroid size={24} />
                    </div>
                    <span className="ml-1">ErgoPay</span>
                  </div>
                  {poolState.walletState === "ergopay" &&
                  poolState.userAddress ? (
                    <p className="ml-1">(Connected)</p>
                  ) : null}
                </div>
              </Button> */}
            </div>
          </div>
        </div>
      );
    } else if (modalPage === "ergopay") {
      let disErgopayUUID = ergopayUUID;

      return (
        <div>
          <div className="text-xl mb-2">{"Connect ErgoPay"}</div>
          <div ref={qrRef}>
            <p>
              Scan the QR or press the button below to connect ErgoPay. Do not
              close out of this popup while connecting.
            </p>

            <div className="text-center">
              <div className="w-40 h-40 mx-auto mb-4 mt-4 overflow-hidden rounded-lg bg-white p-2.5">
                <QRCode
                  size={138}
                  value={`ergopay://${apiRoot}/api/ergopay/setAddr/${disErgopayUUID}/#P2PK_ADDRESS#`}
                />
              </div>
              <div></div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-2 text-center">
                <button
                  className="py-2 border-2 rounded-lg"
                  onClick={copyErgoPay}
                >
                  Copy request
                </button>
                <button
                  className="py-2 border-2 rounded-lg text-blue-500"
                  onClick={openErgoPay}
                >
                  Open wallet
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (modalPage === "clear") {
      return (
        <div>
          <p className="pb-1 font-bold">
            {modalPage === "main" ? "Select your wallet" : "Disconnect"}
          </p>
          <div className="mb-4">
            <p className="mb-4">
              Are you sure you want to disconnect?{" "}
              {poolState.walletState === "ergopay"
                ? ""
                : "This will refresh the page."}
            </p>

            <Button
              className="w-full py-2 border-2 rounded-lg text-red-500 border-red-500"
              onClick={clearWallet}
              colorScheme="red"
            >
              Disconnect Wallet
            </Button>
          </div>
        </div>
      );
    }
  };

  return (
    <Fragment>

      <Box>
        <Modal
          // isCentered
          // finalFocusRef={finalRef}
          // size="md"
          // isOpen={poolState.walletSelectOpen}
          // onClose={toggle}
          open={poolState.walletSelectOpen}
          setOpen={toggle}
        >
          <div className="">
            {modalCurrentPage()}

            <div className="flex flex-row mt-6 space-x-3 justify-end">
              <Button className="text-base font-semibold border hover:opacity-60" colorScheme="white" onClick={toggle}>
                Close
              </Button>
              {poolState.walletState !== "Configure" && (modalPage !== "clear" && modalPage !== "ergopay") && (
                <Button
                  disabled={poolState.walletState === "Configure"}
                  onClick={handleClearButton}
                  colorScheme="red"
                >
                  Clear Wallet
                </Button>
              )}
            </div>
          </div>
        </Modal>
      </Box>
    </Fragment>
  );
}
