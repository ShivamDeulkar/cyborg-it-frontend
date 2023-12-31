import React from "react";
import { NavLink, Link } from "react-router-dom";
import { RiHomeFill } from "react-icons/ri";

import logo from "../assets/logo.png";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { categories } from "../utils/data";

const isNotActiveStyle =
  "flex items-center px-5 p-2 gap-3 text-gray-500 hover:text-gray-200 transition-all duration-200 ease-in-out capitalize";
const isActiveStyle =
  "flex items-center px-5 py-2 gap-3 text-gray-50 font-extrabold border-r-4 border-gray-50 transition-all duration-200 ease-in-out capitalize bg-gray-600";

const Sidebar = ({ user, closeToggle }) => {
  const handleCloseSidebar = () => {
    if (closeToggle) closeToggle(false);
  };

  return (
    <div className="h-full relative md:bg-gray-800 md:px-4 w-full ">
      <div className="absolute z-10 w-5/6 md:w-full  flex justify-end items-center p-3 md:hidden animate-slide-in">
        <AiOutlineCloseCircle
          fontSize={30}
          className="cursor-pointer text-highlight"
          onClick={handleCloseSidebar}
        />
      </div>
      <div
        className="md:hidden block bg-black bg-opacity-60  w-full h-full -z-10 animate-fade-in"
        style={{ backdropFilter: "blur(10px)" }}
      ></div>
      <div
        className=" absolute md:static top-0 flex flex-col justify-between  bg-gray-800 w-5/6 md:w-full  h-full overflow-y-scroll min-w-210 hide-scrollbar animate-slide-in"
        style={{ opacity: 0.99 }}
      >
        <div className="flex flex-col w-full">
          <Link
            to="/"
            className="flex px-5 gap-2 mt-3 mb-2 pt-1 w-190 items-center self-center"
            onClick={handleCloseSidebar}
          >
            <img src={logo} alt="logo" />
          </Link>
          <div className="flex flex-col gap-2 md:gap-5 ">
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
            <div className="flex flex-col gap-2 overflow-scroll flex-1">
              {categories.slice(0, categories.length).map((category) => (
                <NavLink
                  to={`category/${category.name}`}
                  className={({ isActive }) =>
                    isActive ? isActiveStyle : isNotActiveStyle
                  }
                  onClick={handleCloseSidebar}
                  key={category.name}
                >
                  <img
                    src={category.image}
                    alt="category"
                    className="w-8 h-8 rounded-full shadow-sm "
                  />
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
    </div>
  );
};

export default Sidebar;
