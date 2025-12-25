import React, { Fragment, ReactNode, useState } from "react";
import Head from "next/head";
import Fade from "@/components/Fade/Fade";
import FieldItem from "@/components/FieldItem/FieldItem";
import { useSelector } from "react-redux";
import {
  AppStateInterface,
  SelectorAppState,
} from "interfaces/AppStateInterface";
import LoadingScreen from "@/components/LoadingScreen";
import { addNumberCommas } from "ergofunctions/frontend_helpers";

function Home() {
  const [type, setType] = useState<"open" | "closed">("open");
  const {
    fields: reduxFields,
    loadingFields,
    errorFields,
    blockHeight,
  } = useSelector((state: SelectorAppState) => state.app);

  console.log("reduxFields", reduxFields);

  const renderFields = () => {
    if (loadingFields) {
      return (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6 pb-12">
          {/* <LoadingScreen title="Loading fields" /> */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((an) => {
            return (
              <div key={`loader-home-index-${an}`} className="animate-pulse bg-black/50 shadow rounded h-80 max-w-sm w-full mx-auto" />
            );
          })}
        </div>
      );
    }
    return (
      <Fade fadeKey={`all-fields-display`}>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6 pb-12">
          {reduxFields.map((lo, index) => {
            if (type === "open" && lo.marketState === "past") {
              return;
            } else if (type === "closed" && lo.marketState !== "past") {
              return;
            }
            // if winner is -1 it means there is no winner, return nothing
            if(type === "closed" && lo.winner === -1) {
              return 
            }

            return <FieldItem key={`${lo.description}-${index}`} data={lo} />;
          })}
        </div>
      </Fade>
    );
  };
  return (
    <div>
      <Head>
        <title>The Field</title>
        <meta property="og:image" content={"/android-chrome-512x512.png"} />
        <meta name="description" content="The Field." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Fade fadeKey={"dash-fade"} fadeDuration={0.2}>
        <div>
          {/* OPEN/CLOSE POOLS + PENDING POOLS + BUTTON FOR NEW BET */}
          <div className="w-full flex flex-row items-center justify-between">
            <div className="bg-blue-600 flex flex-row items-center p-1 space-x-2 text-white text-sm font-semibold rounded-lg ">
              <div
                onClick={() => setType("open")}
                className={`transition-colors px-4 py-2 rounded cursor-pointer  ${
                  type === "open" ? "bg-blue-800" : "hover:bg-blue-700"
                }`}
              >
                Open
              </div>
              <div
                onClick={() => setType("closed")}
                className={`transition-colors px-4 py-2 rounded cursor-pointer  ${
                  type === "closed" ? "bg-blue-800" : "hover:bg-blue-700"
                }`}
              >
                Closed
              </div>
            </div>
            <div className="border border-white/20 px-3 py-1 rounded">
              <p className="text-xs md:text-sm">
                Blockheight {blockHeight ? addNumberCommas(blockHeight) : "..."}
              </p>
            </div>
          </div>

          {/* LIST OF BETS */}
          {renderFields()}
        </div>
      </Fade>
    </div>
  );
}

export default Home;
