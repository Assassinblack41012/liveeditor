import React from "react";
import PropTypes from "prop-types";
// import "./TimelineFrame.css";

const TimelineFrame = ({ time, isSelected, onClick, image }) => {
  return (
    <div
      className={`flex-none w-[90px] mr-1 cursor-pointer transition-transform duration-200 hover:scale-105 selected:border-2 selected:border-blue-500 ${
        isSelected ? "selected" : ""
      }`}
      onClick={onClick}
    >
      <div className="w-[90px] h-[45px] bg-white border border-gray-300 rounded overflow-hidden">
        {/* Placeholder for actual video frame */}
        <img
          src={image.imgData}
          // width={frame.width}
          // height={frame.height}
        ></img>
        <div
          className="w-full h-full bg-gradient-to-r from-[#f0f0f0] to-[#e0e0e0] bg-pattern"
          style={{ backgroundSize: "20px 20px" }}
        />
      </div>
      <div className="text-center text-xs mt-1 text-gray-600">
        {time.toFixed(2)}s
      </div>
    </div>
  );
};

TimelineFrame.propTypes = {
  time: PropTypes.number.isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

TimelineFrame.defaultProps = {
  isSelected: false,
};

export default TimelineFrame;
