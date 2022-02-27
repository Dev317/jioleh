import React, { useState, useEffect } from "react";
import shareVideo from "../assets/share1.mp4";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { client } from "../client";

export default function VendorLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState({
    message: "",
    show: false,
  });

  useEffect(() => {
    if (errorMessage.show) {
      new Promise((r) => {
        setTimeout(r, 3000);
      }).then(() => setErrorMessage({ message: "", show: false }));
    }
  }, [errorMessage.show]);

  const navigate = useNavigate();

  const bcrypt = require("bcryptjs");

  const handleSubmit = (e) => {
    e.preventDefault();
    const authQuery = `*[_type == 'vendor' && username == $username]`;
    const params = { username: username };
    client
      .fetch(authQuery, params)
      .then((queryRes) => {
        if (queryRes.length <= 0) {
          setErrorMessage({ message: "Username not found.", show: true });
        } else {
          const vendorAcc = queryRes[0];
          const doesPasswordMatch = bcrypt.compareSync(
            password,
            vendorAcc.password
          );
          if (doesPasswordMatch) {
            delete vendorAcc.password;
            localStorage.setItem("vendor", JSON.stringify(vendorAcc));
            navigate("/vendor-scanner");
          } else {
            setErrorMessage({ message: "Wrong password.", show: true });
          }
        }
      })
      .catch((err) => setErrorMessage({ message: err.message, show: true }));
  };

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 h-screen bg-blackOverlay">
        <div class="p-5 max-w-sm rounded overflow-hidden shadow-lg bg-mainColor flex flex-col justify-center items-center">
          <div className="flex py-5 justify-center items-center">
            <img src={logo} alt="logo" width="200px" />
          </div>
          <h2 className="text-center sm:text-lg py-2">Login as vendor</h2>
          {errorMessage.show ? (
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
              <span className="font-medium">{errorMessage.message}</span>
            </div>
          ) : (
            <div></div>
          )}
          <form
            className="flex flex-col justify-center items-center"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username..."
              className="outline-none text-base rounded-lg sm:text-lg border-2 border-gray-200 my-2 p-2"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password..."
              className="outline-none text-base rounded-lg sm:text-lg border-2 border-gray-200 my-2 p-2"
            />
            <button
              type="submit"
              className="bg-red-500 text-white font-bold mt-2 p-3 rounded-full w-28 outline-none"
            >
              Login
            </button>
          </form>
          <span className="flex gap-2 mt-6 w-full items-center">
            Don't have a vendor account?
            <Link to="/vendor-signup">
              <h2 className="font-semibold text-red-500 sm:text-lg">Sign up</h2>
            </Link>
          </span>
          <span className="flex gap-2 mt-2 w-full items-center">
            Are you a normal user?
            <Link to="/login">
              <h2 className="font-semibold text-red-500 sm:text-lg">
                Login as user
              </h2>
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
