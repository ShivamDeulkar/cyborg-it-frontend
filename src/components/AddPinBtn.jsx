import React from "react";
import { IoMdAdd } from "react-icons/io";
import { Link } from "react-router-dom";

const AddPinBtn = () => {
  return (
    <Link
      to={`create-pin`}
      className=" bg-primary rounded-full md:rounded-lg w-12 aspect-square  md:w-14  justify-center items-center flex"
    >
      <IoMdAdd className="text-gray-800" strokeWidth={5} fontSize={18} />
    </Link>
  );
};

export default AddPinBtn;
