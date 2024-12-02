import React, { useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { timeToSeconds } from "./utils";

export function TimeInput({ value, min, max, label, onChange }) {
  const increment = () => {
    const newValue = value >= max ? min : parseInt(value + 1);
    onChange(newValue);
  };

  const decrement = () => {
    const newValue = value <= min ? max : parseInt(value - 1);
    onChange(newValue);
  };

  const handleInputChange = (e) => {
    if (e.target.value === "") return onChange(0);
    const newValue = parseInt(e.target.value, 10);
    if (isNaN(newValue)) return;
    onChange(newValue);
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => increment()}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        aria-label={`Increment ${label}`}
      >
        <ChevronUp className="w-4 h-4" />
      </button>

      <div className="flex flex-col items-center">
        <input
          type="text"
          value={value || 0}
          onChange={(e) => handleInputChange(e)}
          className="w-12 text-center border rounded-md py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={label}
        />
        <span className="text-xs text-gray-500 mt-1">{label}</span>
      </div>

      <button
        onClick={() => decrement()}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        aria-label={`Decrement ${label}`}
      >
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  );
}
