import { formatDuration } from 'date-fns';

export const formatTimeCode = (seconds) => {
  return formatDuration({
    seconds: Math.floor(seconds % 60),
    minutes: Math.floor(seconds / 60) % 60,
    hours: Math.floor(seconds / 3600)
  });
};

export const frameToTime = (frame, fps = 30) => {
  return frame / fps;
};

export const timeToFrame = (time, fps = 30) => {
  return Math.round(time * fps);
};