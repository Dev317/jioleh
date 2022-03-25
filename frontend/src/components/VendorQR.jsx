import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";

export default function VendorQR() {
  const vendor = JSON.parse(localStorage.getItem("vendor"));
  return (
    <div className="h-screen flex justify-center items-center">
      {vendor ? (
        <QRCode value={`http://jioleh.kuehbies.com/?vendor=${vendor._id}`} />
      ) : (
        <></>
      )}
    </div>
  );
}
