import React, { useState, useRef, useEffect } from 'react';
import { VideoPlayer } from './components/VideoPlayer/VideoPlayer';
import { Timeline } from './components/Timeline/Timeline';
import { ClipList } from './components/ClipList/ClipList';
import { ExportDialog } from './components/ExportDialog/ExportDialog';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { generateThumbnail } from './utils/thumbnail';

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [clips, setClips] = useState({});
  const [markers, setMarkers] = useState([]);
  const [inMarker, setInMarker] = useState();
  const [outMarker, setOutMarker] = useState();
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedClip, setSelectedClip] = useState(null);
  const [url, setUrl] = useState('');
  const videoRef = useRef(null);

  const [streamSource, setStreamSource] = useState({
    url: '',
    type: 'hls'
  });
  useEffect(() => {
    console.log(streamSource);
  }, [streamSource]);

  const handleClipCreate = async () => {
    const inMarker = markers.find(m => m.type === 'in');
    const outMarker = markers.find(m => m.type === 'out');

    if (inMarker && outMarker && videoRef.current) {
      const thumbnail = await generateThumbnail(videoRef.current, inMarker.time);

      const newClip = {
        id: Date.now().toString(),
        startTime: inMarker.time,
        endTime: outMarker.time,
        thumbnail,
        title: `Clip ${clips.length + 1}`
      };

      setClips([...clips, newClip]);
      setMarkers([]);
    }
  };

  const handleExport = (options) => {
    if (selectedClip) {
      console.log('Exporting clip with options:', { clip: selectedClip, options });
      // Here you would implement the actual export logic
    }
  };

  useKeyboardShortcuts({
    onI: () => { if (outMarker >= currentTime) setInMarker(currentTime) },
    onO: () => { if (inMarker <= currentTime) setOutMarker(currentTime) },
  });

  return (
    <div className="min-h-screen w-full flex justify-center bg-gray-700 p-4">
      <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
      <div className="max-w-[980px] gap-4 flex flex-wrap">
        <h1 className="w-full text-3xl font-bold text-white leading-none">Live Video Editor</h1>

        <div id="controls" className='w-full flex gap-4 items-center justify-between '>
          <input type="text" className="w-full px-4 py-2 rounded hover:bg-gray-300" onChange={(e) => setUrl(e.target.value.trim())} placeholder="Enter Live Stream URL" />
          <button className="w-[200px] px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" onClick={() => setStreamSource({ url, type: 'hls' })}>Start Recording</button>
        </div>

        <VideoPlayer
          source={streamSource}
          onTimeUpdate={setCurrentTime}
          videoRef={videoRef}
        />
        <Timeline
          duration={300}
          currentTime={currentTime}
          markers={markers}
          onSeek={(time) => setCurrentTime(time)}
          onMarkerAdd={(marker) => setMarkers([...markers, marker])}
          onMarkerUpdate={(updatedMarker) => {
            setMarkers(markers.map(m =>
              m.type === updatedMarker.type ? updatedMarker : m
            ));
          }}
        />

        <div className="w-full flex justify-center gap-4">
          <button
            onClick={() => setMarkers([...markers, { time: currentTime, label: 'In', type: 'in' }])}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Set In Point (I)
          </button>
          <button
            onClick={() => setMarkers([...markers, { time: currentTime, label: 'Out', type: 'out' }])}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Set Out Point (O)
          </button>
          <button
            onClick={handleClipCreate}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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