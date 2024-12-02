import { useState, useCallback } from 'react';

export const useTimelineZoom = () => {
  const [zoom, setZoom] = useState(1);
  const MIN_ZOOM = 1.5;
  const MAX_ZOOM = 4;
  const ZOOM_SENSITIVITY = 0.1;

  const handleZoom = useCallback((event) => {
    event.preventDefault();
    
    const delta = event.deltaY > 0 ? -ZOOM_SENSITIVITY : ZOOM_SENSITIVITY;
    setZoom(prevZoom => {
      const newZoom = prevZoom + delta;
      return Math.min(Math.max(newZoom, MIN_ZOOM), MAX_ZOOM);
    });
  }, []);

  return { zoom, handleZoom };
};