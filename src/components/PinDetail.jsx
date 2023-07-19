import React, { useState, useEffect } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { client, urlFor } from "../client";
import MasonaryLayout from "./MasonryLayout";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import Spinner from "./Spinner";

const PinDetail = () => {
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comments, setComments] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  // ID
  const { pinId } = useParams();

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
    console.log(pins);
  }, [pinId]);

  if (!pinDetail) return <Spinner message="Loading pin" />;

  return (
    <div
      className="flex xl:flex-row flex-col m-auto bg-gray-700 mt-4 overflow-hidden"
      style={{ maxWidth: "1500px", borderRadius: "32px" }}
    >
      {/* img */}
      <div className="flex justify-center items-center w-full  md:items-start flex-initial xl:m-0  mt-5">
        <img
          src={pinDetail.image && urlFor(pinDetail.image)}
          alt={pinDetail.about}
          className="xl:rounded-none rounded-lg  w-2/3 xl:w-full xl:min-w-350 "
        ></img>
      </div>
      {/* details */}
      <div className="xl:w-2/3 w-full  p-5 flex flex-col gap-4 ">
        {/* download */}
        <div className="grid grid-cols-2 items-center w-full bg-red-300 h-fit">
          <div className="flex gap-2 items-center">
            <a
              href={`${pinDetail.image?.asset?.url}?dl=`}
              download
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
            >
              <MdDownloadForOffline />
            </a>
          </div>
          <a
            href={pinDetail.destination}
            target="_blank"
            rel="noreferrer"
            className="bg-white flex items-center gap-2 font-semibold p-2  text-sm rounded-full opacity-70 hover:opacity-100 hover:shadow-md px-4 justify-self-end"
          >
            {pinDetail.destination}
          </a>
        </div>
        {/* title and comments*/}
        <div className="bg-red-500  relative flex-1 flex flex-col">
          <div className="h-fit bg-green-200">
            <h1 className="text-4xl font-bold break-words  text-gray-300 capitalize">
              {pinDetail.title}
            </h1>
          </div>
          <div className="bg-green-500 flex-1 overflow-hidden">
            <div className="bg-blue-300 h-full flex flex-col gap-4">
              <div className="bg-black h-28 opacity-20"></div>
              <div className="bg-black h-28 opacity-20"></div>
              <div className="bg-black h-28 opacity-20"></div>
              <div className="bg-black h-28 opacity-20"></div>
              <div className="bg-black h-28 opacity-20"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinDetail;

{
  /* <div className="w-full h-fit">
            <h1 className="text-4xl font-bold break-words  text-gray-300 capitalize">
              {pinDetail.title}
            </h1>
            <p className="mt-1 text-gray-400">{pinDetail.about}</p>
            <div className="flex items-center mt-4">
              <div>
                <Link
                  to={`user-profile/${pinDetail.postedBy?._id}`}
                  className="flex justify-start gap-2  items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={pinDetail.postedBy?.image}
                    alt="user-profile"
                    className=" w-12 h-12   rounded-full shadow-sm "
                    referrerPolicy="no-referrer"
                  />
                  <p className="font-bold text-md text-gray-300">
                    {pinDetail.postedBy?.userName}
                  </p>
                </Link>
              </div>
            </div>
          </div> */
}

{
  /* <div className="flex flex-col gap-3 h-full   justify-start overflow-scroll">
            <h2 className="text-gray-300 text-xl">
              {pinDetail.comments?.length} Comments
            </h2>
            <div className=" flex flex-col gap-3   items-start  "></div>
          </div> */
}

// {pinDetail.comments?.map((comment, i) => (
//   <div
//     className="flex gap-2 items-start w-full bg-gray-600 p-3 rounded-md"
//     key={i}
//   >
//     <div
//       className="grid gap-4"
//       style={{ gridTemplateColumns: "fit-content(400px) 1fr" }}
//     >
//       <Link
//         to={`user-profile/${comment.postedBy?._id}`}
//         className=" flex justify-start items-center gap-1
//          w-fit h-fit"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <img
//           src={pinDetail.postedBy?.image}
//           alt="user-profile"
//           className=" w-8 h-8   rounded-full shadow-sm "
//           referrerPolicy="no-referrer"
//         />
//         <p className="font-bold text-xs  text-gray-300">
//           {pinDetail.postedBy?.userName.split(" ").at(0)}
//         </p>
//       </Link>
//       <p className=" font-normal text-gray-400 text-sm text-gray-30 break-all px-0 w-full">
//         {comment.comment}
//       </p>
//     </div>
//   </div>
// ))}

{
  /* addcomments */
}
{
  /* <div className="  flex items-end">
<div className=" bg-gray-600 flex w-full px-4 py-2 rounded-lg gap-4">
  <Link
    to={`user-profile/${pinDetail.postedBy?._id}`}
    className="flex justify-start gap-2  items-center    rounded-xl"
    onClick={(e) => e.stopPropagation()}
  >
    <img
      src={pinDetail.postedBy?.image}
      alt="user-profile"
      className=" w-10 h-10   rounded-full shadow-sm "
      referrerPolicy="no-referrer"
    />
    <p
      className="font-bold text-sm
     text-gray-300"
    >
      {pinDetail.postedBy?.userName}
    </p>
  </Link>
  <input
    className="w-full bg-gray-500 rounded-md outline-none text-md sm:text-lg text-base border-2 border-gray-500 text-gray-300 p-2 placeholder:text-gray-400 "
    placeholder="Add a comment"
  />
</div>
</div> */
}
