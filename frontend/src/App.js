import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import VendorScanner from "./components/VendorScanner";
import VendorLogin from "./components/VendorLogin";
import VendorSignUp from "./components/VendorSignUp";
import VendorQR from "./components/VendorQR";
import Login from "./components/Login";
import Home from "./container/Home";
import { fetchUser } from "./utils/fetchUser";

const App = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   const User = fetchUser();
  //   if (!User) navigate("/login");
  // }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/vendor-scanner" element={<VendorScanner />} />
      <Route path="/vendor-login" element={<VendorLogin />} />
      <Route path="/vendor-signup" element={<VendorSignUp />} />
      <Route path="/vendor-qr" element={<VendorQR />} />
      <Route path="/*" element={<Home />} />
    </Routes>
  );
};

export default App;
