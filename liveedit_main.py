from fastapi import FastAPI, Request, BackgroundTasks, HTTPException
from pydantic import BaseModel
import subprocess
import uvicorn
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
import threading
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Mount StaticFiles at '/static'
# app.mount("/static", StaticFiles(directory="static"), name="static")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React development server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve the index.html at the root path
@app.get("/")
async def read_index():
    return FileResponse("static/index.html")

# Global variables to manage recording
recording_process = None
recording_lock = threading.Lock()
recording_file = "live_stream_recording.ts"
current_stream_url = None

class StreamURL(BaseModel):
    stream_url: str

class RenderRequest(BaseModel):
    startTime: float
    endTime: float
    
class VideoRequest(BaseModel):
    video_url: str  # URL of the input video
    start_time: int  # Start time in seconds
    end_time: int    # End time in seconds
    zoom: int          # Video filter (e.g., "fps=1")

@app.post("/api/start_recording")
async def start_recording(stream: StreamURL):
    global recording_process, current_stream_url

    with recording_lock:
        # If a recording is already in progress, terminate it
        if recording_process and recording_process.poll() is None:
            recording_process.terminate()
            recording_process = None
            if os.path.exists(recording_file):
                os.remove(recording_file)

        current_stream_url = stream.stream_url

        # Start recording the live stream using FFmpeg
        command = [
            'ffmpeg',
            '-y',  # Overwrite output file if it exists
            '-i', current_stream_url,
            '-c', 'copy',  # Copy codec to avoid re-encoding
            '-t', "3600",
            '-f', 'mpegts',
            recording_file
        ]

        # Start the recording process
        recording_process = subprocess.Popen(command)

    return {"message": "Recording started for stream URL."}

@app.post("/api/stop_recording")
async def stop_recording():
    global recording_process, recording_file

    with recording_lock:
        if recording_process and recording_process.poll() is None:
            recording_process.terminate()
            recording_process = None

            # Delete the recording file
            if os.path.exists(recording_file):
                os.remove(recording_file)

            return {"message": "Recording stopped and file deleted."}
        else:
            # Delete the recording file if it exists
            if os.path.exists(recording_file):
                os.remove(recording_file)
            return {"message": "No active recording to stop. Recording file deleted if it existed."}

@app.post("/extract_frames/")
def extract_frames(request: VideoRequest):
    global recording_process, current_stream_url 
    with recording_lock:
        # If a recording is already in progress, terminate it
        if recording_process and recording_process.poll() is None:
            recording_process.terminate()
            recording_process = None
            if os.path.exists(output_pattern):
                os.remove(output_pattern)
        # File and folder setup
        output_folder = "frames_output"
        os.makedirs(output_folder, exist_ok=True)
        output_pattern = os.path.join(output_folder, "frame-%03d.png")
        current_stream_url = request.video_url

    # Download the video
    # download_command = ["curl", "-L", request.video_url, "-o", input_file]
    # try:
    #     subprocess.run(download_command, check=True)
    # except subprocess.CalledProcessError:
    #     raise HTTPException(status_code=400, detail="Failed to download the video.")

    # Run FFmpeg to extract frames
        ffmpeg_command = [
            "ffmpeg", 
            # "-y", 
            '-n',
            "-i", current_stream_url,  # Input file
            # '-f', 'mpegts',
            '-s', '90x40',
            "-ss", str(request.start_time),  # Start time
            # "-to", str(request.end_time),    # End time
            # '-ss', '00:00:05',vframe
            '-vframes', '1',
            # "-vf", str(25*(request.end_time-request.start_time)/(10*request.zoom)),               # Video filter
            # "-r", "1",       
            output_pattern                   # Output file pattern
        ]
        try:
            subprocess.Popen(ffmpeg_command)
        except subprocess.CalledProcessError:
            raise HTTPException(status_code=500, detail="FFmpeg failed to process the video.")


        return {"message": "Frames extracted successfully!", "output_folder": output_folder}

@app.post("/api/render")
async def render_video(request: RenderRequest, background_tasks: BackgroundTasks):
    global recording_file

    # Check if the recording file exists
    if not os.path.exists(recording_file):
        return {"message": "Recording file not found. Please start the stream first."}

    output_video = f"output_{request.startTime}_{request.endTime}.mp4"
    output_path = os.path.join("outputs", output_video)

    # Ensure the outputs directory exists
    os.makedirs("outputs", exist_ok=True)

    # Run FFmpeg command in the background
    background_tasks.add_task(run_ffmpeg, recording_file, output_path, request.startTime, request.endTime)

    # Construct the URL to the output file
    output_url = f"/outputs/{output_video}"

    return {"message": "Video processing started.", "output_url": output_url}

def run_ffmpeg(input_video, output_video, start_time, end_time):
    # FFmpeg command to trim video
    command = [
        'ffmpeg',
        '-y',  # Overwrite output file if it exists
        '-i', input_video,
        '-ss', str(start_time),
        '-to', str(end_time),
        '-c', 'copy',  # Use 'copy' to avoid re-encoding
        output_video
    ]

    subprocess.run(command, check=True)

# Serve the outputs directory
app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=48080)
    