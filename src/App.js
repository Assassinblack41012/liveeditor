import React, { useState, useRef, useEffect } from "react";
import { VideoPlayer } from "./components/VideoPlayer/VideoPlayer";
import { Timeline } from "./components/Timeline/Timeline";
import { TimePicker } from "./components/TimePicker/TimePicker";
import {
  DEFAULT_MIN_TIME,
  timeToMilliseconds,
} from "./components/TimePicker/utils";
import { ExportDialog } from "./components/ExportDialog/ExportDialog";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { generateThumbnail } from "./utils/thumbnail";

function App() {
  const [startStatus, setStartStatus] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedClip, setSelectedClip] = useState(null);
  const [url, setUrl] = useState("");
  const [time, setTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });
  const [movedTime, setMovedTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(time);
  const [clips, setClips] = useState({});
  const [markers, setMarkers] = useState([]);
  const [inMarker, setInMarker] = useState(time);
  const [outMarker, setOutMarker] = useState(time);
  const [duration, setDuration] = useState(time);
  const videoRef = useRef(null);

  const [streamSource, setStreamSource] = useState({
    url: "",
    type: "hls",
  });

  const onStart = () => {
    if (startStatus) {
      setStartStatus(!startStatus);
    }
    setStreamSource({ url, type: "hls" });
    setStartStatus(!startStatus);
  };

  const handleClipCreate = async () => {
    // const inMarker = markers.find(m => m.type === 'in');
    // const outMarker = markers.find(m => m.type === 'out');

    // if (inMarker && outMarker && videoRef.current) {
    //   const thumbnail = await generateThumbnail(videoRef.current, inMarker.time);

    //   const newClip = {
    //     id: Date.now().toString(),
    //     startTime: inMarker.time,
    //     endTime: outMarker.time,
    //     thumbnail,
    //     title: `Clip ${clips.length + 1}`
    //   };

    //   setClips([...clips, newClip]);
    //   setMarkers([]);
    // }
    if (inMarker === null || outMarker === null || inMarker >= outMarker) {
      alert("Please set valid start and end points.");
      return;
    }
    if (inMarker > currentTime || outMarker > currentTime) {
      alert("Please set valid start and end points.");
      return;
    }
  };

  const onChangeTime = (value) => {
    setInMarker(value);
    setMovedTime(value);
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
    <div className="min-h-screen w-full justify-items-center bg-gray-700 p-4 gap-4">
      <div className="w-[1280px] flex p-4 mt-10">
        <h1 className="w-full text-3xl font-bold text-white leading-none">
          Live Video Editor
        </h1>
      </div>

      <div className="flex gap-4">
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
              style={startStatus ? { backgroundColor: "red" } : {}}
              onClick={() => onStart()}
            >
              {startStatus ? "Stop Recording" : "Start Recording"}
            </button>
          </div>

          <VideoPlayer
            source={streamSource}
            onTimeUpdate={setCurrentTime}
            onDuration={setDuration}
            movedTime={movedTime}
          />
          <Timeline
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
          />
        </div>

        <div className="w-[340px] gap-4 h-fit text-center flex flex-wrap justify-center">
          <button
            onClick={() => setInMarker(currentTime)}
            className="w-40 h-10 mt-[56px] bg-green-500 text-white rounded hover:bg-green-600"
          >
            Set In Point (I)
          </button>

          <TimePicker
            value={inMarker}
            onChange={(value) => {
              setInMarker(value);
              setMovedTime(value);
            }}
            minTime={DEFAULT_MIN_TIME}
            maxTime={currentTime ? currentTime : DEFAULT_MIN_TIME}
            showSeconds={true}
            showMilliseconds={true}
          />

          <button
            onClick={() => setOutMarker(currentTime)}
            className="w-40 h-10 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Set Out Point (O)
          </button>

          <TimePicker
            value={outMarker}
            onChange={(value) => {
              setOutMarker(value);
              setMovedTime(value);
            }}
            minTime={DEFAULT_MIN_TIME}
            maxTime={currentTime ? duration : DEFAULT_MIN_TIME}
            showSeconds={true}
            showMilliseconds={true}
          />

          <button
            onClick={handleClipCreate}
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

      <ExportDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        onExport={handleExport}
      />
    </div>
  );
}

export default App;
