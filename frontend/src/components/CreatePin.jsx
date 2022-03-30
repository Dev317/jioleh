import React, { useState, useEffect, useContext } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { client } from "../client";
import Spinner from "./Spinner";
import { categories } from "../utils/data";
import { TokenContext } from "../context/TokenContext";

const CreatePin = ({ user }) => {
  const { currentAccount, connectWallet } = useContext(TokenContext);
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(null);
  const [category, setCategory] = useState(null);
  const [visitedVendors, setVisitedVendors] = useState([]);
  const [taggedVendor, setTaggedVendor] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [videoAsset, setVideoAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    client
      .getDocument(user._id)
      .then((res) => {
        client
          .getDocuments(res.visitedPlacesId)
          .then((r) => {
            setVisitedVendors(r);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }, []);

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

  const savePin = () => {
    if (title && about && destination && imageAsset?._id && category) {
      const doc = {
        _type: "pin",
        title,
        about,
        destination,
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset?._id,
          },
        },
        userId: user._id,
        postedBy: {
          _type: "postedBy",
          _ref: user._id,
        },
        category,
        taggedVendor,
      };

      client.create(doc).then(() => {
        navigate("/");
      });
    } else {
      setFields(true);
      setTimeout(() => setFields(false), 2000);
    }
  };

  return (
    <div className="flex flex-col jusity-center items-center mt-5 lg:h-4/5">
      {fields && (
        <p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in">
          Please fill in all the fields
        </p>
      )}
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

        <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add your title"
            className="outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2"
          />
          {user && (
            <div className="flex gap-2 my-2 items-center bg-white rounded-lg">
              <img
                src={user.image}
                className="w-10 h-10 rounded-full"
                alt="user-profile"
              />
              <p className="font-bold">{user.userName}</p>
            </div>
          )}
          <input
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="What is your pin about?"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Add a destination link"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />
          <div className="flex flex-col">
            <div>
              <p className="mb-2 font-semibold text-lg sm:text-xl">
                {" "}
                Choose pin category
              </p>
              <select
                onChange={(e) => setCategory(e.target.value)}
                className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
              >
                <option value="other" className="sm:text-bg bg-white">
                  Select category
                </option>
                {categories.map((category) => (
                  <option
                    className="text-base border-0 outline-none capitalize text-black"
                    value={category.name}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-3 flex flex-col">
              <div>
                <p className="mb-2 font-semibold text-lg sm:text-xl">
                  {" "}
                  Tag a vendor!
                </p>
                <select
                  onChange={(e) => setTaggedVendor(e.target.value)}
                  className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
                >
                  <option value="other" className="sm:text-bg bg-white">
                    Select vendor
                  </option>
                  {visitedVendors.map((vendor) => {
                    console.log(vendor);
                    return (
                      <option
                        className="text-base border-0 outline-none capitalize text-black"
                        value={vendor?._id}
                      >
                        {vendor?.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="flex justify-end items-end mt-5">
            {!currentAccount ? (<button
                type="button"
                className="bg-purple-500 text-white font-bold p-2 rounded-full w-28 outline-none"
                onClick={() => connectWallet(user._id)}
              >
                Connect Wallet
              </button>) : (
              <button
                type="button"
                onClick={savePin}
                className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none"
              >
                Save FoodStep
              </button>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePin;


// const assetDocument = {
//   _id: 'a6e70715-ec6f-4fe1-8b5b-7d6aeb74759c',
//   _rev: '0xLJdqcI4pgly0b1Ixu67q',
//   _type: 'mux.videoAsset',
//   data: {
//     aspect_ratio: '16:9',
//     created_at: '1543532219',
//     duration: 170.859,
//     id: 'KNlhusaO201gm3vrD00LLHaRO02DW9RBPjF',
//     max_stored_frame_rate: 25,
//     max_stored_resolution: 'HD',
//     mp4_support: 'none',
//     passthrough: 'a6e70715-ec6f-4fe1-8b5b-7d6aeb74759c',
//     playback_ids: [{id: 'oxWh34cgT802eHzHIhPXWoHsZb9htpkZL', policy: 'public'}],
//     status: 'ready',
//     tracks: [
//       {
//         duration: 170.84,
//         id: 'ZYxBhbZy8hnmcNaXWDDeRC302zO01LbLv3',
//         max_frame_rate: 25,
//         max_height: 720,
//         max_width: 1280,
//         type: 'video'
//       },
//       {
//         duration: 170.858667,
//         id: 'ZCavEVHaoxjI02RWMBRBuviQLnTxIu2NGk2M4mDGn9Mo',
//         max_channel_layout: '5.1',
//         max_channels: 6,
//         type: 'audio'
//       }
//     ]
//   },
//   filename: 'SampleVideo_1280x720_30mb.mp4',
//   playbackId: 'oxWh34cgT802eHzHIhPXWoHsZb9htpkZL',
//   status: 'ready',
//   thumbTime: 106.370451
// }