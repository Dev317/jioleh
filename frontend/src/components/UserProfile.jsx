import React, { useEffect, useState } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import { GoogleLogout } from "react-google-login";
import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from "../utils/data";
import { client } from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import QRModal from "./QRModal";
import { fetchUser } from "../utils/fetchUser";

const randomImg = "https://cdn.wallpapersafari.com/29/50/7acBKo.jpg";
const activeBtnStyles =
  "bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none";
const notActiveBtnStyles =
  "bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [activeUser, setActiveUser] = useState();
  const [pins, setPins] = useState(null);
  const [text, setText] = useState("Created");
  const [activeBtn, setActiveBtn] = useState("created");
  const [showQRModal, setShowQRModal] = useState(false);
  const navigate = useNavigate();
  const { userId } = useParams();
  const [followed, setFollowed] = useState(false);

  console.log(userId);

  useEffect(() => {
    const query = userQuery(userId);
    client.fetch(query).then((data) => {
      setUser(data[0]);
      const loggedInUser = fetchUser();
      setActiveUser(loggedInUser.googleId);
      if (data[0].followers?.includes(loggedInUser.googleId)) {
        setFollowed(true);
      }
    });

  }, [userId]);

  useEffect(() => {
    if (text === "Created") {
      const createdPinsQuery = userCreatedPinsQuery(userId);
      client.fetch(createdPinsQuery).then((data) => {
        setPins(data);
      });
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId);
      client.fetch(savedPinsQuery).then((data) => {
        setPins(data);
      });
    }
  }, [text, userId]);

  const logout = () => {
    localStorage.clear();

    navigate("/login");
  };

  const handleFollow = (e) => {
    e.preventDefault();
    const loggedInUser = fetchUser();
    if (!followed) {
      client
          .patch(loggedInUser.googleId)
          .setIfMissing({ following: [] })
          .append("following", [userId])
          .commit()
          .then((res) => {
            client
                .patch(userId)
                .setIfMissing({ followers: [] })
                .append("followers", [loggedInUser.googleId])
                .commit()
                .then((res) => {
                  const query = userQuery(userId);
                  client
                      .fetch(query)
                      .then((data) => {
                        setUser(data[0]);
                        setFollowed(true);
                      })
                      .catch((err) => {
                        console.log(err.message);
                      });
                })
                .catch((err) => {
                  console.log(err.message);
                });
          })
          .catch((err) => {
            console.log(err.message);
          });
    } else {
      client
          .patch(loggedInUser.googleId)
          .unset([`following[@=="${userId}"]`])
          .commit()
          .then((res) => {
            client
                .patch(userId)
                .unset([`followers[@=="${loggedInUser.googleId}"]`])
                .commit()
                .then((res) => {
                  const query = userQuery(userId);
                  client
                      .fetch(query)
                      .then((data) => {
                        setUser(data[0]);
                        setFollowed(false);
                      })
                      .catch((err) => {
                        console.log(err.message);
                      });
                })
                .catch((err) => {
                  console.log(err.message);
                });
          })
          .catch((err) => {
            console.log(err.message);
          });
    }
  };

  if (!user) {
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
              src={user.image}
              alt="user-pic"
            />
          </div>
          <h1 className="font-bold text-2xl text-center mt-3">
            {user.username}
          </h1>

          <p className="font-bold text-center">
            {user.followers ? user.followers.length : 0} followers
          </p>

          {userId !== activeUser ? (
          <div className="flex mt-4 items-center justify-center mx-5">
            <button
                type="button"
                onClick={handleFollow}
                className={
                  followed
                      ? "md:w-20 flex-1 border-red-500 border-2 text-red-500 outline-solid font-bold rounded-lg p-3 mx-1"
                      : "md:w-20 bg-red-500 flex-1 font-bold text-white rounded-lg p-3 mx-1"
                }
            >
              {followed ? "Following" : "Follow"}
            </button>

          </div>) : (<div></div>)}

          <div className="absolute top-0 z-1 right-0 p-2">
            {userId === user._id && (
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
            )}
          </div>
        </div>

        <div className="text-center mb-7">
          <button
            type="button"
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn("created");
            }}
            className={`${
              activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles
            }`}
          >
            Created
          </button>
          <button
            type="button"
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn("saved");
            }}
            className={`${
              activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles
            }`}
          >
            Saved
          </button>
          <button
            type="button"
            onClick={(e) => {
              setShowQRModal(true);
            }}
            className={notActiveBtnStyles}
          >
            QR
          </button>
        </div>

        <div className="px-2">
          <MasonryLayout pins={pins} />
        </div>

        {pins?.length === 0 && (
          <div className="flex justify-center font-bold items-center w-full text-1xl mt-2">
            No Pins Found!
          </div>
        )}
      </div>
      {showQRModal ? (
        <QRModal poster={userId} setShow={setShowQRModal} />
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default UserProfile;
