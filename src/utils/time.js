export const formatTimeCode = (seconds) => {
  const value = {
    hours: Math.floor(seconds / 3600) || 0,
    minutes: Math.floor(seconds / 60) % 60 || 0,
    seconds: Math.floor(seconds % 60) || 0,
    milliseconds: Math.floor((seconds - Math.floor(seconds)) * 1000) || 0,
  };
  return value;
};

export const MStoTimeCode = (milliseconds) => {
  const value = {
    hours: Math.floor(milliseconds / 3600000) || 0,
    minutes: Math.floor(milliseconds / 60000) % 60 || 0,
    seconds: Math.floor(milliseconds / 1000) % 60 || 0,
    milliseconds: Math.floor(milliseconds % 1000) || 0,
  };
  return value;
};

export const timeToFrame = (time, fps = 30) => {
  return Math.round(time * fps);
};
