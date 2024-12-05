import React, { useState } from "react";
import { VideoPlayer } from "./components/VideoPlayer/VideoPlayer";
import { TimePicker } from "./components/TimePicker/TimePicker";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import VideoTimeline from "./components/VideoTimeline/VideoTimeline";
import axios from "axios";

function App() {
  const [url, setUrl] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [inMarker, setInMarker] = useState(0);
  const [outMarker, setOutMarker] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [refreshStatus, setRefreshStatus] = useState(false);
  const [movedTime, setMovedTime] = useState(0);

  const [streamSource, setStreamSource] = useState({
    url: "",
    type: "hls",
  });

  const onStart = () => {
    if (!url) {
      return;
    }
    setStreamSource({ url, type: "hls" });
  };

  const handleClipCreate = () => {
    if (
      inMarker === null ||
      outMarker === null ||
      parseFloat(inMarker) >= parseFloat(outMarker)
    ) {
      alert("Please set valid start and end points.");
      return;
    }
    if (inMarker > currentTime || outMarker > currentTime) {
      alert("Please set valid start and end points.");
      return;
    }
    axios
      .post("http://127.0.0.1:48080/api/render/", {
        video_url: url,
        start_time: inMarker,
        end_time: outMarker,
        zoom: 1,
      })
      .error((error) => {
        console.log(error);
      });
  };

  useKeyboardShortcuts({
    onI: () => {
      if (outMarker >= currentTime) setInMarker(currentTime);
    },
    onO: () => {
      if (inMarker <= currentTime) setOutMarker(currentTime);
    },
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-700 p-4 gap-4">
      <div className="w-[1280px] flex flex-wrap p-4 gap-4">
        <h1 className="w-full text-3xl font-bold text-white leading-none">
          Live Video Editor
        </h1>
        <div className="w-full flex gap-4">
          <div className="max-w-[980px] gap-4 flex flex-wrap">
            <div
              id="controls"
              className="w-full flex gap-4 items-center justify-between "
            >
              <input
                type="text"
                className="w-full px-4 py-2 rounded hover:bg-gray-300"
                onChange={(e) => setUrl(e.target.value.trim())}
                placeholder="Enter Live Stream URL"
                value={url}
              />
              <button
                className="w-[200px] px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => onStart()}
              >
                Start Live Stream
              </button>
            </div>
            <VideoPlayer
              source={streamSource}
              currentTime={currentTime}
              duration={duration}
              onTimeUpdate={(value) => setCurrentTime(value)}
              onDuration={(value) => setDuration(value)}
              isPlaying={isPlaying}
              setIsPlaying={(value) => setIsPlaying(value)}
              movedTime={movedTime}
            />
          </div>

          <div className="w-[340px] gap-4 h-fit text-center flex flex-wrap justify-center">
            <button
              onClick={() => setInMarker(parseFloat(currentTime?.toFixed(3)))}
              className="w-40 h-10 mt-[56px] bg-green-500 text-white rounded hover:bg-green-600"
            >
              Set In Point (I)
            </button>

            <TimePicker
              value={inMarker}
              onChange={(value) => {
                if (parseFloat(value) > duration) {
                  alert("Please set valid start and end points.");
                  setInMarker(duration);
                  setMovedTime(duration);
                  return;
                }
                setInMarker(value);
                setMovedTime(value);
              }}
              minTime={0}
              maxTime={currentTime ? parseFloat(currentTime?.toFixed(3)) : 0}
            />

            <button
              onClick={() => {
                setOutMarker(parseFloat(currentTime?.toFixed(3)));
              }}
              className="w-40 h-10 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Set Out Point (O)
            </button>

            <TimePicker
              value={outMarker}
              onChange={(value) => {
                if (parseFloat(value) > duration) {
                  alert("Please set valid start and end points.");
                  setOutMarker(duration);
                  setMovedTime(duration);
                  return;
                }
                setOutMarker(value);
                setMovedTime(value);
              }}
              minTime={0}
              maxTime={currentTime ? parseFloat(duration?.toFixed(3)) : 0}
            />

            <button
              onClick={() => handleClipCreate()}
              className="w-40 h-10 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Create Clip
            </button>
          </div>
        </div>

        <div className="flex gap-2 w-full">
          <div>
            <VideoTimeline
              source={streamSource}
              startTime={inMarker}
              endTime={outMarker} // 60 seconds video duration
              refreshStatus={refreshStatus}
              setRefreshStatus={(value) => setRefreshStatus(value)}
              savedTime={currentTime}
              isPlaying={isPlaying}
              setIsPlaying={(value) => setIsPlaying(value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
