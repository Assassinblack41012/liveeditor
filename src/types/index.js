// Represents a video clip
const VideoClip = {
  id: '',          // string
  startTime: 0,   // number
  endTime: 0,     // number
  thumbnail: '',   // optional string
  title: ''        // optional string
};

// Represents a stream source
const StreamSource = {
  url: '',        // string
  type: 'hls'     // can be either 'hls' or 'rtmp'
};

// Represents a timeline marker
const TimelineMarker = {
  time: 0,       // number
  label: '',     // string
  type: 'in'     // can be either 'in' or 'out'
};

// Represents export options for a video
const ExportOptions = {
  watermark: {     // optional object
    url: '',       // string
    position: 'top-left' // can be 'top-left', 'top-right', 'bottom-left', or 'bottom-right'
  },
  quality: 'high', // can be 'high', 'medium', or 'low'
  format: 'mp4'    // can be 'mp4' or 'webm'
};