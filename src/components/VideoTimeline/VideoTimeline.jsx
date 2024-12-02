import React, { useState, useRef, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { useTimelineZoom } from "../../hooks/useTimelineZoom";
import { useTimelineDrag } from "../../hooks/useTimelineDrag";
import TimelineFrame from "./TimelineFrame";
import "./VideoTimeline.css";
import Hls from "hls.js";

const VideoTimeline = ({ startTime, endTime, onFrameSelect, frames }) => {
  const [currentTime, setCurrentTime] = useState(startTime);
  const containerRef = useRef(null);

  // let video = document.createElement("video");
  // video.src = source?.url;
  let canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");

  // useEffect(() => {
  //   if (source?.type === "hls" && video) {
  //     if (Hls.isSupported()) {
  //       const hls = new Hls();
  //       hls.loadSource(url);
  //       hls.attachMedia(video);
  //     }
  //   }
  // }, [source]);

  const { zoom, handleZoom } = useTimelineZoom();
  const { isDragging, startDrag, onDrag, endDrag } = useTimelineDrag({
    zoom,
    startTime,
    endTime,
    onTimeChange: setCurrentTime,
  });

  const totalDuration = endTime - startTime;
  const visibleDuration = totalDuration / zoom;
  const framesCount = Math.ceil(10 * zoom);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       let imageArray = [];
  //       const startTime = 10; // in seconds
  //       const endTime = 20; // in seconds
  //       imageArray = await getFramesBetweenTimes(startTime, endTime, 10);

  //       getFrames(imageArray);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, [createStatus]);

  // const getFramesBetweenTimes = async (startTime, endTime, zoom) => {
  //   if (video) {
  //     const saveTime = video.currentTime;
  //     let frames = [];
  //     let presentMoment = startTime;
  //     let [w, h] = [video.videoWidth, video.videoHeight];
  //     canvas.width = w;
  //     canvas.height = h;

  //     const waitForVideoToLoad = () => {
  //       return new Promise((resolve) => {
  //         video.onseeked = () => {
  //           resolve();
  //         };
  //         video.currentTime = video.currentTime; // Trigger the seek event
  //       });
  //     };

  //     for (let i = 0; i < zoom; i++) {
  //       // Calculate the new current time
  //       video.currentTime = presentMoment + ((endTime - startTime) / zoom) * i;

  //       // Wait for the video to be ready after changing currentTime
  //       await waitForVideoToLoad();

  //       // Draw the current frame onto the canvas
  //       context.drawImage(video, 0, 0, w, h);
  //       let base64ImageData = canvas.toDataURL();
  //       if (canvas.width && canvas.height) {
  //         frames.push({
  //           imgData: base64ImageData,
  //           width: canvas.width,
  //           height: canvas.height,
  //         });
  //       } else {
  //         return;
  //       }
  //     }

  //     // Restore the video's current time
  //     video.currentTime = saveTime;
  //     return frames;
  //   }
  // };

  const generateFrames = useCallback(() => {
    const frames = [];
    const frameInterval = visibleDuration / 10;

    for (let i = 0; i < framesCount; i++) {
      const frameTime = currentTime + i * frameInterval;
      if (frameTime <= endTime) {
        frames.push(
          <TimelineFrame
            key={i}
            image={frames[i]}
            time={frameTime}
            isSelected={false}
            onClick={() => onFrameSelect(frameTime)}
          />
        );
      }
    }
    return frames;
  }, [currentTime, visibleDuration, framesCount, endTime, onFrameSelect]);

  const gener = () => {
    let arr = [];
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i];
      canvas.width = frame?.width || 0;
      canvas.height = frame?.height || 0;

      arr.push(
        <img
          src={frame.imgData}
          // width={frame.width}
          // height={frame.height}
          key={i}
        ></img>
      );
    }
    return arr;
  };

  return (
    <div
      className="w-full h-[110px] bg-gray-200 border border-gray-300 rounded overflow-hidden relative"
      ref={containerRef}
      onWheel={handleZoom}
      onMouseDown={startDrag}
      onMouseMove={isDragging ? onDrag : null}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
    >
      <div className="flex gap-[2px] h-[75px] p-2 overflow-x-auto overflow-y-hidden">
        {frames !== undefined && gener()}
        {/* {generateFrames()} */}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-white bg-opacity-90 border-t border-gray-300 flex justify-between text-xs">
        <span>Zoom: {zoom.toFixed(1)}x</span>
        <span>Current Time: {currentTime.toFixed(2)}s</span>
      </div>
    </div>
  );
};

VideoTimeline.propTypes = {
  startTime: PropTypes.number.isRequired,
  endTime: PropTypes.number.isRequired,
  onFrameSelect: PropTypes.func.isRequired,
};

export default VideoTimeline;
