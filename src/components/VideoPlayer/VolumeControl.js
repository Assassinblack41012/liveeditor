import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export const VolumeControl = ({ volume, isMuted, onVolumeChange, onMuteToggle }) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onMuteToggle}
        className="p-2 hover:bg-gray-700 rounded-full"
        title="Toggle Mute (M)"
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-white" />
        ) : (
          <Volume2 className="w-5 h-5 text-white" />
        )}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={isMuted ? 0 : volume}
        onChange={(e) => onVolumeChange(Number(e.target.value))}
        className="w-20 accent-blue-500"
      />
    </div>
  );
};