const DEFAULT_MIN_TIME = {
  hours: 0,
  minutes: 0,
  seconds: 0,
  milliseconds: 0,
};

const DEFAULT_MAX_TIME = {
  hours: 23,
  minutes: 59,
  seconds: 59,
  milliseconds: 999,
};

function isTimeInRange(time, minTime, maxTime) {
  const timeValue = timeToMilliseconds(time);
  const minValue = timeToMilliseconds(minTime);
  const maxValue = timeToMilliseconds(maxTime);

  return timeValue >= minValue && timeValue <= maxValue;
}

function timeToMilliseconds(time) {
  return (
    time.hours * 3600000 +
    time.minutes * 60000 +
    time.seconds * 1000 +
    time.milliseconds
  );
}

function timeToSeconds(time) {
  return (
    time.hours * 3600 +
      time.minutes * 60 +
      time.seconds +
      time.milliseconds / 1000 || 0
  );
}

function clampTime(time, minTime, maxTime) {
  if (timeToMilliseconds(time) < timeToMilliseconds(minTime)) return minTime;
  if (timeToMilliseconds(time) > timeToMilliseconds(maxTime)) return maxTime;
  return timeToMilliseconds(time);
}

// Exporting the constants and functions
module.exports = {
  DEFAULT_MIN_TIME,
  DEFAULT_MAX_TIME,
  timeToSeconds,
  isTimeInRange,
  timeToMilliseconds,
  clampTime,
};
