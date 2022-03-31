import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { MdDownloadForOffline } from "react-icons/md";

export default function VendorQR({ vendor }) {
  const downloadQR = () => {
    var svgElement = document.getElementById("qr-code");
    let { width, height } = svgElement.getBBox();
    let svgString = svgElement.outerHTML;

    const svgUrl = "data:image/svg+xml," + encodeURIComponent(svgString);

    let image = new Image();
    image.onload = () => {
      let canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      let context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, width, height);

      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "qr-code.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };
    image.src = svgUrl;
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div className="p-5 text-center">
        <h1 className="text-lg font-bold">Verification QR</h1>
        <p>
          Present this to a first-time customer so that they may refer your
          eatery to others!
        </p>
      </div>
      {vendor ? (
        <div className="flex flex-col items-center">
          <div className="p-5 m-5 max-w-sm rounded overflow-hidden shadow-lg">
            <QRCode
              id="qr-code"
              value={`http://jioleh.kuehbies.com/?vendor=${vendor._id}`}
            />
          </div>
          <button
            className="flex justify-center align-items-center bg-red-500 mx-5 text-white font-bold p-2 rounded-full w-full outline-none"
            onClick={downloadQR}
          >
            <MdDownloadForOffline className="mr-2 h-full" /> Download QR
          </button>
        </div>
      ) : (
        <div
          className="flex mt-3 p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
          role="alert"
        >
          <svg
            className="inline flex-shrink-0 mr-3 w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span className="font-medium">No vendor found!</span>
        </div>
      )}
    </div>
  );
}
