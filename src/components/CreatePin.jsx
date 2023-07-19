import React, { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { client } from "../client";
import Spinner from "./Spinner";
import { categories } from "../utils/data";
const CreatePin = ({ user }) => {
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);
  const navigate = useNavigate();
  const uploadImage = (e) => {
    const selectedFile = e.target.files[0];
    const { type, name } = selectedFile;
    if (
      type === "image/png" ||
      type === "image/jpg" ||
      type === "image/jpeg" ||
      type === "image/svg" ||
      type === "image/gif" ||
      type === "image/tiff" ||
      type === "image/webp"
    ) {
      setWrongImageType(false);
      setLoading(true);
      client.assets
        .upload("image", selectedFile, {
          contentType: type,
          filename: name,
        })
        .then((document) => {
          setImageAsset(document);
          setLoading(false);
        })
        .catch((err) => {
          console.log("image upload failed ", err);
        });
    } else {
      setWrongImageType(true);
    }
  };
  const savePin = (e) => {
    e.preventDefault();
    console.log(e);
    if (title && about && destination && imageAsset?._id && category) {
      const doc = {
        _type: "pin",
        title,
        about,
        destination,
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset?._id,
          },
        },
        userId: user?._id,
        postedBy: {
          _type: "postedBy",
          _ref: user?._id,
        },
        category,
      };
      client.create(doc).then(() => {
        navigate("/");
      });
    } else {
      setFields(true);
      console.log("fill");
      setTimeout(() => setFields(false), 2000);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center w-full mt-5 lg:h-4/5 ">
      <form
        onSubmit={(e) => savePin(e)}
        className="flex lg:flex-row flex-col  justify-center item-center bg-gray-800 lg:p-5 p-3  w-full gap-4 "
      >
        <div className=" bg-gray-700  flex items-center   rounded-lg w-full lg:w-7/12 xl:w-2/3  ">
          <div className="flex justify-center items-center flex-col   w-full h-420 ">
            {loading && <Spinner />}
            {wrongImageType && (
              <p className="text-highlight2 ">*Wrong image type</p>
            )}
            {!imageAsset && !loading ? (
              <label className="relative rounded-lg  w-full h-full">
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="flex  flex-col justify-center items-center">
                    <p className=" text-bold text-2xl text-gray-300">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg text-gray-300"> click to upload</p>
                  </div>
                  <p className=" text-gray-500">
                    Try to use high-quality JPG, JPEG, PNG, SVG or GIF less than
                    20MB
                  </p>
                </div>
                <input
                  type="file"
                  name="upload-image"
                  onChange={uploadImage}
                  className="w-0 h-0 absolute top-0 left-0"
                />
              </label>
            ) : (
              !loading && (
                <div className="relative h-full">
                  <img
                    src={imageAsset?.url}
                    alt="uploaded-image"
                    className="h-full w-ful rounded-lg"
                  />
                  <button
                    type="button"
                    className=" absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-lg transition-all duration-500 ease-in-out shadow-md"
                    onClick={() => setImageAsset(null)}
                  >
                    <MdDelete />
                  </button>
                </div>
              )
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col  gap-4  mt-5 lg:mt-0   w-full lg:w-5/12   xl:w-1/3 ">
          {user && (
            <div className="flex gap-2 my-2 items-center bg-gray-700 rounded-md p-2">
              <img
                src={user?.image}
                alt="user-profile"
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full"
              />
              <p className="text-base  text-gray-300">{user.userName}</p>
            </div>
          )}
          <input
            className="outline-none text-md sm:text-lg text-base border-2 border-gray-500 p-2 bg-gray-800 placeholder:text-gray-500 rounded-md"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            placeholder="Title"
          />

          <input
            className="outline-none text-md sm:text-lg text-base border-2 border-gray-500 p-2 bg-gray-800 placeholder:text-gray-500 rounded-md"
            type="text"
            value={about}
            onChange={(e) => {
              setAbout(e.target.value);
            }}
            placeholder="Description"
          />
          <input
            className="outline-none text-md sm:text-lg text-base border-2 border-gray-500 p-2 bg-gray-800 placeholder:text-gray-500 rounded-md"
            type="url"
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
            }}
            placeholder="Destination URL"
          />
          <div className="flex flex-col gap-5">
            <div>
              <p className="mb-2 font-semibold text-lg sm:text-xl">
                Choose pin category
              </p>
              <select
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
                className="outline-none w-full text-base border-2 border-gray-600 p-2 rounded-md cursor-pointer bg-gray-700"
              >
                <option value="other">Select Category</option>
                {categories.map((category) => (
                  <option value={category.name} key={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end items-end lg:justify-normal lg:block lg:items-stretch">
              <button
                className="bg-highlight text-gray-100 lg:px-5 px-8 py-2 text-lg capitalize rounded-md hover:bg-white hover:text-highlight2 transition-all duration-150 shadow-sm hover:shadow-lg lg:w-full w-fit"
                type="submit"
              >
                save
              </button>
            </div>
          </div>
        </div>
      </form>
      {fields && (
        <p className=" bg-gradient-to-br bg-white border border-highlight  text-highlight2  px-5 py-2  mt-5  transition-all duration-150 ease-in -skew-x-12 uppercase text-base">
          Please fill in all the fields
        </p>
      )}
    </div>
  );
};

export default CreatePin;
