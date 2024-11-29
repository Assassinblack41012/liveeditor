import React, { useState, useEffect } from "react";
import { TimeInput } from "./TimeInput";
import { DEFAULT_MIN_TIME, DEFAULT_MAX_TIME } from "./utils";
import { Clock } from "lucide-react";
import { formatTimeCode } from "../../utils/time";

export function TimePicker({
  value,
  onChange,
  minTime = DEFAULT_MIN_TIME,
  maxTime = DEFAULT_MAX_TIME,
  showSeconds = true,
  showMilliseconds = false,
}) {
  const [pickerValue, setPickerValue] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });
  const max = {
    hours: Math.floor(maxTime / 3600),
    minutes: Math.floor(maxTime / 60) % 60,
    seconds: Math.floor(maxTime % 60),
    milliseconds: Math.floor((maxTime - Math.floor(maxTime)) * 1000),
  };

  useEffect(() => {
    setPickerValue(formatTimeCode(value));
  }, [value]);

  return (
    <div className="inline-flex items-center gap-4 p-4 bg-white rounded-lg shadow-md">
      <Clock className="w-5 h-5 text-gray-400" />

      <div className="flex items-center gap-2">
        <TimeInput
          value={pickerValue}
          min={minTime.hours}
          max={max.hours}
          setPickerValue={() => setPickerValue()}
          label="hours"
          onChange={(value) => onChange(value)}
        />
        <div className="mb-[25px] text-xl font-semibold text-gray-400">:</div>

        <TimeInput
          value={pickerValue}
          min={0}
          max={59}
          setPickerValue={() => setPickerValue()}
          label="minutes"
          onChange={(value) => onChange(value)}
        />

        {showSeconds && (
          <>
            <div className="mb-[25px] text-xl font-semibold text-gray-400">
              :
            </div>
            <TimeInput
              value={pickerValue}
              min={0}
              max={59}
              setPickerValue={() => setPickerValue()}
              label="seconds"
              onChange={(value) => onChange(value)}
            />
          </>
        )}

        {showMilliseconds && (
          <>
            <div className="mb-[20px] text-xl font-semibold text-gray-400">
              .
            </div>
            <TimeInput
              value={pickerValue}
              min={0}
              max={999}
              setPickerValue={() => setPickerValue()}
              label="milliseconds"
              padLength={3}
              onChange={(value) => onChange(value)}
            />
          </>
        )}
      </div>
    </div>
  );
}
