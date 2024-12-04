import React from "react";
import PropTypes from "prop-types";

const TimelineFrame = ({ time, image }) => {
  return (
    <div className="flex flex-wrap w-[90px] min-w-[90px] h-fit box-content cursor-pointer transition-transform duration-200 hover:scale-105 hover:border-2 hover:border-blue-500 selected:border-2 hover:rounded selected:rounded">
      <img src={image} className="rounded" objectfit="cover" alt="frames" />
      <div className="w-full mt-1 text-center text-xs text-gray-600">
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
