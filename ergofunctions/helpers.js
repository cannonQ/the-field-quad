import {createStandaloneToast} from "@chakra-ui/toast";

import {Address, minBoxValue} from "@coinbarn/ergo-ts";
import {unspentBoxesFor} from "./explorer";
import moment from "moment";
import {theme} from "../components/theme";

const { toast } = createStandaloneToast({theme: theme});

const explorerUrl = "https://explorer.ergoplatform.com/en/";
const nodeUrl = "https://paidincrypto.io";

export function friendlyToken(token, length = 10) {
    let res = "";
    res += token.slice(0, length) + "..." + token.slice(-length);
    return res;
}

export function friendlyERG(value) {
    return (value / 1e9).toFixed(2);
}

export function friendlyAddress(addr, tot = 13) {
    if (addr === undefined || addr.slice === undefined) return "";
    return addr.slice(0, tot) + "..." + addr.slice(-tot);
}

export function friendlyName(name, tot = 80) {
    if (name === undefined || name.slice === undefined) return "";
    else if (name.length < tot) return name;
    return name.slice(0, tot) + "...";
}

export function getTxUrl(txId) {
    return explorerUrl + "transactions/" + txId;
}

export function getAuctionUrl(boxId) {
    return "#/auction/specific/" + boxId;
}

export function getArtworkUrl(tokenId) {
    return "#/artwork/" + tokenId;
}

export function getAddrUrl(addr) {
    return explorerUrl + "addresses/" + addr;
}

export function getArtistUrl(addr) {
    return "#/auction/active?type=all&artist" + addr;
}

export function showMsg(message, isError = false, isWarning = false, id) {
    let status = "info";
    if (isError) status = "error";
    if (isWarning) status = "warning";
    // toast(message, {
    //     transition: Slide,
    //     closeButton: true,
    //     autoClose: 5000,
    //     position: 'top-right',
    //     type: status,
    // });
    if (!toast.isActive(id)) {
        toast({
            title: message,
            colorScheme: isError ? "red" : "brand",
            // description: "Unable to create user account.",
            position: "bottom-right",
            status: status,
            duration: 5000,
            isClosable: true,
            id,
        });
    }
}

export function showStickyMsg(message, isError = false) {
    // toast(message, {
    //     transition: Flip,
    //     closeButton: true,
    //     autoClose: false,
    //     closeOnClick: false,
    //     position: 'top-center',
    //     type: isError ? 'error' : 'default',
    // });
    toast({
        title: message,
        // description: "Unable to create user account.",
        position: "top",
        status: isError ? "error" : "info",
        duration: 10000,
        isClosable: false,
    });
}

export function isWalletSaved() {
    // console.log(localStorage.getItem('wallet'))
    const isIt = sessionStorage?.getItem("wallet") !== null || localStorage?.getItem("wallet") !== null
    return isIt;
}

export function isAssembler() {
    return isWalletSaved() && getWalletType() === "assembler";
}

export function isYoroi() {
    // console.log("getwalletype", getWalletType())
    return isWalletSaved() && getWalletType() === "yoroi";
}

export function isNautilus() {
    return isWalletSaved() && getWalletType() === "nautilus";
}

export function getWalletConnector() {
    if (isWalletSaved()) {
        return getWalletType();
    }
    return false;
}

export function getWalletAddress() {
    return JSON.parse(localStorage.getItem("wallet")).address;
}

export function getWalletAddresses() {
    return JSON.parse(localStorage.getItem("wallets")).addresses;
}

export function getWalletType() {
    if (localStorage.getItem("wallet") !== null)
        return JSON.parse(localStorage.getItem("wallet")).type;
    return JSON.parse(sessionStorage.getItem("wallet"))?.type;
}

export function getWholeWallet() {
    if (localStorage.getItem('wallet') !== null)
        return JSON.parse(localStorage.getItem('wallet'))
    return JSON.parse(sessionStorage.getItem('wallet'))
}

export function getWalletUUID() {
    if (localStorage.getItem('wallet') !== null)
        return JSON.parse(localStorage.getItem('wallet'))?.uuid
    return JSON.parse(sessionStorage.getItem('wallet'))?.uuid
}

export function getMyBids() {
    let bids = JSON.parse(localStorage.getItem("bids"));
    if (bids === null) bids = [];
    return bids;
}

export function setMyBids(bids) {
    localStorage.setItem("bids", JSON.stringify(bids));
}

export function addBid(bid) {
    let bids = getMyBids();
    bids.unshift(bid);
    setMyBids(bids);
}

export function getForKey(key) {
    let reqs = JSON.parse(localStorage.getItem(key));
    if (reqs === null) reqs = [];
    return reqs;
}

export function setForKey(reqs, key) {
    localStorage.setItem(key, JSON.stringify(reqs));
}

export function removeForKey(key, toRem) {
    let reqs = getForKey(key).filter((req) => req.id !== toRem);
    setForKey(reqs, key);
}

export function updateForKey(key, toUp) {
    let reqs = getForKey(key).map((req) => {
        if (req.id !== toUp.id) return req;
        return toUp;
    });
    setForKey(reqs, key);
}

export function getUrl(url) {
    if (!url.startsWith("http")) url = "http://" + url;
    if (url.endsWith("/")) url = url.slice(0, url.length - 1);
    return url;
}

export function addNotification(msg, lnk, stat = "info") {
    let nots = JSON.parse(localStorage.getItem("notification"));
    if (nots === null)
        nots = {
            data: [],
            unread: 0,
        };
    nots.unread += 1;
    nots.data = nots.data.concat([
        {
            message: msg,
            link: lnk,
            status: stat,
            time: moment().valueOf(),
        },
    ]);
    setForKey(nots, "notification");
    // notifyMe(msg, lnk).then(r => {
    // })
}

export async function copyToClipboard(text) {
    return navigator.clipboard.writeText(text).then((_) => showMsg("Copied!"));
}

export function isAddressValid(address) {
    try {
        return new Address(address).isValid();
    } catch (_) {
        return false;
    }
}



export async function signTx(transaction_to_sign) {
    // let sellerTx;
    let tx;

    try {
        tx = await ergo.sign_tx(transaction_to_sign);
    } catch (e) {
        console.log(e)
        showMsg("Error while sending funds!", true);
        return;
    }
    const txId = await ergo.submit_tx(tx);

    console.log("tx id", txId);
    if (true) {
        if (txId !== undefined && txId.length > 0)
            showMsg("Necessary funds were sent. Now we wait until it's confirmed!");
        else showMsg("Error while sending funds!", true);
    }
    return txId;
}


export const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

