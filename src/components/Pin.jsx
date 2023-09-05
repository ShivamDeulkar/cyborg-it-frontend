import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";

import { client, urlFor } from "../client";
import { fetchUser } from "../utils/fetchUser";
import { BiLoaderCircle } from "react-icons/bi";

const Pin = ({ pin }) => {
  const { postedBy, image, _id, destination, save } = pin;
  const user = fetchUser();
  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const [alreadySaved, setAlreadySaved] = useState(
    !!save?.find((item) => item.postedBy?._id === user?.sub)
  );
  const navigate = useNavigate();

  const savePin = (id) => {
    if (!alreadySaved) {
      setSavingPost(true);

      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            userId: user?.sub,
            postedBy: {
              _type: "postedBy",
              _ref: user?.sub,
            },
          },
        ])
        .commit()
        .then(() => {
          setSavingPost(false);
          setAlreadySaved(true);
        })
        .catch((error) => {
          console.error("Error while saving post:", error);
          setSavingPost(false);
        });
    }
  };

  const unsavePin = (id) => {
    const indexToRemove = save.findIndex((item) => item.userId === user?.sub);
    if (indexToRemove === -1) {
      return;
    }

    const updatedSaveArray = save.slice();
    updatedSaveArray.splice(indexToRemove, 1);

    client
      .patch(id)
      .set({ save: updatedSaveArray })
      .commit()
      .then(() => {
        setAlreadySaved(false);
      })
      .catch((error) => {
        console.error("Error while unsaving post:", error);
      });
  };

  return (
    <div className="mx-2 my-4  overflow-hidden rounded-lg">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className="relative cursor-zoom-in w-auto hover:shadow-lg  overflow-hidden transition-all duration-500 ease-in-out"
      >
        <img
          src={urlFor(image).width(250).url()}
          alt="user-post"
          className="w-full"
        />
        {/* Rest of the JSX code... */}
        <Link
          to={`/user-profile/${postedBy?._id}`}
          className="flex justify-start gap-2 p-2 items-center absolute z-50 bottom-0 left-0 "
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={postedBy?.image}
            alt="user-profile"
            className=" w-9 h-9  rounded-full shadow-sm hover:shadow-lg  opacity-50 hover:opacity-100"
            referrerPolicy="no-referrer"
          />
        </Link>
        {/* Replace the Save button and Unsave button as follows */}
        {postHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-40 cursor-zoom-in"
            style={{ height: "100%" }}
          >
            {/* Existing code for other elements */}
            {/* ... */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {/* Conditional rendering of Save button or Unsave button */}
              {alreadySaved ? (
                <div
                  className="bg-white opacity-70 hover:opacity-100 text-highlight2 font-semibold text-sm px-5 py-1 rounded-full text-center shadow-sm shadow-gray-500 hover:shadow-sm hover:shadow-gray-500 w-16 h-9 flex items-center justify-center cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    unsavePin(_id);
                  }}
                >
                  <span>Saved</span>
                </div>
              ) : (
                <button
                  className="bg-highlight opacity-70 hover:opacity-100 text-white font-semibold text-sm px-5 py-1 rounded-3xl text-center shadow-sm hover:shadow-md w-16 h-9 flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                >
                  {savingPost ? (
                    <BiLoaderCircle className="text-lg" />
                  ) : (
                    <p className="text-base">Save</p>
                  )}
                </button>
              )}
            </div>
            <div className=" flex  items-center justify-end gap-2 w-full h-9">
              {destination && (
                <a
                  href={destination}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white flex items-center gap-2 font-semibold p-1 text-sm rounded-full opacity-70 hover:opacity-100 hover:shadow-md px-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <BsFillArrowUpRightCircleFill />
                  {destination.length > 20
                    ? destination.slice(12, 20) + ".."
                    : destination.slice(12)}
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pin;
