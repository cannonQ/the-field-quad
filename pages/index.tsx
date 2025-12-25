import React, { useState } from "react";
import Head from "next/head";
import Fade from "@/components/Fade/Fade";
import { QuadView } from "@/components/QuadView";
import FieldItem from "@/components/FieldItem/FieldItem";
import { useSelector } from "react-redux";
import { SelectorAppState } from "interfaces/AppStateInterface";
import { addNumberCommas } from "ergofunctions/frontend_helpers";

function Home() {
  const [type, setType] = useState<"open" | "closed">("open");
  const [viewMode, setViewMode] = useState<"quad" | "list">("quad");
  
  const {
    fields: reduxFields,
    loadingFields,
    blockHeight,
  } = useSelector((state: SelectorAppState) => state.app);

  // Find featured event (first active, pledgeable market)
  const featuredField = reduxFields.find(
    (f) => f.marketState !== "past" && f.ableToPledge
  );
  
  // Other markets (not featured)
  const otherFields = reduxFields.filter((f) => f !== featuredField);

  const renderLoading = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className="h-48 bg-white/5 rounded-xl animate-pulse" />
      ))}
    </div>
  );

  const renderFields = () => {
    if (loadingFields) return renderLoading();

    return (
      <Fade fadeKey="all-fields">
        {/* Featured Event - Quad View */}
        {featuredField && viewMode === "quad" && (
          <QuadView field={featuredField} />
        )}

        {/* Other Markets Header */}
        {otherFields.length > 0 && (
          <h3 className="text-white text-xl font-bold mt-8 mb-4">
            {featuredField ? "More Markets" : "All Markets"}
          </h3>
        )}

        {/* Other Markets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-12">
          {otherFields.map((field, index) => {
            if (type === "open" && field.marketState === "past") return null;
            if (type === "closed" && field.marketState !== "past") return null;
            if (type === "closed" && field.winner === -1) return null;
            
            return <FieldItem key={`${field.description}-${index}`} data={field} />;
          })}
        </div>
      </Fade>
    );
  };

  return (
    <div>
      <Head>
        <title>The Field - Prediction Markets</title>
        <meta name="description" content="Parimutuel prediction markets on Ergo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Fade fadeKey="home" fadeDuration={0.2}>
        <div>
          {/* Controls Row */}
          <div className="w-full flex flex-row items-center justify-between mb-6">
            {/* Open/Closed Toggle */}
            <div className="bg-blue-600 flex flex-row items-center p-1 space-x-2 text-white text-sm font-semibold rounded-lg">
              <div
                onClick={() => setType("open")}
                className={`px-4 py-2 rounded cursor-pointer transition-colors ${
                  type === "open" ? "bg-blue-800" : "hover:bg-blue-700"
                }`}
              >
                Open
              </div>
              <div
                onClick={() => setType("closed")}
                className={`px-4 py-2 rounded cursor-pointer transition-colors ${
                  type === "closed" ? "bg-blue-800" : "hover:bg-blue-700"
                }`}
              >
                Closed
              </div>
            </div>

            {/* Block Height */}
            <div className="border border-white/20 px-3 py-1 rounded">
              <p className="text-xs md:text-sm">
                Block {blockHeight ? addNumberCommas(blockHeight) : "..."}
              </p>
            </div>
          </div>

          {/* Main Content */}
          {renderFields()}
        </div>
      </Fade>
    </div>
  );
}

export default Home;