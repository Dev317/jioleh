import React from "react";
import GoogleLogin from "react-google-login";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import shareVideo from "../assets/share.mp4";
import logo from "../assets/logo.png";
import { client } from "../client";

const Login = () => {
  const navigate = useNavigate();

  const responseGoogle = (res) => {
    console.log(res);
    localStorage.setItem("user", JSON.stringify(res.profileObj));
    const { name, googleId, imageUrl } = res.profileObj;

    const doc = {
      _id: googleId,
      _type: "user",
      userName: name,
      image: imageUrl,
    };

    client.createIfNotExists(doc).then(() => {
      navigate("/", { replace: true });
    });
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
        <div class="p-5 max-w-sm rounded overflow-hidden shadow-lg bg-mainColor flex flex-col">
          <div className="flex py-5 justify-center items-center">
            <img src={logo} alt="logo" width="200px" />
          </div>
          <h2 className="text-center sm:text-lg py-2">Login as user</h2>
          <div className="py-2">
            <GoogleLogin
              clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}
              render={(renderProps) => (
                <button
                  type="button"
                  className="flex bg-white w-full justify-center items-center p-3 rounded-lg cursor-pointer border-2 border-gray-200 outline-none"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  <FcGoogle className="mr-4" /> Sign In with Google
                </button>
              )}
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy="single_host_origin"
            />
          </div>
          <span className="flex gap-2 mt-6 w-full items-center">
            Are you a vendor?
            <Link to="/vendor-login">
              <h2 className="font-semibold text-red-500 sm:text-lg">
                Login as vendor
              </h2>
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
