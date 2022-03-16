import React, { useEffect, useState } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';
// import { GoogleLogout } from 'react-google-login';

// import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data';
import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import QRModal from './QRModal';
import { vendorQuery } from '../utils/data';

const randomImg = 'https://cdn.wallpapersafari.com/29/50/7acBKo.jpg';
const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none';
const notActiveBtnStyles = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none';

const VendorProfile = () => {
  const [vendor, setVendor] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText ] = useState('Created');
  const [activeBtn, setActiveBtn] = useState('created');
  const [showQRModal, setShowQRModal] = useState(false);
  const [editingMode, setEditingMode] = useState(false);
  const navigate = useNavigate();
  const { vendorId } = useParams();

  useEffect(() => {
    const query = vendorQuery(vendorId);
    client.fetch(query).then((data) => {
      setVendor(data[0]);
    });
  }, [vendorId]);

  // useEffect(() => {
  //   if (text === 'Created') {
  //     const createdPinsQuery = CreatedPinsQuery(userId);
  //     client.fetch(createdPinsQuery).then((data) => {
  //       setPins(data);
  //     })
  //   } else {
  //     const savedPinsQuery = userSavedPinsQuery(userId);
  //     client.fetch(savedPinsQuery).then((data) => {
  //       setPins(data);
  //     });
  //   }
  // }, [text, userId]);

  const logout = () => {
    localStorage.clear();

    navigate('/login')
  }

  if (!vendor) {
    return <Spinner message ='Loading profile...'/>
  }

  return (
    <div className='relative pb-2 h-full justify-center items-center'>
      <div className='flex flex-col pb-5'>
        <div className='relative flex flex-col mb-7'>
          <div className='flex flex-col justify-center items-center'>
            <img 
              src={randomImg}
              className='w-full h-370 2xl:h-510 shadow-lg object-cove'
              alt='banner-pic'
            />
            <img
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
              src={vendor.image}
              alt="vendor-pic"
            />
          </div>
          
          <h1 className="font-bold text-2xl text-center mt-3">
            {vendor.username}
          </h1>

          <div className='absolute top-0 z-1 right-0 p-2'>logout
          {/* {userId === user._id && (
              <GoogleLogout
                clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}
                render={(renderProps) => (
                  <button
                    type="button"
                    className=" bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                  >
                    <AiOutlineLogout color="red" fontSize={21} />
                  </button>
                )}
                onLogoutSuccess={logout}
                cookiePolicy="single_host_origin"
              />
            )} */}

            <button
              type="button"
              className=" bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
            >
              <AiOutlineLogout color="red" fontSize={21} />
            </button>
          </div>
        </div>

        <div className='text-center mb-7'>
          <button
              type="button"
              onClick={(e) => {
                setEditingMode(!editingMode);
              }}
              className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles}`}
            >
              {editingMode ? "Save" : "Edit Profile"}
          </button>

          {editingMode ? 
          <form class="w-full max-w-sm">
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="category">
              Category
            </label>
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="category" type="text" placeholder="Category" />
          </div>
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="Location">
              Location
            </label>
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="location" placeholder="Location" />
          </div>
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="Location">
              Description
            </label>
            <textarea
              class="
                form-control
                block
                w-full
                px-3
                py-1.5
                text-base
                font-normal
                text-gray-700
                bg-white bg-clip-padding
                border border-solid border-gray-300
                rounded
                transition
                ease-in-out
                m-0
                focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
              "
              id="description"
              rows="4"
              placeholder="Description"
            ></textarea>
          </div>
          </form> 
          :
          <div class="grid grid-cols-3 gap-2" >
            <div class="...">
              <p className="text-xl font-bold break-words mt-3">Category:</p>
            </div>
            <div class="col-span-2 ...">
              <p className="text-xl break-words mt-3">{vendor.category == null ? "no text" : vendor.category}</p>
            </div>
            <div class="...">
              <p className="text-xl font-bold break-words mt-3">Location:</p>
            </div>
            <div class="col-span-2 ...">
              <p className="text-xl break-words mt-3">{vendor.location == null ? "no text" : vendor.location}</p>
            </div><div class="...">
              <p className="text-xl font-bold break-words mt-3">About:</p>
            </div>
            <div class="col-span-3 ...">
              <p className="text-xl break-words mt-3">{vendor.description == null ? "no text" : vendor.description}</p>
            </div>
          </div>
          }
          
        </div>

      </div>
    </div>
  );
};

export default VendorProfile;
