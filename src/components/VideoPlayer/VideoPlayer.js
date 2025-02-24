import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  Play,
  Pause,
  StepForward,
  StepBack,
  FastForward,
  Rewind,
} from "lucide-react";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { formatTimeCode } from "../../utils/time";
import { ProgressBar } from "./ProgressBar";
import { VolumeControl } from "./VolumeControl";

export const VideoPlayer = ({
  source,
  onTimeUpdate,
  onDuration,
  currentTime,
  duration,
  isPlaying,
  setIsPlaying,
  movedTime,
}) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (source?.type === "hls" && videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(source?.url);
        hls.attachMedia(videoRef.current);
      }
    }
    videoRef.current?.addEventListener("timeupdate", function () {
      if (!duration) {
        onDuration(videoRef.current.duration);
      }
      onTimeUpdate(videoRef.current.currentTime);
    });
  }, [source]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = movedTime;
      setIsPlaying(false);
    }
  }, [movedTime]);

  const handlePlayPause = () => {
    if (source?.url) {
      if (videoRef.current) {
        var playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          if (isPlaying) {
            playPromise
              .then((_) => {
                videoRef.current.pause();
              })
              .catch((error) => {});
          } else {
            playPromise
              .then((_) => {
                videoRef.current.play();
              })
              .catch((error) => {});
          }
        }
        setIsPlaying(!isPlaying);
      }
    } else {
      return;
    }
  };

  useEffect(() => {
    if (!source?.url || !videoRef.current) return;

    if (isPlaying) {
      videoRef.current.play().catch((error) => {
        console.error("Play failed:", error);
      });
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying, source?.url]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      onTimeUpdate(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      onDuration(videoRef.current.duration);
    }
  };

  const skipFrames = (frames) => {
    if (videoRef.current) {
      const frameTime = 1 / 30;
      videoRef.current.currentTime += frameTime * frames;
    }
  };

  const handleVolumeChange = (newVolume) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      if (newVolume > 0) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  useKeyboardShortcuts({
    onSpaceBar: handlePlayPause,
    onLeftArrow: () => skipFrames(-1),
    onRightArrow: () => skipFrames(1),
  });

  return (
    <div className="relative w-full bg-gray-900 rounded-lg">
      <video
        ref={videoRef}
        className="w-full aspect-video"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      <div className="absolute w-full bottom-[76px] left-0 right-0">
        <div className="h-4 w-full flex items-end bg-transparent">
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
          />
        </div>
      </div>
      <div className="w-full p-2">
        <div className="flex items-center justify-between text-gray-400 text-sm h-5 px-2">
          <span>
            {formatTimeCode(currentTime)
              ? `${formatTimeCode(currentTime)
                  .hours.toString()
                  .padStart(2, "0")}:${formatTimeCode(currentTime)
                  .minutes.toString()
                  .padStart(2, "0")}:${formatTimeCode(currentTime)
                  .seconds.toString()
                  .padStart(2, "0")}:${formatTimeCode(currentTime)
                  .milliseconds.toString()
                  .padStart(3, "0")}`
              : " "}
          </span>
          <span>{`${formatTimeCode(duration)
            .hours.toString()
            .padStart(2, "0")}:${formatTimeCode(duration)
            .minutes.toString()
            .padStart(2, "0")}:${formatTimeCode(duration)
            .seconds.toString()
            .padStart(2, "0")}:${formatTimeCode(duration)
            .milliseconds.toString()
            .padStart(3, "0")}`}</span>
        </div>
        <div className="w-full grid grid-cols-12 flex items-center justify-between">
          <div className="col-span-4" />
          <div className="col-span-4 flex items-center justify-center gap-4">
            <button
              onClick={() => skipFrames(-50)}
              className="p-2 hover:bg-gray-700 rounded-full"
              title="Previous Frame (←)"
            >
              <Rewind className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={() => skipFrames(-10)}
              className="p-2 hover:bg-gray-700 rounded-full"
              title="Previous Frame (←)"
            >
              <StepBack className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={() => handlePlayPause()}
              className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full"
              title="Play/Pause (Space)"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white" />
              )}
            </button>
            <button
              onClick={() => skipFrames(10)}
              className="p-2 hover:bg-gray-700 rounded-full"
              title="Next Frame (→)"
            >
              <StepForward className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={() => skipFrames(50)}
              className="p-2 hover:bg-gray-700 rounded-full"
              title="Next Frame (→)"
            >
              <FastForward className="w-6 h-6 text-white" />
            </button>
          </div>
          <div className="col-span-4 flex justify-end">
            <VolumeControl
              volume={volume}
              isMuted={isMuted}
              onVolumeChange={handleVolumeChange}
              onMuteToggle={toggleMute}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
