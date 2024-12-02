import { useState, useCallback } from 'react';

export const useTimelineDrag = ({ zoom, startTime, endTime, onTimeChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [lastX, setLastX] = useState(0);

  const startDrag = useCallback((event) => {
    setIsDragging(true);
    setLastX(event.clientX);
  }, []);

  const onDrag = useCallback((event) => {
    if (!isDragging) return;

    const deltaX = event.clientX - lastX;
    const timeChange = (deltaX / 100) * zoom; // Adjust sensitivity as needed

    onTimeChange(prevTime => {
      const newTime = prevTime - timeChange;
      return Math.min(Math.max(newTime, startTime), endTime);
    });

    setLastX(event.clientX);
  }, [isDragging, lastX, zoom, startTime, endTime, onTimeChange]);

  const endDrag = useCallback(() => {
    setIsDragging(false);
  }, []);

  return { isDragging, startDrag, onDrag, endDrag };
};