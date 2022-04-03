import React from "react";
import QRCode from "react-qr-code";

export default function QRModal({ setShow, poster }) {
  const viewer = JSON.parse(localStorage.getItem("user"));

  const URL = `http://jioleh.kuehbies.com/?viewer=${viewer.googleId}&poster=${poster}`;

  return (
    <div className="modal">
      <div className="modal-main">
        <QRCode value={URL} />
        <button
          type="button"
          onClick={() => setShow(false)}
          className="bg-primary text-black font-bold p-2 rounded-full w-20 outline-none"
        >
          Close
        </button>
      </div>
    </div>
  );
}
