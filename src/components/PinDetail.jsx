import React, { useState, useEffect, useCallback } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { client } from "../client";
import MasonaryLayout from "./MasonryLayout";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import Spinner from "./Spinner";
import {
  AiOutlineLoading3Quarters,
  AiOutlineSend,
  AiTwotoneDelete,
} from "react-icons/ai";
import { BiLoaderCircle } from "react-icons/bi";

const PinDetail = ({ user }) => {
  const navigate = useNavigate();

  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [addingComment, setAddingComment] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const [unSavingPost, setUnSavingPost] = useState(false);

  const [alreadySaved, setAlreadySaved] = useState(
    !!pinDetail?.save?.find((item) => item.postedBy?._id === user?._id)
  );

  // alreadySaved = !!pinDetail?.save?.filter(
  //   (item) => item.postedBy?._id === user?._id
  // )?.length;

  const savePin = () => {
    if (!alreadySaved) {
      setSavingPost(true);
      client
        .patch(pinDetail?._id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            userId: user?._id,
            postedBy: {
              _type: "postedBy",
              _ref: user?._id,
            },
          },
        ])
        .commit()
        .then(() => {
          setSavingPost(false);
          setAlreadySaved(true);
        });
    }
  };
  const unsavePin = () => {
    const userId = user?._id; // Replace this with how you get the current user's ID

    if (
      !userId ||
      !pinDetail ||
      !pinDetail?.save ||
      pinDetail?.save?.length === 0
    ) {
      return; // Nothing to unsave or user not logged in
    }

    const indexToRemove = pinDetail.save.findIndex(
      (item) => item?.postedBy._id === userId
    );
    console.log(indexToRemove);
    if (indexToRemove === -1) {
      return; // The post is not saved by the user, nothing to unsave
    }
    setUnSavingPost(true);
    const updatedSaveArray = pinDetail.save.slice(); // Create a copy of the array
    updatedSaveArray.splice(indexToRemove, 1); // Remove the element at the specified index

    // Update the pin document
    client
      .patch(pinDetail._id)
      .set({ save: updatedSaveArray })
      .commit()
      .then(() => {
        setUnSavingPost(false);
        setAlreadySaved(false);
      })
      .catch((error) => {
        console.error("Error while unsaving post:", error);
      });
  };

  const deletePin = (id) => {
    client.delete(id).then(() => {
      setSavingPost(false);
      navigate("/");
    });
  };

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

  const fetchPinDetials = useCallback(() => {
    let query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(query).then((data) => {
        setPinDetail(data[0]);

        if (data[0]) {
          setLoading(true);
          query = pinDetailMorePinQuery(data[0]);
          client.fetch(query).then((res) => {
            setPins(res);
            setLoading(false);
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
    <div className="flex flex-col justify-start items-center h-fit   overflow-y-auto">
      {/* pin details */}
      <div className="lg:block hidden w-full bg-gray-800 rounded-2xl ">
        <div className="flex h-fit items-start justify-center gap-4 p-2">
          {/* Image div */}
          <div style={{ maxWidth: "50%", height: "80vh" }}>
            <img
              src={pinDetail.image.asset.url}
              alt={pinDetail.title}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "100%",
                objectFit: "cover",
              }}
              className="rounded-2xl"
            />
          </div>
          {/* End of image div */}
          {/* Sidebar div */}
          <div className="w-1/2">
            <div
              className="flex w-full flex-col  p-4 bg-gray-700 rounded-2xl"
              style={{ height: "80vh" }}
            >
              {/* title name */}
              <div className="mb-4  h-fit text-xl font-bold">
                <div className="h-fit  mb-4">
                  <div className="flex h-fit w-full items-center justify-between ">
                    {/* all user view */}
                    <div className=" w-full h-fit flex gap-2 items-center">
                      <div className="flex gap-2 items-center">
                        <a
                          href={`${pinDetail.image?.asset?.url}?dl=`}
                          download
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="bg-white w-10 h-10 rounded-full flex items-center justify-center text-dark text-xl opacity-90 hover:opacity-100 hover:shadow-md outline-none"
                        >
                          <MdDownloadForOffline />
                        </a>
                      </div>
                      {/* save */}
                      <div>
                        {!alreadySaved ? (
                          <button
                            className="flex items-center justify-center  bg-highlight opacity-90 hover:opacity-100  text-white font-semibold  rounded-3xl text-center shadow-sm hover:shadow-md py-2 px-4 font-sans w-16 h-10"
                            onClick={(e) => {
                              savePin(pinDetail?._id);
                            }}
                          >
                            {savingPost ? (
                              <BiLoaderCircle className=" text-lg" />
                            ) : (
                              <p className=" text-base">Save</p>
                            )}
                          </button>
                        ) : (
                          <button
                            className="flex items-center justify-center  bg-white  opacity-90 hover:opacity-100 text-highlight2 font-semibold text-sm  rounded-3xl text-center shadow-sm hover:shadow-md py-2 px-4 font-sans w-16 h-10"
                            onClick={(e) => {
                              unsavePin(pinDetail?._id);
                            }}
                          >
                            {unSavingPost ? (
                              <BiLoaderCircle className=" text-lg" />
                            ) : (
                              <p className=" text-base">Saved</p>
                            )}
                          </button>
                        )}
                      </div>
                      {pinDetail.destination && (
                        <a
                          href={pinDetail.destination}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-white flex items-center gap-2 font-semibold p-2 h-10  text-sm rounded-full opacity-90 hover:opacity-100 hover:shadow-md px-4 justify-self-end"
                        >
                          {pinDetail.destination}
                        </a>
                      )}
                    </div>
                    {/* same user delete pin */}
                    {user?._id === pinDetail?.postedBy?._id && (
                      <button
                        className=" bg-red-500 flex items-center justify-center gap-2 text-white font-semibold  text-sm  rounded-full opacity-90 hover:opacity-100 hover:shadow-md p-2 h-10 w-10"
                        onClick={() => {
                          deletePin(pinId);
                        }}
                      >
                        <AiTwotoneDelete />
                      </button>
                    )}
                  </div>
                </div>
                <div className="text-base flex flex-col items-center gap-1 mb-1">
                  <p className="text-gray-500">Posted by</p>
                  <Link
                    to={`/user-profile/${pinDetail?.postedBy?._id}`}
                    className="flex items-center gap-2 w-fit bg-gray-600 px-4 py-2 rounded-full shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-150 "
                  >
                    <img
                      src={pinDetail.postedBy.image}
                      alt="posted-by-profile"
                      className=" w-10 h-10  rounded-full"
                    />
                    <p className="text-gray-400">
                      {pinDetail.postedBy.userName}
                    </p>
                  </Link>
                </div>
                <div>
                  <h1 className="text-3xl text-gray-100 mb-1">
                    {pinDetail.title}
                  </h1>
                  <p className="text-gray-400">{pinDetail.about}</p>
                </div>
              </div>
              {/* comments */}
              <div className=" pb-10 flex-1 overflow-hidden ">
                <p className="text-gray-300 text-xl mb-1">
                  {pinDetail.comments?.length
                    ? pinDetail.comments?.length
                    : "0"}
                  {pinDetail.comments?.length === 1 ? " Comment" : " Comments"}
                </p>
                <div className="h-full overflow-y-auto pb-10 ">
                  {pinDetail.comments?.map((comment, i) => (
                    <div
                      className="w-full h-fit shrink-0 flex gap-2 items-start justify-center  py-2"
                      key={i}
                    >
                      <Link
                        to={`/user-profile/${comment.postedBy?._id}`}
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
                          {comment.postedBy?.userName.split(" ").at(0)}
                        </p>
                        <p className="font-normal text-gray-400 text-sm text-gray-30 break-all px-0 w-full">
                          {comment.comment}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* add comments */}
              <div className="flex justify-end items-center gap-2 bg-gray-600 px-4 py-2 rounded-full shadow-lg">
                <img
                  src={user?.image}
                  alt="user-profile"
                  className=" w-10 h-10   rounded-full shadow-sm "
                  referrerPolicy="no-referrer"
                />
                <input
                  type="text"
                  className="border border-gray-400 bg-gray-500 rounded-full outline-none flex-1 px-4 py-2 w-full md:w-auto text-gray-300"
                  placeholder="Add a comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button
                  type="button"
                  className=" bg-highlight  text-white rounded-full h-fit w-fit p-2 font-semibold text-base outline-none"
                  onClick={addComment}
                >
                  <div className="h-6 w-6 ">
                    {addingComment ? (
                      <AiOutlineLoading3Quarters className="h-full w-full" />
                    ) : (
                      <AiOutlineSend className="h-full w-full" />
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
          {/* End of sidebar div */}
        </div>
      </div>
      {/* mobile */}
      <div className="w-full block lg:hidden bg-gray-800 rounded-2xl">
        <div
          className="mb-2 h-600 flex items-center justify-center"
          style={{ maxWidth: "100%", maxHeight: "50vh", overflow: "hidden" }}
        >
          <img
            src={pinDetail.image?.asset?.url}
            alt={pinDetail.title}
            className="max-h-full max-w-full rounded-lg"
          />
        </div>
        <div
          className="w-full p-4 bg-gray-700 rounded-2xl"
          style={{ maxHeight: "calc(100vh)" }}
        >
          <div className="mb-4 h-fit text-xl font-bold">
            <div className="h-fit  mb-4">
              <div className="flex h-fit w-full items-center justify-between ">
                {/* all user view */}
                <div className=" w-full h-fit flex gap-2 items-center">
                  <div className="flex gap-2 items-center">
                    <a
                      href={`${pinDetail.image?.asset?.url}?dl=`}
                      download
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="bg-white w-10 h-10 rounded-full flex items-center justify-center text-dark text-xl opacity-90 hover:opacity-100 hover:shadow-md outline-none"
                    >
                      <MdDownloadForOffline />
                    </a>
                  </div>
                  {/* save */}
                  <div>
                    {!alreadySaved ? (
                      <button
                        className="flex items-center justify-center  bg-highlight opacity-90 hover:opacity-100  text-white font-semibold  rounded-3xl text-center shadow-sm hover:shadow-md py-2 px-4 font-sans w-16 h-10"
                        onClick={(e) => {
                          savePin(pinDetail?._id);
                        }}
                      >
                        {savingPost ? (
                          <BiLoaderCircle className=" text-lg" />
                        ) : (
                          <p className=" text-base">Save</p>
                        )}
                      </button>
                    ) : (
                      <button
                        className="flex items-center justify-center  bg-white  opacity-90 hover:opacity-100 text-highlight2 font-semibold text-sm  rounded-3xl text-center shadow-sm hover:shadow-md py-2 px-4 font-sans w-16 h-10"
                        onClick={(e) => {
                          unsavePin(pinDetail?._id);
                        }}
                      >
                        {unSavingPost ? (
                          <BiLoaderCircle className=" text-lg" />
                        ) : (
                          <p className=" text-base">Saved</p>
                        )}
                      </button>
                    )}
                  </div>
                  {pinDetail.destination && (
                    <a
                      href={pinDetail.destination}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-white flex items-center gap-2 font-semibold p-2 h-10  text-sm rounded-full opacity-90 hover:opacity-100 hover:shadow-md px-4 justify-self-end"
                    >
                      {pinDetail.destination}
                    </a>
                  )}
                </div>
                {/* same user delete pin */}
                {user?._id === pinDetail?.postedBy?._id && (
                  <button
                    className=" bg-red-500 flex items-center justify-center gap-2 text-white font-semibold  text-sm  rounded-full opacity-90 hover:opacity-100 hover:shadow-md p-2 h-10 w-10"
                    onClick={() => {
                      deletePin(pinId);
                    }}
                  >
                    <AiTwotoneDelete />
                  </button>
                )}
              </div>
            </div>
            <div>
              <h1 className="text-3xl text-gray-100 mb-1">{pinDetail.title}</h1>
              <p className="text-gray-400">{pinDetail.about}</p>
            </div>
            <div className="text-base flex flex-col items-center gap-1 mb-1">
              <p className="text-gray-500">Posted by</p>
              <Link
                to={`/user-profile/${pinDetail.postedBy?._id}`}
                className="flex items-center gap-2 w-fit bg-gray-600 px-4 py-2 rounded-full shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-150"
              >
                <img
                  src={pinDetail.postedBy.image}
                  alt="posted-by-profile"
                  className=" w-10 h-10  rounded-full"
                />
                <p className="text-gray-400">{pinDetail.postedBy.userName}</p>
              </Link>
            </div>
          </div>
          <div
            className="pb-10"
            style={{ maxHeight: "calc(100vh - 380px)", overflowY: "auto" }}
          >
            <p className="text-gray-300 text-xl mb-1">
              {pinDetail.comments?.length ? pinDetail.comments?.length : "0"}
              {pinDetail.comments?.length === 1 ? " Comment" : " Comments"}
            </p>
            <div className="h-full">
              {pinDetail.comments?.map((comment, i) => (
                <div
                  className="w-full h-fit flex gap-2 items-start justify-center py-2"
                  key={i}
                >
                  <Link
                    to={`/user-profile/${comment.postedBy?._id}`}
                    className="flex justify-start items-center w-fit h-fit"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={comment.postedBy?.image}
                      alt="user-profile"
                      className="w-8 h-8 rounded-full shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                  </Link>
                  <div className="w-full">
                    <p className="font-bold text-sm text-gray-300">
                      {comment.postedBy?.userName.split(" ").at(0)}
                    </p>
                    <p className="font-normal text-gray-400 text-sm text-gray-30 break-all px-0 w-full">
                      {comment.comment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end items-center gap-2 bg-gray-600 px-4 py-2 rounded-full shadow-lg">
            <img
              src={user?.image}
              alt="user-profile"
              className="w-10 h-10 rounded-full shadow-sm"
              referrerPolicy="no-referrer"
            />
            <input
              type="text"
              className="border border-gray-400 bg-gray-500 rounded-full outline-none flex-1 px-4 py-2 w-full md:w-auto text-gray-300"
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type="button"
              className="bg-highlight text-white rounded-full h-fit w-fit p-2 font-semibold text-base outline-none"
              onClick={addComment}
            >
              <div className="h-6 w-6">
                {addingComment ? (
                  <AiOutlineLoading3Quarters className="h-full w-full" />
                ) : (
                  <AiOutlineSend className="h-full w-full" />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
      {/* mobile end */}
      {/* Start of Related pins */}
      <div className="w-full p-4l mt-8   rounded-lg shadow-md ">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-200">
          Related Pins
        </h2>
        {/* Add your content for related pins here */}
        {!loading ? (
          <div className="w-full   flex items-center justify-center flex-col">
            {pins?.length > 0 ? (
              <MasonaryLayout pins={pins} />
            ) : (
              <p className="mb-10 text-lg">No related pins</p>
            )}
          </div>
        ) : (
          <div className="mb-10">
            <Spinner message="Loading more pins" />
          </div>
        )}
        {/* Add more related pins here */}
      </div>

      {/* End of related pins */}
    </div>
  );
};

export default PinDetail;
