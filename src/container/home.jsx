import React, { useState, useRef, useEffect } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { Link, Route, Routes } from "react-router-dom";

import { Sidebar, UserProfile } from "../components";
import { client } from "../client";
import Pins from "./Pins";
import { fetchUser, userQuery } from "../utils/data";
import logo from "../assets/logo.png";
import AddPinBtn from "../components/AddPinBtn";

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);
  const userInfo = fetchUser();

  useEffect(() => {
    const query = userQuery(userInfo?.sub);
    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, []);

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex bg-gray-900 text-gray-500 h-screen  md:flex-row flex-col transition-height duration-75 ease-out">
      <div className="hidden md:flex h-screen flex-initial">
        <Sidebar user={user && user} />
      </div>
      <div className="flex md:hidden flex-row items-center">
        <div className=" p-2 w-full flex flex-row justify-between items-center shadow-md">
          <AiOutlineMenu
            fontSize={40}
            className="cursor-pointer text-highlight "
            onClick={() => setToggleSidebar(true)}
          />
          <Link to="/">
            <img src={logo} alt="logo" className="w-28" />
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img
              src={user?.image}
              alt="user-profile"
              referrerPolicy="no-referrer"
              className=" w-12 rounded-full"
            />
          </Link>
        </div>
        {toggleSidebar && (
          // overflow removed
          <div className="fixed top-0 left-0 w-full h-screen   z-10 ">
            <Sidebar user={user && user} closeToggle={setToggleSidebar} />
          </div>
        )}
      </div>
      <div className=" pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/*" element={<Pins user={user && user} />} />
        </Routes>
      </div>
      <div className=" absolute bottom-5 right-5 block ">
        <AddPinBtn />
      </div>
    </div>
  );
};

export default Home;
