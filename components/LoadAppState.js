import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveLoans,
  setBlockHeight,
  setErrorFields,
  setFields,
  setLoadingFields,
  setOraclePrices,
  setPools,
  updatePool,
} from "../redux/appSlice";
import { currentHeight } from "../ergofunctions/explorer";
import {get_all_fields} from '../ergofunctions/fields'
import { useQuery } from "react-query";

export default function LoadAppState({ routerReady }) {
  const dispatch = useDispatch();
  const reduxUserAddress = useSelector((state) => state.app.userAddress);

  // Get all active votes
  const {
    isLoading: isLoadingFields,
    error: isErrorFields,
    data: dataFields,
  } = useQuery("allFields", () => get_all_fields(), {
    refetchOnWindowFocus: false,
    refetchInterval: 120000,
  });
  console.log("dataFields", dataFields)

  const {
    data: blockHeightData,
  } = useQuery("blockheight", () => currentHeight(), {
    refetchOnWindowFocus: false,
    refetchInterval: 120000,
  });

  // All Active Votes
  useEffect(() => {
    if (dataFields) {
      dispatch(setFields(dataFields));
    }
  }, [dataFields]);
  useEffect(() => {
    dispatch(setLoadingFields(isLoadingFields));
  }, [isLoadingFields]);
  useEffect(() => {
    dispatch(setErrorFields(isErrorFields));
  }, [isErrorFields]);

  // Set blockheight
  useEffect(() => {
    dispatch(setBlockHeight(blockHeightData));
  }, [blockHeightData]);



  return <div style={{ display: "none" }}></div>;
}
