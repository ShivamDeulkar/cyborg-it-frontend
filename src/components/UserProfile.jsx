import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Spinner from "./Spinner";
import MasonryLayout from "./MasonryLayout";
import {
  userCreatedPinsQuery,
  userSavedPinsQuery,
  userQuery,
} from "../utils/data";
import { client } from "../client";
import { AiOutlineLogout } from "react-icons/ai";

const UserProfile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [sameUser, setSameUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);

  const [text, setText] = useState("Created");
  const [activeBtn, setActiveBtn] = useState("created");
  const randomImg = "https://source.unsplash.com/1600x900/?cyberpunk,cyborg";
  const activeBtnStyles =
    "border-gray-white border bg-highlight text-white font-bold p-2 rounded-full w-20 outline-none";
  const notActiveBtnStyles =
    " bg-gray-700 text-white  font-bold p-2 rounded-full w-20 outline-none";

  // fetching user
  useEffect(() => {
    setLoading(true);
    const query = userQuery(userId);
    client.fetch(query).then((data) => {
      setUser(data[0]);
      setLoading(false);
    });
  }, [userId]);

  //
  useEffect(() => {
    setPinLoading(true);
    if (text === "created" || text === "Created") {
      // created pin
      setPins(null);
      const createdPinQuery = userCreatedPinsQuery(userId);
      client.fetch(createdPinQuery).then((data) => {
        setPins(data);
        setPinLoading(false);
      });
    } else {
      // saved pin
      setPins(null);
      const savedPinQuery = userSavedPinsQuery(userId);
      client.fetch(savedPinQuery).then((data) => {
        setPins(data);
        setPinLoading(false);
      });
    }
  }, [text, userId]);

  // logout
  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // check user
  if (userId === user?._id) {
    !sameUser && setSameUser(true);
  } else {
    sameUser && setSameUser(false);
  }

  // if (user) {
  //   return <Spinner message="Loading profile.." />;
  // }
  if (loading) {
    return <Spinner message="Loading profile.." />;
  }
  if (user) {
    return (
      <div className=" relative pb-2  h-full justify-center items-center">
        <div className="flex flex-col pb-5">
          <div className=" relative  flex flex-col mb-7">
            <div className="flex flex-col justify-center items-center">
              <img
                src={randomImg}
                className="w-full h-370 2xl:h-510 shadow-lg object-cover"
                alt="banner"
              ></img>
              <img
                src={user?.image}
                alt="user-profile"
                className=" rounded-full w-20 h-20 scale-150 -translate-y-1/2   shadow-xl object-cover"
              />
              <h2 className=" font-bold text-center  text-gray-200 text-3xl mb-2">
                {user.userName}
              </h2>
              <div className="absolute top-0 right-0 m-3 z-10 ">
                {sameUser && (
                  <button
                    className="bg-white text-highlight2 p-2  rounded-full flex items-center justify-center "
                    onClick={logout}
                  >
                    <AiOutlineLogout strokeWidth={28} className="text-2xl" />
                  </button>
                )}
              </div>
            </div>
            <div className="text-center mb-7 flex gap-2 w-full  justify-center">
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
            </div>
            {pinLoading && <Spinner message={`Loading ${text} pins`} />}
            {pins?.length ? (
              <div className="px-2 ">
                <MasonryLayout pins={pins} />
              </div>
            ) : (
              <div className="flex justify-center font-bold items-center  w-full text-xl mt-2">
                {!pinLoading && (
                  <p>
                    {text === "Created" ? "No pins Created" : "No pins saved"}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
};
export default UserProfile;
