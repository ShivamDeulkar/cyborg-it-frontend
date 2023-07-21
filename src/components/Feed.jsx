import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { client } from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import { feedQuery, searchQuery } from "../utils/data";
import { BiSolidMessageError } from "react-icons/bi";

const Feed = () => {
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState(null);
  const { categoryId } = useParams();
  useEffect(() => {
    setLoading(true);
    if (categoryId) {
      const query = searchQuery(categoryId);
      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      });
    } else {
      client.fetch(feedQuery).then((data) => {
        setPins(data);
        setLoading(false);
      });
    }
  }, [categoryId]);

  if (loading)
    return <Spinner message="We are adding new ideas to your feed!" />;
  if (!pins?.length)
    return (
      <div className="flex items-center justify-center h-full  flex-col">
        <BiSolidMessageError className="text-2xl" />
        <h2 className="text-lg">No pins avaliable</h2>
      </div>
    );
  return <div>{pins && <MasonryLayout pins={pins} />}</div>;
};

export default Feed;
