import React from "react";
import LoadingCircle from "./LoadingCircle/LoadingCircle";
import Fade from "./Fade/Fade";

interface LoadingScreenProps {
  title: string;
}

const LoadingScreen = ({ title }: LoadingScreenProps) => {
  return (
    <Fade fadeKey={`loading-fade-${title}`} fadeDuration={0.1}>

    <div className="">
      <div className="w-12 m-auto mt-8 mb-4">
        <LoadingCircle />
      </div>
      <p className="text-center text-gray-100">{title}...</p>

    </div>
    </Fade>
  );
};

export default LoadingScreen;
