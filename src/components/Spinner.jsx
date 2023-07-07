import React from "react";
import { CirclesWithBar } from "react-loader-spinner";

const Spinner = ({ message }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div className=" m-5">
        <CirclesWithBar color="#03ffff" height={50} width={200} />
      </div>
      <p className=" text-lg text-center px-2">{message}</p>
    </div>
  );
};

export default Spinner;
