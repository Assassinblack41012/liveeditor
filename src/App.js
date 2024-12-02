import React, { useEffect, useState } from "react";
import { VideoPlayer } from "./components/VideoPlayer/VideoPlayer";
import { Timeline } from "./components/Timeline/Timeline";
import { TimePicker } from "./components/TimePicker/TimePicker";
import { ExportDialog } from "./components/ExportDialog/ExportDialog";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import VideoTimeline from "./components/VideoTimeline/VideoTimeline";
import axios from "axios";

function App() {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedClip, setSelectedClip] = useState(null);
  const [url, setUrl] = useState(
    "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
  );
  const [currentTime, setCurrentTime] = useState(0);
  const [inMarker, setInMarker] = useState(0);
  const [outMarker, setOutMarker] = useState(0);
  const [duration, setDuration] = useState(0);
  const [createStatus, setCreateStatus] = useState(false);
  const [frames, setFrames] = useState([]);

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

  const handleFrameSelect = (time) => {
    console.log("Selected frame at time:", time);
  };

  const handleClipCreate = async () => {
    // if (
    //   inMarker === null ||
    //   outMarker === null ||
    //   parseFloat(inMarker) >= parseFloat(outMarker)
    // ) {
    //   alert("Please set valid start and end points.");
    //   return;
    // }
    // if (inMarker > currentTime || outMarker > currentTime) {
    //   alert("Please set valid start and end points.");
    //   return;
    // }

    setCreateStatus(!createStatus);
  };

  const handleRefresh = async () => {
    // if (
    //   inMarker === null ||
    //   outMarker === null ||
    //   parseFloat(inMarker) >= parseFloat(outMarker)
    // ) {
    //   alert("Please set valid start and end points.");
    //   return;
    // }
    // if (inMarker > currentTime || outMarker > currentTime) {
    //   alert("Please set valid start and end points.");
    //   return;
    // }
    for (let i = 0; i < 10; i++) {
      await axios.post("http://127.0.0.1:48080/extract_frames/", {
        video_url: url,
        start_time: 10 + i,
        end_time: 100,
        zoom: 1,
      });
    }
  };

  const handleExport = (options) => {
    if (selectedClip) {
      console.log("Exporting clip with options:", {
        clip: selectedClip,
        options,
      });
      // Here you would implement the actual export logic
    }
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
    <div className="min-h-screen w-full flex items-center bg-gray-700 p-4 gap-4">
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
              createStatus={createStatus}
              getFrames={(value) => setFrames(value)}
            />

            {/* <Timeline
            duration={300}
            currentTime={currentTime}
            markers={markers}
            onSeek={(time) => setCurrentTime(time)}
            onMarkerAdd={(marker) => setMarkers([...markers, marker])}
            onMarkerUpdate={(updatedMarker) => {
              setMarkers(
                markers.map((m) =>
                  m.type === updatedMarker.type ? updatedMarker : m
                )
              );
            }}
          /> */}
          </div>

          <div className="w-[340px] gap-4 h-fit text-center flex flex-wrap justify-center">
            <button
              onClick={() => {
                if (outMarker === 0)
                  return setInMarker(currentTime?.toFixed(3));
                if (outMarker < currentTime) {
                  return setInMarker(outMarker);
                }
                setInMarker(currentTime?.toFixed(3));
              }}
              className="w-40 h-10 mt-[56px] bg-green-500 text-white rounded hover:bg-green-600"
            >
              Set In Point (I)
            </button>

            <TimePicker
              value={inMarker}
              onChange={(value) => {
                if (value > duration) return setInMarker(duration?.toFixed(3));
                setInMarker(value);
              }}
              minTime={0}
              maxTime={currentTime ? currentTime?.toFixed(3) : 0}
              showSeconds={true}
              showMilliseconds={true}
            />

            <button
              onClick={() => {
                if (inMarker > currentTime) {
                  return setOutMarker(inMarker);
                }
                setOutMarker(currentTime?.toFixed(3));
              }}
              className="w-40 h-10 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Set Out Point (O)
            </button>

            <TimePicker
              value={outMarker}
              onChange={(value) => {
                if (inMarker > value) return setOutMarker(inMarker);
                if (value > duration) return setOutMarker(duration?.toFixed(3));
                setOutMarker(value);
              }}
              minTime={0}
              maxTime={currentTime ? duration?.toFixed(3) : 0}
              showSeconds={true}
              showMilliseconds={true}
            />

            <button
              onClick={() => handleClipCreate()}
              // onClick={() => handleRefresh()}
              className="w-40 h-10 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Create Clip
            </button>

            {/* <div className="col-span-1">
            <ClipList
              clips={clips}
              onClipSelect={(clip) => {
                setCurrentTime(clip.startTime);
                setMarkers([
                  { time: clip.startTime, label: 'In', type: 'in' },
                  { time: clip.endTime, label: 'Out', type: 'out' }
                ]);
                setSelectedClip(clip);
              }}
              onClipDelete={(clipId) => {
                setClips(clips.filter(c => c.id !== clipId));
                if (selectedClip?.id === clipId) {
                  setSelectedClip(null);
                }
              }}
              onClipExport={(clip) => {
                setSelectedClip(clip);
                setIsExportDialogOpen(true);
              }}
            />
          </div> */}
          </div>
        </div>
        <VideoTimeline
          source={streamSource}
          startTime={0}
          endTime={60} // 60 seconds video duration
          onFrameSelect={() => handleFrameSelect()}
          frames={frames}
        />
      </div>

      <ExportDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        onExport={handleExport}
      />
    </div>
  );
}

export default App;
