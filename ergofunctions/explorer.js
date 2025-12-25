import { Explorer, Transaction } from "@coinbarn/ergo-ts";
import { get } from "./rest";
import { longToCurrency } from "./serializer";
import JSONbig from 'json-bigint';

const explorer = Explorer.mainnet;
export const explorerApi = "https://api.ergoplatform.com/api/v1";
export const explorerApiV1 = "https://api.ergoplatform.com/api/v1";

export function getRequest(url, api = explorerApi) {
  return get(api + url)
    .then((res) => res.json())
    .catch((err) => console.log(err));
}

function getRequestBigInt(url, api = explorerApi) {
  return get(api + url)
      .then((res) => res.text()) // get the raw text
      .then((text) => JSONbig.parse(text)) // parse with JSONbig
      .catch((err) => console.log(err));
}


export async function currentHeight() {
  return getRequest("/blocks?limit=1").then((res) => {
    return res?.items[0]?.height;
  });
}

export async function currentBlock() {
  return getRequest("/blocks?limit=1").then((res) => {
    return res.items[0];
  });
}

export function unspentBoxesFor(address) {

  return unspentBoxesForBigInt(address)
}

export async function unspentBoxesForV1(address) {
  return getRequest(`/boxes/unspent/byAddress/${address}`, explorerApiV1).then(
    (res) => {
      return res.items;
    }
  );
}

export function unspentBoxesForBigInt(address, limit = 30) {
  const url = `/boxes/unspent/byAddress/${address}?limit=${limit}`;

  return getRequestBigInt(url).then((res) => {
    return res.items;
  });
}


export function getBoxesForAddress(address, offset = 0, limit = 20) {
  const url = `/boxes/unspent/byAddress/${address}?offset=${offset}&limit=${limit}`;

  return getRequestBigInt(url).then((res) => {
    // Assuming 'res' contains a structure with 'items' and 'total' count
    // If the response structure is different, adjust the return statement accordingly
    return {
      boxes: res.items,
      count: res.total  // This should represent the total number of available boxes
    };
  });
}



export function mempoolTransactionsFor(address) {
  return getRequest(
    `/mempool/transactions/byAddress/${address}`,
    explorerApiV1
  );
}

export async function getBoxesForAsset(asset) {
  return getRequest(`/boxes/unspent/byTokenId/${asset}`, explorerApiV1);
}

export function getActiveAuctions(addr) {
  return getRequest(`/boxes/unspent/byAddress/${addr}?limit=500`, explorerApiV1)
    .then((res) => res.items)
    .then((boxes) => boxes.filter((box) => box.assets.length > 0));
}

export function getUnconfirmedTxsFor(addr) {
  return getRequest(
    `/mempool/transactions/byAddress/${addr}`,
    explorerApiV1
  ).then((res) => res.items);
}

export function boxByAddress(id) {
  return getRequest(`/transactions/boxes/${id}`);
}

export function boxById(id) {
  return getRequest(`/transactions/boxes/${id}`);
}

export function txByAddress(addr) {
  return getRequest(`/addresses/${addr}/transactions`).then((res) => res.items);
}

export function txById(id) {
  return getRequest(`/transactions/${id}`);
}

export async function getSpendingTx(boxId) {
  const data = getRequest(`/transactions/boxes/${boxId}`);
  return data.then((res) => res.spentTransactionId).catch((_) => null);
}

export async function getIssuingBox(tokenId) {
  const data = getRequest(`/assets/${tokenId}/issuingBox`);
  return data.catch((_) => null);
}

export function sendTx(tx) {
  explorer.broadcastTx(tx);
}

export async function getBalance(addr) {
  return await getRequest(`/addresses/${addr}/balance/confirmed`, explorerApi);
}
