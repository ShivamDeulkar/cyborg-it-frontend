import React from "react";
import { useNavigate } from "react-router-dom";
import video from "../assets/login-bg-video.mp4";
import logo from "../assets/logo.png";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { client } from "../client";

const Login = () => {
  const navigate = useNavigate();
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const data = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );
        const profile = data.data;
        const {
          given_name,
          family_name,
          sub: googleId,
          picture: imageUrl,
        } = profile;
        localStorage.setItem("user", JSON.stringify(profile));

        const doc = {
          _id: googleId,
          _type: "user",
          userName: given_name + (family_name ? ` ${family_name}` : ""),
          image: imageUrl,
        };

        client
          .createIfNotExists(doc)
          .then(() => {
            navigate("/", { replace: true });
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (err) {
        console.log(err);
      }
    },
    onError: () => console.log("Login Failed"),
  });

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
              <div
                className=" text-lightGray py-2 px-4 bg-gray-900 rounded-sm cursor-pointer border-primary border flex justify-center items-center gap-2 hover:scale-105 transition-all duration-150"
                onClick={login}
              >
                <FcGoogle />
                <span>Sign in with Google</span>
              </div>

              {/* <GoogleLogin
                onSuccess={(credentialResponse) => {
                  console.log(credentialResponse);
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
              /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
