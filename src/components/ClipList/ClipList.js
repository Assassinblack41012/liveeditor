import React from 'react';
import { Trash2, Share } from 'lucide-react';

export const ClipList = ({ clips, onClipSelect, onClipDelete, onClipExport }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-bold text-white mb-4">Clips</h2>
      <div className="space-y-2">
        {clips.map((clip) => (
          <div
            key={clip.id}
            className="flex items-center justify-between bg-gray-700 p-3 rounded hover:bg-gray-600 cursor-pointer"
            onClick={() => onClipSelect(clip)}
          >
            <div className="flex items-center gap-3">
              {clip.thumbnail && (
                <img
                  src={clip.thumbnail}
                  alt="Clip thumbnail"
                  className="w-20 h-12 object-cover rounded"
                />
              )}
              <div>
                <p className="text-white font-medium">{clip.title}</p>
                <p className="text-gray-400 text-sm">
                  Duration: {parseFloat((clip.endTime - clip.startTime).toFixed(2))}s
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClipExport(clip);
                }}
                className="p-2 hover:bg-gray-500 rounded"
                title="Export clip"
              >
                <Share className="w-5 h-5 text-blue-400" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClipDelete(clip.id);
                }}
                className="p-2 hover:bg-gray-500 rounded"
                title="Delete clip"
              >
                <Trash2 className="w-5 h-5 text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};