import React, { useRef, useState, useEffect } from 'react';
import { TimelineMarker } from './TimelineMarker';

export const Timeline = ({
  duration,
  currentTime,
  markers,
  onSeek,
  onMarkerUpdate,
}) => {
  const timelineRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  const handleTimelineClick = (e) => {
    if (timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const clickPosition = (e.clientX - rect.left) / rect.width;
      const newTime = clickPosition * duration;
      onSeek(Math.max(0, Math.min(duration, newTime)));
    }
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (isDragging && timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const position = (e.clientX - rect.left) / rect.width;
      const newTime = position * duration;
      onSeek(Math.max(0, Math.min(duration, newTime)));
    }
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const visibleDuration = duration / zoom;
  const visibleStart = Math.max(0, currentTime - visibleDuration / 2);
  const visibleEnd = Math.min(duration, visibleStart + visibleDuration);

  return (
    <div className="w-full bg-gray-900 p-2 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        {/* <span className="text-white">{formatTimeCode(currentTime)}</span> */}
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">Zoom:</span>
          <input
            type="range"
            min="1"
            max="4"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-32 accent-blue-500"
          />
        </div>
      </div>
      <div
        ref={timelineRef}
        className="timeline-container relative h-16 bg-gray-700 rounded-lg overflow-y-hidden overflow-x-auto cursor-pointer select-none"
        onClick={handleTimelineClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        <div className="absolute inset-0 flex">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex-1 border-l border-gray-600" />
          ))}
        </div>
        <div
          className="absolute top-0 bottom-0 bg-blue-500 opacity-50"
          style={{
            left: `${((currentTime - visibleStart) / (visibleEnd - visibleStart)) * 100}%`,
            width: '2px'
          }}
        />
        {markers.map((marker, index) => (
          <TimelineMarker
            key={index}
            marker={marker}
            visibleStart={visibleStart}
            visibleEnd={visibleEnd}
            onMarkerDrag={
              onMarkerUpdate
                ? (time) => onMarkerUpdate({ ...marker, time })
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
};