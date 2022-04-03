import React from "react";
import { NavLink, Link } from "react-router-dom";
import { RiHomeFill } from "react-icons/ri";
import { urlFor } from "../client";
import logo from "../assets/logo.png";

const isNotActiveStyle =
  "flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize";
const isActiveStyle =
  "flex items-center px-5 gap-3 font-extrabold bord-r-2 border-black transition-all duration-200 ease-in-out capitalize";

const VendorSidebar = ({ vendor, closeToggle }) => {
  const handleCloseSidebar = () => {
    if (closeToggle) closeToggle(false);
  };

  return (
    <div className="flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar">
      <div className="flex flex-col">
        <Link
          to="/vendor"
          className="flex px-5 gap-2 my-6 pt-1 w-190 items-center"
          onClick={handleCloseSidebar}
        >
          <img src={logo} alt="logo" className="w-full" />
        </Link>
        <div className="flex flex-col gap-5">
          <NavLink
            to="/vendor"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
            onClick={handleCloseSidebar}
          >
            <RiHomeFill /> Home
          </NavLink>
          <NavLink
            to={`/vendor/vendor-qr`}
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
            onClick={handleCloseSidebar}
          >
            QR Code
          </NavLink>
          <h3 className="mt-2 px-5 text-base 2xl:text-xl">Manage Campaign</h3>
          <NavLink
            to={`/vendor/vendor-campaign-detail`}
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
            onClick={handleCloseSidebar}
          >
            My Campaign
          </NavLink>
          <NavLink
            to={`/vendor/vendor-scanner`}
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
            onClick={handleCloseSidebar}
          >
            {/* <img 
                        src={category.image}
                        className='w-8 h-8 rounded-full shadow-sm' alt='category'
                    /> */}
            Scan QR Code
          </NavLink>
          <NavLink
            to={`/vendor/vendor-create-campaign`}
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
            onClick={handleCloseSidebar}
          >
            {/* <img 
                        src={category.image}
                        className='w-8 h-8 rounded-full shadow-sm' alt='category'
                    /> */}
            Create Campaign
          </NavLink>
        </div>
      </div>
      {vendor && (
        <Link
          to={`/vendor/vendor-profile/${vendor._id}`}
          className="flex my-5 mb-3 gap-2 p-2 items-center bg-white rounder-lg shadow-lg mx-3"
          onClick={handleCloseSidebar}
        >
          <img
            src={vendor?.image && urlFor(vendor?.image).url()}
            className="w-10 h-10 rounded-full"
            alt="vendor-pic"
          />
          <p>{vendor.name}</p>
        </Link>
      )}
    </div>
  );
};

export default VendorSidebar;
