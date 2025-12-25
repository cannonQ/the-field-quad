import moment from "moment";

// Adds commas to number values
export function addNumberCommas(value: number) {
  var str = value.toString().split(".");
  str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return str.join(".");
}


export function roundToCurrencyDecimal(value: string, decimalPlaces: number) {
  let newVal = value;
  const regex = new RegExp("^\\d*\\.\\d{" + (decimalPlaces + 1) + ",}$");
  if (regex.test(newVal)) {
    // If it is, round it to the allowed number of decimal places
    newVal = parseFloat(newVal).toFixed(decimalPlaces);
  }
  return newVal;
}

export function maxDP(value: string | number, dp = 3) {
  // *** Check for different types if needed ***

  if(typeof value === "number") {
    let finalValue = value;

    return parseFloat(finalValue.toFixed(dp));
  }

  // *** Also add a ceiling or floor parameter ***

  let finalValue = value;

  return parseFloat(parseFloat(finalValue).toFixed(dp));
}


export function formatValueWithDP(value: string | number, dp = 3) {
  return addNumberCommas(maxDP(value, dp));
}

export function blockToDate(toBlock: number, blockHeight: number) {
  var momentDurationFormatSetup = require("moment-duration-format");

  // Get timing of deadlines
  // Assuming deadline and blockHeight are defined somewhere in your code
  const deadlineDiff = (toBlock - blockHeight) * 2 * 60000;
  let isAfterDeadline: boolean = false;

  if (deadlineDiff < 0) {
    // If deadlineDiff is negative, it means the deadline has already passed
    isAfterDeadline = true;
  }
  // If deadlineDiff is positive or zero, calculate the formattedDeadline and compare
  const formattedDeadline = moment
    .duration(Math.abs(deadlineDiff), "milliseconds")
    // @ts-ignore
    .format("w [weeks], d [days], h [hours], m [minutes]", {
      largest: 2,
      trim: true,
    });

    return formattedDeadline

}