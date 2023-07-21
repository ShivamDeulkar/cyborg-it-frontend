import React, { useState, useEffect, useCallback } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { client } from "../client";
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

  // const fetchPinDetials = () => {
  //   let query = pinDetailQuery(pinId);

  //   if (query) {
  //     client.fetch(query).then((data) => {
  //       setPinDetail(data[0]);

  //       if (data[0]) {
  //         query = pinDetailMorePinQuery(data[0]);
  //         client.fetch(query).then((res) => {
  //           setPins(res);
  //         });
  //       }
  //     });
  //   }
  // };

  // useEffect(() => {
  //   fetchPinDetials();
  // }, [pinId]);

  const fetchPinDetials = useCallback(() => {
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
  }, [pinId]);

  useEffect(() => {
    fetchPinDetials();
  }, [pinId, fetchPinDetials]);

  if (!pinDetail) return <Spinner message="Loading pin" />;
  return (
    <div className="overflow-scroll h-fit w-full  ">
      <div className="   flex-col w-full flex  items-center justify-start ">
        <div className="h-screen w-full items-center flex flex-col gap-2">
          {/* desktop */}
          <div className="hidden h-5/6 w-full  bg-gray-800  lg:flex rounded-3xl overflow-hidden">
            <div className="p-4 " style={{ maxWidth: "50%" }}>
              <img
                src={pinDetail.image?.asset?.url}
                alt={pinDetail.title}
                className="max-h-full max-w-full rounded-2xl"
              />
            </div>
            <div
              className="bg-gray-700 flex-1 h-full relative  rounded-2xl overflow-hidden "
              style={{ minWidth: "50%" }}
            >
              <div className="h-full p-4">
                {/* details */}
                <div className="w-full h-fit  bg-gray-600 p-3 rounded-md mb-6">
                  {/* download */}
                  <div className="h-fit  mb-4">
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
                  <div className="h-fit rounded flex flex-col w-full gap-2 ">
                    <h1 className="break-words text-4xl font-bold capitalize text-gray-200">
                      {pinDetail.title}
                    </h1>
                    <p className="text-gray-400">{pinDetail.about}</p>
                  </div>
                </div>
                {/* comments */}

                <div className="h-fit rounded ">
                  <p className=" text-lg text-gray-200  mb-1">
                    {pinDetail.comments?.length} Comments
                  </p>
                </div>
                <div className="overflow-scroll h-1/2 bg-gray-600 px-4 py-2 rounded-md">
                  <div className="h-full flex flex-col gap-2 w-full">
                    {pinDetail.comments?.map((comment, i) => (
                      <div className="w-full h-fit shrink-0 flex gap-2 items-start justify-center  py-2">
                        <Link
                          to={`user-profile/${comment.postedBy?._id}`}
                          className=" flex justify-start items-center w-fit h-fit"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <img
                            src={comment.postedBy?.image}
                            alt="user-profile"
                            className=" w-8 h-8   rounded-full shadow-sm "
                            referrerPolicy="no-referrer"
                          />
                        </Link>
                        <div className="w-full">
                          <p className="font-bold text-sm  text-gray-300">
                            {pinDetail.postedBy?.userName.split(" ").at(0)}
                          </p>
                          <p className="font-normal text-gray-400 text-sm text-gray-30 break-all px-0 w-full">
                            {comment.comment}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* add comment */}
              <div className="w-full h-fit  absolute bottom-0 ">
                <div className="h-full w-full bg-gray-600 flex items-center gap-2 p-4 ">
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

          {/* mobile */}
          <div className="flex flex-col h-full lg:hidden gap-2 w-full bg-gray-800 mx-4">
            <div className="h-1/2 flex items-center  justify-center">
              <img
                src={pinDetail.image?.asset?.url}
                alt={pinDetail.title}
                className="max-h-full max-w-full rounded-lg"
              />
            </div>
            <div className="h-1/2 w-full">
              <div className="flex-1 h-full relative  rounded-xl overflow-hidden ">
                <div className="h-full p-1">
                  {/* details */}
                  <div className="w-full h-fit  bg-gray-700 p-2 rounded-md mb-3">
                    {/* download */}
                    <div className="h-fit  mb-4">
                      <div className="flex h-fit w-full items-center justify-between">
                        <div className="flex gap-2 items-center">
                          <a
                            href={`${pinDetail.image?.asset?.url}?dl=`}
                            download
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="bg-gray-200 w-7 h-7 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                          >
                            <MdDownloadForOffline />
                          </a>
                        </div>
                        <a
                          href={pinDetail.destination}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-gray-200 flex items-center gap-2 font-semibold p-1  text-xs rounded-full opacity-70 hover:opacity-100 hover:shadow-md px-4 justify-self-end"
                        >
                          {pinDetail.destination}
                        </a>
                      </div>
                    </div>
                    {/* title */}
                    <div className="h-fit rounded flex flex-col w-full gap-1 ">
                      <h1 className="break-words text-xl font-bold capitalize text-gray-200">
                        {pinDetail.title}
                      </h1>
                      <p className="text-gray-400">{pinDetail.about}</p>
                    </div>
                  </div>
                  {/* comments */}

                  <div className="h-fit rounded ">
                    <p className=" text-base text-gray-200  mb-1">
                      {pinDetail.comments?.length} Comments
                    </p>
                  </div>
                  <div className="overflow-scroll h-1/2 bg-gray-700 px-4 py-2 rounded-md">
                    <div className="h-full flex flex-col gap-1 w-full">
                      {pinDetail.comments?.map((comment, i) => (
                        <div className="w-full h-fit shrink-0 flex gap-2 items-start justify-center  py-1">
                          <Link
                            to={`user-profile/${comment.postedBy?._id}`}
                            className=" flex justify-start items-center w-fit h-fit"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <img
                              src={comment.postedBy?.image}
                              alt="user-profile"
                              className=" w-6 h-6   rounded-full shadow-sm "
                              referrerPolicy="no-referrer"
                            />
                          </Link>
                          <div className="w-full">
                            <p className="font-bold text-xs  text-gray-300">
                              {pinDetail.postedBy?.userName.split(" ").at(0)}
                            </p>
                            <p className="font-normal text-gray-400 text-xs text-gray-30 break-all px-0 w-full">
                              {comment.comment}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* add comment */}
                <div className="w-full h-fit  absolute bottom-0 shadow-md">
                  <div className="h-full w-full bg-gray-600 flex items-center gap-2 p-2">
                    <img
                      src={user?.image}
                      alt="user-profile"
                      className=" w-6 h-6   rounded-full shadow-sm "
                      referrerPolicy="no-referrer"
                    />
                    <input
                      className="w-full bg-gray-600 h-6 rounded-xl outline-none text-md sm:text-lg text-xs border-2 border-gray-500 text-gray-200 p-2 placeholder:text-gray-300 "
                      placeholder="Add a comment"
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                      type="button"
                      className=" bg-highlight  text-white rounded-full px-2 py-1 font-bold text-xs outline-none"
                      onClick={addComment}
                    >
                      {addingComment ? "Posting" : "Post"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h2 className="lg:block hidden text-2xl font-bold mt-8 mb-4 text-gray-300 w-full text-center">
            More like this
          </h2>
        </div>
        <div className="h-fit w-full">
          <h2 className="lg:hidden block text-lg font-bold mt-4 mb-2 text-gray-300 w-full text-center">
            More like this
          </h2>
          {pins?.length > 0 ? (
            <div className="w-full   flex items-center justify-center flex-col">
              <MasonaryLayout pins={pins} />
            </div>
          ) : (
            <Spinner message="Loading more pins" />
          )}
        </div>
      </div>
    </div>
  );
};

export default PinDetail;
