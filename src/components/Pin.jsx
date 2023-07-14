import React, { useState } from "react";
import { Link, Navigate, Route, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
// import { useRouter } from "next/router";
// import { Route } from "next/dist/server/router";

import { client, urlFor } from "../client";
import { fetchUser } from "../utils/data";

const Pin = ({ pin: { postedBy, image, _id, destination, save }, pin }) => {
  const user = fetchUser();
  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const navigate = useNavigate();
  const alreadySaved = !!save?.filter((item) => item.postedBy._id === user.sub)
    ?.length;
  // const router = useRouter();
  const savePin = (id) => {
    if (!alreadySaved) {
      setSavingPost(true);

      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            userId: user.sub,
            postedBy: {
              _type: "postedBy",
              _ref: user.sub,
            },
          },
        ])
        .commit()
        .then(() => {
          // router.replace(router.asPath);
          window.location.reload();
          setSavingPost(false);
        });
    }
  };

  return (
    <div className="m-2">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
        <img
          src={urlFor(image).width(250).url()}
          alt="user-post"
          className=" rounded-lg w-full"
        />
        {postHovered && (
          <div
            className=" absolute top-0  w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
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
                  className=" bg-white opacity-70 hover:opacity-100  text-highlight2  text-base px-5 py-1 rounded-full text-center shadow-sm hover:shadow-md "
                  onClick={(e) => {
                    e.stopPropagation();
                    // unSavePin(_id);
                  }}
                >
                  {save?.length}
                  Saved
                </button>
              ) : (
                <button
                  className=" bg-highlight opacity-70 hover:opacity-100  text-white text-base px-5 py-1 rounded-3xl text-center shadow-sm hover:shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                >
                  Save
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
