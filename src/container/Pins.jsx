import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";

import { Navbar, Feed, PinDetail, CreatePin, Search } from "../components";

const Pins = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div className="flex flex-col px-2 md:px-5 h-screen">
      <div className="mb-2 h-fit">
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          user={user && user}
        />
      </div>
      {/* The div below the Navbar should take all the remaining space */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/category/:categoryId" element={<Feed />} />
          <Route
            path="/pin-detail/:pinId"
            element={<PinDetail user={user && user} />}
          />
          <Route
            path="/create-pin"
            element={<CreatePin user={user && user} />}
          />
          <Route
            path="/search"
            element={
              <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default Pins;
