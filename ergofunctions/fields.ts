import { delay } from "./helpers";
import {find_markets} from "./platform_functions";
import {claim_winnings} from "./walletUtils";

// export interface Field {
//   fieldDescription: string;
//   totalPledges: string;
//   pledgesOnEachOption: PledgesOnEachOption[];
//   fieldBox: string;
//   isActive: boolean;
//   userAmountWon: number;
// }

// export interface PledgesOnEachOption {
//   pledgeName: string;
//   pledgeAmount: number;
// }

export interface Field {
  collection_nft?: string,
  description: string
  pledgesOnEachOption: PledgesOnEachOption[]
  marketState: string
  winningIndex: number
  winner: string | -1
  ableToPledge: boolean
  market_box: any;
  pledge_closure_block: number;
  winner_token?: string;
}

export interface PledgesOnEachOption {
  option: string
  Amount: number
}


export async function get_all_fields(): Promise<Field[]> {
  // Returns array of fields.
  let markets = await find_markets()
  // await claim_winnings("32fa9019271c9b3accb31a50179a388d08897553ec96ade33244f2c1109c4aee", "3363afca960ed835d889249e6b222a52f9921bf932ade26637c9de3f5391a7f5", "6000000")
  console.log("Markets", markets)

  // @ts-ignore
  return markets;
  // console.log("Markets", markets)
  // console.log("WAAA")
  // return [
  //   {
  //     fieldDescription: "Description of the field",
  //     totalPledges: "Total Amount of assets bet",
  //     pledgesOnEachOption: [
  //       { pledgeName: "heat", pledgeAmount: 100 },
  //       { pledgeName: "cavs", pledgeAmount: 50 },
  //       { pledgeName: "GSW", pledgeAmount: 10000 },
  //       { pledgeName: "field", pledgeAmount: 500 },
  //     ],
  //     fieldBox: "", //new ErgoBox();//"Ergo box (used to pass into functions)"
  //     isActive: true,
  //     userAmountWon: 100,
  //   },
  // ];
}

