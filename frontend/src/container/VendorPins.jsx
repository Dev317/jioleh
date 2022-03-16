import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar, PinDetail, CreatePin, Search } from '../components';
import VendorFeed from '../components/VendorFeed';

const VendorPins = ({ vendor }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className='px-2 md:px-5'>
      {/* <div className='bg-gray-50'>
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} user={user}/>
      </div> */}
      <div className='h-full'>
        <Routes>
          <Route path='/' element={<VendorFeed />}/>
          {/* <Route path='/category/:categoryId' element={<VendorFeed />}/> */}
          <Route path='/pin-detail/:pinId' element={<PinDetail user={vendor}/>}/>
          {/* <Route path='/create-pin' element={<CreatePin user={user}/>}/> */}
          {/* <Route path='/search' element={<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>}/> */}
        </Routes>
      </div>
    </div>
  );
};

export default VendorPins;
