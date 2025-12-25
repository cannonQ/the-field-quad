import moment from "moment";
import { Address, AddressKind } from "@coinbarn/ergo-ts/dist/models/address";
import { boxById, getIssuingBox, txById } from "./explorer";
import { supportedCurrencies } from "./consts";
import { createStandaloneToast } from "@chakra-ui/toast";
import { theme } from "../components/theme";

const { toast } = createStandaloneToast({ theme: theme });

let ergolib = import("ergo-lib-wasm-browser");

let ergolib = typeof window !== 'undefined' ? import("ergo-lib-wasm-browser") : Promise.resolve(null);

const floatRe = new RegExp("^([0-9]*[.])?[0-9]*$");
const naturalRe = new RegExp("^[0-9]+$");

export async function encodeLongTuple(a, b) {
  if (typeof a !== "string") a = a.toString();
  if (typeof b !== "string") b = b.toString();
  return (await ergolib).Constant.from_i64_str_array([a, b]).encode_to_base16();
}


export async function colTuple(a, b) {
  return (await ergolib).Constant.from_tuple_coll_bytes(
    Buffer.from(a, "hex"),
    Buffer.from(b, "hex")
  ).encode_to_base16();
}

export async function encodeByteArray(reg) {
  return (await ergolib).Constant.from_byte_array(reg).encode_to_base16();
}

export async function decodeLongTuple(val) {
  return (await ergolib).Constant.decode_from_base16(val)
    .to_i64_str_array()
    .map((cur) => parseInt(cur));
}

export async function encodeNum(n, isInt = false) {
  if (isInt) return (await ergolib).Constant.from_i32(n).encode_to_base16();
  else
    return (await ergolib).Constant.from_i64(
      (await ergolib).I64.from_str(n)
    ).encode_to_base16();
}

export async function decodeNum(n, isInt = false) {
  if (isInt) return (await ergolib).Constant.decode_from_base16(n).to_i32();
  else return (await ergolib).Constant.decode_from_base16(n).to_i64().to_str();
}

export async function encodeHex(reg) {
  return (await ergolib).Constant.from_byte_array(
    Buffer.from(reg, "hex")
  ).encode_to_base16();
}

function toHexString(byteArray) {
  return Array.from(byteArray, function (byte) {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
}

export async function decodeString(encoded) {
  return toHexString(
    (await ergolib).Constant.decode_from_base16(encoded).to_byte_array()
  );
}

async function decodeColTuple(str) {
  const two = (await ergolib).Constant.decode_from_base16(
    str
  ).to_tuple_coll_bytes();
  const decoder = new TextDecoder();
  return [decoder.decode(two[0]), decoder.decode(two[1])];
}

export function decodeRenderedLongTuple(str) {
  // Remove the square brackets and split the string by comma
  const numbers = str.replace(/[\[\]]/g, '').split(',');

  // Parse the elements as long integers
  const firstNumber = parseInt(numbers[0]);
  const secondNumber = parseInt(numbers[1]);

  // Return the numbers as a tuple
  return [firstNumber, secondNumber];
}

export function currencyToLong(val, decimal = 9) {
  if (typeof val !== "string") val = String(val);
  if (val === undefined) return 0;
  if (val.startsWith("."))
    return parseInt(val.slice(1) + "0".repeat(decimal - val.length + 1));
  let parts = val.split(".");
  if (parts.length === 1) parts.push("");
  if (parts[1].length > decimal) return 0;
  return parseInt(parts[0] + parts[1] + "0".repeat(decimal - parts[1].length));
}

export function longToCurrency(val, decimal = 9, currencyName = null) {
  if (typeof val !== "number") val = parseInt(val);
  if (currencyName) decimal = supportedCurrencies[currencyName].decimal;
  return val / Math.pow(10, decimal);
}

export function isFloat(num) {
  return num === "" || floatRe.test(num);
}

export function isNatural(num) {
  return num === "" || naturalRe.test(num);
}

export async function getEncodedBoxSer(box) {
  const bytes = (await ergolib).ErgoBox.from_json(
    JSON.stringify(box)
  ).sigma_serialize_bytes();
  let hexString = toHexString(bytes);
  return "63" + hexString;
}

export function isP2pkAddr(tree) {
  return Address.fromErgoTree(tree).getType() === AddressKind.P2PK;
}

export function ascii_to_hex(str) {
  var arr1 = [];
  for (var n = 0, l = str.length; n < l; n++) {
    var hex = Number(str.charCodeAt(n)).toString(16);
    arr1.push(hex);
  }
  return arr1.join("");
}

export function hexToAscii(hexString) {
  var asciiString = '';
  for (var i = 0; i < hexString.length; i += 2) {
    var hexCode = hexString.substring(i, i + 2);
    var asciiChar = String.fromCharCode(parseInt(hexCode, 16));
    asciiString += asciiChar;
  }
  return asciiString;
}


export function isJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}
