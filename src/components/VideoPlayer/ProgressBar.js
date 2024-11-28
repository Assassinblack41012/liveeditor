import React from 'react';

export const ProgressBar = ({ currentTime, duration, onSeek }) => {
  const progress = (currentTime / duration) * 100;

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    onSeek(position * duration);
  };

  return (
    <div
      className="w-full h-2 hover:h-3 bg-gray-600 cursor-pointer relative group"
      onClick={handleSeek}
    >
      <div
        className="absolute h-full bg-blue-500 group-hover:bg-blue-400 transition-colors"
        style={{ width: `${progress}%` }}
      />
      <div
        className="absolute h-3 w-3 bg-blue-500 rounded-full -top-1 -ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ left: `${progress}%` }}
      />
    </div>
  );
};