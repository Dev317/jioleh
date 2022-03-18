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
const activeBtnStyles = "p-2 font-bold border-b-2 w-20 outline-solid border-red-500 text-red-500";
const notActiveBtnStyles = "bg-primary text-black w-20 font-bold p-2 outline-none";
const EditBtnStyle = 'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none';

const About = ({vendor, editingMode, setEditingMode}) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => { setName(vendor.name) }, [])
  
  return (
    <div className='text-center mb-7'>
        <button
            type="button"
            onClick={(e) => {
              setEditingMode(!editingMode);
            }}
            className={EditBtnStyle}
          >
            {editingMode ? "Save" : "Edit Profile"}
        </button>

        {editingMode ? 
          <form class="w-full p-6">
            <div class="mb-6">
              <label class="text-left block text-gray-700 text-sm font-bold mb-2" for="name">
                Company Name
              </label>
              <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Company Name" value={name} onChange={e => setName(e.target.value)}/>
            </div>
            <div class="mb-6">
              <label class="text-left block text-gray-700 text-sm font-bold mb-2" for="category">
                Category
              </label>
              <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="category" type="text" placeholder="Category" />
            </div>
            <div class="mb-6">
              <label class="text-left block text-gray-700 text-sm font-bold mb-2" for="Location">
                Location
              </label>
              <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="location" placeholder="Location" />
            </div>
            <div class="mb-6">
              <label class="text-left block text-gray-700 text-sm font-bold mb-2" for="Description">
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
  )
}

const VendorProfile = () => {
  const [vendor, setVendor] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText ] = useState('about');
  const [activeBtn, setActiveBtn] = useState('about');
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
          {vendorId === vendor._id && (
            <button
              type="button"
              className=" bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
              onClick={logout}
              // disabled={renderProps.disabled}
            >
              <AiOutlineLogout color="red" fontSize={21} />
            </button>
            )}
          </div>
        </div>

        <div className="text-center mb-7">
          <button
            type="button"
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn("about");
            }}
            className={`${
              activeBtn === "about" ? activeBtnStyles : notActiveBtnStyles
            }`}
          >
            About
          </button>
          <button
            type="button"
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn("campaigns");
            }}
            className={`${
              activeBtn === "campaigns" ? activeBtnStyles : notActiveBtnStyles
            }`}
          >
            Campaigns
          </button>
        </div>

        {activeBtn == "about" ? 
          <About vendor={vendor} editingMode={editingMode} setEditingMode={setEditingMode}/>
          :
          <div class='text-center'>Campaign Information</div>
        }
        

      </div>
    </div>
  );
};

export default VendorProfile;
