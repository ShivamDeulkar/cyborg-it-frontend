import React from "react";
import { NavLink, Link } from "react-router-dom";
import { RiHomeFill } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";

import logo from "../assets/logo.png";

const isNotActiveStyle =
  "flex items-center px-5 p-2 gap-3 text-gray-500 hover:text-gray-200 transition-all duration-200 ease-in-out capitalize";
const isActiveStyle =
  "flex items-center px-5 py-2 gap-3 text-gray-50 font-extrabold border-r-4 border-gray-50 transition-all duration-200 ease-in-out capitalize bg-gray-600";

const categories = [
  { name: "Animals" },
  { name: "Wallpapers" },
  { name: "Photography" },
  { name: "Gaming" },
  { name: "Coding" },
  { name: "Other" },
];

const Sidebar = ({ user, closeToggle }) => {
  const handleCloseSidebar = () => {
    if (closeToggle) closeToggle(false);
  };

  return (
    <div className="flex flex-col justify-between bg-gray-800  h-full overflow-y-scroll min-w-210 hide-scrollbar">
      <div className="flex flex-col">
        <Link
          to="/"
          className="flex px-5 gap-2 mt-3 mb-3 pt-1 w-190 items-center"
          onClick={handleCloseSidebar}
        >
          <img src={logo} alt="logo" />
        </Link>
        <div className="flex flex-col gap-5 ">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
            onClick={handleCloseSidebar}
          >
            <RiHomeFill />
            Home
          </NavLink>
          <h3 className="mt-2 px-5 text-lg 2xl:text-xl text-gray-400">
            Discover categories
          </h3>
          <div className="flex flex-col gap-2">
            {categories.slice(0, categories.length - 1).map((category) => (
              <NavLink
                to={`category/${category.name}`}
                className={({ isActive }) =>
                  isActive ? isActiveStyle : isNotActiveStyle
                }
                onClick={handleCloseSidebar}
                key={category.name}
              >
                {category.name}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
      {user && (
        <Link
          to={`user-profile/${user?._id}`}
          className=" flex my-5 mx-3 mb-3 gap-2 p-2 items-center bg-gray-700 rounded-lg shadow-lg"
          onClick={handleCloseSidebar}
        >
          <img
            src={user.image}
            className=" w-10 h-10  rounded-full"
            alt="user-profile"
            referrerPolicy="no-referrer"
          />
          <p>{user.userName}</p>
        </Link>
      )}
    </div>
  );
};

export default Sidebar;
