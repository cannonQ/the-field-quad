import { createSlice } from "@reduxjs/toolkit";
import { AppStateInterface } from "interfaces/AppStateInterface";
// import {Field} from '../ergofunctions/fields'

const initialState: AppStateInterface = {
  isKyaOpen: false,
  kyaAccepted: false,

  blockHeight: null,

  walletSelectOpen: false,
  walletState: "Configure",

  oraclePrices: null,
  userAddress: null,
  userAddressList: [],

  userTokens: null,

  fields: [],
  loadingFields: true,
  errorFields: null
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAppState: (state, action) => {
      state = { ...state, ...action.payload };
    },

    setIsKyaOpen: (state, action) => {
      state.isKyaOpen = action.payload;
    },
    setKyaAccepted: (state, action) => {
      state.kyaAccepted = action.payload;
    },

    setBlockHeight: (state, action) => {
      state.blockHeight = action.payload;
    },

    // Wallet
    setWalletSelectOpen: (state, action) => {
      state.walletSelectOpen = action.payload;
    },
    setWalletState: (state, action) => {
      state.walletState = action.payload;
    },
    setUserAddress: (state, action) => {
      state.userAddress = action.payload;
    },
    setUserAddressList: (state, action) => {
      state.userAddressList = action.payload;
    },
    setOraclePrices: (state, action) => {
      state.oraclePrices = action.payload;
    },

    setUserTokens: (state, action) => {
      state.userTokens = action.payload;
    },

    setFields: (state, action) => {
      state.fields = action.payload;
    },
    setLoadingFields: (state, action) => {
      state.loadingFields = action.payload;
    },
    setErrorFields: (state, action) => {
      state.errorFields = action.payload;
    }
  },
});

export const {
  setAppState,
  setIsKyaOpen,
  setKyaAccepted,
  setWalletSelectOpen,
  setWalletState,
  setBlockHeight,

  setOraclePrices,
  setUserAddress,
  setUserAddressList,

  setUserTokens,

  setFields,
  setLoadingFields,
  setErrorFields
} = appSlice.actions;

export default appSlice.reducer;
