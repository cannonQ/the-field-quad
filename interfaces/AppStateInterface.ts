import { Field } from "ergofunctions/fields";

export type walletStateType = "nautilus" | "safew" | "ergopay" | "Configure"

export interface AppStateInterface {
    isKyaOpen: boolean;
    kyaAccepted: boolean;
  
    blockHeight: number | null;
  
    walletSelectOpen: boolean;
    walletState: walletStateType;
  
    oraclePrices: null;
    userAddress: string | null;
    userAddressList: string[] | null;

    userTokens: any;

    fields: Field[],
    loadingFields: boolean;
    errorFields: any | null;
}

export interface SelectorAppState {
    app: AppStateInterface
}