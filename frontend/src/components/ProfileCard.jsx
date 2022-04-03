import React from "react";
import { useNavigate } from "react-router-dom";

const defaultBg = "https://cdn.wallpapersafari.com/29/50/7acBKo.jpg";
const defaultProfile =
  "https://icon-library.com/images/icon-restaurant/icon-restaurant-0.jpg";
export default function ProfileCard({
  bgimage,
  title,
  location,
  profilepic,
  vid,
}) {
  const navigate = useNavigate();
  return (
    <div
      class="rounded cursor-zoom-in overflow-hidden hover:shadow-lg w-64 shrink-0 m-2 transition-all duration-500 ease-in-out"
      onClick={() => navigate(`/vendor-profile/${vid}`)}
    >
      <img
        class="w-full"
        src={bgimage ? bgimage?.asset?.url : defaultBg}
        alt="bg-img"
      />
      <div class="flex flex-col items-center px-2 py-4">
        <img
          className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
          src={profilepic ? profilepic?.asset?.url : defaultProfile}
          alt="user-pic"
        />
        <div className="font-bold text-lg mt-3">{title}</div>
        <div>{location}</div>
      </div>
    </div>
  );
}
