import React, { useState, useRef, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { RefreshCw, Play } from "lucide-react";
import TimelineFrame from "./TimelineFrame";
import "./VideoTimeline.css";
import Hls from "hls.js";
import { PreviewDialog } from "./PreviewDialog";

const VideoTimeline = ({
  startTime,
  endTime,
  source,
  isPlaying,
  refreshStatus,
  setRefreshStatus,
  savedTime,
  setIsPlaying,
}) => {
  const [frames, setFrames] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(true);
  const [rate, setRate] = useState(1);
  const [fixedInMarker, setIFM] = useState(0);
  const [fixedOutMarker, setOFM] = useState(0);
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  // render PreviewDialog component because of having to set previewRef value to video tag in PreviewDialog component
  useEffect(() => {
    setDialogOpen(false);
  }, []);

  useEffect(() => {
    // Create video element once
    videoRef.current = document.createElement("video");
    videoRef.current.src = source?.url;

    // Setup HLS if needed
    if (source?.type === "hls" && videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(source.url);
        hls.attachMedia(videoRef.current);
        videoRef.current.muted = true;
      }
    }
  }, [source]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !source?.url) return;

    if (isPlaying === true) {
      video.play().catch((error) => console.error("Play error:", error));
    } else {
      video.pause();
    }
  }, [isPlaying]);

  const handleRefresh = () => {
    if (
      startTime === null ||
      endTime === null ||
      parseFloat(startTime) >= parseFloat(endTime)
    ) {
      alert("Please set valid start and end points.");
      return;
    }
    setIFM(startTime);
    setOFM(endTime);
    setRate(zoom);
    setRefreshStatus(true);
  };

  const handlePlay = () => {
    // if (frames?.length === 0) return;
    if (
      startTime === null ||
      endTime === null ||
      parseFloat(startTime) >= parseFloat(endTime)
    ) {
      alert("Please set valid start and end points.");
      return;
    }
    setIFM(startTime);
    setOFM(endTime);
    setIsPlaying(false);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsPlaying(false);
    setDialogOpen(false);
  };

  useEffect(() => {
    if (refreshStatus) {
      const fetchData = async () => {
        try {
          let imageArray = [];
          imageArray = await getFramesBetweenTimes(
            parseFloat(startTime),
            parseFloat(endTime),
            10 * zoom
          );
          setFrames(imageArray);
          setRefreshStatus(false);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [refreshStatus]);

  const getFramesBetweenTimes = async (startTime, endTime, zoom) => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      let frames = [];
      let presentMoment = startTime;
      let [w, h] = [videoRef.current.videoWidth, videoRef.current.videoHeight];
      canvas.width = w;
      canvas.height = h;

      const waitForVideoToLoad = () => {
        return new Promise((resolve) => {
          videoRef.current.onseeked = () => {
            resolve();
          };
        });
      };

      for (let i = 0; i < zoom; i++) {
        // Calculate the new current time
        const cT = presentMoment + ((endTime - startTime) / zoom) * i;
        videoRef.current.currentTime = cT;
        // Wait for the video to be ready after changing currentTime
        await waitForVideoToLoad();

        // Draw the current frame onto the canvas
        context.drawImage(videoRef.current, 0, 0, w, h);
        let base64ImageData = canvas.toDataURL();
        if (canvas.width && canvas.height) {
          frames.push(base64ImageData);
        } else {
          return;
        }
      }
      videoRef.current.currentTime = endTime;
      await waitForVideoToLoad();
      context.drawImage(videoRef.current, 0, 0, w, h);
      let base64ImageData = canvas.toDataURL();
      if (canvas.width && canvas.height) {
        frames.push(base64ImageData);
      }

      // Restore the video's current time
      videoRef.current.currentTime = savedTime;
      await waitForVideoToLoad();
      return frames;
    }
  };

  const gener = () => {
    let arr = [];
    for (let i = 0; i < frames?.length; i++) {
      const frameTime =
        fixedInMarker + (i * (fixedOutMarker - fixedInMarker)) / (rate * 10);
      const frame = frames[i];
      arr.push(
        <div key={i}>
          <TimelineFrame image={frame} time={frameTime} />
        </div>
      );
    }
    return arr;
  };

  return (
    <div
      className="w-[1248px] h-[140px] bg-gray-200 border border-gray-300 rounded overflow-hidden relative"
      ref={containerRef}
    >
      {dialogOpen ? (
        <PreviewDialog
          source={source}
          videoStartTime={fixedInMarker}
          videoEndTime={fixedOutMarker}
          open={dialogOpen}
          setOpen={() => handleDialogClose()}
        />
      ) : null}
      <div
        className="flex gap-[2px] h-[95px] p-2 overflow-x-scroll overflow-y-hidden justify-between"
        style={{ scrollbarGutter: "both-edges" }}
      >
        {frames?.length ? gener() : <div />}
      </div>
      <div className="absolute flex bottom-0 left-0 right-0 gap-4 bg-white bg-opacity-90 border-t border-gray-300 flex justify-between text-xs">
        <div className="flex gap-4">
          <span className="content-center p-2">Frames count: {zoom * 10}</span>
          <input
            type="range"
            min="1"
            max="4"
            step="1"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-20 accent-blue-500"
          />
        </div>
        <div className="flex">
          <button
            onClick={() => handleRefresh()}
            className="p-2 transition-colors  hover:bg-gray-400 rounded-full"
          >
            <RefreshCw
              className={
                refreshStatus
                  ? "w-6 h-6 animate-spin text-blue-600"
                  : "w-6 h-6 text-blue-500"
              }
            />
          </button>
          <button
            onClick={() => handlePlay()}
            className="p-2 transition-colors  hover:bg-gray-400 rounded-full"
            disabled={frames?.length === 0}
          >
            <Play
              className={`w-6 h-6 ${
                frames?.length === 0 ? "text-gray-400" : "text-blue-600"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

VideoTimeline.propTypes = {
  startTime: PropTypes.number.isRequired,
  endTime: PropTypes.number.isRequired,
};

export default VideoTimeline;
