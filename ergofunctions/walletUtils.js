/* eslint no-undef: "off"*/
import { store } from "../pages/_app";
import {
  showMsg,
  isWalletSaved,
  getWalletType,
  getWalletAddress,
  findBoxWithNFT
} from "./helpers";
import {
  txFee,
  MIN_NERG_BOX_VALUE,
  counter_box_address,
  counter_box_nft,
  counter_minimum_tokens,
  quacks_token,
  vote_token,
  user_vote_address,
  indicative_address,
  indicative_nft,
  real_quacks_token,
  pledge_buffer_nergs,
  bid_address,
  bid_tree,
  CHANGE_BOX_ASSET_CHUNK_SIZE, CHANGE_BOX_VALUE_TOTAL, CHANGE_BOXES_SUPPORTED, proxy_win
} from "./consts";

import {currentBlock, getBalance, getBoxesForAsset, unspentBoxesFor} from "./explorer";
import { setUserAddress, setUserAddressList } from "../redux/appSlice";
import { get_utxos } from "./ergolibUtils";
import { signWalletTx } from "./utxos";
import {encodeHex, encodeNum} from "./serializer";
import {Address} from "@coinbarn/ergo-ts/dist/models/address";

let ergolib = typeof window !== 'undefined' ? import("ergo-lib-wasm-browser") : Promise.resolve(null);

function walletDisconnect() {
  showMsg("Disconnected from wallet", true);
  localStorage.removeItem("wallet");
}

// Set Up Nautilus wallet
export async function setupNautilus(isFirst = false) {
  const toastId = "connect_toast";

  if (typeof ergo_request_read_access === "undefined") {
    showMsg(
      "You must install Nautilus Wallet to be able to connect.",
      true,
      false,
      toastId
    );
  } else {
    // if (isFirst) {
    window.removeEventListener("ergo_wallet_disconnected", walletDisconnect);
    window.addEventListener("ergo_wallet_disconnected", walletDisconnect);
    // }
    let hasAccess = await ergoConnector.nautilus.isConnected();
    if (!hasAccess) {
      let granted = await ergoConnector.nautilus.connect();
      if (!granted) {
        localStorage.removeItem("wallet");

        if (isFirst) {
          showMsg("Wallet access denied", true, false, toastId);
          return "denied";
        }
      } else {
        if (isFirst)
          showMsg("Successfully connected to Nautilus", false, false, toastId);
        return true;
      }
    } else return true;
  }
  return false;
}

// Set Up SAFEW wallet
export async function setupSAFEW(isFirst = false) {
  if (typeof ergo_request_read_access === "undefined") {
    showMsg("You must install Nautilus Wallet to be able to connect.", true);
  } else {
    // if (isFirst) {
    window.removeEventListener("ergo_wallet_disconnected", walletDisconnect);
    window.addEventListener("ergo_wallet_disconnected", walletDisconnect);
    // }
    // console.log("ergoconnector", ergoConnector)
    let hasAccess = await ergoConnector.safew.isConnected();
    if (!hasAccess) {
      let granted = await ergoConnector.safew.connect();
      if (!granted) {
        localStorage.removeItem("wallet");
        store.dispatch(setW(undefined));

        if (isFirst) {
          showMsg("Wallet access denied", true);
          return "denied";
        }
      } else {
        if (isFirst) showMsg("Successfully connected to SAFEW");
        return true;
      }
    } else return true;
  }
  return false;
}

// Set Up wallet
export async function setupWallet(isFirst = false, wallet = "nautilus") {
  if (typeof ergo_request_read_access === "undefined") {
    showMsg("You must install Nautilus Wallet to be able to connect.", true);
  } else {
    // if (isFirst) {
    window.removeEventListener("ergo_wallet_disconnected", walletDisconnect);
    window.addEventListener("ergo_wallet_disconnected", walletDisconnect);
    // }

    let walletType;
    if (isFirst) {
      walletType = wallet;
    } else {
      if (isWalletSaved()) {
        let type = getWalletType();
        walletType = type;
      }
    }

    if (!ergoConnector[walletType]) {
      showMsg(`${walletType} not found`, true);
      return "denied";
    }

    let hasAccess = await ergoConnector[walletType].isConnected();
    if (!hasAccess) {
      let granted = await ergoConnector[walletType].connect();
      if (!granted) {
        localStorage.removeItem("wallet");
        store.dispatch(setUserAddress(undefined));
        store.dispatch(setUserAddressList(undefined));

        if (isFirst) {
          showMsg("Wallet access denied", true);
          return "denied";
        }
      } else {
        if (isFirst) showMsg(`Successfully connected to ${walletType}`);
        return true;
      }
    } else return true;
  }
  return false;
}

export async function checkIfConnected(walletType) {
  const isConnected = await ergoConnector[walletType].isConnected();
  return isConnected;
}

export async function getConnectorAddress(setup = true) {


  if(getWalletType() === "ergopay") {
    return getWalletAddress()
  }

  if (setup) {
    let res = await setupNautilus();

    if (res && res !== "denied") {
      try {
        return await ergo.get_change_address();
      } catch {
        return "error";
      }
    }
  } else {
    try {
      return await ergo.get_change_address();
    } catch {
      return "error";
    }
  }

  return null;
}

export async function getWalletAddresses() {

  if(getWalletType() === "ergopay") {
    return [getWalletAddress()]
  }

  let res = await setupNautilus();

  if (res && res !== "denied") {
    const addresses = (await ergo.get_used_addresses()).concat(
      await ergo.get_unused_addresses()
    );
    try {
      return addresses;
    } catch {
      return "error";
    }
  }
  return null;
}

// Make all these calls parallel

export async function getTokens() {


  if(getWalletType() === "ergopay") {
    let amounts = {}

     const ids = (await getBalance(getWalletAddress())).tokens.map(tok => {
      amounts[tok.tokenId] = {
        amount: parseInt(tok.amount),
        name: tok.name,
        tokenId: tok.tokenId,

      }
      return tok.tokenId
    })
    return amounts
     
  }

  // await setupNautilus()
  let res = await setupNautilus(); // change this to "setupWallet" later so it can be used by multiple wallets

  if (!res || res === "denied") {
    return;
  }

  const addresses = (await ergo.get_used_addresses()).concat(
    await ergo.get_unused_addresses()
  );
  let tokens = {};
  try {
    const balances = await getBalancesInBatches(addresses);

    for (const balance of balances) {
      // Skip failed responses
      if (balance === null) continue;

      balance.tokens.forEach((ass) => {
        if (!Object.keys(tokens).includes(ass.tokenId))
          tokens[ass.tokenId] = {
            amount: 0,
            name: ass.name,
            tokenId: ass.tokenId,
          };
        tokens[ass.tokenId].amount += parseInt(ass.amount);
      });
    }
  } catch {
    showMsg(
      "Sorry, an issue occurred getting your tokens. Try refreshing.",
      true
    );
  }
  return tokens;
}

async function getBalancesInBatches(addresses, batchSize = 30) {
  let batchBalances = [];

  for (let i = 0; i < addresses.length; i += batchSize) {
    const batch = addresses.slice(i, i + batchSize);
    const balances = await Promise.all(batch.map(address =>
        getBalance(address).catch(error => {
          console.error(`An error occurred for address ${address}:`, error);
          return null; // Return null for failed requests to handle them later
        })
    ));
    batchBalances = batchBalances.concat(balances);
  }

  return batchBalances;
}

export async function getWalletErgs() {
  // let res = await setupNautilus()
  // if(!res || res === 'denied') {
  //     return;
  // }
  const addresses = (await ergo.get_used_addresses()).concat(
    await ergo.get_unused_addresses()
  );
  let nanoErgs = 0;

  let apiCalls = [];

  for (let address of addresses) {
    apiCalls.push(getBalance(address));
  }

  try {
    const res = await Promise.all(apiCalls);
    const data = res.map((res) => res.nanoErgs);
    for (let dat of data) {
      nanoErgs += dat;
    }
  } catch {
    //   throw Error("Couldn't get wallet balance.");
  }

  // for (let i = 0; i < addresses.length; i++) {
  //     // await getBalance(addresses[i]).then((res) => console.log("ass", res)) // lets see what tokens we have
  //     await getBalance(addresses[i]).then(ass => {
  //         nanoErgs += ass.nanoErgs
  //     }).catch((error)=> {
  //         console.log("Error retrieving wallet ERG balance.")
  //     })
  // }
  return nanoErgs;
}

export function filterAssets(have) {
  return Object.keys(have)
    .filter((key) => key !== "ERG")
    .filter((key) => BigInt(have[key]) < BigInt(0))
    .map((key) => {
      return {
        tokenId: key,
        amount: (-BigInt(have[key])).toString(),
      };
    });
}

export function generateCleanTokens(keys, have) {
  let tokens = keys
    .filter((key) => key !== "ERG")
    .map((key) => {
      return {
        tokenId: key,
        amount: have[key].toString(),
      };
    });
  // Remove unnecessary items
  tokens = tokens.filter((token) => token.amount !== "0");

  return tokens;
}


function calculateServiceFee(changeAmount) {
  const stepOneThreshold = 20000000000;
  const stepTwoThreshold = 200000000000;
  const divisorOne = 160;
  const divisorTwo = 200;
  const divisorThree = 250;

  if (changeAmount <= stepOneThreshold) {
    return changeAmount / divisorOne;
  } else if (changeAmount <= stepTwoThreshold) {
    return (
      (changeAmount - stepOneThreshold) / divisorTwo +
      stepOneThreshold / divisorOne
    );
  } else {
    return (
      (changeAmount - stepTwoThreshold - stepOneThreshold) / divisorThree +
      stepTwoThreshold / divisorTwo +
      stepOneThreshold / divisorOne
    );
  }
}

function calculateServiceTokenFee(poolToken, changeAmount) {
  const stepOneThreshold = 2000;
  const stepTwoThreshold = 200000;
  const divisorOne = 160;
  const divisorTwo = 200;
  const divisorThree = 250;

  if (changeAmount <= stepOneThreshold) {
    return changeAmount / divisorOne;
  } else if (changeAmount <= stepTwoThreshold) {
    return (
      (changeAmount - stepOneThreshold) / divisorTwo +
      stepOneThreshold / divisorOne
    );
  } else {
    return (
      (changeAmount - stepTwoThreshold - stepOneThreshold) / divisorThree +
      stepTwoThreshold / divisorTwo +
      stepOneThreshold / divisorOne
    );
  }
}

export async function getAllUtxos(params, have, user) {
  let ins = [];

  if (getWalletType() !== "ergopay") {
    let curIns;

    curIns = await ergo.get_utxos(params);


    if (curIns !== undefined) {
      curIns.forEach((bx) => {
        have["ERG"] -= parseInt(bx.value);
        bx.assets.forEach((ass) => {
          if (!Object.keys(have).includes(ass.tokenId)) {
            have[ass.tokenId] = BigInt(0);
          }
          have[ass.tokenId] -= BigInt(ass.amount);
        });
      });
      ins = ins.concat(curIns);
    }

    return ins;
  }

  // For ergopay below

  const keys = Object.keys(have);

  for (let i = 0; i < keys.length; i++) {
    if (have[keys[i]] <= 0) continue;
    // Without dapp connector
    let curIns;

    if (keys[i] === "ERG") {
      curIns = await get_utxos(user, have[keys[i]].toString());
    } else {
      curIns = await get_utxos(user, 0, keys[i], have[keys[i]].toString());
    }

    // let finalCurIns = curIns.filter(
    //   (value, index, self) =>
    //     index === self.findIndex((t) => t.boxId === value.boxId)
    // );
    const finalCurIns = curIns.filter(item1 => !ins.some(item2 => item2.boxId === item1.boxId));


    if (finalCurIns !== undefined) {
      finalCurIns.forEach((bx) => {
        have["ERG"] -= parseInt(bx.value);
        bx.assets.forEach((ass) => {
          if (!Object.keys(have).includes(ass.tokenId)) {
            have[ass.tokenId] = BigInt(0);
          }
          have[ass.tokenId] -= BigInt(ass.amount);
        });
      });
      ins = ins.concat(finalCurIns);
    }
  }



  const filteredIns = ins.filter(
      (value, index, self) =>
          index === self.findIndex((t) => t.boxId === value.boxId)
  );

  return filteredIns;

  // if(walletType() === "ergopay") {
  //   let curIns;
  //   if (keys[i] === "ERG") {
  //     curIns = await get_utxos(user, have[keys[i]].toString());
  //   } else {
  //     curIns = await get_utxos(user, 0, keys[i], have[keys[i]].toString());
  //   }
  //   return curIns
  // }
  // else {
  //   const cIns = ergo.get_utxos(params)
  //   console.log("CINS", cIns)

  //   return cIns;
  // }
}


function parseHexArray(hexString) {
  // Remove the brackets at the start and end of the string
  hexString = hexString.slice(1, -1);

  // Split the string by comma to get individual elements
  let hexElements = hexString.split(',');

  // Trim any whitespace from elements
  hexElements = hexElements.map(element => element.trim());

  return hexElements;
}

export async function make_pledge(fieldBox, optionIndexSelected, pledgeSize){
  console.log("filed box", fieldBox)
  const pledgeNanoErgs = pledgeSize * 1000000000
  if (!isWalletSaved()) {
    showMsg("Connect your wallet first.", true);
    return
  }

  // Prepare constants and variables
  const [wasm, user, blockHeight, allBal] = await Promise.all([
    ergolib,
    getConnectorAddress(),
    currentBlock(),
    getTokens()
  ]);


  const requiredErg = 2100000 + pledgeNanoErgs + CHANGE_BOX_VALUE_TOTAL;
  let need = {ERG: requiredErg};

  // Get all wallet tokens/ERG and see if they have enough
  let have = JSON.parse(JSON.stringify(need), (key, value) => {
    // Check if key is not "ERG" and value is a string that can be converted to BigInt
    if (key !== "ERG" && typeof value === 'string' && /^\d+$/.test(value)) {
      return BigInt(value);
    }
    return value;
  });

  let ins = [];
  const keys = Object.keys(have);

  let tokens = generateCleanTokens(keys, have)


  // Prepare the parameters
  let params = {
    nanoErgs: requiredErg.toString(),
    tokens: tokens
  };

  // Call the function
//   const curIns = await ergo.get_utxos(params);
  ins = await getAllUtxos(params, have, user)
  have['ERG'] = (BigInt(have['ERG']) - BigInt(txFee)).toString();

  if (keys.filter(key => have[key] > 0).length > 0) {
    showMsg('Not enough balance in the wallet!', true)
    return
  }

  const collectionNft = parseHexArray(fieldBox.additionalRegisters.R9.renderedValue)[1]
  const pledgeBox = {
    value: pledgeNanoErgs.toString(),
    ergoTree: bid_tree,
    assets: [
      {
        "tokenId": fieldBox.assets[1].tokenId,
        "amount": pledgeNanoErgs - pledge_buffer_nergs
      }
    ],
    additionalRegisters: {
      R4: await encodeNum((optionIndexSelected).toString(), true),
      R5: await encodeHex(new Address(user).ergoTree),
      R6: await encodeNum((blockHeight.height + 6).toString()),
      R7: await encodeHex(collectionNft)
    },
    creationHeight: blockHeight.height,
  };


  const outputFieldBox = {
    value: fieldBox.value.toString(),
    ergoTree: fieldBox.ergoTree,
    assets: [
      {
        "tokenId": fieldBox.assets[0].tokenId,
        "amount": fieldBox.assets[0].amount
      },
      {
        "tokenId": fieldBox.assets[1].tokenId,
        "amount": (BigInt(fieldBox.assets[1].amount) - BigInt(pledgeNanoErgs) + BigInt(pledge_buffer_nergs)).toString()
      },
    ],
    additionalRegisters: {
      R4: fieldBox.additionalRegisters.R4.serializedValue,
      R5: fieldBox.additionalRegisters.R5.serializedValue,
      R6: fieldBox.additionalRegisters.R6.serializedValue,
      R7: fieldBox.additionalRegisters.R7.serializedValue,
      R8: fieldBox.additionalRegisters.R8.serializedValue,
      R9: fieldBox.additionalRegisters.R9.serializedValue
    },
    creationHeight: blockHeight.height,
  };


  const change_boxes = create_change_boxes(have, wasm, user, blockHeight)

  const feeBox = {
    value: "1000000",
    creationHeight: blockHeight.height,
    ergoTree:
        "1005040004000e36100204a00b08cd0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798ea02d192a39a8cc7a701730073011001020402d19683030193a38cc7b2a57300000193c2b2a57301007473027303830108cdeeac93b1a57304",
    assets: [],
    additionalRegisters: {},
  };


  let registers = {
    R4: fieldBox.additionalRegisters.R4.serializedValue,
    R5: fieldBox.additionalRegisters.R5.serializedValue,
    R6: fieldBox.additionalRegisters.R6.serializedValue,
    R7: fieldBox.additionalRegisters.R7.serializedValue,
    R8: fieldBox.additionalRegisters.R8.serializedValue,
    R9: fieldBox.additionalRegisters.R9.serializedValue
  };

  const oldFieldBox = {
    value: fieldBox.value,
    ergoTree: fieldBox.ergoTree,
    assets: [
      {
        tokenId: fieldBox.assets[0].tokenId,
        amount: fieldBox.assets[0].amount.toString()
      },
      {
        tokenId: fieldBox.assets[1].tokenId,
        amount: fieldBox.assets[1].amount.toString()
      }
    ],
    additionalRegisters: registers,
    creationHeight: fieldBox.creationHeight,
    transactionId: fieldBox.transactionId,
    index: fieldBox.index,
    boxId: fieldBox.boxId
  }


  ins = ins.concat([oldFieldBox]);

  const inputList = ins.map((curIn) => {
    return {
      ...curIn,
      extension: {},
    }; // this gets all user eutxo boxes
  });

  // console.log(paySeller.value + payService.value + payRoyalty.value + buyerGets.value + feeBox.value)
  let transaction_to_sign = {
    inputs: inputList,
    outputs: [outputFieldBox, pledgeBox, ...change_boxes, feeBox], // Adding change and fee boxes below.
    dataInputs: [],
    fee: 1000000,
  };

  // Assuming inputList is an array of objects (boxes)
  let uniqueInputList = transaction_to_sign.inputs.filter((box, index, self) =>
          index === self.findIndex((b) => (
              JSON.stringify(b) === JSON.stringify(box)
          ))
  );

  // Modify the original transaction_to_sign object
  transaction_to_sign.inputs = uniqueInputList;

  console.log("transaction_to_sign", transaction_to_sign);

  // return transaction_to_sign
  return await signWalletTx(transaction_to_sign);
}

export function create_change_boxes(have, wasm, user, blockHeight){
  let raw_assets = have ? filterAssets(have) : [];
  if (raw_assets.length > 90 * CHANGE_BOX_ASSET_CHUNK_SIZE) {
    showMsg('Too many assets in change box.', true)
    return;
  }
  const asset_arrays = splitArrayIntoChunks(raw_assets, 90)
  const asset_array_size = asset_arrays.length
  let i = 0
  const changeBoxZero = {
    value: asset_array_size <= 1 ? ((-have["ERG"]) + CHANGE_BOX_VALUE_TOTAL).toString() : (-have["ERG"]).toString(),
    ergoTree: wasm.Address.from_mainnet_str(user)
        .to_ergo_tree()
        .to_base16_bytes(),
    assets: asset_arrays[i] || [],
    additionalRegisters: {},
    creationHeight: blockHeight.height,
  };
  let change_boxes = [changeBoxZero]

  i = i + 1
  while (i < asset_array_size) {
    change_boxes.push(
        {
          value: CHANGE_BOX_VALUE_TOTAL / (asset_array_size - 1),
          ergoTree: wasm.Address.from_mainnet_str(user)
              .to_ergo_tree()
              .to_base16_bytes(),
          assets: asset_arrays[i] || [],
          additionalRegisters: {},
          creationHeight: blockHeight.height,
        }
    )
    i = i + 1
  }
  return change_boxes
}


export async function claim_winnings(collection_nft, winner_token, amount){
  console.log("jeee")
  const collection_box = (await getBoxesForAsset(collection_nft)).items[0]
  console.log("collectio", collection_box)
  const value_initial = parseInt(collection_box.value)
  const winnings_initial = parseInt(collection_box.additionalRegisters.R4.renderedValue)
  const winnings_final = winnings_initial - parseInt(amount)
  const final_value = Math.max(Math.floor(value_initial *  winnings_final / winnings_initial), 1000000)
  const user_gets = value_initial - final_value
  console.log(value_initial, winnings_final, winnings_initial, final_value, user_gets )

  if (!isWalletSaved()) {
    showMsg("Connect your wallet first.", true);
    return
  }

  // Prepare constants and variables
  const [wasm, user, blockHeight, allBal] = await Promise.all([
    ergolib,
    getConnectorAddress(),
    currentBlock(),
    getTokens()
  ]);


  const requiredErg = 3000000 + CHANGE_BOX_VALUE_TOTAL + 1100000;
  let need = {ERG: requiredErg};
  need[winner_token] = BigInt(amount).toString();


  // Get all wallet tokens/ERG and see if they have enough
  let have = JSON.parse(JSON.stringify(need), (key, value) => {
    // Check if key is not "ERG" and value is a string that can be converted to BigInt
    if (key !== "ERG" && typeof value === 'string' && /^\d+$/.test(value)) {
      return BigInt(value);
    }
    return value;
  });

  let ins = [];
  const keys = Object.keys(have);

  let tokens = generateCleanTokens(keys, have)


  // Prepare the parameters
  let params = {
    nanoErgs: requiredErg.toString(),
    tokens: tokens
  };

  // Call the function
//   const curIns = await ergo.get_utxos(params);
  ins = await getAllUtxos(params, have, user)
  have['ERG'] = (BigInt(have['ERG']) - BigInt(txFee)).toString();

  if (keys.filter(key => have[key] > 0).length > 0) {
    showMsg('Not enough balance in the wallet!', true)
    return
  }

  const p2s = proxy_win

  let registers = {
    R4: await encodeHex(new Address(user).ergoTree),
    R5: await encodeNum(user_gets.toString()),
    R6: await encodeNum((blockHeight.height + 15).toString()),
  };
  console.log("Successfully calculated registers");

  const proxyBox = {
    value: (2 * MIN_NERG_BOX_VALUE).toString(),
    ergoTree: wasm.Address.from_mainnet_str(p2s)
        .to_ergo_tree()
        .to_base16_bytes(),
    assets: [
      {
        tokenId: winner_token,
        amount: amount,
      },
    ],
    additionalRegisters: registers,
    creationHeight: blockHeight.height,
  };


  const change_boxes = create_change_boxes(have, wasm, user, blockHeight)

  const feeBox = {
    value: "1000000",
    creationHeight: blockHeight.height,
    ergoTree:
        "1005040004000e36100204a00b08cd0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798ea02d192a39a8cc7a701730073011001020402d19683030193a38cc7b2a57300000193c2b2a57301007473027303830108cdeeac93b1a57304",
    assets: [],
    additionalRegisters: {},
  };


  const inputList = ins.map((curIn) => {
    return {
      ...curIn,
      extension: {},
    }; // this gets all user eutxo boxes
  });

  // console.log(paySeller.value + payService.value + payRoyalty.value + buyerGets.value + feeBox.value)
  let transaction_to_sign = {
    inputs: inputList,
    outputs: [proxyBox, ...change_boxes, feeBox], // Adding change and fee boxes below.
    dataInputs: [],
    fee: 1000000,
  };


  // Assuming inputList is an array of objects (boxes)
  let uniqueInputList = transaction_to_sign.inputs.filter((box, index, self) =>
          index === self.findIndex((b) => (
              JSON.stringify(b) === JSON.stringify(box)
          ))
  );

  // Modify the original transaction_to_sign object
  transaction_to_sign.inputs = uniqueInputList;

  console.log("transaction_to_sign", transaction_to_sign);

  // return transaction_to_sign
  return await signWalletTx(transaction_to_sign);
}




function splitArrayIntoChunks(array, chunkSize) {
  let result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    let chunk = array.slice(i, i + chunkSize);
    result.push(chunk);
  }
  return result;
}

