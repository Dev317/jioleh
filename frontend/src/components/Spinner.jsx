import React from "react";
import { BallTriangle } from "react-loader-spinner";

const Spinner = ({ message }) => {
  return (
    <div className="flex flex-col jusitfy-center items-center">
      <BallTriangle color="#00BFFF" height={80} width={200} />
      <p className="text-lg text-center px-2">{message}</p>
    </div>
  );
};

export default Spinner;
