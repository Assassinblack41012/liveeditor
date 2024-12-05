import React from "react";
import { TimeInput } from "./TimeInput";
import { Clock } from "lucide-react";
import { formatTimeCode } from "../../utils/time";
import { timeToSeconds } from "./utils";

export function TimePicker({ value, onChange, minTime = 0, maxTime = 0 }) {
  const timeObject = formatTimeCode(value);

  const handleTimeChange = (unit, newValue) => {
    const updatedTime = {
      ...timeObject,
      [unit]: newValue,
    };
    onChange(parseFloat(timeToSeconds(updatedTime)));
  };

  return (
    <div className="inline-flex items-center gap-4 p-4 bg-white rounded-lg shadow-md">
      <Clock className="w-5 h-5 text-gray-400" />

      <div className="flex items-center gap-2">
        <TimeInput
          value={timeObject.hours}
          min={0}
          max={Math.floor(maxTime / 3600)}
          label="hours"
          onChange={(newValue) => handleTimeChange("hours", newValue)}
        />
        <div className="mb-[25px] text-xl font-semibold text-gray-400">:</div>

        <TimeInput
          value={timeObject.minutes}
          min={0}
          max={59}
          label="minutes"
          onChange={(newValue) => handleTimeChange("minutes", newValue)}
        />

        <>
          <div className="mb-[25px] text-xl font-semibold text-gray-400">:</div>
          <TimeInput
            value={timeObject.seconds}
            min={0}
            max={59}
            label="seconds"
            onChange={(newValue) => handleTimeChange("seconds", newValue)}
          />
        </>

        <>
          <div className="mb-[20px] text-xl font-semibold text-gray-400">.</div>
          <TimeInput
            value={timeObject.milliseconds}
            min={0}
            max={999}
            label="milliseconds"
            onChange={(newValue) => handleTimeChange("milliseconds", newValue)}
          />
        </>
      </div>
    </div>
  );
}
