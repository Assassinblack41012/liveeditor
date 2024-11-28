import React, { useState } from 'react';
import { X } from 'lucide-react';

export const ExportDialog = ({ isOpen, onClose, onExport }) => {
  const [watermarkUrl, setWatermarkUrl] = useState('');
  const [watermarkPosition, setWatermarkPosition] = useState('bottom-right');
  const [quality, setQuality] = useState('high');
  const [format, setFormat] = useState('mp4');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onExport({
      watermark: watermarkUrl ? {
        url: watermarkUrl,
        position: watermarkPosition,
      } : undefined,
      quality,
      format,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Export Clip</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Watermark URL (optional)
            </label>
            <input
              type="url"
              value={watermarkUrl}
              onChange={(e) => setWatermarkUrl(e.target.value)}
              className="w-full bg-gray-700 text-white rounded px-3 py-2"
              placeholder="https://example.com/logo.png"
            />
          </div>

          {watermarkUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Watermark Position
              </label>
              <select
                value={watermarkPosition}
                onChange={(e) => setWatermarkPosition(e.target.value)}
                className="w-full bg-gray-700 text-white rounded px-3 py-2"
              >
                <option value="top-left">Top Left</option>
                <option value="top-right">Top Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-right">Bottom Right</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Quality
            </label>
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="w-full bg-gray-700 text-white rounded px-3 py-2"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full bg-gray-700 text-white rounded px-3 py-2"
            >
              <option value="mp4">MP4</option>
              <option value="webm">WebM</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
          >
            Export
          </button>
        </form>
      </div>
    </div>
  );
};