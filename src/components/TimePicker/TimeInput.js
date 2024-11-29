import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { timeToMilliseconds } from "./utils";

export function TimeInput({
  value,
  min,
  max,
  setPickerValue,
  label,
  onChange,
}) {
  const increment = () => {
    onChange(
      timeToMilliseconds({
        ...value,
        [label]: value[label] >= max ? min : parseInt(value[label], 10) + 1,
      }) / 1000
    );
  };

  const decrement = () => {
    onChange(
      timeToMilliseconds({
        ...value,
        [label]: value[label] >= max ? min : parseInt(value[label], 10) - 1,
      }) / 1000
    );
  };

  const handleInputChange = (e) => {
    if (
      parseInt(e.target.value, 10) < min ||
      parseInt(e.target.value, 10) > max
    ) {
      if (e.target.value.length > 0)
        setPickerValue({ ...value, [label]: parseInt(e.target.value, 10) });
      return;
    }
    if (isNaN(parseInt(e.target.value, 10))) return;
    onChange(
      timeToMilliseconds({ ...value, [label]: parseInt(e.target.value, 10) }) /
        1000
    );
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
          value={value ? value[label] : 0}
          onChange={(event) => handleInputChange(event)}
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
