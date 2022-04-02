import React from "react";

const randomImg = "https://cdn.wallpapersafari.com/29/50/7acBKo.jpg";
export default function ProfileCard({ imgSrc, title }) {
    return (
        <div class="rounded overflow-hidden shadow-lg w-64 shrink-0 m-2">
            <img class="w-full" src={randomImg} alt="Sunset in the mountains" />
            <div class="flex flex-col items-center px-2 py-4">
                <img
                    className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
                    src={imgSrc ? imgSrc : randomImg}
                    alt="user-pic"
                />
                <div class="font-bold text-lg mt-3">{title}</div>
            </div>
        </div>
    );
}
