import React, { useEffect, useState } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';
import { client } from '../client';
import Spinner from './Spinner';
import QRModal from './QRModal';
import { vendorQuery } from '../utils/data';
import { fetchVendor } from '../utils/fetchVendor';

import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";

const randomImg = 'https://cdn.wallpapersafari.com/29/50/7acBKo.jpg';
const activeBtnStyles = "p-2 font-bold border-b-2 outline-solid border-red-500 text-red-500";
const notActiveBtnStyles = "bg-primary text-black font-bold p-2 outline-none";
const EditBtnStyle = 'bg-red-500 text-white font-bold p-2 rounded-xl outline-none w-40';

const EditProfile = ( {vendor, editProfileMode, setEditProfileMode, loggedInVendor} ) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => { 
    setName(vendor.name);
    setCategory(vendor.category);
    setLocation(vendor.location);
    setDescription(vendor.description); 
  }, [])

  const handleSaveChanges = (e) => {
    client
      .patch(vendor._id) // Document ID to patch
      .set({
        name,
        category,
        location,
        description,
      }) // Shallow merge
      .commit()
      .then((updatedVendor) => {
        console.log('Updated')
        console.log(updatedVendor)

        vendor.name = name;
        vendor.category = category;
        vendor.location = location;
        vendor.description = description;
        setEditProfileMode(!editProfileMode);
      })
      .catch((err) => {
        console.error('Update failed: ', err.message)
      })
  }

  return (
    <form class="w-full px-6" onSubmit={e => handleSaveChanges(e)}>
      <div className="flex gap-2 justify-center mb-7">
        <button
          type="button"
          onClick={(e) => {
            setEditProfileMode(!editProfileMode);
          }}
          className={EditBtnStyle}
        >
          Cancel
        </button>
        <button type="submit" className={EditBtnStyle} >
          Save Changes
        </button>
      </div>
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
        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="category" type="text" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
      </div>
      <div class="mb-6">
        <label class="text-left block text-gray-700 text-sm font-bold mb-2" for="Location">
          Location
        </label>
        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="location" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
      </div>
      <div class="mb-6">
        <label class="text-left block text-gray-700 text-sm font-bold mb-2" for="Description">
          Description
        </label>
        <textarea
          class="form-control block w-full px-3 py-1.5 text-base 
          font-normal text-gray-700 bg-white bg-clip-padding
          border border-solid border-gray-300 rounded transition
          ease-in-out m-0 focus:text-gray-700 focus:bg-white 
          focus:border-blue-600 focus:outline-none"
          id="description" rows="4" placeholder="Description"
          value={description} onChange={e => setDescription(e.target.value)}
        ></textarea>
      </div>
      <ChangePhoto />
    </form> 
  )
}

const DisplayInfo = ( { vendor } ) => {

  return (
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
  )
}

const ChangePhoto = () => {
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);
  const [loading, setLoading] = useState(false);

  const uploadImage = (e) => {
    const { type, name } = e.target.files[0];
    if (
      type === "image/png" ||
      type === "image/svg" ||
      type === "image/jpeg" ||
      type === "image/gif" ||
      type === "image/tiff"
    ) {
      setWrongImageType(false);
      setLoading(true);

      client.assets
        .upload("image", e.target.files[0], {
          contentType: type,
          filename: name,
        })
        .then((document) => {
          setImageAsset(document);
          setLoading(false);
        })
        .catch((error) => {
          console.log("image upload error: ", error);
        });
    } else {
      setWrongImageType(true);
    }
  };

  return (
    <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w4/5 w-full">
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
          <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
            {loading && <Spinner />}
            {wrongImageType && <p> Wrong image type </p>}
            {!imageAsset ? (
              <label>
                <div className="flex flex-col items-center justify-center height-full">
                  <div className="flex flex-col justify-center items-center">
                    <p classname="font-bold text-3xl">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg">Click to upload</p>
                  </div>
                  <p className="mt-32 text-gray-400">
                    Use high-uqality JPG, SVG, PNG, GIF or TIFF less than 20MB
                  </p>
                </div>
                <input
                  type="file"
                  name="upload-image"
                  onChange={uploadImage}
                  className="w-0 h-0"
                />
              </label>
            ) : (
              <div className="relative h-full">
                <img
                  src={imageAsset?.url}
                  alt="uploaded-pic"
                  className="h-full w-full"
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                  onClick={() => setImageAsset(null)}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>
    </div>
  );
};

const VendorProfile = () => {
  const [vendor, setVendor] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText ] = useState('about');
  const [activeBtn, setActiveBtn] = useState('about');
  const [showQRModal, setShowQRModal] = useState(false);
  const [editProfileMode, setEditProfileMode] = useState(false);
  const navigate = useNavigate();
  const { vendorId } = useParams();
  const loggedInVendor = fetchVendor();

  useEffect(() => {
    const query = vendorQuery(vendorId);
    client.fetch(query).then((data) => {
      setVendor(data[0]);
    });
  }, [vendorId, vendor]);

  const logout = () => {
    localStorage.clear();

    navigate("/login");
  };

  if (!vendor) {
    return <Spinner message="Loading profile..." />;
  }

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              src={randomImg}
              className="w-full h-370 2xl:h-510 shadow-lg object-cove"
              alt="banner-pic"
            />
            <img
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
              src={vendor.image}
              alt="vendor-pic"
            />
          </div>

          <h1 className="font-bold text-2xl text-center mt-3">
            {vendor.name}
          </h1>
          <h1 className="text-xl text-center">
            @{vendor.username}
          </h1>

          <div className='absolute top-0 z-1 right-0 p-2'>logout
          {vendorId === vendor._id && (
            <button
              type="button"
              className=" bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
              onClick={logout}
            >
              <AiOutlineLogout color="red" fontSize={21} />
            </button>
            )}
          </div>
        </div>

        <div className="flex gap-2 justify-center mb-7">
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

        <DisplayInfo vendor={vendor} />

        {activeBtn == "about" ? 
          <div className='text-center mb-7'>
          {editProfileMode ? 
            <EditProfile vendor={vendor} editProfileMode={editProfileMode} setEditProfileMode={setEditProfileMode} loggedInVendor={loggedInVendor} />
          :
          <div>
            <div>
              {loggedInVendor._id == vendor._id ? 
              <div className="flex gap-2 justify-center mb-7">
                <button
                    type="button"
                    onClick={(e) => {
                      setEditProfileMode(!editProfileMode);
                    }}
                    className={EditBtnStyle}
                  >
                    Edit Profile
                </button>
                <button
                    type="button"
                    className={EditBtnStyle}
                  >
                    Edit Picture
                </button>
              </div>
              : <></>}
            </div>
              <VendorProfile vendor={vendor} />
            </div>
          }
  
          </div>
          :
          <div class='text-center'>Campaign Information</div>
        }
        

      </div>
    </div>
  );
};

export default VendorProfile;
