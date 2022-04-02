import React, { useEffect, useState } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';
import { client, urlFor } from '../client';
import Spinner from './Spinner';
import { vendorQuery } from '../utils/data';
import { fetchVendor } from '../utils/fetchVendor';
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";

const defaultBg = "https://cdn.wallpapersafari.com/29/50/7acBKo.jpg";
const defaultProfile = "https://icon-library.com/images/icon-restaurant/icon-restaurant-0.jpg"
const EditBtnStyle = 'bg-red-500 text-white font-bold p-2 rounded-xl outline-none w-40';

const EditProfile = ( {vendor, editProfileMode, setEditProfileMode, loggedInVendor} ) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(vendor.name);
    setCategory(vendor.category);
    setLocation(vendor.location);
    setDescription(vendor.description);
  }, [vendor.category, vendor.description, vendor.location, vendor.name])

  const handleSaveChanges = (e) => {
    if (imageAsset == null) {
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
        vendor.name = name;
        vendor.category = category;
        vendor.location = location;
        vendor.description = description;
        setEditProfileMode(!editProfileMode);
      })
      .catch((err) => {
        console.error('Update failed: ', err.message)
      })
    } else {
      client
        .patch(vendor._id) // Document ID to patch
        .set({
          name,
          category,
          location,
          description,
          image: {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: imageAsset?._id,
            },
          },
        }) // Shallow merge
        .commit()
        .then((updatedVendor) => {
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
  }

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
                    Use high-quality JPG, SVG, PNG, GIF or TIFF less than 20MB
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
    </form>
  )
}

const DisplayInfo = ( { vendor } ) => {

  return (
    <div>
      <div className="flex p-3 justify-center text-center">
        <p>{vendor.description == null ? <span className="text-gray-400">vendor has not added a description</span> : vendor.description}</p>
      </div>
      <div className="flex mt-3 justify-center">
        <svg
          className="mr-3 w-6 h-6"
          fill="none"
          stroke="#ef4444"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
            <path 
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path 
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p>{vendor.location == null ? <span className="text-gray-400">vendor has not added a location</span> : vendor.location}</p>
      </div>
      <div className="flex p-3 justify-center">
        <svg 
          className="mr-3 w-6 h-6"
          fill="none"
          stroke="#ef4444"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
          </svg>
        <p>{vendor.category == null ? <span className="text-gray-400">vendor has not added a category</span> : vendor.category}</p> 
      </div>
    </div>
  )
}

const CampaignDetails = ( { vendor } ) => {
  const [startDate, setStartDate] = useState();

  useEffect(() => {
    var date = new Date(vendor.startDate);
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    setStartDate(date.toLocaleDateString('en-US', options));
  }, [vendor.startDate])

  return (
    <div className="m-5 p-5 rounded overflow-hidden shadow-lg">
      <p className="text-center font-bold text-2xl mt-3" >
        {vendor.campaignName}
      </p>
      <p className="break-words mt-3">
        From the <span className="font-bold">{startDate}</span> onwards, {vendor.name} will be offering rewards to new customers and their referrers!
      </p>
      <p className="break-words mt-3">
        For every friend you refer, you will be awarded <span className="font-bold">{vendor.rewardAmount}</span> ETH!
      </p>
      <p className="break-words mt-3">
        In return, said referred friend will receive <span className="font-bold">{vendor.refereeReward}</span> upon their first visit to our establishment! <span className="text-gray-400">(Minimum spending required to be met to claim reward)</span>
      </p>
      <p className="break-words mt-3">
        This promotion will be available for <span className="font-bold">{vendor.duration} Days</span> from the start date of the campaign.
      </p>
      {vendor.dailyLimit == null ? <></>:<p className="italic text-sm break-words mt-3">Limited to the first <span className="font-bold">{vendor.dailyLimit}</span> customer(s) per day, while stocks last.</p>}
    </div>
  )
}

const VendorProfile = () => {
  const [vendor, setVendor] = useState(null);
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
        <div className="relative flex flex-col mb-2">
          <div className="flex flex-col justify-center items-center">
            <img
              src={vendor?.bgimage ? vendor?.bgimage && urlFor(vendor?.bgimage).url() : defaultBg}
              className="w-full h-370 2xl:h-510 shadow-lg object-cove"
              alt="banner-pic"
            />
            <img
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
              src={vendor?.image ? vendor?.image && urlFor(vendor?.image).url() : defaultProfile}
              alt="vendor-pic"
            />
          </div>

          <h1 className="font-bold text-2xl text-center mt-3">
            {vendor.name}
          </h1>
          <h1 className="text-xl text-center">
            @{vendor.username}
          </h1>
          {loggedInVendor?._id === vendor._id ?
          <div className='absolute top-0 z-1 right-0 p-2'>
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
          : <></> }
        </div>

        <div className='flex justify-center mb-7'>
          {editProfileMode ?
            <EditProfile vendor={vendor} editProfileMode={editProfileMode} setEditProfileMode={setEditProfileMode} loggedInVendor={loggedInVendor} />
          :
          <div className="w-full">
            <DisplayInfo vendor={vendor} />
            {vendor.hasCampaign ? 
              <div>
                <p className="text-center font-bold text-2xl mt-3">Ongoing Campaigns:</p>
                <CampaignDetails vendor={vendor} />
              </div>
              :
            <></>}
            {loggedInVendor?._id === vendor._id ?
              <div className="flex gap-2 justify-center p-7">
                <button type="button"
                    onClick={(e) => {
                      setEditProfileMode(!editProfileMode);
                    }} 
                  className={EditBtnStyle} >
                  Edit Profile
                </button>
                <Link to={`/vendor/vendor-campaign-detail`}>
                  <button type="button"
                    className={EditBtnStyle} >
                    Edit Campaign
                  </button>
                </Link>
              </div>
            : <></>}
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
