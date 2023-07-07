import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import AddPinBtn from "./AddPinBtn";

const Navbar = ({ searchTerm, setSearchTerm, user }) => {
  const navigate = useNavigate();
  if (!user) return null;
  return (
    <div className="flex gap-2 md:gap-5 w-full md:mt-5 mt-0 pd-7 ">
      <div className="flex justify-start items-center w-full px-2 md:bg-gray-800 bg-gray-700   rounded-md border-none outline-none focus-within:shadow-sm">
        <IoMdSearch fontSize={21} className=" md:ml-1" />
        <input
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          value={searchTerm}
          onFocus={() => navigate("/search")}
          className="p-2 w-full md:bg-gray-800 bg-gray-700 outline-none "
        />
      </div>
      <div className="flex gap-3">
        <Link
          to={`user-profile/${user?._id}`}
          className="hidden md:block md:w-14 w-12"
        >
          <img
            src={user.image}
            alt="user-profile-image"
            className=" w-full  rounded-full"
            referrerPolicy="no-referrer"
          />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
