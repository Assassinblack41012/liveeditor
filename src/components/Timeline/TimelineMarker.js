import React, { useState, useEffect } from 'react';
import { formatTimeCode } from '../../utils/time';

export const TimelineMarker = ({ marker, visibleStart, visibleEnd, onMarkerDrag }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging && onMarkerDrag) {
        const timeline = e.target.closest('.timeline-container');
        if (timeline) {
          const rect = timeline.getBoundingClientRect();
          const position = (e.clientX - rect.left) / rect.width;
          const time = visibleStart + position * (visibleEnd - visibleStart);
          onMarkerDrag(Math.max(0, Math.min(visibleEnd, time)));
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onMarkerDrag, visibleStart, visibleEnd]);

  return (
    <div
      className={`absolute top-0 bottom-0 w-1 cursor-ew-resize ${marker.type === 'in' ? 'bg-green-500' : 'bg-red-500'}`}
      style={{
        left: `${((marker.time - visibleStart) / (visibleEnd - visibleStart)) * 100}%`,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="absolute top-full mt-1 text-xs text-white whitespace-nowrap">
        {marker.label} ({formatTimeCode(marker.time)})
      </div>
    </div>
  );
};