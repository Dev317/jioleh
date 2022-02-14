import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import VendorScanner from "./components/VendorScanner";
import VendorLogin from "./components/VendorLogin";
import VendorSignUp from "./components/VendorSignUp";
import Login from "./components/Login";
import Home from "./container/Home";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const User =
      localStorage.getItem("user") !== "undefined"
        ? JSON.parse(localStorage.getItem("user"))
        : localStorage.getItem("vendor") !== "undefined"
        ? JSON.parse(localStorage.getItem("vendor"))
        : localStorage.clear();
    if (!User) navigate("/login");
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/vendor-scanner" element={<VendorScanner />} />
      <Route path="/vendor-login" element={<VendorLogin />} />
      <Route path="/vendor-signup" element={<VendorSignUp />} />
      <Route path="/*" element={<Home />} />
    </Routes>
  );
};

export default App;
