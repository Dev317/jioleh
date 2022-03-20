import React, { useState, useRef, useEffect } from "react";
import { HiMenu } from "react-icons/hi";
import { AiFillCloseCircle } from "react-icons/ai";
import { Link, Route, Routes } from "react-router-dom";

import VendorSidebar from "../components/VendorSidebar";
import VendorProfile from "../components/VendorProfile";
import VendorPins from "./VendorPins";
import { vendorQuery } from "../utils/data";
import { client } from "../client";
import logo from "../assets/logo.png";
import { fetchVendor } from "../utils/fetchVendor";
import { VendorScanner } from "../components";
import { UserProfile } from "../components";
import VendorCampaignDetail from "../components/VendorCampaignDetail";
import VendorCreateCampaign from "../components/VendorCreateCampaign";

const VendorHome = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [vendor, setVendor] = useState(null);

  const vendorInfo = fetchVendor();

  const scrollRef = useRef(null);

  useEffect(() => {
    const query = vendorQuery(vendorInfo?._id);
    client.fetch(query).then((data) => {
      setVendor(data[0]);
      console.log(data[0]);
    });
  }, []);

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  });

  return (
    <div className="flex bg-gray-50 md:flex-row flex-col h-screen transaction-height duration-75 ease-out">
      <div className="hidden md:flex h-screen flex-initial">
        <VendorSidebar user={vendor && vendor} />
      </div>
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <HiMenu
            fontSize={40}
            className="cursor-pointer"
            onClick={() => setToggleSidebar(true)}
          />
          <Link to="/vendor">
            <img src={logo} alt="logo" className="w-28" />
          </Link>
          <Link to={`/vendor/vendor-profile/${vendor?._id}`}>
            <img src={vendor?.image} alt="logo" className="w-28" />
          </Link>
        </div>
        {toggleSidebar && (
          <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
            <div className="absolute w-full flex justify-end items-center p-2">
              <AiFillCloseCircle
                fontSize={30}
                className="cursor-pointer"
                onClick={() => setToggleSidebar(false)}
              />
            </div>
            <VendorSidebar user={vendor && vendor} closeToggle={setToggleSidebar} />
          </div>
        )}
      </div>

      <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
        <Routes>
          <Route path="/vendor-profile/:vendorId" element={<VendorProfile />} />
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/*" element={<VendorPins vendor={vendor && vendor} />} />
          <Route path="/vendor-campaign-detail" element={<VendorCampaignDetail />} />
          <Route path="/vendor-scanner" element={<VendorScanner />} />
          <Route path="/vendor-create-campaign" element={<VendorCreateCampaign />} />
        </Routes>
      </div>
    </div>
  );
};

export default VendorHome;
