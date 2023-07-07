import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdAdd, IoMdSearch } from "react-icons/io";

const Navbar = ({ searchTerm, setSearchTerm, user }) => {
  const navigate = useNavigate();
  if (!user) return null;
  return (
    <div className="flex gap-2 md:gap-5 w-full mt-5 pd-7 ">
      <div className="flex justify-start items-center w-full px-2 bg-gray-800 rounded-lg  border-none outline-none focus-within:shadow-sm">
        <IoMdSearch fontSize={21} className=" ml-1" />
        <input
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          value={searchTerm}
          onFocus={() => navigate("/search")}
          className="p-2 w-full bg-gray-800 outline-none "
        />
      </div>
      <div className="flex gap-3">
        <Link to={`user-profile/${user?._id}`} className="hidden md:block">
          <img
            src={user.image}
            alt="user-profile-pic"
            className=" w-12 md:w-14 rounded-md"
            referrerPolicy="no-referrer"
          />
        </Link>
        <Link
          to={`create-pin`}
          className=" bg-gray-500 rounded-lg w-12 aspect-square  md:w-14 flex justify-center items-center"
        >
          <IoMdAdd className="text-gray-800" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
