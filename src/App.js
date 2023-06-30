import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./components/login";
import Home from "./container/home";
import React from "react";

const App = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="/*" element={<Home />} />
    </Routes>
  );
};

export default App;
