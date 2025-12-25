import {findBoxWithNFT, isWalletSaved, showMsg} from "./helpers";
import {
    faucet_address,
    indicative_address,
    indicative_nft,
    MIN_NERG_BOX_VALUE,
    real_quacks_token, test_quacks_token,
    txFee
} from "./consts";
import {filterAssets, generateCleanTokens, getAllUtxos, getConnectorAddress, getTokens} from "./walletUtils";
import {currentBlock} from "./explorer";
import {encodeNum} from "./serializer";
import {signWalletTx} from "./utxos";

let ergolib = import("ergo-lib-wasm-browser");

export async function use_faucet() {
    const faucetBox = await findBoxWithNFT(faucet_address, test_quacks_token, 10000000000000);
    if (!isWalletSaved()) {
        showMsg("Connect your wallet to use faucet.", true);
        return;
    }
    const [wasm, user, allBal, blockHeight] = await Promise.all([
        ergolib,
        getConnectorAddress(),
        getTokens(),
        currentBlock()
    ]);
    const requiredErg = MIN_NERG_BOX_VALUE + txFee;

    let need = { ERG: requiredErg };

    // Get all wallet tokens/ERG and see if they have enough
    let have = JSON.parse(JSON.stringify(need), (key, value) => {
        // Check if key is not "ERG" and value is a string that can be converted to BigInt
        if (key !== "ERG" && typeof value === "string" && /^\d+$/.test(value)) {
            return BigInt(value);
        }
        return value;
    });

    let ins = [];
    const keys = Object.keys(have);
    if (
        keys
            .filter((key) => key !== "ERG")
            .filter(
                (key) =>
                    !Object.keys(allBal).includes(key) || allBal[key].amount < have[key]
            ).length > 0
    ) {
        showMsg("Not enough balance in the wallet! See FAQ for more info.", true);
        return;
    }

    let tokens = generateCleanTokens(keys, have);

    // Prepare the parameters
    let params = {
        nanoErgs: requiredErg.toString(),
        tokens: tokens,
    };

    // Call the function
    ins = await getAllUtxos(params,have, user)


    if (keys.filter((key) => have[key] > 0).length > 0) {
        showMsg("Not enough balance in the wallet! See FAQ for more info.", true);
        return;
    }

    const time_since = blockHeight.height - faucetBox.additionalRegisters.R4.renderedValue



    const faucet_box_out = {
        value: faucetBox.value,
        ergoTree: faucetBox.ergoTree,
        assets: [
            {
                "tokenId": test_quacks_token,
                "amount": faucetBox.assets[0].amount - time_since * 10000000
            }
        ],
        additionalRegisters: {
            "R4": await encodeNum((parseInt(blockHeight.height)).toString())
        },
        creationHeight: blockHeight.height,
    };

    const userReceivesBox = {
        value: MIN_NERG_BOX_VALUE,
        ergoTree: wasm.Address.from_mainnet_str(user)
            .to_ergo_tree()
            .to_base16_bytes(),
        assets: [
            {
                "tokenId": test_quacks_token,
                "amount": time_since * 10000000
            }
        ],
        additionalRegisters: {},
        creationHeight: blockHeight.height,
    };


    const changeBox = {
        value: (-have["ERG"]).toString(),
        ergoTree: wasm.Address.from_mainnet_str(user)
            .to_ergo_tree()
            .to_base16_bytes(),
        assets: filterAssets(have),
        additionalRegisters: {},
        creationHeight: blockHeight.height,
    };

    // throw error for oversized change
    if (changeBox.assets.length > 90) {
        showMsg("Too many assets in change box.", true);
        return;
    }

    const feeBox = {
        value: txFee.toString(),
        creationHeight: blockHeight.height,
        ergoTree:
            "1005040004000e36100204a00b08cd0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798ea02d192a39a8cc7a701730073011001020402d19683030193a38cc7b2a57300000193c2b2a57301007473027303830108cdeeac93b1a57304",
        assets: [],
        additionalRegisters: {},
    };
    ins = ins.concat([faucetBox]);

    const inputList = ins.map((curIn) => {
        return {
            ...curIn,
            extension: {},
        }; // this gets all user eutxo boxes
    });


    // console.log(paySeller.value + payService.value + payRoyalty.value + buyerGets.value + feeBox.value)
    let transaction_to_sign = {
        inputs: inputList,
        outputs: [faucet_box_out, userReceivesBox, changeBox, feeBox], // Adding change and fee boxes below.
        dataInputs: [],
        fee: txFee,
    };

    // Assuming inputList is an array of objects (boxes)
    let uniqueInputList = transaction_to_sign.inputs.filter(
        (box, index, self) =>
            index === self.findIndex((b) => JSON.stringify(b) === JSON.stringify(box))
    );

    transaction_to_sign.inputs = uniqueInputList;

    console.log("transaction_to_sign", transaction_to_sign);

    return await signWalletTx(transaction_to_sign);
}
