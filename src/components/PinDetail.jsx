import React, { useState, useEffect } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { client, urlFor } from "../client";
import MasonaryLayout from "./MasonryLayout";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import Spinner from "./Spinner";

const PinDetail = ({ user }) => {
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  // ID
  const { pinId } = useParams();

  const addComment = () => {
    if (comment) {
      setAddingComment(true);
      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: uuidv4(),
            postedBy: {
              _type: "postedBy",
              _ref: user._id,
            },
          },
        ])
        .commit()
        .then(() => {
          fetchPinDetials();
          setComment("");
          setAddingComment(false);
        });
    }
  };

  const fetchPinDetials = () => {
    let query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(query).then((data) => {
        setPinDetail(data[0]);

        if (data[0]) {
          query = pinDetailMorePinQuery(data[0]);
          client.fetch(query).then((res) => {
            setPins(res);
          });
        }
      });
    }
  };

  useEffect(() => {
    fetchPinDetials();
  }, [pinId]);

  if (!pinDetail) return <Spinner message="Loading pin" />;
  return (
    <div className="h-fit flex flex-col items-center justify-center">
      <div className="bg-gray-800 h-fit xl:h-3/4  flex items-center xl:flex-row flex-col  rounded-2xl mt-4 xl:p-0  justify-between xl:w-full w-11/12">
        <div className="xl:h-full xl:w-2/3 h-1/3 flex items-center justify-center xl:p-5 xl:mt-0 ">
          <img
            src={pinDetail?.image?.asset?.url}
            alt="post-img"
            className=" object-contain  h-full xl:rounded-lg "
          />
        </div>
        {/* details */}
        <div className=" xl:h-full  h-fit    p-5 flex  flex-col xl:w-1/2  ">
          {/* download */}
          <div className="h-fit mb-4">
            <div className="flex h-fit w-full items-center justify-between">
              <div className="flex gap-2 items-center">
                <a
                  href={`${pinDetail.image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="bg-gray-200 w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              <a
                href={pinDetail.destination}
                target="_blank"
                rel="noreferrer"
                className="bg-gray-200 flex items-center gap-2 font-semibold p-2  text-sm rounded-full opacity-70 hover:opacity-100 hover:shadow-md px-4 justify-self-end"
              >
                {pinDetail.destination}
              </a>
            </div>
          </div>
          {/* title */}
          <div className="h-fit rounded mb-4 ">
            <h1 className="break-words text-4xl font-bold capitalize text-gray-300">
              {pinDetail.title}
            </h1>
            <p className="mt-1 text-gray-400">{pinDetail.about}</p>
          </div>
          {/* comments */}
          <div className="h-fit rounded mb-2">
            <p className="text-gray-300 mb-1">
              {pinDetail.comments?.length} Comments
            </p>
          </div>
          <div
            className="h-fit flex-1 overflow-scroll rounded mb-4"
            style={{ maxHeight: "500px" }}
          >
            <div className="flex flex-col items-center justify-center gap-4">
              {pinDetail.comments?.map((comment, i) => (
                <div
                  className="flex gap-2 items-start w-full   rounded-md"
                  key={i}
                >
                  <div
                    className="grid gap-4"
                    style={{ gridTemplateColumns: "fit-content(400px) 1fr" }}
                  >
                    <Link
                      to={`user-profile/${comment.postedBy?._id}`}
                      className=" flex justify-start items-center gap-1
         w-fit h-fit"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <img
                        src={comment.postedBy?.image}
                        alt="user-profile"
                        className=" w-8 h-8   rounded-full shadow-sm "
                        referrerPolicy="no-referrer"
                      />
                      <p className="font-bold text-xs  text-gray-300">
                        {pinDetail.postedBy?.userName.split(" ").at(0)}
                      </p>
                    </Link>
                    <p className=" font-normal text-gray-400 text-sm text-gray-30 break-all px-0 w-full">
                      {comment.comment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* add comments */}
          <div className=" flex h-fit rounded ">
            <div className=" bg-gray-700 flex w-full px-4 py-2 rounded-lg gap-4 items-center">
              <img
                src={user?.image}
                alt="user-profile"
                className=" w-10 h-10   rounded-full shadow-sm "
                referrerPolicy="no-referrer"
              />
              <input
                className="w-full bg-gray-600 rounded-xl outline-none text-md sm:text-lg text-base border-2 border-gray-500 text-gray-200 p-2 placeholder:text-gray-300 "
                placeholder="Add a comment"
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                type="button"
                className=" bg-highlight  text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
                onClick={addComment}
              >
                {addingComment ? "Posting" : "Post"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {pins?.length > 0 ? (
        <div className="w-full flex items-center justify-center flex-col">
          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-300 w-full text-center">
            More like this
          </h2>
          <MasonaryLayout pins={pins} />
        </div>
      ) : (
        <Spinner message="Loading more pins" />
      )}
    </div>
  );
};

export default PinDetail;
