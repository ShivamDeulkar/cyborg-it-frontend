import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";

import { client, urlFor } from "../client";
import { fetchUser } from "../utils/fetchUser";

const Pin = ({ pin }) => {
  const { postedBy, image, _id, destination, save } = pin;
  const user = fetchUser();
  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const navigate = useNavigate();
  const alreadySaved = !!save?.filter((item) => item.postedBy._id === user?.sub)
    ?.length;

  // { pin: { postedBy, image, _id, destination, save }
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
          window.location.reload();
          setSavingPost(false);
        });
    }
  };
  const deletePin = (id) => {
    client.delete(id).then(() => {
      window.location.reload();
      setSavingPost(false);
    });
  };
  return (
    <div className="mx-2 my-4  overflow-hidden rounded-lg ">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className="relative cursor-zoom-in w-auto hover:shadow-lg  overflow-hidden transition-all duration-500 ease-in-out"
      >
        <img
          src={urlFor(image).width(250).url()}
          alt="user-post"
          className="  w-full"
        />
        <Link
          to={`user-profile/${postedBy?._id}`}
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
        {postHovered && (
          <div
            className=" absolute top-0  w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-40 cursor-zoom-in"
            style={{ height: "100%" }}
          >
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
              {alreadySaved ? (
                <button
                  type="button"
                  className=" bg-white opacity-70 hover:opacity-100  text-highlight2 font-semibold  text-sm px-5 py-1 rounded-full text-center shadow-sm shadow-gray-500 hover:shadow-sm hover:shadow-gray-500 "
                  onClick={(e) => {
                    e.stopPropagation();
                    // unSavePin(_id);
                  }}
                >
                  <span>{save?.length}</span>
                  <span> Saved</span>
                </button>
              ) : (
                <button
                  className=" bg-highlight opacity-70 hover:opacity-100  text-white font-semibold text-sm px-5 py-1 rounded-3xl text-center shadow-sm hover:shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                >
                  {savingPost ? "Saving" : "Save"}
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
              {postedBy?._id === user?.sub && (
                <button
                  className=" bg-red-500 flex items-center justify-center gap-2 text-white font-semibold  text-sm  rounded-full opacity-70 hover:opacity-100 hover:shadow-md p-2 h-9 w-9"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id);
                  }}
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pin;
