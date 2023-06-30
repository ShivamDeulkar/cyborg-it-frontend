import React from "react";
import { useNavigate } from "react-router-dom";
import video from "../assets/video-3.mp4";
import logo from "../assets/logo-main.png";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";

const Login = () => {
  return (
    <div className="flex  justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src={video}
          type="video/mp4"
          autoPlay
          loop
          muted
          controls={false}
          className="w-full h-full object-cover"
        />
        <div className=" absolute flex flex-col justify-center items-center top-0 right-0 bottom-0 left-0 bg-blackOverlay">
          <div className="p-5 flex flex-col items-center gap-3">
            <img src={logo} alt="logo" width="180px" />
            <div className=" shadow-2xl mt-1">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  const decoded = jwt_decode(credentialResponse.credential);
                  console.log(decoded);
                  localStorage.setItem("user", JSON.stringify(decoded));
                  const { name, googleId, imgUrl } = decoded;
                  const doc = {
                    _id: googleId,
                    _type: "user",
                    username: name,
                    image: imgUrl,
                  };
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
                additionalProps={{
                  target: "_blank",
                  rel: "noopener noreferrer",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
