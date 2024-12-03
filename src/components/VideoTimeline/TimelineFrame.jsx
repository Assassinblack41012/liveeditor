import React from "react";
import PropTypes from "prop-types";

const TimelineFrame = ({ time, image }) => {
  return (
    <div className="flex flex-wrap w-[90px] box-content cursor-pointer transition-transform duration-200  selected:border-2">
      <img src={image} className="rounded" objectfit="cover" alt="frames" />
      <div className="w-full text-center text-xs mt-1 text-gray-600">
        {time.toFixed(2)}s
      </div>
    </div>
  );
};

TimelineFrame.propTypes = {
  image: PropTypes.string,
  time: PropTypes.number.isRequired,
};

export default TimelineFrame;
