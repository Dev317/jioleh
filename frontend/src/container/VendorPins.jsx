import React from "react";
import { Routes, Route } from "react-router-dom";
import VendorFeed from "../components/VendorFeed";
import VendorPinDetail from "../components/VendorPinDetail";

const VendorPins = ({ vendor }) => {

  return (
    <div className="px-2 md:px-5">
      {/* <div className='bg-gray-50'>
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} user={user}/>
      </div> */}
      <div className="h-full">
        <Routes>
          <Route
            path="/"
            element={<VendorFeed vendorId={vendor && vendor._id} />}
          />
          {/* <Route path='/category/:categoryId' element={<VendorFeed />}/> */}
          <Route
            path="/pin-detail/:pinId"
            element={<VendorPinDetail user={vendor} />}
          />
          {/* <Route path='/create-pin' element={<CreatePin user={user}/>}/> */}
          {/* <Route path='/search' element={<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>}/> */}
        </Routes>
      </div>
    </div>
  );
};

export default VendorPins;
