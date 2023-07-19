import React from "react";
import Masonry from "react-masonry-css";
import Pin from "./Pin";

const breakPointObj = {
  default: 4,
  2800: 8,
  2400: 6,
  2000: 4,
  1300: 3,
  1000: 2,
};

const MasonryLayout = ({ pins }) => {
  return (
    <Masonry
      className="flex animate-slide-fwd  "
      breakpointCols={breakPointObj}
    >
      {pins?.map((pin) => {
        return <Pin key={pin._id} pin={pin} className=" w-max" />;
      })}
    </Masonry>
  );
};

export default MasonryLayout;
